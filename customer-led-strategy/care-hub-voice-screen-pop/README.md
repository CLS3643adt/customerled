# Care Hub · Voice Screen-Pop (Salesforce template)

Care Hub inbound voice screen-pop built on the **Salesforce Open CTI out-of-the-box call pop** softphone template (`callInitiatedPanel` → Accept / Decline), then the connected panel and Lightning console screen-pop.

## Path

`customer-led-strategy/care-hub-voice-screen-pop`

## Design baseline

- Salesforce Lightning Service Console chrome
- Softphone utility panel matching Open CTI demo adapter:
  - Available / search panel
  - Incoming **call pop** (avatar, name, account, title, Incoming + number, ticker, Decline / Accept)
  - Connected panel (mini record, Connected ticker, notes, End)
- On **Accept**, workspace tabs screen-pop for Voice Call + Contact
- Care Hub accents: **purple** brand + **orange** highlights (replacing default Salesforce blue)

## Open the prototype

```bash
python3 -m http.server 8765 --directory .
```

Visit `http://localhost:8765`.

## Demo flow

1. Softphone is open on the right (Phone utility).
2. Click the phone icon in the softphone toolbar to simulate an inbound call.
3. Review the OOTB-style call pop, then click **Accept**.
4. Console opens in **three columns**:
   - **Left:** Health Hub client card
   - **Centre:** Agentforce for Voice + auto-created Visit Change case
   - **Right:** Next visits / workers
5. Softphone stays as a **bottom utility popup** (Phone in the footer), not a fourth column.
6. Use **Replay demo** on the Voice Call tab to re-run the Agentforce transcript simulation.

## Docs

- [Brief](./docs/brief.md)
- [Call journey](./docs/call-journey.md)
