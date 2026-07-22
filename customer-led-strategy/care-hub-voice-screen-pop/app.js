(() => {
  const screenPop = document.getElementById("screen-pop");
  const idleState = document.getElementById("idle-state");
  const popBody = document.getElementById("pop-body");
  const triggerCall = document.getElementById("trigger-call");
  const answerCall = document.getElementById("answer-call");
  const dismissCall = document.getElementById("dismiss-call");
  const openSchedule = document.getElementById("open-schedule");
  const callBadge = document.querySelector(".call-badge");

  if (!screenPop || !popBody || !triggerCall) return;

  const setState = (state) => {
    screenPop.dataset.state = state;
    const active = state !== "idle";
    popBody.hidden = !active;
    idleState.hidden = active;

    if (callBadge) {
      callBadge.lastChild.textContent =
        state === "answered" ? " Live call · connected" : " Live call · ringing";
    }

    if (answerCall) {
      answerCall.disabled = state === "answered";
      answerCall.textContent = state === "answered" ? "Connected" : "Answer";
    }
  };

  triggerCall.addEventListener("click", () => {
    setState("active");
    popBody.focus?.();
  });

  answerCall?.addEventListener("click", () => {
    setState("answered");
  });

  dismissCall?.addEventListener("click", () => {
    setState("idle");
  });

  openSchedule?.addEventListener("click", () => {
    openSchedule.textContent = "Scheduling opened";
    openSchedule.disabled = true;
    window.setTimeout(() => {
      openSchedule.textContent = "Open scheduling";
      openSchedule.disabled = false;
    }, 1800);
  });
})();
