# Salesforce implementation checklist

Use this after stakeholders accept the prototype behaviour.

## A. Platform prerequisites

- [ ] Service Cloud Voice (or Open CTI softphone) enabled  
- [ ] Omni-Channel / contact centre routing configured  
- [ ] IVR can pass **intent** + ANI into Salesforce  
- [ ] Agentforce (or Einstein bots / flows) licensed for agent assist  
- [ ] Care Hub Contact / Account / Client identifiers available for matching  

## B. Screen-pop

- [ ] Softphone incoming panel shows name, account/role, ANI, intent  
- [ ] Accept opens Voice Call + matched Contact/Account  
- [ ] Ambiguous ANI shows ranked match list (shared household numbers)  
- [ ] Unknown ANI opens search / create path without losing IVR intent  
- [ ] Softphone utility available but does not block primary work  

## C. Intent routing

For each intent, confirm Omni / IVR → queue → Agentforce topic:

| Intent | Record | Queue |
| --- | --- | --- |
| Visit change | Case | Scheduling |
| SC worker sick | Case | SC Manager |
| General lead enquiry | Lead | Intake |
| Finance & billing | Case | Finance |
| Complaint / feedback | Case | Quality & Experience |

- [ ] Intent value is written to Voice Call (and Case/Lead)  
- [ ] Wrong-intent recovery: agent can switch topic without losing ANI match  

## D. Agentforce capture

For each flow in `03-agentforce-voice-flow-specs.md`:

- [ ] Question order matches the spec  
- [ ] Answers map to Case/Lead fields  
- [ ] Description / narrative is auto-assembled  
- [ ] Required vs optional questions defined  
- [ ] Escalation rules (severity, risk, leave hours) defined  

## E. Data & privacy

- [ ] Clinical / sensitive fields hidden until identity verified  
- [ ] Consent fields captured on Lead and Complaint flows  
- [ ] Audit: who captured what, on which Voice Call  
- [ ] Retention aligned to aged-care / privacy obligations  

## F. Next actions

- [ ] Visit change → scheduling task / SMS confirmation  
- [ ] Worker sick → manager approval + coverage workflow  
- [ ] Lead → intake SLA + follow-up task  
- [ ] Finance → Finance queue SLA + callback  
- [ ] Complaint → Quality SLA + investigation case path  

## G. Pilot success metrics

- [ ] Time from ring → usable screen-pop  
- [ ] % calls with intent attached  
- [ ] % Cases/Leads with all required capture fields  
- [ ] First-contact resolution on visit-change / routine enquiries  
- [ ] Agent adoption (pop used, not dismissed)  

## H. What this pack is not

- Not a Salesforce DX / unlocked package  
- Not production metadata  
- Not a substitute for org-specific Care Hub schema design  

Treat `prototype/flows.js` as the behavioural contract until Salesforce metadata is authored.
