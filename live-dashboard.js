const policy = [
  {
    source: "WAN",
    dest: "DMZ",
    ports: ["80", "443"],
    action: "pass",
    reason: "Public web traffic is allowed only to the DMZ web server."
  },
  {
    source: "Internal",
    dest: "DMZ",
    ports: ["80", "443"],
    action: "pass",
    reason: "Employees can browse the DMZ web service."
  },
  {
    source: "Internal",
    dest: "Restricted",
    ports: ["22"],
    action: "pass",
    reason: "Controlled SSH access from Internal to Restricted is allowed."
  }
];

const checklistItems = [
  ["topology", "Topology screenshot captured", "Open topology.html and save a clean screenshot."],
  ["adapters", "pfSense four adapters verified", "WAN NAT plus dmz_net, lan_net, restricted_net."],
  ["interfaces", "Interface IPs configured", "DMZ .10.1, Internal .20.1, Restricted .30.1."],
  ["server", "DMZ web server running", "Apache responds on 192.168.10.10."],
  ["rules", "Firewall allow rules added", "WAN web, Internal web, Internal SSH."],
  ["allow-test", "Allowed traffic tested", "Internal to DMZ HTTP works."],
  ["block-test", "Blocked traffic tested", "DMZ/Internal or Restricted/WAN block confirmed."],
  ["logs", "Firewall logs captured", "One allowed and one blocked log entry saved."],
  ["report", "Final report filled", "Screenshots and conclusion added to report template."]
];

const evidenceSlots = [
  ["Topology", "topology"],
  ["pfSense adapters", "adapters"],
  ["Firewall rules", "rules"],
  ["Allowed test", "allow-test"],
  ["Blocked test", "block-test"],
  ["Firewall log", "logs"]
];

const checklistEl = document.getElementById("checklist");
const completionText = document.getElementById("completionText");
const statusDot = document.getElementById("statusDot");
const liveClock = document.getElementById("liveClock");
const logTable = document.getElementById("logTable");
const decisionBox = document.getElementById("decisionBox");
const sourceZone = document.getElementById("sourceZone");
const destZone = document.getElementById("destZone");
const servicePort = document.getElementById("servicePort");
const runTraffic = document.getElementById("runTraffic");
const clearLogs = document.getElementById("clearLogs");
const resetChecklist = document.getElementById("resetChecklist");
const evidenceGrid = document.getElementById("evidenceGrid");

const savedChecks = JSON.parse(localStorage.getItem("pfsenseLabChecks") || "{}");
let logs = JSON.parse(localStorage.getItem("pfsenseLabLogs") || "[]");

function tickClock() {
  const now = new Date();
  liveClock.textContent = now.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "medium"
  });
}

function renderChecklist() {
  checklistEl.innerHTML = "";

  checklistItems.forEach(([id, title, detail]) => {
    const row = document.createElement("label");
    row.className = "check-item";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = Boolean(savedChecks[id]);
    input.addEventListener("change", () => {
      savedChecks[id] = input.checked;
      localStorage.setItem("pfsenseLabChecks", JSON.stringify(savedChecks));
      updateCompletion();
    });

    const text = document.createElement("div");
    text.innerHTML = `<strong>${title}</strong><span>${detail}</span>`;

    const badge = document.createElement("span");
    badge.textContent = input.checked ? "Done" : "Open";

    input.addEventListener("change", () => {
      badge.textContent = input.checked ? "Done" : "Open";
    });

    row.append(input, text, badge);
    checklistEl.appendChild(row);
  });

  updateCompletion();
}

function updateCompletion() {
  const done = checklistItems.filter(([id]) => savedChecks[id]).length;
  const pct = Math.round((done / checklistItems.length) * 100);
  completionText.textContent = `${pct}% complete`;
  statusDot.style.background = pct === 100 ? "var(--pass)" : pct >= 50 ? "var(--warn)" : "#94a3b8";
  statusDot.style.boxShadow = pct === 100 ? "0 0 0 5px var(--pass-soft)" : "0 0 0 5px #eef2f7";
}

function decideFlow(source, dest, port) {
  const match = policy.find((rule) => (
    rule.source === source &&
    rule.dest === dest &&
    rule.ports.includes(port)
  ));

  if (match) {
    return {
      action: "pass",
      reason: match.reason
    };
  }

  return {
    action: "block",
    reason: "Blocked by default deny because no explicit allow rule matches this flow."
  };
}

