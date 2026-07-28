# Voice screen-pop call journey

## Happy path

1. **Signal** — Inbound call presents ANI (`+61 412 883 204`).
2. **IVR / voice capture** — Caller confirms DOB; intent tagged as *Visit change* (physiotherapy, same carer preferred).
3. **Match** — Care Hub resolves Client ID `ECH-10482` (Margaret “Maggie” Chen).
4. **Screen-pop** — Agent desktop opens with identity, intent, care snapshot, history, and suggested scheduling action.
5. **Answer** — Agent greets by preferred name and confirms the visit change without re-collecting basics.
6. **Close** — Schedule updated; SMS confirmation to Maggie and key contact David.

## Unhappy paths to design for

| Scenario | Behaviour |
| --- | --- |
| Unknown number | Pop search/create flow with IVR intent still shown |
| Shared household number | Ranked match list with discriminating detail (e.g. DOB last digits, recent visit) |
| Auth failed | Show unmatched caution; do not expose clinical detail until verified |
| Intent missing | Identity + care snapshot only; prompt agent to confirm reason |
| Pop latency | Keep ringing softphone UI; show “loading context” then hydrate—never blank CRM |

## Data inputs (prototype assumptions)

- Telephony: caller ID + queue
- IVR: intent, auth level
- Care system: package, visits, risk flags, contacts
- Interaction history: prior calls, portal, visit notes
