(() => {
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
  const questionItems = [...document.querySelectorAll("#question-list [data-question]")];
  const caseCreatedPill = document.getElementById("case-created-pill");
  const caseStatusPill = document.getElementById("case-status-pill");
  const casePageStatus = document.getElementById("case-page-status");
  const caseSummary = document.getElementById("case-summary");
  const callNote = document.getElementById("call-note");

  let tickerStart = null;
  let tickerTimer = null;
  let activeTab = "home";
  let transcriptTimers = [];

  const transcriptScript = [
    {
      delay: 600,
      speaker: "system",
      label: "Agentforce",
      text: "Visit Change case 00015821 created from IVR intent and linked to this Voice Call.",
    },
    {
      delay: 1800,
      speaker: "agent",
      label: "Agent",
      text: "Hi Maggie, it's Sam from Care Hub. I can see you're calling about a visit change — which visit needs to move?",
      question: "visit",
    },
    {
      delay: 3600,
      speaker: "client",
      label: "Maggie",
      text: "Thursday's physiotherapy with Amira. I can't do Thursday morning.",
      field: "visit",
      value: "Thu 24 Jul · 10:30 · Physiotherapy · Amira Khan",
      question: "visit",
    },
    {
      delay: 5400,
      speaker: "agent",
      label: "Agent",
      text: "Got it. What's the reason we need to change that visit?",
      question: "reason",
    },
    {
      delay: 7000,
      speaker: "client",
      label: "Maggie",
      text: "I've got a specialist appointment that morning. David is taking me.",
      field: "reason",
      value: "Client specialist appointment · family transport with David",
      question: "reason",
    },
    {
      delay: 8800,
      speaker: "agent",
      label: "Agent",
      text: "Would Friday at 9:30 or 11:00 work better?",
      question: "preference",
    },
    {
      delay: 10400,
      speaker: "client",
      label: "Maggie",
      text: "Friday at 11:00 would be perfect.",
      field: "preference",
      value: "Fri 25 Jul · 11:00–11:45",
      question: "preference",
    },
    {
      delay: 12000,
      speaker: "agent",
      label: "Agent",
      text: "Shall we keep Amira as your worker for the physio visit?",
      question: "worker",
    },
    {
      delay: 13400,
      speaker: "client",
      label: "Maggie",
      text: "Yes please — Amira knows my exercises.",
      field: "worker",
      value: "Amira Khan · preferred carer required",
      question: "worker",
    },
    {
      delay: 15000,
      speaker: "agent",
      label: "Agent",
      text: "Who should we SMS to confirm the new time — you, David, or both?",
      question: "notify",
    },
    {
      delay: 16600,
      speaker: "client",
      label: "Maggie",
      text: "Both me and David, please. And let Jordan know too.",
      field: "notify",
      value: "SMS Maggie + David · notify Care Partner Jordan Lee",
      question: "notify",
    },
    {
      delay: 18400,
      speaker: "agent",
      label: "Agent",
      text: "Any risk or access notes we should add for Friday?",
      question: "risk",
    },
    {
      delay: 20000,
      speaker: "client",
      label: "Maggie",
      text: "Same as usual — use the key safe, and please remind me about my evening Webster pack.",
      field: "risk",
      value: "Key safe access · evening medication prompt · fall history noted",
      question: "risk",
      complete: true,
    },
    {
      delay: 21600,
      speaker: "system",
      label: "Agentforce",
      text: "All Visit Change questions captured. Case description and next steps updated.",
    },
  ];

  const formatElapsed = (ms) => {
    const total = Math.floor(ms / 1000);
    const mm = String(Math.floor(total / 60)).padStart(2, "0");
    const ss = String(total % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const stopTicker = () => {
    if (tickerTimer) {
      clearInterval(tickerTimer);
      tickerTimer = null;
    }
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
    if (clientNav) clientNav.hidden = !open;
    if (scheduleNav) scheduleNav.hidden = !open;
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
    if (tabs.contact) tabs.contact.hidden = false;
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

  const setCaseField = (field, value) => {
    document.querySelectorAll(`[data-field="${field}"]`).forEach((node) => {
      node.textContent = value;
      node.classList.remove("is-pending");
    });
  };

  const setQuestionState = (questionId, state) => {
    questionItems.forEach((item) => {
      const id = item.getAttribute("data-question");
      item.classList.remove("is-current", "is-done");
      if (id === questionId && state === "current") item.classList.add("is-current");
      if (item.dataset.completed === "true") item.classList.add("is-done");
      if (id === questionId && state === "done") {
        item.dataset.completed = "true";
        item.classList.add("is-done");
        item.classList.remove("is-current");
      }
    });

    if (state === "done") {
      const order = questionItems.map((item) => item.getAttribute("data-question"));
      const idx = order.indexOf(questionId);
      const next = order.slice(idx + 1).find((id) => {
        const el = questionItems.find((item) => item.getAttribute("data-question") === id);
        return el && el.dataset.completed !== "true";
      });
      if (next) {
        const nextEl = questionItems.find((item) => item.getAttribute("data-question") === next);
        nextEl?.classList.add("is-current");
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
      setCaseField(
        "subject",
        "Visit change — move Thu physio to Fri 11:00 with Amira"
      );
      setCaseField(
        "description",
        "Client cannot attend Thu 24 Jul physio due to specialist appointment. Prefers Fri 25 Jul 11:00 with Amira Khan. Notify Maggie, David, and Care Partner Jordan. Key safe + evening Webster prompt."
      );
      if (caseSummary) {
        caseSummary.classList.remove("is-pending");
        caseSummary.textContent =
          "Maggie needs Thursday physio moved to Friday 11:00 with Amira. Notify Maggie, David, and Jordan. Retain key safe access and medication prompt.";
      }
      if (caseStatusPill) caseStatusPill.textContent = "In Progress";
      if (casePageStatus) casePageStatus.textContent = "In Progress";
      if (callNote && !callNote.value) {
        callNote.value =
          "Visit change captured via Agentforce. Case 00015821 updated with preferred Fri 11:00 slot.";
      }
    }
  };

  const clearTranscript = () => {
    transcriptTimers.forEach((id) => clearTimeout(id));
    transcriptTimers = [];
    if (transcriptList) transcriptList.innerHTML = "";
    if (transcriptEmpty) transcriptEmpty.hidden = false;
    questionItems.forEach((item, index) => {
      item.dataset.completed = "false";
      item.classList.remove("is-done", "is-current");
      if (index === 0) item.classList.add("is-current");
    });
    [
      "visit",
      "reason",
      "preference",
      "worker",
      "notify",
      "risk",
      "description",
    ].forEach((field) => {
      document.querySelectorAll(`[data-field="${field}"]`).forEach((node) => {
        node.textContent =
          field === "description" ? "Built from transcript…" : "Awaiting answer…";
        node.classList.add("is-pending");
      });
    });
    setCaseField("subject", "Visit change — pending details");
    document.querySelectorAll('[data-field="subject"]').forEach((node) => {
      node.classList.remove("is-pending");
    });
    if (caseSummary) {
      caseSummary.classList.add("is-pending");
      caseSummary.textContent = "Summary will appear as transcript answers are captured.";
    }
    if (caseStatusPill) caseStatusPill.textContent = "New";
    if (casePageStatus) casePageStatus.textContent = "New";
  };

  const startAgentforceDemo = () => {
    clearTranscript();
    if (caseCreatedPill) caseCreatedPill.hidden = false;
    transcriptScript.forEach((entry) => {
      const timer = window.setTimeout(() => appendTranscript(entry), entry.delay);
      transcriptTimers.push(timer);
    });
  };

  const stopAgentforceDemo = () => {
    clearTranscript();
    if (caseCreatedPill) caseCreatedPill.hidden = true;
  };

  simulateBtn?.addEventListener("click", () => {
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
  setSoftphoneView("available");
  setContextPanels(false);
  showTab("home");
})();
