# Agentforce flow — New client enquiry about future services

Requirements, draft questions, topic instructions, and the build process for an Agentforce (Voice / Service) flow that captures a **new service enquiry** and creates a **Lead** for Intake.

Aligned with the Care Hub prototype in `customer-led-strategy/new-enquiry-to-lead` and demo persona **Priya Sharma → Ananya Sharma (HCP L2)**.

---

## 1. Business requirements

### 1.1 Problem

New service enquiries often arrive by phone with no CRM record. Agents re-ask identity, write free-text notes, and later recreate a Lead — so funding, consent, and urgency are incomplete when Intake picks up the work.

### 1.2 Outcome

When a caller selects (or is classified as) **General lead enquiry / new services**, Agentforce:

1. Confirms there is no existing Client/Contact match (or proceeds Lead-first for unknowns).
2. Creates a Lead at accept / intent recognition.
3. Guides capture of enquirer, prospective client, services, funding, location, urgency, and consent.
4. Writes structured fields on the Lead (not call-note-only).
5. Hands off to Intake with clear next actions (qualify, book assessment, follow up).

### 1.3 Scope

| In scope | Out of scope (phase 1) |
| --- | --- |
| Inbound phone + IVR intent *General lead enquiry* | Full eligibility determination |
| Lead create + field population | Lead conversion to Account/Contact/Opportunity |
| Consent capture on Lead | Clinical assessment booking automation |
| Catchment / funding capture (including “unknown”) | Partner referral integrations |
| Duplicate Lead warning (name + DOB + suburb) | Portal / web form intake (reuse questions later) |

### 1.4 Actors

| Actor | Role |
| --- | --- |
| Enquirer | Caller (self, family, friend, or professional) |
| Prospective client | Person who may receive future services |
| Frontline agent | Optional human-in-the-loop; can override Agentforce |
| Agentforce | Guides questions, maps answers, updates Lead |
| Intake team | Owns qualification, assessment booking, follow-up |

### 1.5 Success criteria

- Lead created at accept with IVR intent attached
- Required intake fields complete before call end
- Reduction in “callback to re-collect details” from Intake
- Time from enquiry to booked assessment measurable from Lead timestamps

---

## 2. Process steps (end-to-end)

```text
1. Signal          Inbound call (ANI) → Care Hub voice queue
2. IVR classify    Intent = General lead enquiry (new / future services)
3. Match check     ANI / identity not linked to existing Client Card
4. Create Lead     Auto-create Lead (e.g. L-000492), owner = Intake Team
5. Screen pop      Softphone + Voice Call + Lead open for agent
6. Guided capture  Agentforce walks draft questions (section 3)
7. Validate        Required fields + consent + duplicate check
8. Summarise       Subject, description, Agentforce summary on Lead
9. Next actions    Qualify · Book assessment · Email / SMS enquirer
10. Close          Call ends; Lead remains system of record until conversion
```

### 2.1 Happy path (summary)

Unknown caller → IVR *General lead enquiry* → Lead created → Agentforce captures enquirer + prospective client + services/funding → consent recorded → Intake follow-up within urgency window.

### 2.2 Unhappy paths

| Scenario | Agentforce behaviour |
| --- | --- |
| Duplicate Lead | Warn if matching name + DOB + suburb already open; offer link vs new Lead |
| Funding unknown | Allow “unknown”; queue eligibility callback task for Intake |
| Out of catchment | Capture interest; route to partner / waitlist path; keep Lead |
| No consent to contact client | Enquirer-only follow-up; do not contact prospective client |
| Shared household number | Clarify who is enquiring before writing Lead fields |
| Caller is the prospective client | Relationship = Self; skip “who is the client” identity re-ask where redundant |
| Distressed / crisis language | Escalate to human agent; do not force full intake script |

---

## 3. Draft questions (guided capture)

Ask in this order. Map each answer 1:1 to Lead fields (section 5).

