(() => {
  "use strict";
  const state = { role: "driver", ride: { name: "Saver", price: "₱185", eta: "5 min" } };
  const screens = Array.from(document.querySelectorAll(".screen"));
  const toastEl = document.getElementById("toast");
  const scrim = document.getElementById("scrim");
  const sheet = document.getElementById("demo-sheet");
  const authRoleCode = document.getElementById("auth-role-code");
  let toastTimer = null;

  function showScreen(id) {
    const next = document.getElementById(id);
    if (!next) return showToast("Demo screen not found: " + id);
    screens.forEach(s => s.classList.remove("active"));
    next.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function homeForRole(role) { return role === "driver" ? "d-home" : role === "operator" ? "o-home" : "c-home"; }
  function roleLabel(role) { return role === "driver" ? "DRIVER" : role === "operator" ? "OPERATOR" : "CUSTOMER"; }
  function selectRole(role, goToAuth = true) {
    state.role = role;
    if (authRoleCode) authRoleCode.textContent = roleLabel(role);
    if (goToAuth) showScreen("auth-phone");
  }
  function enterDemo(role = state.role) { state.role = role; closeDemoSheet(); showScreen(homeForRole(role)); }
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message || "Demo action completed.";
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1900);
  }
  function openDemoSheet() { if (scrim) scrim.classList.add("show"); if (sheet) sheet.classList.add("open"); }
  function closeDemoSheet() { if (scrim) scrim.classList.remove("show"); if (sheet) sheet.classList.remove("open"); }
  function setRide(value) {
    const [name, price, eta] = value.split("|");
    state.ride = { name, price, eta };
    document.getElementById("confirm-ride-name").textContent = "DRIVR " + name;
    document.getElementById("confirm-ride-price").textContent = price;
    document.getElementById("confirm-ride-eta").textContent = eta + " pickup";
    document.getElementById("complete-price").textContent = price;
    showScreen("c-confirm");
  }
  function money(n) { return "₱" + Math.round(n).toLocaleString("en-PH"); }
  function updateShift(value) {
    const v = Number(value), target = 2500, cleared = v >= target;
    const excess = Math.max(0, v - target), share = excess * 0.70, bonus = cleared ? 475 : 0;
    document.getElementById("shift-gross").textContent = money(v);
    document.getElementById("shift-progress").style.width = Math.min(100, (v / target) * 100) + "%";
    const stateChip = document.getElementById("shift-state");
    stateChip.textContent = cleared ? "TARGET CLEARED" : "BUILDING TARGET";
    stateChip.className = "signal-chip " + (cleared ? "success" : "attention");
    const remaining = document.getElementById("shift-remaining");
    remaining.textContent = cleared ? "Cleared ✓" : money(target - v) + " remaining";
    remaining.className = cleared ? "green-text" : "amber-text";
    document.getElementById("shift-share").textContent = money(share);
    document.getElementById("shift-fuel").textContent = "+" + money(cleared ? 200 : 0);
    document.getElementById("shift-ad").textContent = "+" + money(cleared ? 125 : 0);
    document.getElementById("shift-perf").textContent = "+" + money(cleared ? 150 : 0);
    document.getElementById("shift-earned").textContent = money(share + bonus);
  }

  document.addEventListener("click", (event) => {
    const targetButton = event.target.closest("[data-target]");
    if (targetButton) { showScreen(targetButton.dataset.target); return; }
    const roleButton = event.target.closest("[data-role]");
    if (roleButton) { selectRole(roleButton.dataset.role, true); return; }
    const roleJump = event.target.closest("[data-role-jump]");
    if (roleJump) { enterDemo(roleJump.dataset.roleJump); return; }
    const rideButton = event.target.closest("[data-ride]");
    if (rideButton) {
      document.querySelectorAll(".ride-option").forEach(b => b.classList.remove("selected"));
      rideButton.classList.add("selected");
      setRide(rideButton.dataset.ride); return;
    }
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;
    const action = actionButton.dataset.action;
    if (action === "open-demo-sheet") openDemoSheet();
    else if (action === "close-demo-sheet") closeDemoSheet();
    else if (action === "demo-enter") enterDemo();
    else if (action === "toast") showToast(actionButton.dataset.message || "Demo action completed.");
  });

  if (scrim) scrim.addEventListener("click", closeDemoSheet);
  const slider = document.getElementById("shift-slider");
  if (slider) { slider.addEventListener("input", e => updateShift(e.target.value)); updateShift(slider.value); }
})();