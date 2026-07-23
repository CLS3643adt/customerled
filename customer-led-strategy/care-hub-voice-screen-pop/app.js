(() => {
  const FLOWS = window.CARE_HUB_FLOWS;
  const FLOW_ORDER = [
    "visit-change",
    "worker-sick",
    "lead-enquiry",
    "finance-billing",
    "complaint-feedback",
  ];

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

  const simulateBtn = document.getElementById("simulate-call");
  const acceptBtn = document.getElementById("accept-call");
  const declineBtn = document.getElementById("decline-call");
  const endBtn = document.getElementById("end-call");
  const utilityPhone = document.getElementById("utility-phone");
  const utilityBadge = document.getElementById("utility-badge");
  const minimizeBtn = document.getElementById("softphone-minimize");
  const openScheduling = document.getElementById("open-scheduling");
  const replayTranscript = document.getElementById("replay-transcript");
  const markCaseWorking = document.getElementById("mark-case-working");
  const incomingTicker = document.getElementById("incoming-ticker");
  const connectedTicker = document.getElementById("connected-ticker");
  const voiceStatus = document.getElementById("voice-status");
  const presenceDot = document.querySelector(".presence-dot");
  const presenceSelect = document.getElementById("presence-select");
  const transcriptList = document.getElementById("transcript-list");
  const transcriptEmpty = document.getElementById("transcript-empty");
  const questionList = document.getElementById("question-list");
  const guideIntro = document.getElementById("guide-intro");
  const caseFields = document.getElementById("case-fields");
  const casePageFields = document.getElementById("case-page-fields");
  const caseCreatedPill = document.getElementById("case-created-pill");
  const caseStatusPill = document.getElementById("case-status-pill");
  const casePageStatus = document.getElementById("case-page-status");
  const caseSummary = document.getElementById("case-summary");
  const caseBanner = document.getElementById("case-banner");
  const caseNextSteps = document.getElementById("case-next-steps");
  const callNote = document.getElementById("call-note");
  const intentOptions = document.getElementById("intent-options");
  const softphoneIntentOptions = document.getElementById("softphone-intent-options");
  const voiceIntentLabel = document.getElementById("voice-intent-label");
  const recordTabLabel = document.getElementById("record-tab-label");
  const recordCardTitle = document.getElementById("record-card-title");
  const casePageTitle = document.getElementById("case-page-title");
  const casePageTypeLabel = document.getElementById("case-page-type-label");
  const casePageRecordLabel = document.getElementById("case-page-record-label");
  const casePageOwner = document.getElementById("case-page-owner");
  const voiceCallerTitle = document.querySelector('[data-page="voice"] .sf-highlights__body h2');

  let activeFlowId = "visit-change";
  let tickerStart = null;
  let tickerTimer = null;
  let activeTab = "home";
  let transcriptTimers = [];

  const initials = (name) =>
    name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const currentFlow = () => FLOWS[activeFlowId];

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

  const setContextPanels = (open) => {
    const flow = currentFlow();
    const showClient = open && flow.id !== "lead-enquiry";
    const showSchedule = open && (flow.id === "visit-change" || flow.id === "worker-sick");
    if (clientNav) clientNav.hidden = !showClient;
    if (scheduleNav) scheduleNav.hidden = !showSchedule;
    app.dataset.context = open ? "open" : "closed";
  };

  const setSoftphoneView = (view) => {
    softphone.dataset.panel = view;
    Object.entries(views).forEach(([key, node]) => {
      if (!node) return;
      node.hidden = key !== view;
    });
    if (utilityBadge) utilityBadge.hidden = view !== "incoming";
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
    if (tabs.contact) tabs.contact.hidden = currentFlow().id === "lead-enquiry";
    showTab("voice");
  };

  const closeWorkspaceTabs = () => {
    ["voice", "case", "contact"].forEach((name) => {
      if (tabs[name]) tabs[name].hidden = true;
    });
    showTab("home");
  };

  const setPresenceVisual = () => {
    if (!presenceDot || !presenceSelect) return;
    const value = presenceSelect.value;
    if (value === "Busy") presenceDot.style.background = "var(--sf-accent)";
    else if (value === "Unavailable") presenceDot.style.background = "var(--sf-destructive)";
    else presenceDot.style.background = "var(--sf-success)";
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
    makeButtons(intentOptions);
    makeButtons(softphoneIntentOptions);
  };

  const renderQuestions = (flow) => {
    if (!questionList) return;
    questionList.innerHTML = "";
    flow.questions.forEach((q, index) => {
      const li = document.createElement("li");
      li.dataset.question = q.id;
      li.dataset.completed = "false";
      if (index === 0) li.classList.add("is-current");
      li.innerHTML = `<span class="q-status" aria-hidden="true"></span><div><strong>${q.title}</strong><p>${q.hint}</p></div>`;
      questionList.appendChild(li);
    });
    if (guideIntro) guideIntro.innerHTML = flow.guideIntro;
  };

  const renderRecordFields = (flow) => {
    if (caseFields) {
      caseFields.innerHTML = "";
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
        caseFields.appendChild(row);
      });
      const subject = document.createElement("div");
      subject.innerHTML = `<dt>Subject</dt><dd data-field="subject">${flow.subjectPending}</dd>`;
      caseFields.appendChild(subject);
      flow.fields.forEach((field) => {
        const row = document.createElement("div");
        const placeholder =
          field.key === "description" ? "Built from transcript…" : "Awaiting answer…";
        row.innerHTML = `<dt>${field.label}</dt><dd data-field="${field.key}" class="is-pending">${placeholder}</dd>`;
        caseFields.appendChild(row);
      });
    }

    if (casePageFields) {
      casePageFields.innerHTML = "";
      const subject = document.createElement("div");
      subject.innerHTML = `<dt>Subject</dt><dd data-field="subject">${flow.subjectPending}</dd>`;
      casePageFields.appendChild(subject);
      flow.fields.forEach((field) => {
        if (field.key === "description") return;
        const row = document.createElement("div");
        row.innerHTML = `<dt>${field.label}</dt><dd data-field="${field.key}" class="is-pending">Awaiting answer…</dd>`;
        casePageFields.appendChild(row);
      });
    }

    if (caseNextSteps) {
      const steps = {
        "visit-change": [
          "Confirm cancel or new slot in scheduling",
          "Notify client / household / care partner",
          "Update visit notes and risk flags",
        ],
        "worker-sick": [
          "Route case to SC Manager for leave hour approval",
          "Arrange coverage for impacted visits",
          "Attach medical certificate when received",
        ],
        "lead-enquiry": [
          "Qualify funding and serviceability",
          "Book intake assessment if eligible",
          "Send welcome / next-step email to enquirer",
        ],
        "finance-billing": [
          "Finance reviews invoice / payment issue",
          "Apply credit or payment arrangement if approved",
          "Callback caller with outcome",
        ],
        "complaint-feedback": [
          "Quality acknowledges complaint within SLA",
          "Investigate with scheduling / worker",
          "Provide outcome to complainant",
        ],
      };
      caseNextSteps.innerHTML = (steps[flow.id] || [])
        .map((step) => `<li>${step}</li>`)
        .join("");
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
    if (voiceIntentLabel) voiceIntentLabel.textContent = flow.label;
    const voiceFromPhone = document.getElementById("voice-from-phone");
    if (voiceFromPhone) voiceFromPhone.textContent = flow.phone;
    if (voiceCallerTitle) voiceCallerTitle.textContent = `VC-000482 · ${flow.callerName}`;
    if (recordTabLabel) {
      recordTabLabel.textContent = `${flow.recordType} ${flow.recordNumber}`;
    }
    if (recordCardTitle) {
      recordCardTitle.textContent =
        flow.recordType === "Lead" ? "Auto-created Lead" : "Auto-created Case";
    }
    if (caseBanner) caseBanner.innerHTML = flow.banner;
    if (caseCreatedPill) caseCreatedPill.textContent = flow.pill;
    if (casePageTypeLabel) casePageTypeLabel.textContent = flow.recordType;
    if (casePageRecordLabel) casePageRecordLabel.textContent = flow.recordLabel;
    if (casePageOwner) casePageOwner.textContent = flow.owner;
    if (casePageTitle) {
      casePageTitle.textContent = `${flow.recordNumber} · ${flow.recordLabel}`;
    }
  };

  const setCaseField = (field, value) => {
    document.querySelectorAll(`[data-field="${field}"]`).forEach((node) => {
      node.textContent = value;
      node.classList.remove("is-pending");
    });
  };

  const questionItems = () => [...document.querySelectorAll("#question-list [data-question]")];

  const setQuestionState = (questionId, state) => {
    const items = questionItems();
    items.forEach((item) => {
      const id = item.getAttribute("data-question");
      item.classList.remove("is-current");
      if (item.dataset.completed === "true") item.classList.add("is-done");
      else item.classList.remove("is-done");
      if (id === questionId && state === "current") item.classList.add("is-current");
      if (id === questionId && state === "done") {
        item.dataset.completed = "true";
        item.classList.add("is-done");
        item.classList.remove("is-current");
      }
    });
    if (state === "done") {
      const order = items.map((item) => item.getAttribute("data-question"));
      const idx = order.indexOf(questionId);
      const next = order.slice(idx + 1).find((id) => {
        const el = items.find((item) => item.getAttribute("data-question") === id);
        return el && el.dataset.completed !== "true";
      });
      if (next) {
        items
          .find((item) => item.getAttribute("data-question") === next)
          ?.classList.add("is-current");
      }
    }
  };

  const appendTranscript = (entry) => {
    if (!transcriptList) return;
    if (transcriptEmpty) transcriptEmpty.hidden = true;
    const li = document.createElement("li");
    li.innerHTML = `<span class="speaker ${entry.speaker}">${entry.label}</span><span>${entry.text}</span>`;
    transcriptList.appendChild(li);
    transcriptList.scrollTop = transcriptList.scrollHeight;

    if (entry.question && !entry.field) setQuestionState(entry.question, "current");
    if (entry.field && entry.value) {
      setCaseField(entry.field, entry.value);
      if (entry.question) setQuestionState(entry.question, "done");
    }
    if (entry.complete) {
      if (entry.subject) setCaseField("subject", entry.subject);
      if (entry.description) setCaseField("description", entry.description);
      if (caseSummary && entry.summary) {
        caseSummary.classList.remove("is-pending");
        caseSummary.textContent = entry.summary;
      }
      if (caseStatusPill) caseStatusPill.textContent = "In Progress";
      if (casePageStatus) casePageStatus.textContent = "In Progress";
      if (callNote) {
        callNote.value = `${currentFlow().label} captured via Agentforce. ${currentFlow().recordType} ${currentFlow().recordNumber} updated.`;
      }
    }
  };

  const clearTranscript = () => {
    transcriptTimers.forEach((id) => clearTimeout(id));
    transcriptTimers = [];
    if (transcriptList) transcriptList.innerHTML = "";
    if (transcriptEmpty) transcriptEmpty.hidden = false;
    if (caseSummary) {
      caseSummary.classList.add("is-pending");
      caseSummary.textContent = "Summary will appear as transcript answers are captured.";
    }
    if (caseStatusPill) caseStatusPill.textContent = "New";
    if (casePageStatus) casePageStatus.textContent = "New";
    if (markCaseWorking) {
      markCaseWorking.disabled = false;
      markCaseWorking.textContent = "Start working";
    }
  };

  const startAgentforceDemo = () => {
    const flow = currentFlow();
    clearTranscript();
    renderQuestions(flow);
    renderRecordFields(flow);
    applyCallerChrome(flow);
    if (caseCreatedPill) caseCreatedPill.hidden = false;
    flow.transcript.forEach((entry) => {
      const timer = window.setTimeout(() => appendTranscript(entry), entry.delay);
      transcriptTimers.push(timer);
    });
  };

  const stopAgentforceDemo = () => {
    clearTranscript();
    if (caseCreatedPill) caseCreatedPill.hidden = true;
  };

  const setActiveFlow = (id, { restartIfConnected = false } = {}) => {
    if (!FLOWS[id]) return;
    activeFlowId = id;
    renderIntentPickers();
    applyCallerChrome(FLOWS[id]);
    renderQuestions(FLOWS[id]);
    renderRecordFields(FLOWS[id]);
    if (app.dataset.state === "connected") {
      setContextPanels(true);
      if (restartIfConnected) startAgentforceDemo();
    }
  };

  simulateBtn?.addEventListener("click", () => {
    applyCallerChrome(currentFlow());
    app.dataset.state = "incoming";
    setSoftphoneView("incoming");
    startTicker(incomingTicker);
    softphone.classList.remove("is-minimized");
    utilityPhone?.classList.add("is-active");
  });

  acceptBtn?.addEventListener("click", () => {
    app.dataset.state = "connected";
    setSoftphoneView("connected");
    startTicker(connectedTicker);
    openWorkspaceTabs();
    setContextPanels(true);
    if (voiceStatus) voiceStatus.textContent = "in-progress";
    startAgentforceDemo();
  });

  declineBtn?.addEventListener("click", () => {
    app.dataset.state = "available";
    stopTicker();
    setSoftphoneView("available");
    closeWorkspaceTabs();
    setContextPanels(false);
    stopAgentforceDemo();
  });

  endBtn?.addEventListener("click", () => {
    app.dataset.state = "available";
    stopTicker();
    setSoftphoneView("available");
    if (voiceStatus) voiceStatus.textContent = "completed";
  });

  replayTranscript?.addEventListener("click", () => {
    if (app.dataset.state === "connected") startAgentforceDemo();
  });

  markCaseWorking?.addEventListener("click", () => {
    if (caseStatusPill) caseStatusPill.textContent = "Working";
    if (casePageStatus) casePageStatus.textContent = "Working";
    markCaseWorking.textContent = "Working";
    markCaseWorking.disabled = true;
  });

  openScheduling?.addEventListener("click", () => {
    openScheduling.textContent = "Scheduling opened";
    openScheduling.disabled = true;
    window.setTimeout(() => {
      openScheduling.textContent = "Open scheduling";
      openScheduling.disabled = false;
    }, 1600);
  });

  utilityPhone?.addEventListener("click", () => {
    softphone.classList.toggle("is-minimized");
    const open = !softphone.classList.contains("is-minimized");
    utilityPhone.classList.toggle("is-active", open);
    utilityPhone.setAttribute("aria-pressed", String(open));
  });

  minimizeBtn?.addEventListener("click", () => {
    softphone.classList.add("is-minimized");
    utilityPhone?.classList.remove("is-active");
    utilityPhone?.setAttribute("aria-pressed", "false");
  });

  document.querySelectorAll("[data-tab-jump]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-tab-jump");
      if (name && tabs[name] && !tabs[name].hidden) showTab(name);
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

  presenceSelect?.addEventListener("change", setPresenceVisual);
  setPresenceVisual();
  setActiveFlow("visit-change");
  setSoftphoneView("available");
  setContextPanels(false);
  showTab("home");
})();
