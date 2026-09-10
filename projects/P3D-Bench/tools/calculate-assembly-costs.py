#!/usr/bin/env python3
"""Audit selected generation attempts against a frozen benchmark score snapshot.

Read-only with respect to benchmark data. Raw response identifiers and paths stay
in --audit-dir; public output contains aggregate counters and source hashes only.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor
from decimal import Decimal
import hashlib
import json
from pathlib import Path

FIELDS = ("input_tokens", "cached_input_tokens", "cache_write_tokens", "output_tokens", "reasoning_tokens")


def normalized(usage):
    if not usage:
        return None
    chat = "prompt_tokens" in usage
    response = "input_tokens" in usage
    if chat == response:
        raise ValueError("expected exactly one supported usage schema")
    inp = usage["prompt_tokens" if chat else "input_tokens"]
    out = usage["completion_tokens" if chat else "output_tokens"]
    details = usage.get("prompt_tokens_details" if chat else "input_tokens_details") or {}
    output_details = usage.get("completion_tokens_details" if chat else "output_tokens_details") or {}
    values = dict(zip(FIELDS, (inp, details.get("cached_tokens", 0), details.get("cache_write_tokens", 0), out,
                               output_details.get("reasoning_tokens", 0))))
    if any(isinstance(v, bool) or not isinstance(v, int) or v < 0 for v in values.values()):
        raise ValueError("usage counters must be nonnegative integers")
    if values["cached_input_tokens"] + values["cache_write_tokens"] > inp:
        raise ValueError("cache counters exceed total input")
    if values["reasoning_tokens"] > out:
        raise ValueError("reasoning must already be included in output")
    if "total_tokens" in usage and usage["total_tokens"] != inp + out:
        raise ValueError("input plus output differs from total tokens")
    return values


def price(tokens, rates):
    if tokens is None:
        return None
    if tokens["input_tokens"] > rates["max_input_at_rate"]:
        raise ValueError("request needs a different context price tier")
    ordinary = tokens["input_tokens"] - tokens["cached_input_tokens"] - tokens["cache_write_tokens"]
    total = Decimal(0)
    for count, name in [(ordinary, "input"), (tokens["cached_input_tokens"], "cache_read"),
                        (tokens["cache_write_tokens"], "cache_write"), (tokens["output_tokens"], "output")]:
        if count:
            if rates[name] is None:
                raise ValueError(f"missing official {name} rate")
            total += Decimal(count) * Decimal(rates[name]) / Decimal(1000000)
    return total


def resolve(path):
    return Path(path.replace("/mnt/CFS/yangyikang/cad_dataset/", "/share/yyk/3dagent/cad_dataset/"))


def read_attempt(path):
    raw = path.read_bytes()
    meta = json.loads(raw)
    return {"path": str(path), "sha256": hashlib.sha256(raw).hexdigest(),
            "model": meta.get("model"), "response_id": meta.get("response_id"),
            "tokens": normalized(meta.get("usage"))}


def audit_case(job):
    model, fmt, case, rates = job
    history = case.get("attempt_history") or []
    if history:
        numbers = [h["attempt"] for h in history]
        paths = [resolve(h["response_meta_path"]) for h in history]
    else:
        # A few local-only repairs retained aggregate usage and attempt files,
        # but not the history list. Recover only the explicitly recorded budget.
        numbers = list(range(1, case["attempts"] + 1))
        root = resolve(case["generated_code_path"]).parent
        paths = [root / f"attempt_{n}" / "response_meta.json" for n in numbers]
    if not numbers or numbers != list(range(1, len(numbers) + 1)) or len(numbers) > 3:
        raise ValueError(f"{model}/{fmt}/{case['case_id']}: invalid attempt budget")
    records = [read_attempt(p) for p in paths]
    if any(r["model"] not in rates["model_ids"] for r in records):
        raise ValueError("attempt model does not match pricing model")
    available = [r["tokens"] for r in records if r["tokens"] is not None]
    totals = {f: sum(t[f] for t in available) for f in FIELDS}
    aggregate = normalized(case.get("usage"))
    complete = len(available) == len(records)
    if complete and totals != aggregate:
        raise ValueError(f"{model}/{fmt}/{case['case_id']}: attempts disagree with saved usage")
    if not complete and aggregate is not None:
        raise ValueError("aggregate usage exists but individual requests cannot be fully audited")
    costs = [price(r["tokens"], rates) for r in records] if complete else []
    cost = sum(costs, Decimal(0)) if complete else None
    return {"model_id": model, "format": fmt, "case_id": case["case_id"], "valid": bool(case.get("valid")),
            "attempts": len(records), "history_recovered": not bool(history), "usage_complete": complete,
            "tokens": totals if complete else None, "cost_usd": str(cost) if cost is not None else None,
            "records": records}


def summarize(cases, api_unrun):
    complete = [c for c in cases if c["usage_complete"]]
    total = sum((Decimal(c["cost_usd"]) for c in complete), Decimal(0))
    all_known = len(complete) == len(cases)
    return {"tested_cases": len(cases), "api_unrun": api_unrun,
            "valid_cases": sum(c["valid"] for c in cases), "invalid_cases": sum(not c["valid"] for c in cases),
            "cases_with_complete_usage": len(complete), "generation_requests": sum(c["attempts"] for c in cases),
            "requests_without_usage": sum(r["tokens"] is None for c in cases for r in c["records"]),
            "histories_recovered_from_attempt_files": sum(c["history_recovered"] for c in cases),
            "token_totals": {f: sum(c["tokens"][f] for c in complete) for f in FIELDS} if all_known else None,
            "max_request_input_tokens": max((r["tokens"]["input_tokens"] for c in complete for r in c["records"]), default=None),
            "total_usd": float(total) if all_known else None,
            "usd_per_case": float(total / len(cases)) if all_known and cases else None}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--results", type=Path, required=True)
    parser.add_argument("--summary", type=Path, required=True)
    parser.add_argument("--pricing", type=Path, required=True)
    parser.add_argument("--audit-dir", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    raw = args.results.read_bytes()
    full = json.loads(raw)
    summary = json.loads(args.summary.read_text())
    catalog = json.loads(args.pricing.read_text())
    jobs, coverage = [], {}
    for row in summary["rows"]:
        model = row["model_id"]
        for fmt in ("cadquery", "openscad"):
            cases = full[f"text_image2cad/{model}-reason/{fmt}"]["cases"]
            tested = [c for c in cases if not c.get("llm_failed")]
            if len(cases) != 100 or len(tested) != row["formats"][fmt]["coverage"]["tested"]:
                raise ValueError("score and cost case populations differ")
            coverage[model, fmt] = 100 - len(tested)
            jobs += [(model, fmt, c, catalog["models"][model]) for c in tested]
    with ThreadPoolExecutor(max_workers=8) as pool:
        ledger = list(pool.map(audit_case, jobs))
    identifiers = [(c["model_id"], r["response_id"]) for c in ledger for r in c["records"] if r["response_id"]]
    if len(identifiers) != len(set(identifiers)):
        raise ValueError("the same generation response would be charged twice")
    report = {"schema_version": "p3d-assembly-generation-cost-v1", "checked_at": catalog["checked_at"],
              "score_source": summary["score_source"], "full_results_sha256": hashlib.sha256(raw).hexdigest(),
              "pricing_source": "assembly-api-pricing.json",
              "definition": "Official API equivalent generation cost. Sum all selected initial/correction requests (at most three per tested case); include invalid cases; exclude API-unrun cases. Average the two format-specific per-tested-case means equally. Output includes reasoning exactly once; cached reads and writes are priced separately. Excludes evaluator calls, superseded runs, failed transport overhead, subscription payments and tax.",
              "rows": []}
    for row in summary["rows"]:
        model = row["model_id"]
        formats = {fmt: summarize([c for c in ledger if c["model_id"] == model and c["format"] == fmt], coverage[model, fmt])
                   for fmt in ("cadquery", "openscad")}
        means = [v["usd_per_case"] for v in formats.values()]
        cost = sum(means) / 2 if all(v is not None for v in means) else None
        report["rows"].append({"model_id": model, "model": row["model"], "usd_per_case": cost,
                               "usage_kind": "actual_tokens_official_api_rates" if cost is not None else "missing_generation_usage",
                               "formats": formats})
    args.audit_dir.mkdir(parents=True, exist_ok=True)
    (args.audit_dir / "request-ledger.private.json").write_text(json.dumps(ledger, ensure_ascii=False, indent=2) + "\n")
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps([{"model": r["model"], "usd_per_case": r["usd_per_case"],
                       "tested": sum(f["tested_cases"] for f in r["formats"].values()),
                       "requests": sum(f["generation_requests"] for f in r["formats"].values())}
                      for r in report["rows"]], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
