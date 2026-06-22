#!/usr/bin/env python3
"""Build a compact, versioned runtime bundle for cmo-cloud.

The full authoring pack stays in growth-os/knowledge. This script exports only
the small runtime subset needed by V1.1 prompts and deterministic QA.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "dist" / "runtime"
SOURCE_COMMIT = "ffd6c4feaeded5d3b7077f00f2050bd623653b5c"
BUNDLE_VERSION = "v1.1.0-knowledge-runtime"
SCHEMA_VERSION = "1.0"
STATIC_TOKEN_DIVISOR = 4
MAX_CONTEXT_CHARS = 16000

RUNTIME_PROMPTS = {
    "cmo_chat_system.md": """# CMO Chat System Runtime Prompt

Answer as BirLiy's cautious CMO assistant. Use runtime evidence for operational state. Use only verified facts for affirmative public claims. Treat needs-confirmation facts as questions or qualified uncertainty. Block prohibited claims. Never invent team discussions, implementation, deployment, publication, customers, testimonials or metrics.
""",
    "campaign_planner.md": """# Campaign Planner Runtime Prompt

Plan campaigns for small shop owners in Uzbekistan. Use one audience, one pain, one CTA and verified facts only. Mention needs-confirmation items only as owner questions. Avoid prohibited claims, parent-company mentions, em-dash and UZS.
""",
    "blog_generator.md": """# Blog Generator Runtime Prompt

Generate RU, UZ and EN blog content for BirLiy. Keep the copy calm, concrete and owner-facing. Use verified facts only. Preserve RU/UZ meaning parity. End with an approved CTA. Do not claim public publication, implementation status, customer results or deadlines unless runtime evidence proves them.
""",
    "telegram_generator.md": """# Telegram Generator Runtime Prompt

Generate staged Telegram drafts for review, not public publication. Use short lines, one idea, verified facts only and a clear CTA. RU and UZ drafts must carry the same meaning. Never use prohibited claims, em-dash, UZS, fabricated testimonials or fabricated results.
""",
    "qa_reviewer.md": """# QA Reviewer Runtime Prompt

Review public copy against deterministic QA: no parent-company/bank mention, no unsupported facts, no prohibited facts, no em-dash, no UZS, no fabricated testimonial/result/status/deadline, required language present and CTA present. Warnings must remain visible.
""",
    "regenerate_from_feedback.md": """# Regenerate From Feedback Runtime Prompt

