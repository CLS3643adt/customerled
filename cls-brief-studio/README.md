# CLS Brief Studio

Customer Led Strategy agent for consultancy briefs, work-stream estimates, and branded PowerPoint / Word deliverables.

## Quick start (local standalone — no Cursor team required)

```bash
cd cls-brief-studio
npm ci   # or: npm install
export CURSOR_API_KEY="crsr_…"   # Dashboard → API Keys, or `npx bdk login`
npx bdk validate --dir .
npx bdk serve --dir . --mode single --dev --host 0.0.0.0 --port 3000
# Playground: http://127.0.0.1:3000/playground
```

Hosted `bdk deploy` needs a Cursor **team**. Individual accounts should use this local playground path.

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
