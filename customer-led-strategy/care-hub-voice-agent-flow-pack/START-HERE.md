# Care Hub · Salesforce Voice Agent Flow Pack

**What this is:** a send-ready pack for Care Hub Salesforce Voice + Agentforce screen-pop flows.  
It includes an interactive HTML prototype you can demo immediately, plus the documentation needed to brief stakeholders and implement the same patterns in Salesforce.

**Live demo (if available):** https://cls3643adt.github.io/customerled/

---

## What’s inside

| Folder | Contents |
| --- | --- |
| `prototype/` | Interactive Salesforce-style console (open in a browser) |
| `documentation/` | Brief, call journey, Agentforce Voice flow specs, facilitator guide, Salesforce build checklist |
| `assets/` | Optional placeholders for screenshots / logos |

---

## Open the prototype in 30 seconds

From this pack folder:

```bash
cd prototype
python3 -m http.server 8765
```

Then open: http://localhost:8765

Or double-open `prototype/index.html` in a browser (some browsers restrict local modules; the local server above is preferred).

### Facilitator path (recommended)

1. On the **Demo hub**, pick a scenario card  
2. Click **Start demo**  
3. Softphone rings → **Accept**  
4. Use **Interactive capture** (or switch to **Guided auto-play**)  
5. Capture answers → review Case / Lead → next actions  

Bottom purple bar: **Demo hub / Reset / Switch mode / Start–next step**.

---

## Five Voice agent flows included

| IVR intent | Salesforce record | Owner queue (prototype) |
| --- | --- | --- |
| Visit change | Case | Scheduling Team |
| SC worker sick | Case (manager leave approval) | SC Manager |
| General lead enquiry | Lead | Intake Team |
| Finance & billing | Case | Finance Queue |
| Complaint / feedback | Case | Quality & Experience |

Full question scripts, field maps, and Agentforce guidance are in:

`documentation/03-agentforce-voice-flow-specs.md`

---

## Who this pack is for

- **Stakeholders / facilitators** — run the interactive demo  
- **Salesforce / Agentforce builders** — use the flow specs + checklist to implement  
- **Care Hub / CLS consultants** — leave behind as the working brief  

Start reading order:

1. `START-HERE.md` (this file)  
2. `documentation/05-facilitator-guide.md`  
3. `documentation/03-agentforce-voice-flow-specs.md`  
4. `documentation/04-salesforce-implementation-checklist.md`  

---

## Disclaimer

This is a **process and UX prototype**, not a managed Salesforce package or metadata deploy.  
Use it to align on Voice / Agentforce behaviour before building in a Salesforce org.
