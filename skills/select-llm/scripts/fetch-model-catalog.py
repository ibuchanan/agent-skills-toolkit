#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.12"
# dependencies = [
#   "httpx>=0.28,<1",
# ]
# ///

"""Fetch and normalize LLM catalog data from Artificial Analysis.

This script prefers the Artificial Analysis API when `ARTIFICIAL_ANALYSIS_API_KEY`
is configured. If the key is missing or the API request fails, it falls back to a
recent cached response, then to a checked-in snapshot when one is available. If no
live, cached, or snapshot data is available, it still emits valid JSON so the
skill can continue with static references.
"""

from __future__ import annotations

import argparse
import json
import os
import platform
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import httpx

API_ENDPOINT = "https://artificialanalysis.ai/api/v2/data/llms/models"
ATTRIBUTION_URL = "https://artificialanalysis.ai/"
API_KEY_ENV = "ARTIFICIAL_ANALYSIS_API_KEY"


def load_dotenv(path: Path) -> None:
    if not path.exists():
        return

    with path.open("r", encoding="utf-8") as handle:
        for raw_line in handle:
            line = raw_line.strip()
            if not line or line.startswith("#"):
                continue

            if line.startswith("export "):
                line = line[len("export ") :].lstrip()

            if "=" not in line:
                continue

            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip()

            if not key or key in os.environ:
                continue

            if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
                value = value[1:-1]

            os.environ[key] = value


def load_local_env() -> None:
    script_dir = Path(__file__).resolve().parent
    load_dotenv(script_dir / ".env")


def now_iso() -> str:
    return (
        datetime.now(timezone.utc)
        .replace(microsecond=0)
        .isoformat()
        .replace("+00:00", "Z")
    )


def default_cache_path() -> Path:
    home = Path.home()
    system = platform.system()

    if os.environ.get("XDG_CACHE_HOME"):
        return (
            Path(os.environ["XDG_CACHE_HOME"])
            / "select-llm"
            / "artificialanalysis-models.json"
        )
    if system == "Darwin":
        return (
            home
            / "Library"
            / "Caches"
            / "select-llm"
            / "artificialanalysis-models.json"
        )
    if system == "Windows" and os.environ.get("LOCALAPPDATA"):
        return (
            Path(os.environ["LOCALAPPDATA"])
            / "select-llm"
            / "artificialanalysis-models.json"
        )
    return home / ".cache" / "select-llm" / "artificialanalysis-models.json"


def default_snapshot_path() -> Path:
    return (
        Path(__file__).resolve().parent.parent
        / "assets"
        / "model-catalog.snapshot.json"
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--cache-path",
        default=str(default_cache_path()),
        help="Path to the local JSON cache file.",
    )
    parser.add_argument(
        "--snapshot-path",
        default=str(default_snapshot_path()),
        help="Path to the checked-in snapshot JSON file.",
    )
    parser.add_argument(
        "--max-age-seconds",
        type=int,
        default=24 * 60 * 60,
        help="Maximum age for cached data before refresh is attempted.",
    )
    parser.add_argument(
        "--timeout-seconds",
        type=int,
        default=20,
        help="HTTP timeout for the API request.",
    )
    parser.add_argument(
        "--force-refresh",
        action="store_true",
        help="Bypass cache age checks and attempt a live API request.",
    )
    return parser.parse_args()


def build_output(
    *,
    mode: str,
    cached: bool,
    prompt_options: dict[str, Any] | None,
    models: list[dict[str, Any]],
    errors: list[dict[str, str]] | None = None,
) -> dict[str, Any]:
    return {
        "source": {
            "name": "artificialanalysis",
            "mode": mode,
            "attribution_required": mode in {"api", "cache"},
            "attribution_url": ATTRIBUTION_URL,
            "api_endpoint": API_ENDPOINT,
            "cached": cached,
        },
        "fetched_at": now_iso(),
        "prompt_options": prompt_options or {},
        "models": models,
        "errors": errors or [],
    }


def normalize_model(model: dict[str, Any]) -> dict[str, Any]:
    creator = model.get("model_creator") or {}
    pricing = model.get("pricing") or {}
    evaluations = model.get("evaluations") or {}

    return {
        "artificial_analysis_id": model.get("id"),
        "name": model.get("name"),
        "slug": model.get("slug"),
        "creator": {
            "id": creator.get("id"),
            "name": creator.get("name"),
            "slug": creator.get("slug"),
        },
        "pricing": {
            "price_1m_input_tokens": pricing.get("price_1m_input_tokens"),
            "price_1m_output_tokens": pricing.get("price_1m_output_tokens"),
            "price_1m_blended_3_to_1": pricing.get("price_1m_blended_3_to_1"),
        },
        "benchmarks": evaluations,
        "performance": {
            "median_output_tokens_per_second": model.get(
                "median_output_tokens_per_second"
            ),
            "median_time_to_first_token_seconds": model.get(
                "median_time_to_first_token_seconds"
            ),
            "median_time_to_first_answer_token": model.get(
                "median_time_to_first_answer_token"
            ),
        },
    }


def fetch_api(api_key: str, timeout_seconds: int) -> dict[str, Any]:
    with httpx.Client(timeout=timeout_seconds) as client:
        response = client.get(API_ENDPOINT, headers={"x-api-key": api_key})
        response.raise_for_status()
        return response.json()


def cache_is_fresh(cache_path: Path, max_age_seconds: int) -> bool:
    if not cache_path.exists():
        return False
    age_seconds = time.time() - cache_path.stat().st_mtime
    return age_seconds <= max_age_seconds


