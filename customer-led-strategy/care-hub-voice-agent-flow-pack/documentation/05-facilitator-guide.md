# Facilitator guide — running the demo

## Setup

```bash
cd prototype
python3 -m http.server 8765
```

Open http://localhost:8765  
(or use the live site: https://cls3643adt.github.io/customerled/)

Allow ~5–8 minutes per scenario, or 15–20 minutes for a full tour of two flows.

## Recommended run order

1. **Visit change** — clearest client screen-pop story  
2. **SC worker sick** — shows staff path + manager approval Case  
3. **Lead enquiry** — shows Lead instead of Case  
4. Optional: Finance or Complaint for specialised queues  

## Script (Visit change)

1. “Inbound call hits Care Hub Voice. IVR already tagged **Visit change**.”  
2. Softphone rings — point out name, role, phone, intent.  
3. Click **Accept**.  
4. Walk the three columns: client card → Agentforce/Case → next visits.  
5. Capture answers (Interactive) or switch to Guided auto-play.  
6. Show fields filling on the Case.  
7. Close on next actions: schedule update + notify household.  

## Modes

| Mode | When to use |
| --- | --- |
| Interactive capture | Workshops — let people click answers |
| Guided auto-play | Executive overview — hands-off transcript |

## Controls (bottom bar)

- **Demo hub** — scenario cards  
- **Reset** — clear current demo state  
- **Switch mode** — Interactive ↔ Guided  
- **Start / next step** — advance the process map  

## Talking points

- Start from Salesforce OOTB call pop, then Care Hub accents/context  
- Intent creates the right record type and queue early  
- Agentforce reduces free-text rework by structuring capture  
- Same pattern scales across five Care Hub intents  

## Parking lot (common questions)

| Question | Answer |
| --- | --- |
| Is this in our org? | Prototype only — see implementation checklist |
| Can IVR pass intent today? | Depends on contact centre; checklist covers the requirement |
| Does it store clinical data unsafely? | Prototype uses sample data; prod needs auth gates |
| Can we add more intents? | Yes — extend the same Case/Lead + question pattern |
