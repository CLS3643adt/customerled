# New enquiry → Lead call journey

## Happy path

1. **Signal** — Inbound call presents ANI (`+61 400 778 219`).
2. **IVR / voice capture** — Intent tagged as *General lead enquiry* (new services).
3. **No client match** — Number is not linked to an existing Contact/Client; Lead is created.
4. **Screen-pop** — Softphone + Voice Call open; Lead `L-000492` is auto-created for Intake.
5. **Capture** — Agent (or Agentforce) walks enquirer through: who is calling, relationship, contact details, prospective client identity, services, funding, suburb, urgency, consent.
6. **Close** — Lead subject/description/summary complete; next actions for Intake (qualify, book assessment, email enquirer).

## Demo persona

| Role | Person | Detail |
| --- | --- | --- |
| Enquirer / caller | Priya Sharma | Daughter · primary contact |
| Prospective client | Ananya Sharma | DOB 02 Feb 1944 · Glenelg North |
| Funding | HCP Level 2 | Approved |
| Services | Personal care · Domestic assistance | Start within 2 weeks |

## Unhappy paths to design for

| Scenario | Behaviour |
| --- | --- |
| Duplicate Lead | Warn if matching name + DOB + suburb already open |
| Funding unknown | Allow “unknown” and queue eligibility callback |
| Out of catchment | Capture interest; route to partner / waitlist path |
| No consent | Do not contact prospective client; enquirer-only follow-up |
| Shared household number | Clarify who is enquiring before writing the Lead |

## Data inputs (prototype assumptions)

- Telephony: caller ID + queue
- IVR: General lead enquiry intent
- Lead: enquirer, relationship, contact, prospective client, services, funding, location, urgency, consent
- No existing Health Hub client card until Lead converts