| # | Question ID | Agent / Agentforce prompt | Hint / accepted values | Required |
| --- | --- | --- | --- | --- |
| 1 | `enquirer` | Thanks for calling Care Hub — can I take your name? | Full name of caller | Yes |
| 2 | `relationship` | What’s your relationship to the person who may need care? | Self / daughter / son / friend / professional / other | Yes |
| 3 | `contact` | What’s the best phone and email for follow-up? | Confirm preferred contact method | Yes (phone or email) |
| 4 | `client` | Prospective client’s name and date of birth? | Identity for eligibility screening | Yes (if not Self) |
| 5 | `services` | Which services are you interested in for the future? | Home care / personal care / domestic / allied health / respite / other | Yes |
| 6 | `funding` | Do you know the funding classification — HCP, CHSP, NDIS, DVA, private, or unknown? | HCP level if known | Yes (incl. unknown) |
| 7 | `location` | Which suburb does the client live in? | Catchment / serviceability | Yes |
| 8 | `urgency` | How soon would you like support to start? | Immediate / within 2 weeks / exploring | Yes |
| 9 | `consent` | Do we have consent to contact you and [client] about this enquiry? | Privacy consent on Lead | Yes |

### 3.1 Optional clarifying prompts

Use only when the answer is incomplete:

- **Services:** “Is that personal care, domestic help, allied health, respite — or a mix?”
- **Funding:** “If you’re not sure, we can note ‘unknown’ and Intake will call you back about eligibility.”
- **Urgency:** “Is this something you need in the next few days, within about two weeks, or are you exploring options?”
- **Consent:** “Can we contact you only, or both you and [client name]?”

### 3.2 Demo script answers (Priya / Ananya)

| Field | Captured value |
| --- | --- |
| Enquirer | Priya Sharma |
| Relationship | Daughter · primary enquirer |
| Contact | +61 400 778 219 · priya.sharma@email.example |
| Prospective client | Ananya Sharma · DOB 02 Feb 1944 |
| Services | Personal care · Domestic assistance |
| Funding | Home Care Package · Level 2 |
| Location | Glenelg North · SA · Care Hub Adelaide catchment |
| Urgency | Within 2 weeks |
| Consent | Consent given · enquirer + client |
| Subject | HCP L2 enquiry — Ananya Sharma (via Priya Sharma) |
| Summary | New Lead for Ananya Sharma (HCP L2) via daughter Priya. Services: personal care + domestic in Glenelg North. Follow up within 2 weeks. |

---

## 4. Agentforce topic & instructions

Use these as the starting **Topic**, **Classification**, and **Instructions** in Agent Builder (Agentforce Service / Voice).

### 4.1 Topic metadata

| Property | Value |
| --- | --- |
| Topic name | New service enquiry (Lead) |
| API / developer name | `New_Service_Enquiry_Lead` |
| Classification description | Caller is asking about future or new care services for themselves or someone else, and there is no existing client engagement. Includes Home Care Package, CHSP, NDIS interest, private care, respite, domestic assistance, personal care. |
| Scope | Lead creation and structured intake capture only; do not convert Lead or book clinical visits in this topic. |

### 4.2 Classification / utterance examples

Train or list examples such as:

- “I’d like to enquire about home care for my mum.”
- “What services do you offer for older people?”
- “We’re looking at a Home Care Package and need a provider.”
- “I want to register interest for future services.”
- “Can someone call me about getting domestic help started?”
- “My father might need support in a few weeks — how do we start?”

**Do not classify here** (hand off to other topics):

- Existing client visit change / cancellation → Visit change
- Invoice / payment → Finance & billing
- Complaint about current service → Complaint / feedback
- Worker leave / coverage → SC worker sick

### 4.3 Job to be done (topic job)

Collect enough structured information to create and complete a Lead so Intake can qualify the enquiry and follow up without calling back for basics.

### 4.4 Agent instructions (paste into Agentforce)