def read_cache(cache_path: Path) -> dict[str, Any] | None:
    if not cache_path.exists():
        return None
    with cache_path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def read_snapshot(snapshot_path: Path) -> dict[str, Any] | None:
    if not snapshot_path.exists():
        return None
    with snapshot_path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_cache(cache_path: Path, payload: dict[str, Any]) -> None:
    cache_path.parent.mkdir(parents=True, exist_ok=True)
    with cache_path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, sort_keys=True)
        handle.write("\n")


def cached_output(
    cached_payload: dict[str, Any], reason: dict[str, str] | None = None
) -> dict[str, Any]:
    payload = dict(cached_payload)
    source = dict(payload.get("source") or {})
    source["mode"] = "cache"
    source["cached"] = True
    source["attribution_required"] = True
    source["attribution_url"] = ATTRIBUTION_URL
    source["api_endpoint"] = API_ENDPOINT
    payload["source"] = source
    errors = list(payload.get("errors") or [])
    if reason:
        errors.append(reason)
    payload["errors"] = errors
    return payload


def snapshot_output(
    snapshot_payload: dict[str, Any], reason: dict[str, str] | None = None
) -> dict[str, Any]:
    payload = dict(snapshot_payload)
    source = dict(payload.get("source") or {})
    source["mode"] = "snapshot"
    source["cached"] = False
    source["attribution_required"] = True
    source["attribution_url"] = ATTRIBUTION_URL
    source["api_endpoint"] = API_ENDPOINT
    payload["source"] = source
    errors = list(payload.get("errors") or [])
    if reason:
        errors.append(reason)
    payload["errors"] = errors
    return payload


def unavailable_output(error: dict[str, str]) -> dict[str, Any]:
    return build_output(
        mode="unavailable",
        cached=False,
        prompt_options={},
        models=[],
        errors=[error],
    )


def http_error_details(error: httpx.HTTPStatusError) -> dict[str, str]:
    return {
        "code": f"http_{error.response.status_code}",
        "message": (
            "Artificial Analysis API request failed with HTTP "
            f"{error.response.status_code}."
        ),
    }


def main() -> int:
    load_local_env()
    args = parse_args()
    cache_path = Path(args.cache_path).expanduser()
    snapshot_path = Path(args.snapshot_path).expanduser()
    api_key = os.environ.get(API_KEY_ENV)

    if not args.force_refresh and cache_is_fresh(cache_path, args.max_age_seconds):
        cached_payload = read_cache(cache_path)
        if cached_payload is not None:
            json.dump(
                cached_output(cached_payload), sys.stdout, indent=2, sort_keys=True
            )
            sys.stdout.write("\n")
            return 0

    if api_key:
        try:
            raw = fetch_api(api_key, args.timeout_seconds)
            normalized = build_output(
                mode="api",
                cached=False,
                prompt_options=raw.get("prompt_options") or {},
                models=[normalize_model(model) for model in raw.get("data") or []],
            )
            write_cache(cache_path, normalized)
            json.dump(normalized, sys.stdout, indent=2, sort_keys=True)
            sys.stdout.write("\n")
            return 0
        except httpx.HTTPStatusError as error:
            reason = http_error_details(error)
        except httpx.RequestError as error:
            reason = {
                "code": "network_error",
                "message": f"Artificial Analysis API request failed: {error}.",
            }
        except json.JSONDecodeError:
            reason = {
                "code": "invalid_json",
                "message": "Artificial Analysis API returned invalid JSON.",
            }

        cached_payload = read_cache(cache_path)
        if cached_payload is not None:
            print(
                "Using cached Artificial Analysis model catalog after API failure.",
                file=sys.stderr,
            )
            json.dump(
                cached_output(cached_payload, reason),
                sys.stdout,
                indent=2,
                sort_keys=True,
            )
            sys.stdout.write("\n")
            return 0

        snapshot_payload = read_snapshot(snapshot_path)
        if snapshot_payload is not None:
            print(
                "Using checked-in Artificial Analysis model snapshot after API failure.",
                file=sys.stderr,
            )
            json.dump(
                snapshot_output(snapshot_payload, reason),
                sys.stdout,
                indent=2,
                sort_keys=True,
            )
            sys.stdout.write("\n")
            return 0

        print(reason["message"], file=sys.stderr)
        json.dump(unavailable_output(reason), sys.stdout, indent=2, sort_keys=True)
        sys.stdout.write("\n")
        return 0

    cached_payload = read_cache(cache_path)
    if cached_payload is not None:
        print(
            f"{API_KEY_ENV} is not set; using cached Artificial Analysis model catalog.",
            file=sys.stderr,
        )
        json.dump(
            cached_output(
                cached_payload,
                {
                    "code": "missing_api_key",
                    "message": f"{API_KEY_ENV} is not set.",
                },
            ),
            sys.stdout,
            indent=2,
            sort_keys=True,
        )
        sys.stdout.write("\n")
        return 0

    snapshot_payload = read_snapshot(snapshot_path)
    if snapshot_payload is not None:
        print(
            f"{API_KEY_ENV} is not set; using checked-in Artificial Analysis model snapshot.",
            file=sys.stderr,
        )
        json.dump(
            snapshot_output(
                snapshot_payload,
                {
                    "code": "missing_api_key",
                    "message": f"{API_KEY_ENV} is not set.",
                },
            ),
            sys.stdout,
            indent=2,
            sort_keys=True,
        )
        sys.stdout.write("\n")
        return 0

    print(
        f"{API_KEY_ENV} is not set; returning an unavailable catalog so the skill can fall back to static references.",
        file=sys.stderr,
    )
    json.dump(
        unavailable_output(
            {
                "code": "missing_api_key",
                "message": f"{API_KEY_ENV} is not set.",
            }
        ),
        sys.stdout,
        indent=2,
        sort_keys=True,
    )
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
