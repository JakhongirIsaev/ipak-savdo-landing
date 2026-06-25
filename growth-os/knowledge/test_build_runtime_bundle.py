import hashlib
import json
import tempfile
from pathlib import Path
import unittest

import build_runtime_bundle as bundle


class RuntimeBundleBuildTests(unittest.TestCase):
    def build_temp_bundle(self):
        tmp = tempfile.TemporaryDirectory()
        old_out = bundle.OUT
        bundle.OUT = Path(tmp.name) / "runtime"
        try:
            manifest = bundle.build()
            return tmp, bundle.OUT, manifest
        finally:
            bundle.OUT = old_out

    def read_json(self, root, name):
        return json.loads((root / name).read_text(encoding="utf-8"))

    def test_runtime_fact_counts_and_budget(self):
        tmp, root, manifest = self.build_temp_bundle()
        self.addCleanup(tmp.cleanup)

        self.assertEqual(manifest["verified_fact_count"], 7)
        self.assertEqual(manifest["needs_confirmation_count"], 28)
        self.assertEqual(manifest["prohibited_count"], 11)
        self.assertLessEqual(manifest["approximate_character_count"], bundle.MAX_CONTEXT_CHARS)
        self.assertLessEqual(manifest["approximate_token_estimate"], 4000)

    def test_owner_decisions_are_enforced(self):
        tmp, root, _manifest = self.build_temp_bundle()
        self.addCleanup(tmp.cleanup)
        approved = self.read_json(root, "approved_facts.verified.json")
        needs = self.read_json(root, "claims_needing_confirmation.json")
        prohibited = self.read_json(root, "prohibited_claims.json")
        approved_ids = {item["id"] for item in approved}
        needs_ids = {item["id"] for item in needs}
        prohibited_ids = {item["id"] for item in prohibited}

        self.assertNotIn("fact_pricing_promo", approved_ids)
        self.assertIn("fact_pricing_promo", needs_ids)
        self.assertIn("fact_onboarding_cashier_30min", prohibited_ids)
        self.assertIn("fact_install_time", prohibited_ids)
        self.assertIn("fact_sale_flow_15s", prohibited_ids)
        self.assertIn("fact_real_shops_badge", prohibited_ids)
        self.assertFalse(approved_ids & needs_ids)
        self.assertFalse(approved_ids & prohibited_ids)
        self.assertFalse(needs_ids & prohibited_ids)

    def test_verified_runtime_facts_have_allowed_source_classifications(self):
        tmp, root, _manifest = self.build_temp_bundle()
        self.addCleanup(tmp.cleanup)
        approved = self.read_json(root, "approved_facts.verified.json")
        allowed = {"operational_evidence", "product_code", "owner_confirmed", "commercial_policy"}

        self.assertTrue(approved)
        self.assertTrue(all(item["effective_status"] == "verified" for item in approved))
        self.assertTrue(all(item["runtime_public"] for item in approved))
        self.assertTrue(all(item["source_classification"] in allowed for item in approved))

    def test_manifest_file_set_and_checksums_are_recorded(self):
        tmp, root, manifest = self.build_temp_bundle()
        self.addCleanup(tmp.cleanup)
        expected = {
            "company_context.compact.md",
            "approved_facts.verified.json",
            "claims_needing_confirmation.json",
            "prohibited_claims.json",
            "brand_rules.runtime.json",
            "qa_rules.runtime.json",
            "prompts/cmo_chat_system.md",
            "prompts/campaign_planner.md",
            "prompts/blog_generator.md",
            "prompts/telegram_generator.md",
            "prompts/qa_reviewer.md",
            "prompts/regenerate_from_feedback.md",
        }

        self.assertEqual(set(manifest["files"]), expected)
        for rel, meta in manifest["files"].items():
            data = (root / rel).read_bytes()
            self.assertEqual(hashlib.sha256(data).hexdigest(), meta["sha256"], rel)
            self.assertEqual(len(data), meta["bytes"], rel)

    def test_golden_campaigns_are_not_in_ordinary_runtime(self):
        tmp, root, manifest = self.build_temp_bundle()
        self.addCleanup(tmp.cleanup)
        runtime_text = "\n".join(
            (root / rel).read_text(encoding="utf-8")
            for rel in manifest["files"]
            if (root / rel).suffix in {".md", ".json"}
        )

        self.assertNotIn("Golden Campaign", runtime_text)
        self.assertNotIn("campaign-1-remote-revenue-stock", runtime_text)
        self.assertNotIn("campaign-2-faster-cashier-queues", runtime_text)
        self.assertNotIn("campaign-3-nasiya-debt-visibility", runtime_text)

    def test_golden_campaign_fixtures_publish_qa_verdicts(self):
        for path in sorted((bundle.ROOT / "golden-campaigns").glob("*.md")):
            text = path.read_text(encoding="utf-8")
            self.assertIn("PASS", text, path.name)
            self.assertNotIn("\u2014", text, path.name)
            self.assertNotIn("\u2013", text, path.name)


if __name__ == "__main__":
    unittest.main()
