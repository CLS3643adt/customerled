---
description: Use when drafting, refining, or structuring a Customer Led Strategy consultancy brief (problem, outcome, scope, success signals).
---

# Consultancy brief workflow

## Required sections

1. **Problem** — who feels the pain, what breaks today, cost of inaction
2. **Outcome** — measurable end-state the engagement will leave behind
3. **Principles** — 3–5 design / delivery principles
4. **In scope** — work streams or capabilities included
5. **Out of scope** — explicit exclusions (protects estimate integrity)
6. **Success signals** — leading indicators and acceptance cues
7. **Assumptions** — access, data, decision rights, environments
8. **Risks** — delivery, adoption, dependency, political
9. **Next steps** — immediate decisions and workshops

## Style

- Outcome before solution. Avoid feature laundry lists in the problem statement.
- Prefer client language; translate jargon on first use.
- Status: `draft` → `review` → `approved` only when the user confirms.

## Tool calls

1. Draft content in the conversation if needed.
2. Call `upsert_brief` with structured fields.
3. For a Word pack, map sections 1:1 into `render_document` headings.
4. Offer a deck via `render_presentation` when stakeholders need a walkthrough.
