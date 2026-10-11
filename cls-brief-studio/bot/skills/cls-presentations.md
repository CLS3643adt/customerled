---
description: Use when creating Customer Led Strategy PowerPoint or Word deliverables so slide/section structure and branding stay consistent.
---

# CLS presentation & document format

## Brand lock

- Firm name on title and closing slides / document header: **Customer Led Strategy**
- Purple primary, orange accent (handled by render tools — do not invent alternate colours)
- Calibri-friendly copy; short headlines; one idea per slide

## Standard deck order

1. `title` — engagement title + client subtitle
2. `agenda` — 4–6 beats
3. `bullets` — Problem
4. `bullets` — Outcome
5. `bullets` or `two_column` — Approach / principles
6. `bullets` — Work streams
7. `table` — Estimate (Stream | Bucket | Days | Confidence)
8. `two_column` — Risks | Assumptions
9. `bullets` — Next steps
10. `closing` — thank you / contact line

Omit empty sections rather than padding with filler.

## Word structure

Mirror the brief skill headings. Optional `metaRows`: Client, Status, Brief id, Estimate id, Total days.

## Tool calls

- PowerPoint → `render_presentation`
- Word → `render_document`
- Always return the `workspacePath` to the user