Regenerate only the requested draft while preserving facts, language parity and approval gating. Do not add new claims. If feedback asks for a needs-confirmation or prohibited claim, refuse or qualify it safely.
""",
}


def read_json(name: str):
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


def write_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n", encoding="utf-8")


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8")


def short_text(value: object, limit: int = 220) -> str:
    text = " ".join(str(value or "").split())
    return text if len(text) <= limit else text[: limit - 1].rstrip() + "..."


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    h.update(path.read_bytes())
    return h.hexdigest()


def classify_source(fact: dict, decisions: dict) -> str:
    override = (decisions.get("fact_overrides") or {}).get(fact.get("id"), {})
    if override.get("source_classification"):
        return override["source_classification"]
    if fact.get("status") == "prohibited":
        return "demo_placeholder"
    source = " ".join(str(fact.get(k, "")) for k in ("source", "source_location", "notes")).lower()
    if any(word in source for word in ("demo", "herorevenue", "sample receipt", "mock")):
        return "demo_placeholder"
    if any(word in source for word in ("prompt", "spec", "unused", "roadmap")):
        return "specification_only"
    if any(word in source for word in ("i18n", "landing", "blog", "conceptlanding")):
        return "marketing_copy_only"
    return "unknown"


def temporary_owner_decision_map(decisions: dict) -> dict:
    mapped: dict[str, dict] = {}
    for decision in decisions.get("temporary_owner_decisions") or []:
        for fact_id in decision.get("fact_ids") or []:
            mapped[fact_id] = {
                "effective_status": decision.get("effective_status"),
                "source_classification": decision.get("source_classification"),
                "reason": decision.get("topic"),
                "public_instruction": decision.get("public_instruction"),
            }
    return mapped


def apply_decisions(facts: list[dict], decisions: dict) -> tuple[list[dict], list[dict], list[dict]]:
    overrides = decisions.get("fact_overrides") or {}
    temporary = temporary_owner_decision_map(decisions)
    verified: list[dict] = []
    needs: list[dict] = []
    prohibited: list[dict] = []

    for fact in facts:
        item = dict(fact)
        fid = item.get("id")
        override = overrides.get(fid, {})
        temp_decision = temporary.get(fid, {})
        classification = classify_source(item, decisions)
        effective_status = override.get("effective_status") or temp_decision.get("effective_status")
        if temp_decision.get("source_classification") and not override.get("source_classification"):
            classification = temp_decision["source_classification"]
        if not effective_status:
            if item.get("status") == "prohibited":
                effective_status = "prohibited"
            elif classification == "demo_placeholder":
                effective_status = "prohibited"
            elif item.get("status") == "verified" and classification in {
                "operational_evidence",
                "product_code",
                "owner_confirmed",
                "commercial_policy",
            }:
                effective_status = "verified"
            else:
                effective_status = "needs_confirmation"
        item["source_classification"] = override.get("source_classification") or classification
        item["effective_status"] = effective_status
        item["runtime_public"] = bool(effective_status == "verified")
        if override.get("reason"):
            item["decision_reason"] = override["reason"]
        elif temp_decision.get("reason"):
            item["decision_reason"] = temp_decision["reason"]
        if temp_decision.get("public_instruction"):
            item["public_instruction"] = temp_decision["public_instruction"]
        if effective_status == "verified":
            compact = {
                "id": item.get("id"),
                "category": item.get("category"),
                "effective_status": item.get("effective_status"),
                "source_classification": item.get("source_classification"),
                "runtime_public": True,
                "conditions": [short_text(c, 52) for c in (item.get("conditions") or [])[:1]],
                "decision_reason": short_text(item.get("decision_reason", ""), 48),
            }
            compact["safe_public_wording_ru"] = short_text(item.get("safe_public_wording_ru") or item.get("statement_ru"), 96)
            compact["safe_public_wording_uz"] = short_text(item.get("safe_public_wording_uz") or item.get("statement_uz"), 96)
            verified.append(compact)
        elif effective_status == "prohibited":
            compact = {
                "id": item.get("id"),
                "effective_status": item.get("effective_status"),
                "source_classification": item.get("source_classification"),
            }
            prohibited.append(compact)
        else:
            compact = {
                "id": item.get("id"),
                "effective_status": item.get("effective_status"),
                "source_classification": item.get("source_classification"),
            }
            if item.get("decision_reason"):
                compact["decision_reason"] = short_text(item.get("decision_reason"), 32)
            needs.append(compact)
    return verified, needs, prohibited


def compact_company_context(verified: list[dict], needs: list[dict], prohibited: list[dict]) -> str:
    verified_ids = ", ".join(f["id"] for f in verified[:12]) or "none"
    needs_ids = ", ".join(f["id"] for f in needs[:12]) or "none"
    prohibited_ids = ", ".join(f["id"] for f in prohibited[:12]) or "none"
    return f"""
# BirLiy Runtime Company Context

BirLiy is a phone-first POS and small-shop management app for Uzbekistan. Audience: owners of neighborhood shops and minimarkets. Public posture: early access 2026, Tashkent first, human review before publication.

Use only `approved_facts.verified.json` for affirmative public claims. Treat `claims_needing_confirmation.json` as questions or uncertainty. Never use `prohibited_claims.json` as evidence.

Approved positioning: phone-first kassa, stock, payments and owner visibility; made for Uzbekistan; early access / pilot cohort; contact and lead form.

Hard truth rules: never name a bank, payment processor, parent company or internal partner; never invent team discussions, implementation, deployment, publication, customers, testimonials, revenue, deadlines or metrics; never treat marketing copy, prompts, specs, mockups or demo data as evidence; roadmap is not shipped; preserve RU/UZ parity; no em-dash, UZS, missing CTA or fabricated claims.

