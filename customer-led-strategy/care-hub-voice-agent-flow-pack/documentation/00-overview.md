# Overview — Care Hub Voice Agent Flows

## Purpose

Show how Salesforce Voice (Open CTI call pop) + Agentforce can:

1. Present an inbound call with IVR intent  
2. Screen-pop the right Care Hub context  
3. Guide the agent through intent-specific questions  
4. Auto-create a **Case** or **Lead** with captured fields  
5. Hand off clear next actions (schedule, approve leave, intake, finance, quality)

## Target process (all scenarios)

```text
Select intent → Screen pop → Capture answers → Create Case/Lead → Next actions
```

## Design baseline

- Softphone follows Salesforce **OOTB** Open CTI patterns: incoming pop (Accept / Decline) → connected panel  
- After Accept: three-column Service Console  
  - Left: Health Hub client / caller context  
  - Centre: Voice Call + Agentforce + Case/Lead  
  - Right: Next visits / related work  
- Softphone sits in the **bottom utility** (starts minimized on the demo hub)

## Accent theme

Care Hub purple + orange accents on a Salesforce-inspired console (not production Lightning CSS).

## Outcomes we are proving

| Outcome | How the prototype shows it |
| --- | --- |
| Context before conversation | Screen-pop with client, risk, care partner, household |
| Structured capture | Guided questions per IVR intent |
| Less re-keying | Fields fill as answers are captured |
| Correct routing | Case/Lead owner queue shown per intent |
| Facilitator-ready demo | Interactive capture + guided auto-play modes |

## Related docs

- Call journey: `01-call-journey.md`  
- Design brief: `02-design-brief.md`  
- Flow specs: `03-agentforce-voice-flow-specs.md`  
- Build checklist: `04-salesforce-implementation-checklist.md`  
- Facilitator guide: `05-facilitator-guide.md`  
- Sharing / live link: `06-sharing-and-live-demo.md`
