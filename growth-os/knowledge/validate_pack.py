#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
validate_pack.py  (Deliverable 12)

Mechanical, deterministic linter for the BirLiy CMO Brain pack.

Standard library only (json, re, pathlib, glob, unittest in the test file).

What it checks, per file type, over the knowledge pack at
growth-os/knowledge/:

  1. Every JSON and JSONL file parses.
  2. Required keys are present per file type:
       - APPROVED_FACTS.json: each fact carries the 13 required keys.
       - HOOK_BANK.json: each hook carries id / locale / pain / angle /
         semantic_hook (+ visual_hook_suggestion / suitable_formats /
         risk_notes).
       - ICP_AND_PAIN_MAP.json: meta / primary / secondary / global_guardrails.
       - CONTENT_STRATEGY.json: meta / content_pillars / weekly_balance.
       - TEMPLATE_LIBRARY.json: meta / templates.
       - QA_RULES.json: meta / blocking_rules / warning_rules.
       - qa_cases.jsonl / generation_cases.jsonl (if present): each line is an
         object with an id.
  3. Duplicate ids (facts, hooks, and any id-bearing JSONL records).
  4. RU/UZ pair completeness:
       - Each approved fact has non-empty statement_ru AND statement_uz
         (and safe_public_wording_ru / safe_public_wording_uz).
       - Hook locale coverage: locale in {ru, uz}; every (pain, angle) RU hook
         has a matching UZ hook and vice versa (coverage report).
  5. Prohibited terms in PUBLIC-COPY fields only:
       - 'UZS' as a standalone token.
       - 'Ipak' / 'Yuli' (and transliterations) and a bank-name list.
       Notes / source / source_location / *_location / _grounding files and the
       rule-definition files (QA_RULES.json, COMPANY_CONTEXT.md policy lines)
       are skipped so the rules that NAME these terms do not self-trip.
  6. Em-dash family (U+2014 / U+2013 / U+2015) in public-copy fields only.
  7. Empty required values.
  8. Clear PASS / FAIL summary with per-file counts; non-zero exit on FAIL.

Run:
    python validate_pack.py
    python validate_pack.py --dir /path/to/knowledge
