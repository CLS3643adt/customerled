# Care Hub · Voice Screen-Pop (Salesforce template)

Care Hub inbound voice screen-pop built on the **Salesforce Open CTI out-of-the-box call pop** softphone template, with Agentforce for Voice question flows and auto-created Case / Lead records.

## Path

`customer-led-strategy/care-hub-voice-screen-pop`

## Design baseline

- Salesforce Lightning Service Console chrome (three columns)
- Softphone as a **bottom utility popup** (Phone in the footer)
- Agentforce live transcription + guided questions per IVR intent
- Care Hub accents: **purple** brand + **orange** highlights

## Open the prototype

```bash
python3 -m http.server 8765 --directory .
```

Visit `http://localhost:8765`.

## Demo flow

1. Open **Phone** from the footer utility bar.
2. Choose an **IVR intent** question flow in the softphone.
3. Simulate the inbound call, then **Accept**.
4. Three-column console opens; Agentforce maps answers into the auto-created record.
5. Switch flows from the Voice Call **Question flow** chips to replay another demo.

### Intent flows

| Intent | Record created | Focus |
| --- | --- | --- |
| Visit change | Case | Cancel / reschedule visit details |
| SC worker sick | Case (+ manager approval task) | Leave hours, impacted visits, coverage |
| General lead enquiry | Lead | Enquirer, client, services, funding |
| Finance & billing | Case | Invoice / payment issue and resolution |
| Complaint / feedback | Case | Category, impact, desired outcome |

## Docs

- [Brief](./docs/brief.md)
- [Call journey](./docs/call-journey.md)
- [Intent flows](./flows.js)
