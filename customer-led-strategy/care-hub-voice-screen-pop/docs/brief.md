# Care Hub voice screen-pop — brief

## Problem

Care teams often answer inbound calls without context. Agents ask for identity again, hunt for the client record, and rebuild the reason for calling while the customer waits. That adds handle time and erodes trust—especially for older clients and family carers.

## Outcome

At the moment a call connects (ideally while it is still ringing), Care Hub presents:

- Who is calling (client identity, preferred name, key contact)
- Why they called (IVR / voice-bot intent and tags)
- Care snapshot (package, next visit, risk flags)
- Recent interactions
- One suggested next action

## Design principles

1. **Context before conversation** — Prefetch from ANI and IVR data so the screen-pop lands before the agent greets.
2. **One job for the first glance** — Identity + intent + next action; not a full CRM dump.
3. **Customer-led language** — Prefer the client’s preferred name and care reality over internal codes.
4. **Graceful ambiguity** — When a number matches multiple people, rank by recent activity and show a discriminating detail.
5. **Actionable close** — Every pop ends with a concrete next step (schedule, escalate, note).

## Success signals

- Seconds from ring to usable context (target: pop visible before answer)
- Reduction in re-verification questions on matched/verified calls
- Agent adoption: pop used as the starting surface, not dismissed
- First-contact resolution lift on visit-change and routine care enquiries
