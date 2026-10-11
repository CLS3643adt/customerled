# Agentforce Voice flow specifications

Use these specs to configure **IVR intent → Agentforce topic / script → Case or Lead field mapping** in Salesforce.

Prototype source of truth: `prototype/flows.js`

---

## Shared Voice behaviour

| Step | Behaviour |
| --- | --- |
| 1. Ring | Softphone shows inbound pop: name, role, ANI, IVR intent |
| 2. Accept | Console opens Voice Call + related record; Agentforce starts guided questions |
| 3. Capture | Each answer writes to Case/Lead field map |
| 4. Complete | Description assembled; next-action suggestions shown |
| 5. Decline | Call ends; no record update in prototype |

**Common data inputs:** ANI, IVR intent, auth level, Care Hub client/worker match, visit / roster / finance context.

---

## Flow 1 — Visit change

| Attribute | Value |
| --- | --- |
| Flow ID | `visit-change` |
| IVR intent | Visit change |
| Record | **Case** `00015821` |
| Owner | Scheduling Team |
| Priority | Medium |
| Demo caller | Margaret Chen · Client · `+61 412 883 204` |

### Agentforce questions

1. Is this a cancellation or a reschedule?  
2. Which visit is affected?  
3. What is the reason for the change?  
4. If rescheduling, what day and time is preferred?  
5. Same worker required on the new visit?  
6. Who should be notified?  
7. Any risk or access notes for the visit?

### Field map

| Field | Purpose |
| --- | --- |
| Action | Cancel vs reschedule |
| Visit | Service / date / worker |
| Reason | Client / family / clinical / worker |
| Preferred slot | New date/time |
| Worker | Same / preferred / excluded |
| Notify | SMS / household / care partner |
| Risk / access | Falls, meds, key safe |
| Description | Narrative summary |

### Next actions (prototype)

- Update schedule / cancel visit  
- Notify client + key contact  
- Confirm preferred carer continuity  

---

## Flow 2 — SC worker sick (leave approval)

| Attribute | Value |
| --- | --- |
| Flow ID | `worker-sick` |
| IVR intent | SC worker sick |
| Record | **Case** `00015834` |
| Owner | SC Manager · Priya Nair |
| Priority | High |
| Demo caller | Amira Khan · Support Worker · `+61 411 902 441` |

### Agentforce questions

1. Confirm worker name and employee ID  
2. Which date(s) is the worker unable to work?  
3. How many leave hours are being requested?  
4. Which scheduled visits are impacted?  
5. Which clients need coverage?  
6. Is replacement coverage required today?  
7. Is a medical certificate required or already provided?  
8. Confirm manager to review and approve leave hours  

### Field map

| Field | Purpose |
| --- | --- |
| Worker | Name / employee ID |
| Leave dates | Day or range |
| Hours requested | Rostered hours to approve |
| Impacted visits | Run list |
| Clients affected | Priority / risk first |
| Coverage needed | Yes / partial / cancel with consent |
| Medical evidence | Cert required / provided |
| Approving manager | Queue owner |
| Description | Narrative summary |

### Next actions (prototype)

- Manager leave approval  
- Coverage / reassign visits  
- Client notification if cancelled  

---

## Flow 3 — General lead enquiry

| Attribute | Value |
| --- | --- |
| Flow ID | `lead-enquiry` |
| IVR intent | General enquiry |
| Record | **Lead** `L-000492` |
| Owner | Intake Team |
| Priority | Medium |
| Demo caller | Priya Sharma · Enquirer · Daughter · `+61 400 778 219` |

### Agentforce questions

1. Who is making the enquiry?  
2. What is their relationship to the prospective client?  
3. Best phone and email for follow-up?  
4. Prospective client name and date of birth?  
5. Which services are they interested in?  
6. What is the funding classification?  
7. Where does the client live?  
8. How soon do they need support to start?  
9. Consent to contact client and share information?  

### Field map

| Field | Purpose |
| --- | --- |
| Enquirer | Caller name |
| Relationship | Self / family / professional |
| Contact details | Phone / email |
| Prospective client | Name / DOB |
| Services interested | Home care / allied / respite / domestic |
| Funding classification | HCP / CHSP / NDIS / DVA / private / unknown |
| Location / catchment | Serviceability |
| Urgency | Immediate / 2 weeks / exploring |
| Consent | Privacy / contact consent |
| Description | Narrative summary |

### Next actions (prototype)

- Intake follow-up  
- Eligibility / funding check  
- Book assessment if urgent  

---

## Flow 4 — Finance & billing

| Attribute | Value |
| --- | --- |
| Flow ID | `finance-billing` |
| IVR intent | Finance & billing |
| Record | **Case** `00015847` |
| Owner | Finance Queue |
| Priority | Medium |
| Demo caller | David Chen · Key contact · Son · `+61 400 221 918` |

### Agentforce questions

1. Confirm the client the enquiry relates to  
2. What type of finance enquiry is this?  
3. Which invoice number or billing period?  
4. What amount is in question?  
5. What is the issue with the charge or payment?  
6. What resolution is the caller seeking?  
7. Best callback number and time?  

### Field map

| Field | Purpose |
| --- | --- |
| Client | Name / ID / DOB |
| Enquiry type | Invoice / statement / payment / refund / fees |
| Invoice / period | Invoice ID or month |
| Amount | Quoted vs expected |
| Issue | Duplicate / incorrect / failed payment |
| Preferred resolution | Credit / reissue / plan / explanation |
| Callback | Number / time window |
| Description | Narrative summary |

### Next actions (prototype)

- Finance investigation  
- Statement / credit note  
- Callback confirmation  

---

## Flow 5 — Complaint / feedback

| Attribute | Value |
| --- | --- |
| Flow ID | `complaint-feedback` |
| IVR intent | Complaint / feedback |
| Record | **Case** `00015852` |
| Owner | Quality & Experience |
| Priority | High |
| Demo caller | David Chen · Key contact · Son · `+61 400 221 918` |

### Agentforce questions

1. Is this a complaint, compliment, or general feedback?  
2. Who or what is the feedback about?  
3. When did this occur?  
4. What happened? (caller’s words)  
5. What was the impact on the client or family?  
6. What outcome is the caller seeking?  
7. How serious does the caller feel this is?  
8. Consent for Quality to follow up and share with relevant staff?  

### Field map

| Field | Purpose |
| --- | --- |
| Category | Complaint / compliment / feedback |
| About | Worker / service / process / communication |
| Date / time | When it occurred |
| What happened | Factual sequence |
| Impact | Safety / dignity / trust / inconvenience |
| Desired outcome | Apology / investigation / change / note |
| Severity | Low / medium / high (+ escalate) |
| Follow-up consent | Privacy / investigation consent |
| Description | Narrative summary |

### Next actions (prototype)

- Quality triage / SLA  
- Investigation assignment  
- Caller follow-up  

---

## Suggested Salesforce object mapping (implementation)

| Prototype concept | Salesforce |
| --- | --- |
| IVR intent | Voice Call / Messaging Session / custom Intent field; Omni routing attribute |
| Agentforce questions | Agentforce topic instructions + prompt template / flow |
| Case fields | Case + custom fields or Care Hub field set |
| Lead fields | Lead + custom intake fields |
| Screen pop | Open CTI / Service Cloud Voice pop + Lightning page |
| Softphone | Service Cloud Voice / Amazon Connect / Open CTI adapter |

Exact API names will depend on the target org’s Care Hub data model.