"""

import json
import re
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

# The 13 required keys on every APPROVED_FACTS fact object.
FACT_REQUIRED_KEYS = [
    "id",
    "category",
    "statement_uz",
    "statement_ru",
    "statement_en",
    "status",
    "source",
    "source_location",
    "last_verified",
    "safe_public_wording_uz",
    "safe_public_wording_ru",
    "conditions",
    "notes",
]

# Required + recommended keys on every HOOK_BANK hook object.
HOOK_REQUIRED_KEYS = [
    "id",
    "locale",
    "pain",
    "angle",
    "semantic_hook",
    "visual_hook_suggestion",
    "suitable_formats",
    "risk_notes",
]

# Fact fields that must be non-empty strings (the required RU/UZ public copy).
FACT_NONEMPTY_STRING_KEYS = [
    "id",
    "category",
    "statement_uz",
    "statement_ru",
    "statement_en",
    "status",
    "last_verified",
    "safe_public_wording_uz",
    "safe_public_wording_ru",
]

# Em-dash family. A normal hyphen-minus (U+002D) is allowed and not listed.
EM_DASH_CHARS = ["—", "–", "―"]
EM_DASH_RE = re.compile("[" + "".join(EM_DASH_CHARS) + "]")

# 'UZS' as a standalone token (word boundaries), case-insensitive.
UZS_RE = re.compile(r"\bUZS\b", re.IGNORECASE)

# Forbidden entity tokens (bank / parent-company names + transliterations).
# These must never appear in generated public copy.
FORBIDDEN_ENTITY_RES = [
    re.compile(r"ipak\s*-?\s*yuli", re.IGNORECASE),
    re.compile(r"ipakyuli", re.IGNORECASE),
    re.compile(r"ipak\s*yo'?li", re.IGNORECASE),
    re.compile(r"\bipak\b", re.IGNORECASE),
    re.compile(r"\byuli\b", re.IGNORECASE),
    re.compile(r"ипак\s*-?\s*йули", re.IGNORECASE),
    re.compile(r"ипакйули", re.IGNORECASE),
    re.compile(r"\bипак\b", re.IGNORECASE),
    re.compile(r"\bйули\b", re.IGNORECASE),
]

# Field-name fragments that are metadata / grounding, NOT public copy.
# Any value whose key path contains one of these is exempt from term scans.
#
# Two groups:
#  (a) plain metadata/grounding (source, notes, rationale, ...);
#  (b) rule-DEFINING / guardrail fields whose whole job is to STATE the
#      prohibition (currency_style, hard_rules, global_failure_conditions,
#      unsuitable_messaging, ...). These legitimately NAME 'UZS' / 'Ipak Yuli'
#      to forbid them, so scanning them for those very terms would self-trip.
NON_PUBLIC_KEY_FRAGMENTS = (
    # (a) metadata / grounding
    "source",
    "source_location",
    "_location",
    "notes",
    "note",
    "rationale",
    "detection_method",
    "examples_fail",       # rule examples deliberately contain bad inputs
    "remediation",
    "grounding",
    "built_from",
    "relies_on",
    "maps_to_strategy",
    "guard",
    "hypothesis_note",
    "scope_note",
    "engine_conventions",
    "verdict_logic",
    "description",         # rule prose describing what is forbidden
    # (b) rule-defining / guardrail / do-not fields
    "currency",            # currency / currency_style: states the сум-not-UZS rule
    "hard_rules",
    "global_rules",
    "global_guardrails",
    "global_qa_rules",
    "qa_rules",
    "global_failure_conditions",
    "failure_conditions",
    "no_bank_name",
    "never_name",
    "never_claim",
    "unsuitable_messaging",
    "prohibited_claims",
    "must_not_use_as_proof",
    "do_not_claim_unconfirmed",
    "copy_hygiene",
    "no_em_dash",
    "no_uzs",
    "no_invention",
)

# Files that DEFINE the rules (they legitimately name the forbidden terms).
# They are parsed/validated but exempt from prohibited-term + em-dash scans.
RULE_DEFINITION_FILES = {
    "QA_RULES.json",
    "COMPANY_CONTEXT.md",
    "UNVERIFIED_CLAIMS_REPORT.md",
    "BIRLIY_BRAND_VOICE.md",
    "validate_pack.py",
    "test_validate_pack.py",
}

# JSONL files we know about (validated only if present).
KNOWN_JSONL = ["qa_cases.jsonl", "generation_cases.jsonl"]


# ---------------------------------------------------------------------------
# Issue collection
# ---------------------------------------------------------------------------

class Report:
    """Accumulates per-file issue counts and a flat issue list."""

    def __init__(self):
        # filename -> list of issue strings
        self.issues = {}
        # filename -> dict of named counts (records, etc.)
        self.counts = {}

    def add(self, filename, message):
        self.issues.setdefault(filename, []).append(message)

    def set_count(self, filename, name, value):
        self.counts.setdefault(filename, {})[name] = value

    def file_issue_count(self, filename):
        return len(self.issues.get(filename, []))

    def total_issues(self):
        return sum(len(v) for v in self.issues.values())

    def failed(self):
        return self.total_issues() > 0


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def is_public_key(key_path):
    """True if a key path points at public copy (not metadata/grounding)."""
    low = key_path.lower()
    for frag in NON_PUBLIC_KEY_FRAGMENTS:
        if frag in low:
            return False
    return True


def walk_strings(node, key_path, public_only):
    """
    Yield (key_path, string_value) for every string leaf in a nested
    JSON structure. If public_only, skip subtrees whose key indicates
    metadata/grounding (notes, source, etc.).
    """
    if isinstance(node, str):
        yield key_path, node
        return
    if isinstance(node, dict):
        for k, v in node.items():
            child_path = f"{key_path}.{k}" if key_path else str(k)
            if public_only and not is_public_key(str(k)):
                continue
            yield from walk_strings(v, child_path, public_only)
        return
    if isinstance(node, list):
        for i, v in enumerate(node):
            child_path = f"{key_path}[{i}]"
            yield from walk_strings(v, child_path, public_only)
        return
    # numbers, bools, None: nothing to scan
    return


def scan_public_copy(report, filename, data, skip_terms=False):
    """
    Scan public-copy string fields for em-dashes and prohibited terms.
    Metadata fields (source/notes/etc.) are skipped via is_public_key.
    If skip_terms, only the em-dash scan is suppressed too (rule files).
    """
    for key_path, value in walk_strings(data, "", public_only=True):
        # Em-dash family
        if EM_DASH_RE.search(value):
            report.add(
                filename,
                f"em-dash character in public field '{key_path}': {value[:60]!r}",
            )
        if skip_terms:
            continue
        # 'UZS' standalone
        if UZS_RE.search(value):
            report.add(
                filename,
                f"prohibited 'UZS' in public field '{key_path}': {value[:60]!r}",
            )
        # Forbidden entity / bank names
        for rx in FORBIDDEN_ENTITY_RES:
            m = rx.search(value)
            if m:
                report.add(
                    filename,
                    f"forbidden entity token '{m.group(0)}' in public field "
                    f"'{key_path}': {value[:60]!r}",
                )
                break


def require_keys(report, filename, obj, required, label):
    """Report any missing keys on obj; return list of missing keys."""
    missing = [k for k in required if k not in obj]
    if missing:
        report.add(
            filename,
            f"{label} missing required key(s): {', '.join(missing)}",
        )
    return missing


def check_nonempty(report, filename, obj, keys, label):
    """Report keys present-but-empty (empty/whitespace string, or empty list)."""
    for k in keys:
        if k not in obj:
            continue
        v = obj[k]
        if isinstance(v, str) and v.strip() == "":
            report.add(filename, f"{label} has empty required value for '{k}'")
        elif isinstance(v, list) and len(v) == 0 and k not in ("conditions",):
            # conditions [] is legitimately empty for verified facts.
            report.add(filename, f"{label} has empty required list for '{k}'")


def load_json(report, path):
    """Parse a JSON file; report a parse error and return None on failure."""
    try:
        with open(path, "r", encoding="utf-8") as fh:
            return json.load(fh)
    except json.JSONDecodeError as exc:
        report.add(path.name, f"JSON parse error: {exc}")
    except OSError as exc:
        report.add(path.name, f"could not read file: {exc}")
    return None


def load_jsonl(report, path):
    """
    Parse a JSONL file line by line. Returns a list of (line_no, obj).
    Reports a parse error per bad line.
    """
    records = []
    try:
        with open(path, "r", encoding="utf-8") as fh:
            for line_no, raw in enumerate(fh, start=1):
                stripped = raw.strip()
                if stripped == "":
                    continue  # tolerate blank lines
                try:
                    records.append((line_no, json.loads(stripped)))
                except json.JSONDecodeError as exc:
                    report.add(path.name, f"JSONL parse error on line {line_no}: {exc}")
    except OSError as exc:
        report.add(path.name, f"could not read file: {exc}")
    return records


def find_duplicates(ids):
    """Return the set of ids that appear more than once."""
    seen = set()
    dups = set()
    for i in ids:
        if i in seen:
            dups.add(i)
        else:
            seen.add(i)
    return dups


# ---------------------------------------------------------------------------
# Per-file validators
# ---------------------------------------------------------------------------

def validate_approved_facts(report, path):
    filename = path.name
    data = load_json(report, path)
    if data is None:
        return
    if not isinstance(data, list):
        report.add(filename, "APPROVED_FACTS.json must be a JSON array of facts")
        return
    report.set_count(filename, "facts", len(data))

    ids = []
    for idx, fact in enumerate(data):
        label = f"fact[{idx}]"
        if not isinstance(fact, dict):
            report.add(filename, f"{label} is not an object")
            continue
        fid = fact.get("id")
        if isinstance(fid, str) and fid:
            label = f"fact '{fid}'"
            ids.append(fid)
        require_keys(report, filename, fact, FACT_REQUIRED_KEYS, label)
        check_nonempty(report, filename, fact, FACT_NONEMPTY_STRING_KEYS, label)

        # RU/UZ pair completeness for statements + safe public wording.
        for ru_key, uz_key in (
            ("statement_ru", "statement_uz"),
            ("safe_public_wording_ru", "safe_public_wording_uz"),
        ):
            ru = fact.get(ru_key)
            uz = fact.get(uz_key)
            ru_ok = isinstance(ru, str) and ru.strip() != ""
            uz_ok = isinstance(uz, str) and uz.strip() != ""
            if ru_ok and not uz_ok:
                report.add(filename, f"{label} has {ru_key} but missing/empty {uz_key}")
            elif uz_ok and not ru_ok:
                report.add(filename, f"{label} has {uz_key} but missing/empty {ru_key}")

    dups = find_duplicates(ids)
    for d in sorted(dups):
        report.add(filename, f"duplicate fact id: {d}")

    scan_public_copy(report, filename, data)
    return set(ids)


def validate_hook_bank(report, path):
    filename = path.name
    data = load_json(report, path)
    if data is None:
        return
    if not isinstance(data, list):
        report.add(filename, "HOOK_BANK.json must be a JSON array of hooks")
        return
    report.set_count(filename, "hooks", len(data))

    ids = []
    # (pain, angle) -> set of locales present
    coverage = {}
    valid_locales = {"ru", "uz"}
    for idx, hook in enumerate(data):
        label = f"hook[{idx}]"
        if not isinstance(hook, dict):
            report.add(filename, f"{label} is not an object")
            continue
        hid = hook.get("id")
        if isinstance(hid, str) and hid:
            label = f"hook '{hid}'"
            ids.append(hid)
        require_keys(report, filename, hook, HOOK_REQUIRED_KEYS, label)
        check_nonempty(
            report, filename, hook,
            ["id", "locale", "pain", "angle", "semantic_hook"], label,
        )
        loc = hook.get("locale")
        if loc is not None and loc not in valid_locales:
            report.add(filename, f"{label} has invalid locale {loc!r} (expected ru/uz)")
        pain = hook.get("pain")
        angle = hook.get("angle")
        if isinstance(loc, str) and isinstance(pain, str) and isinstance(angle, str):
            coverage.setdefault((pain, angle), set()).add(loc)

    dups = find_duplicates(ids)
    for d in sorted(dups):
        report.add(filename, f"duplicate hook id: {d}")

    # Locale coverage: each (pain, angle) seen in one locale should exist in both.
    missing_uz = 0
    missing_ru = 0
    for (pain, angle), locs in sorted(coverage.items()):
        if "ru" in locs and "uz" not in locs:
            missing_uz += 1
            report.add(
                filename,
                f"hook locale gap: (pain={pain!r}, angle={angle!r}) has RU but no UZ",
            )
        elif "uz" in locs and "ru" not in locs:
            missing_ru += 1
            report.add(
                filename,
                f"hook locale gap: (pain={pain!r}, angle={angle!r}) has UZ but no RU",
            )
    report.set_count(filename, "pain_angle_pairs", len(coverage))

    scan_public_copy(report, filename, data)
    return set(ids)


def validate_object_with_keys(report, path, top_keys):
    """Validate a top-level JSON object that must carry given keys."""
    filename = path.name
    data = load_json(report, path)
    if data is None:
        return
    if not isinstance(data, dict):
        report.add(filename, f"{filename} must be a JSON object")
        return
    require_keys(report, filename, data, top_keys, filename)
    # Surface a useful count for the summary so it is visible the file was read.
    for k in top_keys:
        v = data.get(k)
        if isinstance(v, list):
            report.set_count(filename, k, len(v))
        elif isinstance(v, dict):
            report.set_count(filename, k, len(v))
    report.set_count(filename, "parsed", True)
    skip_terms = filename in RULE_DEFINITION_FILES
    scan_public_copy(report, filename, data, skip_terms=skip_terms)
    return data


def validate_jsonl(report, path):
    filename = path.name
    records = load_jsonl(report, path)
    report.set_count(filename, "records", len(records))
    ids = []
    for line_no, obj in records:
        if not isinstance(obj, dict):
            report.add(filename, f"line {line_no}: record is not an object")
            continue
        rid = obj.get("id")
        if rid is None:
            report.add(filename, f"line {line_no}: record missing 'id'")
        elif isinstance(rid, str) and rid:
            ids.append(rid)
        # JSONL cases are test fixtures (they may carry bad inputs on purpose),
        # so we do NOT run prohibited-term / em-dash scans on them.
    dups = find_duplicates(ids)
    for d in sorted(dups):
        report.add(filename, f"duplicate record id: {d}")


# ---------------------------------------------------------------------------
# Top-level run
# ---------------------------------------------------------------------------

def validate_pack(knowledge_dir):
    """
    Validate every known file in the knowledge pack.
    Returns a Report.
    """
    report = Report()
    base = Path(knowledge_dir)

    if not base.exists():
        report.add("(pack)", f"knowledge directory not found: {base}")
        return report

    # Required JSON files and their top-level key requirements / validators.
    facts_path = base / "APPROVED_FACTS.json"
    if facts_path.exists():
        validate_approved_facts(report, facts_path)
    else:
        report.add("APPROVED_FACTS.json", "required file is missing")

    hooks_path = base / "HOOK_BANK.json"
    if hooks_path.exists():
        validate_hook_bank(report, hooks_path)
    else:
        report.add("HOOK_BANK.json", "required file is missing")

    object_files = {
        "ICP_AND_PAIN_MAP.json": ["meta", "primary", "secondary", "global_guardrails"],
        "CONTENT_STRATEGY.json": ["meta", "content_pillars", "weekly_balance"],
        "TEMPLATE_LIBRARY.json": ["meta", "templates"],
        "QA_RULES.json": ["meta", "blocking_rules", "warning_rules"],
    }
    for name, keys in object_files.items():
        p = base / name
        if p.exists():
            validate_object_with_keys(report, p, keys)
        else:
            report.add(name, "required file is missing")

    # Optional JSONL files: validate only if present.
    for name in KNOWN_JSONL:
        p = base / name
        if p.exists():
            validate_jsonl(report, p)

    # Any other *.jsonl files (future-proofing): parse them too.
    for p in sorted(base.glob("*.jsonl")):
        if p.name not in KNOWN_JSONL:
            validate_jsonl(report, p)

    return report


def print_summary(report, knowledge_dir):
    """Print a clear PASS/FAIL summary with per-file counts."""
    print("=" * 72)
    print(f"BirLiy CMO Brain pack validation: {knowledge_dir}")
    print("=" * 72)

    # Per-file counts (records/facts/hooks) for files that parsed.
    all_files = sorted(set(list(report.counts.keys()) + list(report.issues.keys())))
    for filename in all_files:
        counts = report.counts.get(filename, {})
        count_str = ", ".join(f"{k}={v}" for k, v in counts.items())
        n_issues = report.file_issue_count(filename)
        status = "OK" if n_issues == 0 else f"{n_issues} ISSUE(S)"
        line = f"  {filename:<32} {status}"
        if count_str:
            line += f"   [{count_str}]"
        print(line)
        for msg in report.issues.get(filename, []):
            print(f"       - {msg}")

    print("-" * 72)
    total = report.total_issues()
    if report.failed():
        print(f"RESULT: FAIL  ({total} issue(s) across {len(report.issues)} file(s))")
    else:
        print("RESULT: PASS  (0 issues)")
    print("=" * 72)


def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    knowledge_dir = str(Path(__file__).resolve().parent)
    if "--dir" in argv:
        i = argv.index("--dir")
        try:
            knowledge_dir = argv[i + 1]
        except IndexError:
            print("--dir requires a path argument", file=sys.stderr)
            return 2

    report = validate_pack(knowledge_dir)
    print_summary(report, knowledge_dir)
    return 1 if report.failed() else 0


if __name__ == "__main__":
    sys.exit(main())