function serviceLabel(port) {
  const labels = {
    "80": "HTTP 80",
    "443": "HTTPS 443",
    "22": "SSH 22",
    "icmp": "ICMP ping",
    "any": "Any other"
  };
  return labels[port] || port;
}

function addLog(entry) {
  logs.unshift(entry);
  logs = logs.slice(0, 9);
  localStorage.setItem("pfsenseLabLogs", JSON.stringify(logs));
  renderLogs();
}

function renderLogs() {
  if (logs.length === 0) {
    logTable.innerHTML = `<div class="log-row"><strong>Ready</strong><span>No simulated traffic yet. Run a test flow.</span><code>local</code></div>`;
    return;
  }

  logTable.innerHTML = "";
  logs.forEach((entry) => {
    const row = document.createElement("div");
    row.className = `log-row ${entry.action}`;
    row.innerHTML = `
      <strong>${entry.action}</strong>
      <span>${entry.source} to ${entry.dest} / ${entry.service}<br><code>${entry.reason}</code></span>
      <code>${entry.time}</code>
    `;
    logTable.appendChild(row);
  });
}

function animateFlow(source, dest, action) {
  document.querySelectorAll(".links path").forEach((path) => {
    path.classList.remove("active-pass", "active-block");
  });

  const map = {
    "WAN-DMZ": ["flowWan", "flowDmz"],
    "Internal-DMZ": ["flowInternal", "flowDmz"],
    "Internal-Restricted": ["flowInternal", "flowRestricted"],
    "DMZ-Internal": ["flowDmz", "flowInternal"],
    "DMZ-Restricted": ["flowDmz", "flowRestricted"],
    "Restricted-WAN": ["flowRestricted", "flowWan"],
    "Restricted-DMZ": ["flowRestricted", "flowDmz"],
    "Restricted-Internal": ["flowRestricted", "flowInternal"]
  };

  const ids = map[`${source}-${dest}`] || [];
  ids.forEach((id) => {
    const path = document.getElementById(id);
    if (path) {
      path.classList.add(action === "pass" ? "active-pass" : "active-block");
    }
  });
}

function runFlow() {
  const source = sourceZone.value;
  const dest = destZone.value;
  const port = servicePort.value;
  const result = decideFlow(source, dest, port);
  const service = serviceLabel(port);

  decisionBox.className = `decision ${result.action}`;
  decisionBox.innerHTML = `
    <span>${result.action === "pass" ? "Allowed" : "Blocked"}</span>
    <strong>${source} to ${dest} using ${service}</strong>
    <p class="hint">${result.reason}</p>
  `;

  animateFlow(source, dest, result.action);

  addLog({
    action: result.action,
    source,
    dest,
    service,
    reason: result.reason,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  });
}

function renderEvidenceSlots() {
  evidenceGrid.innerHTML = "";

  evidenceSlots.forEach(([title, id]) => {
    const slot = document.createElement("div");
    slot.className = "evidence-slot";

    const label = document.createElement("strong");
    label.textContent = title;

    const preview = document.createElement("div");
    preview.className = "preview";
    preview.textContent = "Attach screenshot";

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.setAttribute("aria-label", `${title} screenshot`);
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) {
        preview.textContent = "Attach screenshot";
        return;
      }
      const img = document.createElement("img");
      img.alt = `${title} preview`;
      img.src = URL.createObjectURL(file);
      preview.innerHTML = "";
      preview.appendChild(img);
      savedChecks[id] = true;
      localStorage.setItem("pfsenseLabChecks", JSON.stringify(savedChecks));
      renderChecklist();
    });

    slot.append(label, preview, input);
    evidenceGrid.appendChild(slot);
  });
}

runTraffic.addEventListener("click", runFlow);
clearLogs.addEventListener("click", () => {
  logs = [];
  localStorage.setItem("pfsenseLabLogs", JSON.stringify(logs));
  renderLogs();
});
resetChecklist.addEventListener("click", () => {
  checklistItems.forEach(([id]) => {
    savedChecks[id] = false;
  });
  localStorage.setItem("pfsenseLabChecks", JSON.stringify(savedChecks));
  renderChecklist();
});

tickClock();
setInterval(tickClock, 1000);
renderChecklist();
renderLogs();
renderEvidenceSlots();
