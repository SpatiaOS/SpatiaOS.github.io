import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from decimal import Decimal

spec = importlib.util.spec_from_file_location("costs", Path(__file__).with_name("calculate-assembly-costs.py"))
costs = importlib.util.module_from_spec(spec)
spec.loader.exec_module(costs)
RATES = {"model_ids": ["test-model"], "input": "10", "cache_read": "1", "cache_write": "12.5",
         "output": "50", "max_input_at_rate": 272000}


class CostAccountingTests(unittest.TestCase):
    def test_reasoning_is_included_once_and_cache_writes_replace_ordinary_input(self):
        tokens = costs.normalized({"input_tokens": 1000, "output_tokens": 2000, "total_tokens": 3000,
                                   "input_tokens_details": {"cached_tokens": 200, "cache_write_tokens": 300},
                                   "output_tokens_details": {"reasoning_tokens": 1500}})
        self.assertEqual(costs.price(tokens, RATES), Decimal("0.10895"))
        chat = costs.normalized({"prompt_tokens": 1000, "completion_tokens": 2000, "total_tokens": 3000,
                                 "prompt_tokens_details": {"cached_tokens": 200, "cache_write_tokens": 300},
                                 "completion_tokens_details": {"reasoning_tokens": 1500}, "cost": 999})
        self.assertEqual(chat, tokens)
        self.assertEqual(costs.price(chat, RATES), Decimal("0.10895"))

    def test_missing_usage_stays_unknown_instead_of_zero(self):
        self.assertIsNone(costs.normalized({}))
        report = costs.summarize([{"usage_complete": False, "valid": True, "attempts": 1,
                                  "history_recovered": False, "records": [{"tokens": None}]}], 4)
        self.assertIsNone(report["usd_per_case"])
        self.assertIsNone(report["token_totals"])
        self.assertEqual(report["api_unrun"], 4)

    def test_three_attempts_include_invalid_outputs_and_use_tested_denominator(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for attempt in range(1, 4):
                path = root / f"attempt_{attempt}"
                path.mkdir()
                (path / "response_meta.json").write_text(json.dumps({"model": "test-model", "response_id": str(attempt),
                    "usage": {"prompt_tokens": 100, "completion_tokens": 200, "total_tokens": 300}}))
            case = {"case_id": "x", "attempts": 3, "valid": False, "generated_code_path": str(root / "generated.py"),
                    "usage": {"prompt_tokens": 300, "completion_tokens": 600, "total_tokens": 900}}
            audited = costs.audit_case(("test", "cadquery", case, RATES))
            self.assertEqual(Decimal(audited["cost_usd"]), Decimal("0.033"))
            self.assertTrue(audited["history_recovered"])
            report = costs.summarize([audited], 99)
            self.assertEqual(report["usd_per_case"], 0.033)
            self.assertEqual(report["invalid_cases"], 1)
            case["usage"]["completion_tokens"] = 599
            case["usage"]["total_tokens"] = 899
            with self.assertRaisesRegex(ValueError, "disagree"):
                costs.audit_case(("test", "cadquery", case, RATES))

    def test_refuse_ambiguous_counters_or_unhandled_rates(self):
        with self.assertRaisesRegex(ValueError, "cache counters"):
            costs.normalized({"input_tokens": 10, "output_tokens": 20, "input_tokens_details": {"cached_tokens": 11}})
        tokens = costs.normalized({"input_tokens": 300000, "output_tokens": 20})
        with self.assertRaisesRegex(ValueError, "context price"):
            costs.price(tokens, RATES)
        tokens = costs.normalized({"input_tokens": 1000, "output_tokens": 20, "input_tokens_details": {"cache_write_tokens": 1}})
        with self.assertRaisesRegex(ValueError, "cache_write"):
            costs.price(tokens, {**RATES, "cache_write": None})


if __name__ == "__main__":
    unittest.main()
