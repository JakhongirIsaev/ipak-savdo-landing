#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
test_validate_pack.py  (Deliverable 12)

Unit tests for validate_pack.py. Standard library only (json, unittest,
tempfile, pathlib, copy).

Two kinds of test:
  (a) the REAL pack in this directory validates with zero issues;
  (b) synthetic bad inputs are CAUGHT: em-dash, 'UZS', duplicate id,
      missing required key, empty required value, locale gap, JSON/JSONL
      parse errors, prohibited entity (bank) name.

Run:
    python -m unittest test_validate_pack -v
"""

import copy
import json
import tempfile
import unittest
from pathlib import Path

import validate_pack as vp

KNOWLEDGE_DIR = Path(__file__).resolve().parent


def write(path, text):
    path.write_text(text, encoding="utf-8")


def all_messages(report):
    """Flatten every issue message into one list of strings."""
    msgs = []
    for file_msgs in report.issues.values():
        msgs.extend(file_msgs)
    return msgs


def joined(report):
    return "\n".join(all_messages(report))


# A minimal, valid fact carrying all 13 required keys.
def good_fact(fact_id="fact_sample"):
    return {
        "id": fact_id,
        "category": "product",
        "statement_uz": "Kassa, ombor va to'lovlar bitta ilovada.",
        "statement_ru": "Касса, склад и оплаты в одном приложении.",
        "statement_en": "Checkout, stock and payments in one app.",
        "status": "verified",
        "source": "D:/x/i18n.ts",
        "source_location": "features[0]",
        "last_verified": "2026-06-23",
        "safe_public_wording_uz": "Kassa, ombor va to'lovlar bitta ilovada.",
        "safe_public_wording_ru": "Касса, склад и оплаты в одном приложении.",
        "conditions": [],
        "notes": "Reusable.",
    }


def good_hook(hook_id="hook_ru_x_001", locale="ru", pain="stock loss", angle="pain"):
    return {
        "id": hook_id,
        "locale": locale,
        "pain": pain,
        "angle": angle,
        "semantic_hook": "Остаток в тетради расходится с полкой.",
        "visual_hook_suggestion": "Бумажный фон, тетрадь и полка.",
        "suitable_formats": ["telegram_post"],
        "risk_notes": ["Опирается на fact_stock_auto_low_alert"],
    }


class RealPackTest(unittest.TestCase):
    """The actual delivered pack must validate clean."""

    def test_real_pack_passes(self):
        report = vp.validate_pack(KNOWLEDGE_DIR)
        self.assertFalse(
            report.failed(),
            msg="Real pack should validate with zero issues, but got:\n"
            + joined(report),
        )

    def test_real_pack_exit_code_zero(self):
        self.assertEqual(vp.main(["--dir", str(KNOWLEDGE_DIR)]), 0)


class SyntheticPackTestBase(unittest.TestCase):
    """
    Builds a minimal, fully valid pack in a temp dir, then each test mutates
    ONE file to inject a single defect and asserts it is caught.
    """

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.dir = Path(self.tmp.name)
        self._write_valid_pack()

    def tearDown(self):
        self.tmp.cleanup()

    def _write_valid_pack(self):
        facts = [good_fact("fact_a"), good_fact("fact_b")]
        write(self.dir / "APPROVED_FACTS.json", json.dumps(facts, ensure_ascii=False))

        hooks = [
            good_hook("hook_ru_stock_pain", "ru", "stock loss", "pain"),
            good_hook("hook_uz_stock_pain", "uz", "stock loss", "pain"),
        ]
        write(self.dir / "HOOK_BANK.json", json.dumps(hooks, ensure_ascii=False))

        write(self.dir / "ICP_AND_PAIN_MAP.json", json.dumps({
            "meta": {"title": "x"},
            "primary": {"segment_id": "p"},
            "secondary": [],
            "global_guardrails": {"currency": "RU 'сум' / UZ 'so'm'. Never 'UZS'."},
        }, ensure_ascii=False))

        write(self.dir / "CONTENT_STRATEGY.json", json.dumps({
            "meta": {"title": "x"},
            "content_pillars": [{"pillar_id": 1, "name_ru": "Боль"}],
            "weekly_balance": {"posts_per_week_instagram": 3},
        }, ensure_ascii=False))

        write(self.dir / "TEMPLATE_LIBRARY.json", json.dumps({
            "meta": {"title": "x"},
            "templates": {"telegram_post": {"id": "telegram_post"}},
        }, ensure_ascii=False))

        write(self.dir / "QA_RULES.json", json.dumps({
            "meta": {"title": "x"},
            "blocking_rules": [{"rule_id": "B01"}],
            "warning_rules": [{"rule_id": "W01"}],
        }, ensure_ascii=False))

    def run_pack(self):
        return vp.validate_pack(self.dir)

    def assert_clean(self):
        report = self.run_pack()
        self.assertFalse(report.failed(), msg="expected clean, got:\n" + joined(report))

    def assert_caught(self, needle):
        report = self.run_pack()
        self.assertTrue(report.failed(), "expected validation to FAIL but it passed")
        self.assertIn(
            needle.lower(),
            joined(report).lower(),
            msg=f"expected an issue containing {needle!r}; got:\n" + joined(report),
        )


class BaselineSanityTest(SyntheticPackTestBase):
    def test_baseline_pack_is_clean(self):
        # The unmutated synthetic pack must itself pass, so later tests are meaningful.
        self.assert_clean()


class EmDashTest(SyntheticPackTestBase):
    def test_em_dash_in_fact_caught(self):
        facts = [good_fact("fact_a"), good_fact("fact_b")]
        facts[0]["statement_ru"] = "BirLiy — это касса, склад и оплаты."  # U+2014
        write(self.dir / "APPROVED_FACTS.json", json.dumps(facts, ensure_ascii=False))
        self.assert_caught("em-dash")

    def test_en_dash_in_hook_caught(self):
        hooks = [
            good_hook("hook_ru_stock_pain", "ru", "stock loss", "pain"),
            good_hook("hook_uz_stock_pain", "uz", "stock loss", "pain"),
        ]
        hooks[0]["semantic_hook"] = "Старт 49 000 сум – первые 6 месяцев."  # U+2013
        write(self.dir / "HOOK_BANK.json", json.dumps(hooks, ensure_ascii=False))
        self.assert_caught("em-dash")


class UzsTest(SyntheticPackTestBase):
    def test_uzs_in_fact_caught(self):
        facts = [good_fact("fact_a"), good_fact("fact_b")]
        facts[0]["statement_ru"] = "Старт 49 000 UZS в месяц."
        write(self.dir / "APPROVED_FACTS.json", json.dumps(facts, ensure_ascii=False))
        self.assert_caught("UZS")

    def test_uzs_substring_not_flagged(self):
        # 'UZS' is matched only as a standalone token; a substring must NOT fire.
        facts = [good_fact("fact_a"), good_fact("fact_b")]
        facts[0]["statement_ru"] = "Слово BRUZSKIY не валюта."
        write(self.dir / "APPROVED_FACTS.json", json.dumps(facts, ensure_ascii=False))
        self.assert_clean()


class DuplicateIdTest(SyntheticPackTestBase):
    def test_duplicate_fact_id_caught(self):
        facts = [good_fact("fact_dup"), good_fact("fact_dup")]
        write(self.dir / "APPROVED_FACTS.json", json.dumps(facts, ensure_ascii=False))
        self.assert_caught("duplicate fact id")

    def test_duplicate_hook_id_caught(self):
        hooks = [
            good_hook("hook_same", "ru", "stock loss", "pain"),
            good_hook("hook_same", "uz", "stock loss", "pain"),
        ]
        write(self.dir / "HOOK_BANK.json", json.dumps(hooks, ensure_ascii=False))
        self.assert_caught("duplicate hook id")


class MissingKeyTest(SyntheticPackTestBase):
    def test_missing_fact_key_caught(self):
        facts = [good_fact("fact_a"), good_fact("fact_b")]
        del facts[0]["statement_uz"]
        write(self.dir / "APPROVED_FACTS.json", json.dumps(facts, ensure_ascii=False))
        self.assert_caught("missing required key")

    def test_missing_hook_key_caught(self):
        hooks = [
            good_hook("hook_ru_stock_pain", "ru", "stock loss", "pain"),
            good_hook("hook_uz_stock_pain", "uz", "stock loss", "pain"),
        ]
        del hooks[0]["semantic_hook"]
        write(self.dir / "HOOK_BANK.json", json.dumps(hooks, ensure_ascii=False))
        self.assert_caught("missing required key")

    def test_missing_top_level_object_key_caught(self):
        write(self.dir / "CONTENT_STRATEGY.json", json.dumps({
            "meta": {"title": "x"},
            # content_pillars removed
            "weekly_balance": {"posts_per_week_instagram": 3},
        }, ensure_ascii=False))
        self.assert_caught("content_pillars")


class EmptyValueTest(SyntheticPackTestBase):
    def test_empty_fact_value_caught(self):
        facts = [good_fact("fact_a"), good_fact("fact_b")]
        facts[0]["statement_ru"] = "   "
        write(self.dir / "APPROVED_FACTS.json", json.dumps(facts, ensure_ascii=False))
        self.assert_caught("empty required value")

    def test_empty_uz_breaks_ru_uz_pair(self):
        facts = [good_fact("fact_a"), good_fact("fact_b")]
        facts[0]["statement_uz"] = ""
        write(self.dir / "APPROVED_FACTS.json", json.dumps(facts, ensure_ascii=False))
        report = self.run_pack()
        self.assertTrue(report.failed())
        # Either the empty-value check or the RU/UZ-pair check (or both) must fire.
        text = joined(report).lower()
        self.assertTrue(
            ("empty required value" in text) or ("missing/empty statement_uz" in text),
            msg="expected an empty-value / RU-UZ-pair issue; got:\n" + joined(report),
        )


class RuUzParityTest(SyntheticPackTestBase):
    def test_hook_locale_gap_caught(self):
        # Only a RU hook for (stock loss, pain): the UZ counterpart is missing.
        hooks = [good_hook("hook_ru_only", "ru", "stock loss", "pain")]
        write(self.dir / "HOOK_BANK.json", json.dumps(hooks, ensure_ascii=False))
        self.assert_caught("RU but no UZ")

    def test_invalid_locale_caught(self):
        hooks = [
            good_hook("hook_a", "ru", "stock loss", "pain"),
            good_hook("hook_b", "uz", "stock loss", "pain"),
        ]
        hooks[0]["locale"] = "en"
        write(self.dir / "HOOK_BANK.json", json.dumps(hooks, ensure_ascii=False))
        self.assert_caught("invalid locale")


class ProhibitedEntityTest(SyntheticPackTestBase):
    def test_bank_name_in_public_copy_caught(self):
        facts = [good_fact("fact_a"), good_fact("fact_b")]
        facts[0]["statement_ru"] = "Касса BirLiy от Ipak Yuli."
        write(self.dir / "APPROVED_FACTS.json", json.dumps(facts, ensure_ascii=False))
        self.assert_caught("forbidden entity")

    def test_entity_in_notes_field_not_flagged(self):
        # 'notes' is metadata, not public copy: naming the term there is allowed.
        facts = [good_fact("fact_a"), good_fact("fact_b")]
        facts[0]["notes"] = "Never name Ipak Yuli or any bank in public copy."
        write(self.dir / "APPROVED_FACTS.json", json.dumps(facts, ensure_ascii=False))
        self.assert_clean()


class ParseErrorTest(SyntheticPackTestBase):
    def test_broken_json_caught(self):
        write(self.dir / "APPROVED_FACTS.json", "{ this is not valid json ")
        self.assert_caught("parse error")

    def test_broken_jsonl_line_caught(self):
        # Add an optional JSONL file with one bad line.
        write(
            self.dir / "qa_cases.jsonl",
            '{"id": "c1", "ok": true}\nthis is not json\n{"id": "c2"}\n',
        )
        self.assert_caught("JSONL parse error")

    def test_duplicate_jsonl_id_caught(self):
        write(
            self.dir / "generation_cases.jsonl",
            '{"id": "g1"}\n{"id": "g1"}\n',
        )
        self.assert_caught("duplicate record id")

    def test_jsonl_missing_id_caught(self):
        write(self.dir / "qa_cases.jsonl", '{"prompt": "no id here"}\n')
        self.assert_caught("missing 'id'")


class MissingFileTest(SyntheticPackTestBase):
    def test_missing_required_file_caught(self):
        (self.dir / "APPROVED_FACTS.json").unlink()
        self.assert_caught("required file is missing")


class ExitCodeTest(SyntheticPackTestBase):
    def test_main_returns_nonzero_on_failure(self):
        facts = [good_fact("fact_dup"), good_fact("fact_dup")]
        write(self.dir / "APPROVED_FACTS.json", json.dumps(facts, ensure_ascii=False))
        self.assertEqual(vp.main(["--dir", str(self.dir)]), 1)

    def test_main_returns_zero_on_clean(self):
        self.assertEqual(vp.main(["--dir", str(self.dir)]), 0)


if __name__ == "__main__":
    unittest.main(verbosity=2)
