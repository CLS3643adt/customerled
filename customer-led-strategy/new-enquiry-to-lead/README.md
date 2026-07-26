# Care Hub · New enquiry → Lead

Standalone Salesforce Voice + Agentforce prototype for the **new service enquiry → Lead** intake flow.
Adapted from the Care Hub multi-scenario voice demo, focused on a single process.

## Path

`customer-led-strategy/new-enquiry-to-lead`

## How to present

```bash
python3 -m http.server 8766 --directory customer-led-strategy/new-enquiry-to-lead
```

Open `http://localhost:8766`.

### Facilitator controls (bottom purple bar)

- **Interactive capture** (default): click questions / answers, or use **Capture next answer**
- **Guided auto-play**: Agentforce plays the transcript automatically
- **Start demo** on the scenario card: launches call → screen pop → capture
- **Start / next step**: advances the target process flow
- **Reset / Demo hub**: return to the hub

### Target process flow

1. IVR intent: General lead enquiry  
2. Screen pop (softphone + Voice Call)  
3. Capture enquirer, client, services, funding  
4. Create Lead `L-000492`  
5. Next actions (qualify, book intake, follow up)

### Scenario

| Scenario | Record | Demo focus |
| --- | --- | --- |
| General lead enquiry | Lead | Enquirer Priya Sharma → prospective client Ananya Sharma (HCP L2) |

## Files

- `index.html` — console + demo hub UI
- `app.js` — interactive / guided prototype logic
- `flows.js` — lead enquiry questions, transcript, Lead mapping
- `styles.css` — Salesforce-inspired Care Hub theme
- `docs/brief.md` — problem / outcome brief
- `docs/call-journey.md` — call journey notes
- `docs/agentforce-flow-requirements.md` — Agentforce requirements, draft questions, topic instructions, and build process

## Share online

Drop this folder on [Netlify Drop](https://app.netlify.com/drop), or serve locally as above.
The GitHub Pages site continues to host the multi-scenario Care Hub demo from `docs/`.