Verified fact IDs in runtime: {verified_ids}
Needs-confirmation IDs include: {needs_ids}
Prohibited IDs include: {prohibited_ids}
""".strip()


def compact_rule(rule: dict) -> dict:
    return {
        "rule_id": rule.get("rule_id"),
        "severity": rule.get("severity"),
    }


def compact_rules(qa: dict, brand_text: str) -> tuple[dict, dict]:
    return (
        {
            "version": (brand_text.splitlines()[0] if brand_text else "BIRLIY_BRAND_VOICE").strip("# ").strip(),
            "public_copy_blocks": [
                "no bank or parent-company mention",
                "no em-dash",
                "RU currency is сум; UZ currency is so'm; never UZS",
                "no fabricated testimonials or customer counts",
                "no fabricated team discussion, implementation, deployment or publication status",
                "CTA required for public marketing copy",
            ],
            "tone": [
                "calm shopkeeper-neighbour",
                "plain, concrete, owner-facing",
                "one idea per post",
                "money, time and control over technology hype",
            ],
        },
        {
            "schema_version": SCHEMA_VERSION,
            "source_meta": {
                "source": "QA_RULES.json",
                "version": (qa.get("meta") or {}).get("version") or SCHEMA_VERSION,
            },
            "blocking_rules": [compact_rule(rule) for rule in qa.get("blocking_rules", [])[:12]],
            "warning_rules": [compact_rule(rule) for rule in qa.get("warning_rules", [])[:12]],
            "runtime_blocking_checks": [
                "prohibited parent-company mention",
                "unsupported factual claims",
                "missing required language",
                "em-dash in public output",
                "prohibited currency notation",
                "fabricated testimonial",
                "fabricated result",
                "fabricated implementation state",
                "fabricated deadline",
                "empty output",
                "missing required CTA",
            ],
        },
    )


def copy_prompt(name: str) -> None:
    write_text(OUT / "prompts" / name, RUNTIME_PROMPTS[name])


def build() -> dict:
    facts = read_json("APPROVED_FACTS.json")
    decisions = read_json("CLAIMS_DECISIONS.json")
    qa = read_json("QA_RULES.json")
    brand_text = (ROOT / "BIRLIY_BRAND_VOICE.md").read_text(encoding="utf-8")

    verified, needs, prohibited = apply_decisions(facts, decisions)

    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / "prompts").mkdir(parents=True, exist_ok=True)

    write_text(OUT / "company_context.compact.md", compact_company_context(verified, needs, prohibited))
    write_json(OUT / "approved_facts.verified.json", verified)
    write_json(OUT / "claims_needing_confirmation.json", needs)
    write_json(OUT / "prohibited_claims.json", prohibited)
    brand_rules, qa_rules = compact_rules(qa, brand_text)
    write_json(OUT / "brand_rules.runtime.json", brand_rules)
    write_json(OUT / "qa_rules.runtime.json", qa_rules)

    for prompt in [
        "cmo_chat_system.md",
        "campaign_planner.md",
        "blog_generator.md",
        "telegram_generator.md",
        "qa_reviewer.md",
        "regenerate_from_feedback.md",
    ]:
        copy_prompt(prompt)

    files = sorted(p for p in OUT.rglob("*") if p.is_file() and p.name != "manifest.json")
    total_chars = sum(len(p.read_text(encoding="utf-8")) for p in files if p.suffix in {".md", ".json"})
    manifest = {
        "schema_version": SCHEMA_VERSION,
        "bundle_version": BUNDLE_VERSION,
        "source_claude_commit": SOURCE_COMMIT,
        "build_timestamp": datetime.now(timezone.utc).isoformat(),
        "verified_fact_count": len(verified),
        "needs_confirmation_count": len(needs),
        "prohibited_count": len(prohibited),
        "approximate_character_count": total_chars,
        "approximate_token_estimate": round(total_chars / STATIC_TOKEN_DIVISOR),
        "context_budget": {
            "static_context_preferred_max_tokens": 4000,
            "static_context_hard_max_chars": MAX_CONTEXT_CHARS,
            "truncation": "deterministic by file order and per-section character limit",
        },
        "files": {str(p.relative_to(OUT)).replace("\\", "/"): {"sha256": sha256(p), "bytes": p.stat().st_size} for p in files},
    }
    write_json(OUT / "manifest.json", manifest)
    return manifest


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="Build and validate the runtime bundle.")
    args = parser.parse_args()
    manifest = build()
    if manifest["approximate_token_estimate"] > 4000:
        print("WARN: full bundle is above preferred ordinary context budget; loader must select task-relevant files.")
    print(json.dumps({
        "ok": True,
        "bundle_version": manifest["bundle_version"],
        "verified_fact_count": manifest["verified_fact_count"],
        "needs_confirmation_count": manifest["needs_confirmation_count"],
        "prohibited_count": manifest["prohibited_count"],
        "approximate_token_estimate": manifest["approximate_token_estimate"],
    }, ensure_ascii=False, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