```text
You are Care Hub’s intake assistant for NEW or FUTURE service enquiries.
Your only job in this topic is to create or update a Lead and complete structured intake fields.

Tone
- Warm, clear, unhurried. Suitable for older callers and family carers.
- One question at a time. Acknowledge answers briefly, then continue.
- Prefer plain language over clinical or CRM jargon.

Identity & records
- Assume Lead-first for unknown callers. Do not invent an existing Client Card.
- If the caller is enquiring for someone else, capture the enquirer first, then the prospective client.
- If relationship is Self, use the caller as the prospective client and avoid redundant re-asks.
- Before finalising, check for an open Lead with the same prospective client name + DOB + suburb. If found, warn the agent/user and ask whether to continue on that Lead.

Required capture (in order)
1. Enquirer full name
2. Relationship to prospective client
3. Best phone and email for follow-up (at least one)
4. Prospective client name and date of birth (unless Self and already captured)
5. Services of interest (future services — personal care, domestic, allied health, respite, other)
6. Funding classification (HCP including level if known, CHSP, NDIS, DVA, private, or unknown)
7. Suburb / location for catchment
8. Urgency (immediate, within 2 weeks, exploring)
9. Consent to contact enquirer and/or prospective client

Rules
- Map each answer to the Lead field; do not leave critical facts only in free-text notes.
- If funding is unknown, accept “unknown” and create an Intake eligibility callback task.
- If out of catchment, still save the Lead and flag partner/waitlist routing for Intake.
- If consent is refused for the prospective client, record enquirer-only follow-up and do not contact the client.
- If the caller shows distress, crisis, or abuse risk, stop the script and escalate to a human agent immediately.
- Do not provide clinical advice, guarantee package approval, or promise start dates.
- At the end, write Lead Subject, Description, and a short Summary for Intake next actions: qualify, book assessment, follow up with enquirer.

Closing
- Confirm what was captured in one or two sentences.
- Tell the caller that Intake will follow up based on urgency.
- Thank them for contacting Care Hub.
```

### 4.5 Actions the topic should invoke

| Action | When | Result |
| --- | --- | --- |
| Create Lead | IVR intent recognised / topic starts for unmatched ANI | Lead record + Voice Call link |
| Update Lead fields | After each confirmed answer (or at end of capture) | Structured field writes |
| Duplicate Lead check | After prospective client identity captured | Warning or continue |
| Create Task | Funding unknown / out of catchment / urgency = immediate | Intake follow-up task |
| Summarise Lead | All required questions complete | Subject + Description + Summary |
| Transfer / escalate | Crisis language or agent override | Human agent takes over |

---

## 5. Data model (Lead field mapping)

| Question ID | Suggested Lead field | Type / notes |
| --- | --- | --- |
| `enquirer` | `Enquirer_Name__c` (or First/Last on Lead if self) | Text |
| `relationship` | `Enquirer_Relationship__c` | Picklist |
| `contact` | `Phone`, `Email`, `Preferred_Contact_Method__c` | Standard + custom |
| `client` | `Prospective_Client_Name__c`, `Date_of_Birth__c` | Text + Date |
| `services` | `Services_Interested__c` | Multi-select picklist |
| `funding` | `Funding_Classification__c`, `HCP_Level__c` | Picklist |
| `location` | `Suburb__c`, `Catchment__c` | Text / formula |
| `urgency` | `Urgency__c` | Picklist |
| `consent` | `Privacy_Consent__c`, `Consent_Scope__c` | Checkbox + picklist |
| (system) | `LeadSource` = Phone / Voice | Standard |
| (system) | `IVR_Intent__c` = General lead enquiry | Custom |
| (system) | `Owner` = Intake Team queue | Queue |
| (generated) | `Company` / `LastName` | Required Lead defaults as needed |
| (generated) | `Description`, Subject / Summary fields | Long text |

Prototype field labels (UI): Enquirer, Relationship, Contact details, Prospective client, Services interested, Funding classification, Location / catchment, Urgency, Consent, Description.

---

## 6. Process to develop this flow in Agentforce

Use this build sequence in a Salesforce sandbox with Agentforce + Voice (or Service agent) enabled.

### Phase A — Foundations

1. **Confirm org prerequisites**
   - Agentforce enabled; Einstein / Data Cloud as required by your edition
   - Service Cloud Voice or telephony connector available for screen-pop demos
   - Lead object accessible to the agent user / integration user
2. **Extend the Lead data model**
   - Create custom fields from section 5 (or map to existing Care Hub fields)
   - Add validation for required intake fields used at “complete”
   - Create Intake Team queue and assignment rules for *General lead enquiry*
3. **Define picklists**
   - Relationship, Services interested, Funding classification, Urgency, Consent scope
4. **Duplicate rule (optional but recommended)**
   - Matching rule on prospective client name + DOB + suburb for open Leads

