# New enquiry → Lead — brief

## Problem

New service enquiries often arrive by phone with no CRM record. Agents re-ask identity, write free-text notes, and later recreate a Lead — so funding, consent, and urgency are incomplete when intake picks up the work.

## Outcome

Use the Salesforce Voice / Open CTI **out-of-the-box call pop** plus Agentforce guided questions:

1. Softphone shows inbound call pop for an unknown / new enquirer (ANI + IVR intent).
2. Agent chooses **Accept**.
3. IVR intent **General lead enquiry** auto-creates Lead `L-000492`.
4. Guided capture fills enquirer, prospective client, services, funding, location, urgency, and consent.
5. Intake owns next actions: qualify, book assessment, follow up with the enquirer.

## Design principles

1. **Start from Salesforce OOTB** — Match the Open CTI call pop / connected panel before customising Care Hub fields.
2. **Lead-first for unknowns** — No existing Client Card or Contact tab; the Lead is the system of record until conversion.
3. **Structured intake** — Questions map 1:1 to Lead fields so handoff does not depend on call notes.
4. **Consent on the Lead** — Privacy consent is captured before routing to intake.
5. **Build incrementally** — Reuse Care Hub accents; extend with eligibility / catchment checks next.

## Success signals

- Lead created at accept with IVR intent attached
- Required intake fields complete before call end
- Reduction in “callback to re-collect details” from Intake
- Time from enquiry to booked assessment
