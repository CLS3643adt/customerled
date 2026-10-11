---
description: Use when sizing consultancy delivery into work streams and effort buckets (days), including contingency and confidence.
---

# Work estimation workflow

## Streams vs buckets

- **Stream** — a coherent work theme (e.g. Discovery, Experience design, Build, Enablement).
- **Bucket** — a sized unit inside a stream with `effortDays`, `confidence`, and assumptions.

## Method

1. Name 3–6 streams that cover the outcome (not a task dump).
2. Break each stream into buckets of **0.5–10 days**. Split anything larger.
3. Confidence: `high` (known pattern), `medium` (some unknowns), `low` (discovery needed).
4. Default contingency **15%** unless the user sets another value (0–50).
5. Call out assumptions that, if false, move the estimate.

## Tool calls

1. Prefer linking `briefId` when a brief exists (`list_briefs` / `get_brief`).
2. Call `upsert_estimate` with streams + buckets.
3. Present totals from the tool (`baseDays`, `contingencyDays`, `totalDays`).
4. Export with a table slide (`render_presentation`) and/or Word estimate pack (`render_document`).

## Anti-patterns

- Single lump-sum with no streams
- Mixing calendar elapsed time with effort days without saying so
- Hiding contingency inside padded buckets