### Phase B — Agentforce topic

5. **Open Agent Builder** → select the Care Hub service / voice agent (or create one).
6. **Create topic** `New service enquiry (Lead)` using metadata in section 4.1.
7. **Add classification description + example utterances** from section 4.2.
8. **Paste agent instructions** from section 4.4; adjust brand name and escalation path only.
9. **Attach actions**
   - Create Lead / Update Lead (Flow or Invocable Action)
   - Duplicate check Flow
   - Create Task for Intake
   - Optional: Send email/SMS confirmation template
10. **Guardrails**
    - Topic scope: Lead intake only
    - Escalation topic / transfer action for crisis language
    - PII: do not invent DOB, funding, or consent

### Phase C — Automation behind the actions

11. **Flow: Create Lead from Voice Intent**
    - Trigger: Voice Call created / IVR intent = General lead enquiry / unmatched ANI
    - Create Lead, set Owner = Intake queue, link Voice Call
12. **Flow: Update Lead from Agentforce answers**
    - Input variables matching question IDs
    - Update Lead fields; write Description/Summary when complete
13. **Flow: Post-capture tasks**
    - If urgency = Immediate → high-priority Task due today
    - If funding = Unknown → eligibility callback Task
    - If out of catchment → partner/waitlist Task

### Phase D — Voice / channel wiring

14. **IVR / Omni-Channel**
    - Add menu or NLU intent: *General lead enquiry* / *New services*
    - Route to Care Hub queue that launches the Agentforce topic
15. **Screen pop**
    - On Accept: open Voice Call + Lead (OOTB Open CTI / Voice pattern)
16. **Test with demo persona**
    - Run Priya / Ananya script (section 3.2)
    - Verify Lead fields, summary, and Intake tasks

### Phase E — Validate & release

17. **Test matrix**

| Test | Expected |
| --- | --- |
| Happy path (family enquirer) | All fields + consent; Lead complete |
| Self-enquiry | Relationship Self; no redundant client re-ask |
| Funding unknown | Lead saved; eligibility Task created |
| No client consent | Enquirer-only follow-up recorded |
| Duplicate Lead | Warning surfaced; agent chooses path |
| Wrong intent (billing) | Does not stay in this topic |
| Crisis language | Escalates to human |

18. **UAT with Intake** — confirm handoff quality without re-collection callbacks.
19. **Pilot** — one queue / one catchment; measure success criteria in section 1.5.
20. **Iterate** — add catchment rules, eligibility checks, and conversion guidance in later phases.

---

## 7. Build checklist (Agent Builder)

- [ ] Topic created: New service enquiry (Lead)
- [ ] Classification utterances added
- [ ] Instructions pasted and brand-reviewed
- [ ] Create Lead action connected
- [ ] Update Lead action connected
- [ ] Duplicate check action connected
- [ ] Intake Task action connected
- [ ] IVR intent mapped to topic
- [ ] Screen-pop opens Lead + Voice Call
- [ ] Required field validation verified
- [ ] Happy path UAT passed (Priya / Ananya)
- [ ] Unhappy paths UAT passed
- [ ] Intake queue ownership confirmed
- [ ] Privacy / consent wording approved by compliance

---

## 8. Next actions after a completed Lead

Present these to Intake (and optionally as Agentforce closing suggestions):

1. **Qualify** — confirm catchment, funding, and service fit.
2. **Book assessment** — if urgency and consent allow.
3. **Follow up with enquirer** — email/SMS using captured contact details.
4. **Eligibility callback** — only if funding = unknown.
5. **Convert Lead** — when ready to create Client / Contact (later phase).

---

## 9. Related prototype assets

| Asset | Purpose |
| --- | --- |
| `docs/brief.md` | Problem / outcome brief |
| `docs/call-journey.md` | Call journey & unhappy paths |
| `flows.js` | Prototype questions, transcript, Lead mapping |
| `index.html` / `app.js` | Interactive Voice + Agentforce demo |

Run the standalone demo:

```bash
python3 -m http.server 8766 --directory customer-led-strategy/new-enquiry-to-lead
```

Open `http://localhost:8766`, choose **Guided auto-play** or **Interactive capture**, then **Start demo**.
