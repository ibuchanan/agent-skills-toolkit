# Live Data

## Preferred Helper

Use `scripts/fetch-model-catalog.py` to retrieve current LLM catalog data from Artificial Analysis.

The helper is optional. The skill must still work when live data is unavailable.

## Authentication

Set `ARTIFICIAL_ANALYSIS_API_KEY` to enable live API access.

The helper sends the key using the `x-api-key` header required by the Artificial Analysis API.

The helper also loads a local `.env` file at `src/skills/select-llm/scripts/.env` without overriding environment variables already set in the shell.

Do not expose the key in client-side code.

## Attribution

When output relies on the free Artificial Analysis API, provide attribution to `https://artificialanalysis.ai/`.

The helper includes attribution metadata in its output so downstream prompts and reports can carry it forward.

## Caching

Cache responses when possible.

The helper caches successful API responses locally and can reuse them when:

- no API key is configured
- the API request fails
- the cached result is still fresh enough for the current use

The helper also supports a checked-in snapshot at `assets/model-catalog.snapshot.json` as a baseline fallback.

Refresh the checked-in snapshot before releases or when it is older than 30 days. If a workflow uses a stale snapshot because live data is unavailable, report the snapshot age and verify final pricing, availability, context limits, and deprecation status against a current source before making a production recommendation.

## Usage

Examples:

```bash
src/skills/select-llm/scripts/fetch-model-catalog.py
uv run src/skills/select-llm/scripts/fetch-model-catalog.py --force-refresh
uv run src/skills/select-llm/scripts/fetch-model-catalog.py --max-age-seconds 21600
uv run src/skills/select-llm/scripts/fetch-model-catalog.py --snapshot-path src/skills/select-llm/assets/model-catalog.snapshot.json
```

## Output Shape

The helper emits JSON to stdout.

`source.mode` records provenance such as `api`, `cache`, `snapshot`, or `unavailable`.
Use `fetched_at` to judge recency in the skill or calling workflow.

Example:

```json
{
  "source": {
    "name": "artificialanalysis",
    "mode": "api",
    "attribution_required": true,
    "attribution_url": "https://artificialanalysis.ai/",
    "api_endpoint": "https://artificialanalysis.ai/api/v2/data/llms/models",
    "cached": false
  },
  "fetched_at": "2026-04-11T12:00:00Z",
  "prompt_options": {
    "parallel_queries": 1,
    "prompt_length": "medium"
  },
  "models": [
    {
      "artificial_analysis_id": "2dad8957-4c16-4e74-bf2d-8b21514e0ae9",
      "name": "o3-mini",
      "slug": "o3-mini",
      "creator": {
        "id": "e67e56e3-15cd-43db-b679-da4660a69f41",
        "name": "OpenAI",
        "slug": "openai"
      },
      "pricing": {
        "price_1m_input_tokens": 1.1,
        "price_1m_output_tokens": 4.4,
        "price_1m_blended_3_to_1": 1.925
      },
      "benchmarks": {
        "artificial_analysis_intelligence_index": 62.9,
        "artificial_analysis_coding_index": 55.8
      },
      "performance": {
        "median_output_tokens_per_second": 153.831,
        "median_time_to_first_token_seconds": 14.939,
        "median_time_to_first_answer_token": 14.939
      }
    }
  ],
  "errors": []
}
```

If live data is unavailable, the helper prefers cached data, then the checked-in snapshot, and finally returns valid JSON with an empty `models` array and an `errors` entry so the skill can fall back to static references.
