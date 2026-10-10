# CLS Brief Studio

Customer Led Strategy agent for consultancy briefs, work-stream estimates, and branded PowerPoint / Word deliverables.

## Quick start

```bash
cd cls-brief-studio
npm install
npx bdk validate --dir .
npx bdk serve --dir . --mode single --dev
# http://127.0.0.1:3000/playground
```

Model turns need a Cursor credential (`CURSOR_API_KEY` or `bdk login`).

## What it does

- Draft and manage consultancy briefs (`upsert_brief`, `list_briefs`, `get_brief`)
- Estimate streams and effort buckets in days (`upsert_estimate`, …)
- Export CLS-branded `.pptx` and `.docx` (`render_presentation`, `render_document`)

Brand tokens match Care Hub / Customer Led Strategy purple + orange accents used across this repo.

## Checks

```bash
npx bdk validate --dir .
npx bdk info --dir . --json
npx bdk call upsert_brief --dir . --input '{"title":"Demo","problem":"…","outcome":"…"}'
npm run check
npx bdk eval --dir . --list
```
