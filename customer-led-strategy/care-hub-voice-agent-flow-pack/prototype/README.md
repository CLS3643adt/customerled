# Care Hub · Interactive Voice Prototype

Part of the **Care Hub Salesforce Voice Agent Flow Pack**.

For the full sendable pack (flow specs, facilitator guide, Salesforce checklist), see the parent folder or unzipped pack root `START-HERE.md`.

## How to present

```bash
python3 -m http.server 8765 --directory .
```

Open `http://localhost:8765`.

### Facilitator controls (bottom purple bar)

- **Interactive capture** (default): click questions / answers, or use **Capture next answer**
- **Guided auto-play**: Agentforce plays the transcript automatically
- **Start demo** on a scenario card: launches call → screen pop → capture
- **Start / next step**: advances the target process flow
- **Reset / Demo hub**: return to scenario selection

### Target process flow

1. Select intent  
2. Screen pop  
3. Capture answers  
4. Create Case / Lead  
5. Next actions  

### Scenarios

| Scenario | Record | Demo focus |
| --- | --- | --- |
| Visit change | Case | Cancel / reschedule |
| SC worker sick | Case (+ manager approval) | Leave hours & coverage |
| General lead enquiry | Lead | Enquirer, services, funding |
| Finance & billing | Case | Invoice / payment issue |
| Complaint / feedback | Case | Impact & desired outcome |

## Files

- `index.html` — console + demo hub UI  
- `app.js` — interactive / guided prototype logic  
- `flows.js` — intent questions, transcripts, record mapping  
- `styles.css` — Salesforce-inspired Care Hub theme  

## Live demo

https://cls3643adt.github.io/customerled/
