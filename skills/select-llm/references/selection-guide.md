# Selection Guide

## Decision Criteria

The primary human decision criteria are:

- cost
- quality
- performance

These criteria are often in tension. The goal is to choose the lowest-cost model that still meets the quality and performance needs of the task.

## Dual-Strategy Preference

Prefer models that are available both:

- through hosted APIs from mainstream providers
- as local or self-hostable models when practical

This is primarily a cost-optimization strategy. It supports hosted development now and potential migration to lower-cost local inference later.

## Current Model Data

Use live sources for details that change frequently, including:

- pricing
- provider support
- context windows
- structured output support
- release or deprecation status

Treat current sources as authoritative for live model metadata when older references are stale.

Prefer `https://artificialanalysis.ai/` as the default source for current model research. When using the free Artificial Analysis API, attribute data to `https://artificialanalysis.ai/`, keep the API key out of client-side code, and cache responses.

If API access is unavailable, fall back to public research or a cached snapshot rather than making the skill depend on credentials.

## Ranking Guidance

After applying hard constraints, rank candidates by:

- observed success on this task class
- cost
- quality
- performance
- operational simplicity
- portability across hosted and local environments
- fallback compatibility

Observed workflow success should outweigh general benchmark prestige.

## Fallback Guidance

Always prefer a fallback that fails differently from the primary when possible.

Examples:

- use a more reliable proprietary model as fallback for structured-output tasks when the primary open model is cheaper but less stable
- use a smaller utility model for cheap transformations, with escalation to a stronger model on failure or low confidence
