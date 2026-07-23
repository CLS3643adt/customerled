(() => {
  const app = document.querySelector(".sf-app");
  const softphone = document.querySelector(".sf-softphone");
  const views = {
    available: document.querySelector('[data-view="available"]'),
    incoming: document.querySelector('[data-view="incoming"]'),
    connected: document.querySelector('[data-view="connected"]'),
  };
  const pages = {
    home: document.querySelector('[data-page="home"]'),
    voice: document.querySelector('[data-page="voice"]'),
    contact: document.querySelector('[data-page="contact"]'),
  };
  const tabs = {
    home: document.querySelector('.sf-nav__item[data-tab="home"]'),
    voice: document.querySelector('.sf-nav__item[data-tab="voice"]'),
    contact: document.querySelector('.sf-nav__item[data-tab="contact"]'),
  };

  const simulateBtn = document.getElementById("simulate-call");
  const acceptBtn = document.getElementById("accept-call");
  const declineBtn = document.getElementById("decline-call");
  const endBtn = document.getElementById("end-call");
  const utilityPhone = document.getElementById("utility-phone");
  const utilityBadge = document.getElementById("utility-badge");
  const minimizeBtn = document.getElementById("softphone-minimize");
  const incomingTicker = document.getElementById("incoming-ticker");
  const connectedTicker = document.getElementById("connected-ticker");
  const voiceStatus = document.getElementById("voice-status");
  const presenceDot = document.querySelector(".presence-dot");
  const presenceSelect = document.getElementById("presence-select");

  let tickerStart = null;
  let tickerTimer = null;
  let activeTab = "home";

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

  const setSoftphoneView = (view) => {
    softphone.dataset.panel = view;
    Object.entries(views).forEach(([key, node]) => {
      if (!node) return;
      node.hidden = key !== view;
    });
    if (utilityBadge) {
      utilityBadge.hidden = view !== "incoming";
    }
  };

  const showTab = (name) => {
    activeTab = name;
    Object.entries(tabs).forEach(([key, tab]) => {
      if (!tab) return;
      const isTarget = key === name;
      tab.setAttribute("aria-pressed", String(isTarget));
      if (key !== "home") {
        // keep visibility managed separately
      }
    });
    Object.entries(pages).forEach(([key, page]) => {
      if (!page) return;
      page.hidden = key !== name;
    });
  };

  const openWorkspaceTabs = () => {
    if (tabs.voice) tabs.voice.hidden = false;
    if (tabs.contact) tabs.contact.hidden = false;
    showTab("voice");
  };

  const closeWorkspaceTabs = () => {
    if (tabs.voice) tabs.voice.hidden = true;
    if (tabs.contact) tabs.contact.hidden = true;
    showTab("home");
  };

  const setPresenceVisual = () => {
    if (!presenceDot || !presenceSelect) return;
    const value = presenceSelect.value;
    presenceDot.classList.remove("available", "busy", "unavailable");
    if (value === "Busy") {
      presenceDot.classList.add("busy");
      presenceDot.style.background = "var(--sf-accent)";
    } else if (value === "Unavailable") {
      presenceDot.classList.add("unavailable");
      presenceDot.style.background = "var(--sf-destructive)";
    } else {
      presenceDot.classList.add("available");
      presenceDot.style.background = "var(--sf-success)";
    }
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
    if (voiceStatus) voiceStatus.textContent = "in-progress";
  });

  declineBtn?.addEventListener("click", () => {
    app.dataset.state = "available";
    stopTicker();
    setSoftphoneView("available");
    closeWorkspaceTabs();
  });

  endBtn?.addEventListener("click", () => {
    app.dataset.state = "available";
    stopTicker();
    setSoftphoneView("available");
    if (voiceStatus) voiceStatus.textContent = "completed";
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
  showTab("home");
})();
