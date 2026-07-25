(() => {
  const FLOWS = window.LEAD_ENQUIRY_FLOWS;
  const FLOW_ORDER = ["lead-enquiry"];

  const PROCESS = ["select", "pop", "capture", "record", "next"];

  const app = document.querySelector(".sf-app");
  const softphone = document.querySelector(".sf-softphone");
  const clientNav = document.getElementById("client-nav");
  const scheduleNav = document.getElementById("schedule-nav");
  const views = {
    available: document.querySelector('[data-view="available"]'),
    incoming: document.querySelector('[data-view="incoming"]'),
    connected: document.querySelector('[data-view="connected"]'),
  };
  const pages = {
    home: document.querySelector('[data-page="home"]'),
    voice: document.querySelector('[data-page="voice"]'),
    case: document.querySelector('[data-page="case"]'),
    contact: document.querySelector('[data-page="contact"]'),
  };
  const tabs = {
    home: document.querySelector('.sf-nav__item[data-tab="home"]'),
    voice: document.querySelector('.sf-nav__item[data-tab="voice"]'),
    case: document.querySelector('.sf-nav__item[data-tab="case"]'),
    contact: document.querySelector('.sf-nav__item[data-tab="contact"]'),
  };

  const els = {
    simulateBtn: document.getElementById("simulate-call"),
    acceptBtn: document.getElementById("accept-call"),
    declineBtn: document.getElementById("decline-call"),
    endBtn: document.getElementById("end-call"),
    utilityPhone: document.getElementById("utility-phone"),
    utilityBadge: document.getElementById("utility-badge"),
    minimizeBtn: document.getElementById("softphone-minimize"),
    openScheduling: document.getElementById("open-scheduling"),
    replayTranscript: document.getElementById("replay-transcript"),
    captureNext: document.getElementById("capture-next"),
    markCaseWorking: document.getElementById("mark-case-working"),
    incomingTicker: document.getElementById("incoming-ticker"),
    connectedTicker: document.getElementById("connected-ticker"),
    voiceStatus: document.getElementById("voice-status"),
    presenceDot: document.querySelector(".presence-dot"),
    presenceSelect: document.getElementById("presence-select"),
    transcriptList: document.getElementById("transcript-list"),
    transcriptEmpty: document.getElementById("transcript-empty"),
    questionList: document.getElementById("question-list"),
    guideIntro: document.getElementById("guide-intro"),
    answerPanel: document.getElementById("answer-panel"),
    answerPanelTitle: document.getElementById("answer-panel-title"),
    answerChoices: document.getElementById("answer-choices"),
    caseFields: document.getElementById("case-fields"),
    casePageFields: document.getElementById("case-page-fields"),
    caseCreatedPill: document.getElementById("case-created-pill"),
    caseStatusPill: document.getElementById("case-status-pill"),
    casePageStatus: document.getElementById("case-page-status"),
    caseSummary: document.getElementById("case-summary"),
    caseBanner: document.getElementById("case-banner"),
    caseNextSteps: document.getElementById("case-next-steps"),
    callNote: document.getElementById("call-note"),
    intentOptions: document.getElementById("intent-options"),
    softphoneIntentOptions: document.getElementById("softphone-intent-options"),
    scenarioGrid: document.getElementById("scenario-grid"),
    voiceIntentLabel: document.getElementById("voice-intent-label"),
    recordTabLabel: document.getElementById("record-tab-label"),
    recordCardTitle: document.getElementById("record-card-title"),
    casePageTitle: document.getElementById("case-page-title"),
    casePageTypeLabel: document.getElementById("case-page-type-label"),
    casePageRecordLabel: document.getElementById("case-page-record-label"),
    casePageOwner: document.getElementById("case-page-owner"),
    voiceCallerTitle: document.querySelector('[data-page="voice"] .sf-highlights__body h2'),
    facModeLabel: document.getElementById("facilitator-mode-label"),
    facStepLabel: document.getElementById("facilitator-step-label"),
    facHome: document.getElementById("fac-home"),
    facReset: document.getElementById("fac-reset"),
    facToggleMode: document.getElementById("fac-toggle-mode"),
    facNext: document.getElementById("fac-next"),
    demoModeHelp: document.getElementById("demo-mode-help"),
  };

  let activeFlowId = "lead-enquiry";
  let demoMode = "interactive"; // interactive | guided
  let processStep = "select";
  let tickerStart = null;
  let tickerTimer = null;
  let activeTab = "home";
  let transcriptTimers = [];
  let capturedQuestionIds = new Set();
  let activeQuestionId = null;

  const currentFlow = () => FLOWS[activeFlowId];

  const initials = (name) =>
    name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const formatElapsed = (ms) => {
    const total = Math.floor(ms / 1000);
    const mm = String(Math.floor(total / 60)).padStart(2, "0");
    const ss = String(total % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const stopTicker = () => {
    if (tickerTimer) clearInterval(tickerTimer);
    tickerTimer = null;
    tickerStart = null;
  };

  const startTicker = (el) => {
    stopTicker();
    tickerStart = Date.now();
    if (el) el.textContent = "00:00";
    tickerTimer = setInterval(() => {
      if (!el || !tickerStart) return;
      el.textContent = formatElapsed(Date.now() - tickerStart);
    }, 250);
  };

  const enrichQuestions = (flow) =>
    flow.questions.map((q) => {
      const answerEntry = flow.transcript.find((t) => t.question === q.id && t.field && t.value);
      const agentLine = flow.transcript.find((t) => t.question === q.id && t.speaker === "agent");
      const clientLine = flow.transcript.find((t) => t.question === q.id && t.speaker === "client");
      const completeEntry = flow.transcript.find((t) => t.complete);
      const altChoices = q.choices || [];
      const primary = answerEntry?.value;
      const choices = [...new Set([primary, ...altChoices].filter(Boolean))];
      return {
        ...q,
        answer: primary,
        agentLine: agentLine?.text,
        clientLine: clientLine?.text,
        choices: choices.length ? choices : ["Captured from call"],
        completePayload: answerEntry?.complete ? answerEntry : null,
        isLast: flow.questions[flow.questions.length - 1].id === q.id,
        summary: completeEntry,
      };
    });

  const setProcessStep = (step) => {
    processStep = step;
    const idx = PROCESS.indexOf(step);
    document.querySelectorAll("[data-live-step]").forEach((node) => {
      const key = node.getAttribute("data-live-step");
      const nodeIdx = PROCESS.indexOf(key);
      node.classList.toggle("is-active", key === step);
      node.classList.toggle("is-done", nodeIdx < idx);
    });
    document.querySelectorAll("#home-process-steps [data-step]").forEach((node) => {
      const key = node.getAttribute("data-step");
      const nodeIdx = PROCESS.indexOf(key);
      node.classList.toggle("is-active", key === step);
      node.classList.toggle("is-done", nodeIdx < idx);
    });
    updateFacilitatorLabels();
  };

  const updateFacilitatorLabels = () => {
    if (els.facModeLabel) {
      els.facModeLabel.textContent =
        demoMode === "interactive" ? "Mode · Interactive" : "Mode · Guided auto-play";
    }
    if (els.facToggleMode) {
      els.facToggleMode.textContent =
        demoMode === "interactive" ? "Switch to guided" : "Switch to interactive";
    }
    const flow = currentFlow();
    const labels = {
      select: `Select a scenario · ${flow.shortLabel}`,
      pop: "Accept the screen-pop call",
      capture: `Capture answers · ${capturedQuestionIds.size}/${flow.questions.length}`,
      record: `${flow.recordType} ${flow.recordNumber} ready to review`,
      next: "Review next actions / route the work",
    };
    if (els.facStepLabel) els.facStepLabel.textContent = labels[processStep] || "";
    if (els.facNext) {
      const nextLabels = {
        select: "Launch selected scenario",
        pop: "Accept call",
        capture: "Capture next answer",
        record: "Open record",
        next: "Back to demo hub",
      };
      els.facNext.textContent = nextLabels[processStep] || "Next";
    }
    if (els.demoModeHelp) {
      els.demoModeHelp.textContent =
        demoMode === "interactive"
          ? "Interactive: step through each question and select answers to fill the Case/Lead."
          : "Guided: Agentforce auto-plays the transcript and fills fields for you.";
    }
    document.querySelectorAll("[data-demo-mode]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-demo-mode") === demoMode);
    });
  };

  const setContextPanels = (open) => {
    // New enquiry → Lead has no existing client/schedule context yet
    if (clientNav) clientNav.hidden = true;
    if (scheduleNav) scheduleNav.hidden = true;
    app.dataset.context = open ? "open" : "closed";
  };

  const setSoftphoneView = (view) => {
    softphone.dataset.panel = view;
    Object.entries(views).forEach(([key, node]) => {
      if (!node) return;
      node.hidden = key !== view;
    });
    if (els.utilityBadge) els.utilityBadge.hidden = view !== "incoming";
  };

  const showTab = (name) => {
    activeTab = name;
    Object.entries(tabs).forEach(([key, tab]) => {
      if (!tab) return;
      tab.setAttribute("aria-pressed", String(key === name));
    });
    Object.entries(pages).forEach(([key, page]) => {
      if (!page) return;
      page.hidden = key !== name;
    });
  };

  const openWorkspaceTabs = () => {
    if (tabs.voice) tabs.voice.hidden = false;
    if (tabs.case) tabs.case.hidden = false;
    if (tabs.contact) tabs.contact.hidden = true;
    showTab("voice");
  };

  const closeWorkspaceTabs = () => {
    ["voice", "case", "contact"].forEach((name) => {
      if (tabs[name]) tabs[name].hidden = true;
    });
    showTab("home");
  };

  const setPresenceVisual = () => {
    if (!els.presenceDot || !els.presenceSelect) return;
    const value = els.presenceSelect.value;
    if (value === "Busy") els.presenceDot.style.background = "var(--sf-accent)";
    else if (value === "Unavailable") els.presenceDot.style.background = "var(--sf-destructive)";
    else els.presenceDot.style.background = "var(--sf-success)";
  };

  const setCaseField = (field, value) => {
    document.querySelectorAll(`[data-field="${field}"]`).forEach((node) => {
      node.textContent = value;
      node.classList.remove("is-pending");
    });
  };

  const appendTranscript = (entry) => {
    if (!els.transcriptList) return;
    if (els.transcriptEmpty) els.transcriptEmpty.hidden = true;
    const li = document.createElement("li");
    li.innerHTML = `<span class="speaker ${entry.speaker}">${entry.label}</span><span>${entry.text}</span>`;
    els.transcriptList.appendChild(li);
    els.transcriptList.scrollTop = els.transcriptList.scrollHeight;
  };

  const clearTranscriptUi = () => {
    transcriptTimers.forEach((id) => clearTimeout(id));
    transcriptTimers = [];
    if (els.transcriptList) els.transcriptList.innerHTML = "";
    if (els.transcriptEmpty) els.transcriptEmpty.hidden = false;
    if (els.caseSummary) {
      els.caseSummary.classList.add("is-pending");
      els.caseSummary.textContent = "Summary will appear as answers are captured.";
    }
    if (els.caseStatusPill) els.caseStatusPill.textContent = "New";
    if (els.casePageStatus) els.casePageStatus.textContent = "New";
    if (els.markCaseWorking) {
      els.markCaseWorking.disabled = false;
      els.markCaseWorking.textContent = "Start working";
    }
    if (els.answerPanel) els.answerPanel.hidden = true;
    capturedQuestionIds = new Set();
    activeQuestionId = null;
  };

  const renderIntentPickers = () => {
    const makeButtons = (container) => {
      if (!container) return;
      container.innerHTML = "";
      FLOW_ORDER.forEach((id) => {
        const flow = FLOWS[id];
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `intent-chip${id === activeFlowId ? " is-active" : ""}`;
        btn.dataset.flow = id;
        btn.title = flow.description;
        btn.innerHTML = `<strong>${flow.shortLabel}</strong><span>${flow.label}</span>`;
        btn.addEventListener("click", () => setActiveFlow(id, { restartIfConnected: true }));
        container.appendChild(btn);
      });
    };
    makeButtons(els.intentOptions);
    makeButtons(els.softphoneIntentOptions);
  };

  const renderScenarioGrid = () => {
    if (!els.scenarioGrid) return;
    els.scenarioGrid.innerHTML = "";
    FLOW_ORDER.forEach((id) => {
      const flow = FLOWS[id];
      const card = document.createElement("article");
      card.className = `scenario-card${id === activeFlowId ? " is-selected" : ""}`;
      card.innerHTML = `
        <p class="scenario-card__eyebrow">${flow.recordType} · ${flow.recordNumber}</p>
        <h3>${flow.label}</h3>
        <p>${flow.description}</p>
        <ul>
          <li>${flow.questions.length} guided questions</li>
          <li>Caller: ${flow.callerName}</li>
          <li>Owner: ${flow.owner}</li>
        </ul>
        <div class="scenario-card__actions">
          <button type="button" class="slds-button slds-button_neutral" data-select-flow="${id}">Select</button>
          <button type="button" class="slds-button slds-button_brand" data-launch-flow="${id}">Start demo</button>
        </div>`;
      els.scenarioGrid.appendChild(card);
    });

    els.scenarioGrid.querySelectorAll("[data-select-flow]").forEach((btn) => {
      btn.addEventListener("click", () => setActiveFlow(btn.getAttribute("data-select-flow")));
    });
    els.scenarioGrid.querySelectorAll("[data-launch-flow]").forEach((btn) => {
      btn.addEventListener("click", () => launchScenario(btn.getAttribute("data-launch-flow")));
    });
  };

  const renderRecordFields = (flow) => {
    if (els.caseFields) {
      els.caseFields.innerHTML = "";
      const meta = [
        [flow.recordType === "Lead" ? "Lead ID" : "Case Number", flow.recordNumber],
        ["Type", flow.recordLabel],
        ["Priority", flow.priority],
        ["Owner", flow.owner],
        ["Origin", "Phone · IVR"],
      ];
      meta.forEach(([label, value]) => {
        const row = document.createElement("div");
        row.innerHTML = `<dt>${label}</dt><dd>${value}</dd>`;
        els.caseFields.appendChild(row);
      });
      const subject = document.createElement("div");
      subject.innerHTML = `<dt>Subject</dt><dd data-field="subject">${flow.subjectPending}</dd>`;
      els.caseFields.appendChild(subject);
      flow.fields.forEach((field) => {
        const row = document.createElement("div");
        const placeholder =
          field.key === "description" ? "Built from transcript…" : "Awaiting answer…";
        row.innerHTML = `<dt>${field.label}</dt><dd data-field="${field.key}" class="is-pending">${placeholder}</dd>`;
        els.caseFields.appendChild(row);
      });
    }

    if (els.casePageFields) {
      els.casePageFields.innerHTML = "";
      const subject = document.createElement("div");
      subject.innerHTML = `<dt>Subject</dt><dd data-field="subject">${flow.subjectPending}</dd>`;
      els.casePageFields.appendChild(subject);
      flow.fields.forEach((field) => {
        if (field.key === "description") return;
        const row = document.createElement("div");
        row.innerHTML = `<dt>${field.label}</dt><dd data-field="${field.key}" class="is-pending">Awaiting answer…</dd>`;
        els.casePageFields.appendChild(row);
      });
    }

    if (els.caseNextSteps) {
      const steps = [
        "Qualify funding and serviceability",
        "Book intake assessment if eligible",
        "Send welcome / next-step email to enquirer",
      ];
      els.caseNextSteps.innerHTML = steps.map((step) => `<li>${step}</li>`).join("");
    }
  };

  const applyCallerChrome = (flow) => {
    const avatar = initials(flow.callerName);
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    setText("incoming-avatar", avatar);
    setText("incoming-name", flow.callerName);
    setText("incoming-role", flow.callerRole);
    setText("incoming-intent", flow.label);
    setText("incoming-phone", flow.phone);
    setText("connected-avatar", avatar);
    setText("connected-name", flow.callerName);
    setText("connected-role", flow.callerRole);
    setText("connected-intent", `Inbound · ${flow.label}`);
    if (els.voiceIntentLabel) els.voiceIntentLabel.textContent = flow.label;
    const voiceFromPhone = document.getElementById("voice-from-phone");
    if (voiceFromPhone) voiceFromPhone.textContent = flow.phone;
    if (els.voiceCallerTitle) els.voiceCallerTitle.textContent = `VC-000482 · ${flow.callerName}`;
    if (els.recordTabLabel) els.recordTabLabel.textContent = `${flow.recordType} ${flow.recordNumber}`;
    if (els.recordCardTitle) {
      els.recordCardTitle.textContent =
        flow.recordType === "Lead" ? "Auto-created Lead" : "Auto-created Case";
    }
    if (els.caseBanner) els.caseBanner.innerHTML = flow.banner;
    if (els.caseCreatedPill) els.caseCreatedPill.textContent = flow.pill;
    if (els.casePageTypeLabel) els.casePageTypeLabel.textContent = flow.recordType;
    if (els.casePageRecordLabel) els.casePageRecordLabel.textContent = flow.recordLabel;
    if (els.casePageOwner) els.casePageOwner.textContent = flow.owner;
    if (els.casePageTitle) els.casePageTitle.textContent = `${flow.recordNumber} · ${flow.recordLabel}`;
  };

  const highlightQuestion = (questionId) => {
    activeQuestionId = questionId;
    [...document.querySelectorAll("#question-list [data-question]")].forEach((item) => {
      const id = item.getAttribute("data-question");
      item.classList.toggle("is-current", id === questionId && !capturedQuestionIds.has(id));
      item.classList.toggle("is-done", capturedQuestionIds.has(id));
    });
  };

  const showAnswerPanel = (question) => {
    if (!els.answerPanel || !els.answerChoices) return;
    els.answerPanel.hidden = false;
    if (els.answerPanelTitle) {
      els.answerPanelTitle.textContent = question.title;
    }
    els.answerChoices.innerHTML = "";
    question.choices.forEach((choice, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "answer-choice";
      btn.textContent = choice;
      btn.addEventListener("click", () => captureAnswer(question.id, choice, index === 0));
      els.answerChoices.appendChild(btn);
    });
  };

  const renderQuestions = (flow) => {
    if (!els.questionList) return;
    const enriched = enrichQuestions(flow);
    els.questionList.innerHTML = "";
    if (els.guideIntro) {
      els.guideIntro.innerHTML =
        demoMode === "interactive"
          ? `${flow.guideIntro}<br><em>Click a question or use <strong>Capture next answer</strong>.</em>`
          : flow.guideIntro;
    }
    enriched.forEach((q, index) => {
      const li = document.createElement("li");
      li.dataset.question = q.id;
      li.innerHTML = `<span class="q-status" aria-hidden="true"></span><div><strong>${q.title}</strong><p>${q.hint}</p></div>`;
      if (capturedQuestionIds.has(q.id)) li.classList.add("is-done");
      else if (index === enriched.findIndex((item) => !capturedQuestionIds.has(item.id))) {
        li.classList.add("is-current");
        activeQuestionId = q.id;
      }
      li.addEventListener("click", () => {
        if (demoMode !== "interactive" || app.dataset.state !== "connected") return;
        if (capturedQuestionIds.has(q.id)) return;
        highlightQuestion(q.id);
        showAnswerPanel(q);
        setProcessStep("capture");
      });
      els.questionList.appendChild(li);
    });
    if (demoMode === "interactive" && app.dataset.state === "connected") {
      const next = enriched.find((q) => !capturedQuestionIds.has(q.id));
      if (next) showAnswerPanel(next);
      else if (els.answerPanel) els.answerPanel.hidden = true;
    }
  };

  const completeFlowIfReady = () => {
    const flow = currentFlow();
    if (capturedQuestionIds.size < flow.questions.length) return;
    const completeEntry = flow.transcript.find((t) => t.complete);
    if (completeEntry?.subject) setCaseField("subject", completeEntry.subject);
    if (completeEntry?.description) setCaseField("description", completeEntry.description);
    if (els.caseSummary && completeEntry?.summary) {
      els.caseSummary.classList.remove("is-pending");
      els.caseSummary.textContent = completeEntry.summary;
    }
    if (els.caseStatusPill) els.caseStatusPill.textContent = "In Progress";
    if (els.casePageStatus) els.casePageStatus.textContent = "In Progress";
    if (els.callNote) {
      els.callNote.value = `${flow.label} captured via interactive prototype. ${flow.recordType} ${flow.recordNumber} ready.`;
    }
    appendTranscript({
      speaker: "system",
      label: "Agentforce",
      text: `All questions captured. ${flow.recordType} ${flow.recordNumber} is ready for next actions.`,
    });
    if (els.answerPanel) els.answerPanel.hidden = true;
    setProcessStep("record");
  };

  const captureAnswer = (questionId, value) => {
    const flow = currentFlow();
    const question = enrichQuestions(flow).find((q) => q.id === questionId);
    if (!question || capturedQuestionIds.has(questionId)) return;

    if (question.agentLine) {
      appendTranscript({ speaker: "agent", label: "Agent", text: question.agentLine });
    }
    appendTranscript({
      speaker: "client",
      label: flow.callerName.split(" ")[0],
      text: question.clientLine || value,
    });
    setCaseField(questionId, value);
    // Map field key if different from question id - fields use same ids in our flows
    const field = flow.fields.find((f) => f.key === questionId);
    if (field) setCaseField(field.key, value);

    capturedQuestionIds.add(questionId);
    highlightQuestion(questionId);
    renderQuestions(flow);
    setProcessStep("capture");
    updateFacilitatorLabels();
    completeFlowIfReady();
  };

  const captureNextAnswer = () => {
    const flow = currentFlow();
    const next = enrichQuestions(flow).find((q) => !capturedQuestionIds.has(q.id));
    if (!next) {
      setProcessStep("record");
      showTab("case");
      return;
    }
    highlightQuestion(next.id);
    showAnswerPanel(next);
    // Auto-select primary demo answer for facilitator "next" speed-run
    captureAnswer(next.id, next.answer || next.choices[0]);
  };

  const startInteractiveSession = () => {
    clearTranscriptUi();
    const flow = currentFlow();
    renderQuestions(flow);
    renderRecordFields(flow);
    applyCallerChrome(flow);
    if (els.caseCreatedPill) els.caseCreatedPill.hidden = false;
    appendTranscript({
      speaker: "system",
      label: "Agentforce",
      text: `${flow.recordType} ${flow.recordNumber} created from IVR intent “${flow.label}”. Capture the guided questions to complete the record.`,
    });
    setProcessStep("capture");
    const first = enrichQuestions(flow)[0];
    if (first) {
      highlightQuestion(first.id);
      showAnswerPanel(first);
    }
  };

  const startGuidedDemo = () => {
    clearTranscriptUi();
    const flow = currentFlow();
    renderQuestions(flow);
    renderRecordFields(flow);
    applyCallerChrome(flow);
    if (els.caseCreatedPill) els.caseCreatedPill.hidden = false;
    if (els.answerPanel) els.answerPanel.hidden = true;
    setProcessStep("capture");
    flow.transcript.forEach((entry) => {
      const timer = window.setTimeout(() => {
        appendTranscript(entry);
        if (entry.question && !entry.field) highlightQuestion(entry.question);
        if (entry.field && entry.value) {
          setCaseField(entry.field, entry.value);
          capturedQuestionIds.add(entry.question || entry.field);
          highlightQuestion(entry.question || entry.field);
          renderQuestions(flow);
        }
        if (entry.complete) {
          if (entry.subject) setCaseField("subject", entry.subject);
          if (entry.description) setCaseField("description", entry.description);
          if (els.caseSummary && entry.summary) {
            els.caseSummary.classList.remove("is-pending");
            els.caseSummary.textContent = entry.summary;
          }
          if (els.caseStatusPill) els.caseStatusPill.textContent = "In Progress";
          if (els.casePageStatus) els.casePageStatus.textContent = "In Progress";
          if (els.callNote) {
            els.callNote.value = `${flow.label} captured via Agentforce. ${flow.recordType} ${flow.recordNumber} updated.`;
          }
          setProcessStep("record");
        }
        updateFacilitatorLabels();
      }, entry.delay);
      transcriptTimers.push(timer);
    });
  };

  const beginConnectedSession = () => {
    app.dataset.state = "connected";
    setSoftphoneView("connected");
    startTicker(els.connectedTicker);
    openWorkspaceTabs();
    setContextPanels(true);
    if (els.voiceStatus) els.voiceStatus.textContent = "in-progress";
    if (demoMode === "interactive") startInteractiveSession();
    else startGuidedDemo();
  };

  const launchScenario = (flowId) => {
    setActiveFlow(flowId);
    softphone.classList.remove("is-minimized");
    els.utilityPhone?.classList.add("is-active");
    applyCallerChrome(currentFlow());
    app.dataset.state = "incoming";
    setSoftphoneView("incoming");
    startTicker(els.incomingTicker);
    setProcessStep("pop");
    // brief pause then accept for smooth demo launch
    window.setTimeout(() => beginConnectedSession(), 700);
  };

  const setActiveFlow = (id, { restartIfConnected = false } = {}) => {
    if (!FLOWS[id]) return;
    activeFlowId = id;
    renderIntentPickers();
    renderScenarioGrid();
    applyCallerChrome(FLOWS[id]);
    renderQuestions(FLOWS[id]);
    renderRecordFields(FLOWS[id]);
    updateFacilitatorLabels();
    if (app.dataset.state === "connected") {
      setContextPanels(true);
      if (restartIfConnected) {
        if (demoMode === "interactive") startInteractiveSession();
        else startGuidedDemo();
      }
    } else {
      setProcessStep("select");
    }
  };

  const setDemoMode = (mode) => {
    demoMode = mode;
    updateFacilitatorLabels();
    if (app.dataset.state === "connected") {
      if (demoMode === "interactive") startInteractiveSession();
      else startGuidedDemo();
    }
    renderQuestions(currentFlow());
  };

  const resetPrototype = () => {
    stopTicker();
    clearTranscriptUi();
    app.dataset.state = "available";
    setSoftphoneView("available");
    closeWorkspaceTabs();
    setContextPanels(false);
    if (els.caseCreatedPill) els.caseCreatedPill.hidden = true;
    if (els.voiceStatus) els.voiceStatus.textContent = "new";
    softphone.classList.add("is-minimized");
    els.utilityPhone?.classList.remove("is-active");
    els.utilityPhone?.setAttribute("aria-pressed", "false");
    setProcessStep("select");
    showTab("home");
    updateFacilitatorLabels();
  };

  const facilitatorNext = () => {
    if (processStep === "select") {
      launchScenario(activeFlowId);
      return;
    }
    if (processStep === "pop") {
      if (app.dataset.state === "incoming") beginConnectedSession();
      else launchScenario(activeFlowId);
      return;
    }
    if (processStep === "capture") {
      if (demoMode === "interactive") captureNextAnswer();
      else setProcessStep("record");
      return;
    }
    if (processStep === "record") {
      showTab("case");
      setProcessStep("next");
      return;
    }
    resetPrototype();
  };

  // Events
  els.simulateBtn?.addEventListener("click", () => {
    applyCallerChrome(currentFlow());
    app.dataset.state = "incoming";
    setSoftphoneView("incoming");
    startTicker(els.incomingTicker);
    softphone.classList.remove("is-minimized");
    els.utilityPhone?.classList.add("is-active");
    setProcessStep("pop");
  });

  els.acceptBtn?.addEventListener("click", beginConnectedSession);

  els.declineBtn?.addEventListener("click", () => {
    resetPrototype();
  });

  els.endBtn?.addEventListener("click", () => {
    app.dataset.state = "available";
    stopTicker();
    setSoftphoneView("available");
    if (els.voiceStatus) els.voiceStatus.textContent = "completed";
    setProcessStep("next");
  });

  els.replayTranscript?.addEventListener("click", () => {
    if (app.dataset.state !== "connected") return;
    if (demoMode === "interactive") startInteractiveSession();
    else startGuidedDemo();
  });

  els.captureNext?.addEventListener("click", () => {
    if (app.dataset.state === "connected") captureNextAnswer();
  });

  els.markCaseWorking?.addEventListener("click", () => {
    if (els.caseStatusPill) els.caseStatusPill.textContent = "Working";
    if (els.casePageStatus) els.casePageStatus.textContent = "Working";
    els.markCaseWorking.textContent = "Working";
    els.markCaseWorking.disabled = true;
  });

  els.openScheduling?.addEventListener("click", () => {
    els.openScheduling.textContent = "Scheduling opened";
    els.openScheduling.disabled = true;
    window.setTimeout(() => {
      els.openScheduling.textContent = "Open scheduling";
      els.openScheduling.disabled = false;
    }, 1600);
  });

  els.utilityPhone?.addEventListener("click", () => {
    softphone.classList.toggle("is-minimized");
    const open = !softphone.classList.contains("is-minimized");
    els.utilityPhone.classList.toggle("is-active", open);
    els.utilityPhone.setAttribute("aria-pressed", String(open));
  });

  els.minimizeBtn?.addEventListener("click", () => {
    softphone.classList.add("is-minimized");
    els.utilityPhone?.classList.remove("is-active");
    els.utilityPhone?.setAttribute("aria-pressed", "false");
  });

  els.facHome?.addEventListener("click", () => {
    resetPrototype();
  });
  els.facReset?.addEventListener("click", resetPrototype);
  els.facToggleMode?.addEventListener("click", () => {
    setDemoMode(demoMode === "interactive" ? "guided" : "interactive");
  });
  els.facNext?.addEventListener("click", facilitatorNext);

  document.querySelectorAll("[data-demo-mode]").forEach((btn) => {
    btn.addEventListener("click", () => setDemoMode(btn.getAttribute("data-demo-mode")));
  });

  document.querySelectorAll("[data-tab-jump]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-tab-jump");
      if (name && tabs[name] && !tabs[name].hidden) {
        showTab(name);
        if (name === "case") setProcessStep("next");
      }
    });
  });

  Object.values(tabs).forEach((tab) => {
    tab?.addEventListener("click", (event) => {
      const close = event.target.closest("[data-close-tab]");
      if (close) {
        event.stopPropagation();
        const name = close.getAttribute("data-close-tab");
        if (tabs[name]) tabs[name].hidden = true;
        if (activeTab === name) showTab("home");
        return;
      }
      const name = tab.getAttribute("data-tab");
      if (name) showTab(name);
    });
  });

  els.presenceSelect?.addEventListener("change", setPresenceVisual);
  setPresenceVisual();
  setActiveFlow("lead-enquiry");
  setSoftphoneView("available");
  softphone.classList.add("is-minimized");
  els.utilityPhone?.classList.remove("is-active");
  els.utilityPhone?.setAttribute("aria-pressed", "false");
  setContextPanels(false);
  setProcessStep("select");
  showTab("home");
  updateFacilitatorLabels();
})();
