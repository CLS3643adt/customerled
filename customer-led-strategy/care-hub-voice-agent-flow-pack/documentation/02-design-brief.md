# Care Hub voice screen-pop — brief

## Problem

Care teams often answer inbound calls without context. Agents ask for identity again, hunt for the client record, and rebuild the reason for calling while the customer waits. That adds handle time and erodes trust—especially for older clients and family carers.

## Outcome

Use the Salesforce Voice / Open CTI **out-of-the-box call pop** as the starting UI:

1. Softphone shows inbound call pop (avatar, name, account, title, Incoming + ANI, ticker).
2. Agent chooses **Accept** or **Decline**.
3. On Accept, Lightning console screen-pops Voice Call + Contact, and the softphone moves to the connected panel (notes + End).

Care Hub accents (purple brand, orange highlights) replace default Salesforce blue so we can iterate from a familiar Salesforce baseline.

## Design principles

1. **Start from Salesforce OOTB** — Match the Open CTI `callInitiatedPanel` / `connectedPanel` patterns before customising Care Hub fields.
2. **Context before conversation** — Prefetch from ANI and IVR data so the record pop lands as the agent accepts.
3. **Familiar console chrome** — Service Console header, tabs, utility bar, and softphone width (~380px).
4. **Graceful ambiguity** — When a number matches multiple people, rank by recent activity and show a discriminating detail.
5. **Build incrementally** — Purple/orange accents first; Care Hub care context layered onto the Voice Call / Contact pages next.

## Success signals

- Seconds from ring to usable context (target: pop visible before answer)
- Reduction in re-verification questions on matched/verified calls
- Agent adoption: pop used as the starting surface, not dismissed
- First-contact resolution lift on visit-change and routine care enquiries
