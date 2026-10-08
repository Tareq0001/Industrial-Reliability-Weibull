/* ==========================================================================
   Industrial Reliability & Weibull Analytics V2 - Aurora Glass JS Core
   ========================================================================== */

const i18n = {
  en: {
    badgeEngine: "LUXURY AURORA GLASS · WEIBULL LIFE DATA & RCM",
    appTitle: "Weibull Analytics",
    appSub: "Aurora Studio V2",
    appDesc: "Life Data Distribution Modeling, Bathtub Hazard Physics & Optimal Age Replacement Policy (Tp*)",
    langLabel: "العربية",
    exportBtn: "Export Reliability Audit",
    presetsLabel: "Equipment Lifetime Presets:",
    presetBearings: "Roller Bearings (β=2.5, Wear-out)",
    presetSemi: "Microchips (β=0.75, Infant Mortality)",
    presetPower: "Power Units (β=1.0, Constant Random)",
    presetTurbines: "Turbine Blades (β=3.8, Rapid Ageing)",
    resetBtn: "Reset",
    kpiR: "Mission Reliability R(t)",
    kpiMTTF: "Mean Time to Failure (MTTF)",
    kpiHazard: "Hazard Rate h(t)",
    kpiHazardSub: "Failures / 1,000 hrs",
    kpiOptimal: "Optimal Replacement Tp*",
    paramsTitle: "Weibull Distribution Parameters",
    paramsDesc: "Calibrate shape factor, characteristic scale, mission time, and breakdown cost ratios.",
    paramBeta: "Shape Parameter (Beta)",
    paramEta: "Characteristic Life (Eta)",
    paramTime: "Mission Evaluation Time",
    paramCp: "Preventive (Cp)",
    paramCf: "Breakdown (Cf)",
    costRatio: "Penalty Ratio (Cf / Cp):",
    canvasTitle: "Reliability R(t) & Hazard Rate h(t)",
    canvasDesc: "Continuous decay curves rendered with high-DPR optical precision.",
    viewR: "R(t) & F(t)",
    viewH: "Hazard h(t)",
    legR: "Reliability R(t)",
    legF: "Unreliability F(t)",
    legT: "Target Mission t",
    legMTTF: "MTTF Mean Life",
    tabCost: "Optimal Age Replacement Policy C(T)",
    tabMedian: "Median Rank Empirical Fitting (Benard)",
    tabStrategy: "RCM Asset Maintenance Strategy",
    footerStatus: "Luxury Aurora Liquid Glass Reliability Engine V2"
  },
  ar: {
    badgeEngine: "نمط الزجاج السائل وشفق أورورا الفاخر · هندسة الموثوقية ووايبول",
    appTitle: "استوديو وايبول",
    appSub: "أورورا الفاخر V2",
    appDesc: "تحليل منحنى حوض الاستحمام، فيزياء الأعطال، وحساب العمر الأمثل للاستبدال الوقائي (Tp*)",
    langLabel: "English",
    exportBtn: "تصدير تقرير الموثوقية",
    presetsLabel: "نماذج الأصول الصناعية الجاهزة:",
    presetBearings: "رولمان بلي (β=2.5، نمط التآكل)",
    presetSemi: "رقائق إلكترونية (β=0.75، وفيات الرضع)",
    presetPower: "وحدات طاقة (β=1.0، أعطال عشوائية)",
    presetTurbines: "ريش توربينات (β=3.8، تقادم متسارع)",
    resetBtn: "إعادة تعيين",
    kpiR: "موثوقية المهمة R(t)",
    kpiMTTF: "متوسط الوقت حتى العطل (MTTF)",
    kpiHazard: "معدل الخطر اللحظي h(t)",
    kpiHazardSub: "أعطال لكل 1,000 ساعة",
    kpiOptimal: "العمر الأمثل للإحلال Tp*",
    paramsTitle: "معايير توزيع وايبول الهندسية",
    paramsDesc: "ضبط معامل الشكل بيتا، العمر المميز إيتا، زمن التشغيل، وغرامة العطل المفاجئ.",
    paramBeta: "معامل الشكل (بيتا β)",
    paramEta: "العمر المميز (إيتا η)",
    paramTime: "زمن تقييم المهمة (t)",
    paramCp: "الاستبدال الوقائي (Cp)",
    paramCf: "العطل والانهيار (Cf)",
    costRatio: "نسبة عقوبة العطل (Cf / Cp):",
    canvasTitle: "منحنى الموثوقية R(t) ومعدل الخطر h(t)",
    canvasDesc: "محاكاة فيزيائية حية لتلاشي الموثوقية ومعدل الأعطال بدقة عالية.",
    viewR: "الموثوقية R(t) والخلل F(t)",
    viewH: "معدل الخطر h(t)",
    legR: "الموثوقية R(t)",
    legF: "احتمالية الفشل F(t)",
    legT: "زمن المهمة المحدد t",
    legMTTF: "متوسط العمر MTTF",
    tabCost: "سياسة الاستبدال الوقائي المثلى C(T)",
    tabMedian: "بيانات رتب الفشل التجريبية (معادلة بينارد)",
    tabStrategy: "استراتيجية الصيانة المعتمدة على الموثوقية (RCM)",
    footerStatus: "محرك هندسة الموثوقية بنمط الزجاج السائل وشفق أورورا الفاخر V2"
  }
};

let currentLang = 'en';

let beta = 2.50;
let eta = 5000;
let timeTarget = 3000;
let costCp = 250;
let costCf = 2500;
let currentView = 'R';

function gamma(z) {
  const g = 7;
  const C = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109585720872, 9.9843695780195716e-6, 1.5056327351493116e-7
  ];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  z -= 1;
  let x = C[0];
  for (let i = 1; i < g + 2; i++) x += C[i] / (z + i);
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

function getReliability(t, b, a) { return Math.exp(-Math.pow(t / a, b)); }
function getHazardRate(t, b, a) { return t <= 0 ? 0 : (b / a) * Math.pow(t / a, b - 1); }
function getMTTF(b, a) { return a * gamma(1 + 1 / b); }

function computeOptimalReplacementAge(b, a, cp, cf) {
  if (b <= 1.0) return null;
  let minCostRate = Infinity;
  let bestT = a;
  const maxSearch = a * 2.5;
  const step = a / 300;
  let integralR = 0;
  let prevR = 1.0;

  for (let t = step; t <= maxSearch; t += step) {
    const curR = getReliability(t, b, a);
    integralR += ((prevR + curR) / 2) * step;
    prevR = curR;
    const costRate = (cp * curR + cf * (1 - curR)) / integralR;
    if (costRate < minCostRate) {
      minCostRate = costRate;
      bestT = t;
    }
  }
  return { optimalT: bestT, minCostRate };
}

const TEST_FAILURES = [
  { rank: 1, cycles: 1240 }, { rank: 2, cycles: 2150 }, { rank: 3, cycles: 2890 },
  { rank: 4, cycles: 3410 }, { rank: 5, cycles: 3980 }, { rank: 6, cycles: 4520 },
  { rank: 7, cycles: 5120 }, { rank: 8, cycles: 5890 }, { rank: 9, cycles: 6720 },
  { rank: 10, cycles: 8100 }
];

document.addEventListener('DOMContentLoaded', () => {
  setupLanguage();
  setupEventListeners();
  setupPresets();
  setupTabs();

  recalculateAll();

  initReliabilityCanvas();
  initCostCanvas();

  window.addEventListener('resize', () => {
    initReliabilityCanvas();
    initCostCanvas();
  });
});

function setupLanguage() {
  const toggle = document.getElementById('langToggle');
  toggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLang);
    document.getElementById('langLabel').textContent = i18n[currentLang].langLabel;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[currentLang][key]) {
        el.textContent = i18n[currentLang][key];
      }
    });

    recalculateAll();
  });
}

function setupEventListeners() {
  document.getElementById('sliderBeta').addEventListener('input', (e) => {
    beta = parseFloat(e.target.value);
    document.getElementById('valBeta').textContent = beta.toFixed(2);
    clearActivePreset();
    recalculateAll();
  });

  document.getElementById('sliderEta').addEventListener('input', (e) => {
    eta = parseFloat(e.target.value);
    document.getElementById('valEta').textContent = eta.toLocaleString() + ' hrs';
    clearActivePreset();
    recalculateAll();
  });

  document.getElementById('sliderTime').addEventListener('input', (e) => {
    timeTarget = parseFloat(e.target.value);
    document.getElementById('valTime').textContent = timeTarget.toLocaleString() + ' hrs';
    recalculateAll();
  });

  document.getElementById('sliderCp').addEventListener('input', (e) => {
    costCp = parseFloat(e.target.value);
    document.getElementById('valCp').textContent = '$' + costCp.toLocaleString();
    recalculateAll();
  });

  document.getElementById('sliderCf').addEventListener('input', (e) => {
    costCf = parseFloat(e.target.value);
    document.getElementById('valCf').textContent = '$' + costCf.toLocaleString();
    recalculateAll();
  });

  document.getElementById('btnViewReliability').addEventListener('click', () => {
    currentView = 'R';
    document.getElementById('btnViewReliability').classList.add('active');
    document.getElementById('btnViewHazard').classList.remove('active');
    drawReliabilityCanvas();
  });

  document.getElementById('btnViewHazard').addEventListener('click', () => {
    currentView = 'H';
    document.getElementById('btnViewHazard').classList.add('active');
    document.getElementById('btnViewReliability').classList.remove('active');
    drawReliabilityCanvas();
  });

  document.getElementById('resetDefaultsBtn').addEventListener('click', () => setPreset('bearings'));
  document.getElementById('exportReportBtn').addEventListener('click', exportAuditReport);
}

function clearActivePreset() {
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
}

function setupPresets() {
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setPreset(btn.getAttribute('data-preset'));
    });
  });
}

function setPreset(p) {
  if (p === 'bearings') {
    beta = 2.50; eta = 4500; timeTarget = 2800; costCp = 250; costCf = 3000;
  } else if (p === 'semiconductor') {
    beta = 0.75; eta = 8500; timeTarget = 4000; costCp = 80; costCf = 600;
  } else if (p === 'power-supply') {
    beta = 1.00; eta = 6000; timeTarget = 3000; costCp = 150; costCf = 1500;
  } else if (p === 'turbines') {
    beta = 3.80; eta = 12000; timeTarget = 9500; costCp = 800; costCf = 12000;
  }

  document.getElementById('sliderBeta').value = beta;
  document.getElementById('valBeta').textContent = beta.toFixed(2);
  document.getElementById('sliderEta').value = eta;
  document.getElementById('valEta').textContent = eta.toLocaleString() + ' hrs';
  document.getElementById('sliderTime').value = timeTarget;
  document.getElementById('valTime').textContent = timeTarget.toLocaleString() + ' hrs';
  document.getElementById('sliderCp').value = costCp;
  document.getElementById('valCp').textContent = '$' + costCp.toLocaleString();
  document.getElementById('sliderCf').value = costCf;
  document.getElementById('valCf').textContent = '$' + costCf.toLocaleString();

  recalculateAll();
}

function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.getAttribute('data-tab'));
      if (target) target.classList.add('active');
      if (btn.getAttribute('data-tab') === 'tabCostPolicy') drawCostCanvas();
    });
  });
}

function recalculateAll() {
  const rel = getReliability(timeTarget, beta, eta);
  document.getElementById('kpiR').textContent = (rel * 100).toFixed(1) + "%";
  document.getElementById('kpiRSub').textContent = `Unreliability: ${((1 - rel) * 100).toFixed(1)}%`;

  const mttf = getMTTF(beta, eta);
  document.getElementById('kpiMTTF').textContent = Math.round(mttf).toLocaleString() + " hrs";

  const hazard = getHazardRate(timeTarget, beta, eta) * 1000;
  document.getElementById('kpiHazard').textContent = hazard.toFixed(3);

  const optResult = computeOptimalReplacementAge(beta, eta, costCp, costCf);
  const kpiOptEl = document.getElementById('kpiOptimal');
  const kpiOptSub = document.getElementById('kpiOptimalSub');

  if (optResult && beta > 1.0) {
    kpiOptEl.textContent = Math.round(optResult.optimalT).toLocaleString() + " hrs";
    kpiOptSub.textContent = currentLang === 'ar' ? 'استبدال وقائي مبرر' : 'Proactive Replacement Age';
  } else {
    kpiOptEl.textContent = currentLang === 'ar' ? 'تشغيل حتى العطل' : 'Run to Failure';
    kpiOptSub.textContent = currentLang === 'ar' ? 'β ≤ 1.0 لا جدوى من الصيانة المجدولة' : 'β ≤ 1.0 (No wear-out advantage)';
  }

  document.getElementById('valCostRatio').textContent = (costCf / costCp).toFixed(1) + "×";

  updateRegimeBadge();
  renderPolicyInsights(optResult);
  renderMedianRankTable();
  renderRCMStrategy();

  drawReliabilityCanvas();
  drawCostCanvas();
}

function updateRegimeBadge() {
  const pill = document.getElementById('regimePill');
  const text = document.getElementById('regimeText');
  const dot = pill.querySelector('.pill-dot');

  if (beta < 0.95) {
    dot.style.background = 'var(--aurora-cyan)';
    dot.style.boxShadow = '0 0 10px var(--aurora-cyan)';
    text.textContent = currentLang === 'ar' ? 'مرحلة وفيات الرضع (β < 1.0)' : 'Infant Mortality (β < 1.0)';
  } else if (beta <= 1.05) {
    dot.style.background = 'var(--aurora-amber)';
    dot.style.boxShadow = '0 0 10px var(--aurora-amber)';
    text.textContent = currentLang === 'ar' ? 'مرحلة الأعطال العشوائية (β ≈ 1.0)' : 'Random Useful Life (β ≈ 1.0)';
  } else {
    dot.style.background = 'var(--aurora-rose)';
    dot.style.boxShadow = '0 0 10px var(--aurora-rose)';
    text.textContent = currentLang === 'ar' ? 'مرحلة التقادم والتآكل (β > 1.0)' : 'Wear-Out Regime (β > 1.0)';
  }
}

// Canvas
let relCanvas, relCtx;
function initReliabilityCanvas() {
  relCanvas = document.getElementById('reliabilityCanvas');
  if (!relCanvas) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = relCanvas.parentElement.getBoundingClientRect();
  relCanvas.width = rect.width * dpr;
  relCanvas.height = rect.height * dpr;
  relCtx = relCanvas.getContext('2d');
  relCtx.scale(dpr, dpr);
  drawReliabilityCanvas();
}

function drawReliabilityCanvas() {
  if (!relCanvas || !relCtx) return;
  const dpr = window.devicePixelRatio || 1;
  const w = relCanvas.width / dpr;
  const h = relCanvas.height / dpr;

  relCtx.clearRect(0, 0, w, h);

  const pad = { top: 25, right: 30, bottom: 40, left: 55 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;
  const maxT = Math.max(eta * 1.8, timeTarget * 1.3);

  // Background Grid
  relCtx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  relCtx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = pad.top + (plotH / 5) * i;
    relCtx.beginPath();
    relCtx.moveTo(pad.left, y);
    relCtx.lineTo(pad.left + plotW, y);
    relCtx.stroke();
  }

  if (currentView === 'R') {
    // R(t) Curve with Luminous Aurora Glow
    relCtx.beginPath();
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * maxT;
      const r = getReliability(t, beta, eta);
      const x = pad.left + (t / maxT) * plotW;
      const y = pad.top + (1 - r) * plotH;
      if (i === 0) relCtx.moveTo(x, y);
      else relCtx.lineTo(x, y);
    }
    relCtx.strokeStyle = "#06b6d4";
    relCtx.lineWidth = 3;
    relCtx.shadowColor = "#06b6d4";
    relCtx.shadowBlur = 10;
    relCtx.stroke();
    relCtx.shadowBlur = 0;

    // F(t) Curve
    relCtx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * maxT;
      const f = 1 - getReliability(t, beta, eta);
      const x = pad.left + (t / maxT) * plotW;
      const y = pad.top + (1 - f) * plotH;
      if (i === 0) relCtx.moveTo(x, y);
      else relCtx.lineTo(x, y);
    }
    relCtx.strokeStyle = "rgba(244, 63, 94, 0.6)";
    relCtx.lineWidth = 2;
    relCtx.setLineDash([4, 4]);
    relCtx.stroke();
    relCtx.setLineDash([]);
  } else {
    // Hazard View
    const maxH = Math.max(getHazardRate(maxT, beta, eta), getHazardRate(timeTarget, beta, eta)) * 1.2 || 0.005;
    relCtx.beginPath();
    const steps = 120;
    for (let i = 1; i <= steps; i++) {
      const t = (i / steps) * maxT;
      const hVal = getHazardRate(t, beta, eta);
      const x = pad.left + (t / maxT) * plotW;
      const y = pad.top + (1 - Math.min(1, hVal / maxH)) * plotH;
      if (i === 1) relCtx.moveTo(x, y);
      else relCtx.lineTo(x, y);
    }
    relCtx.strokeStyle = "#f59e0b";
    relCtx.lineWidth = 3;
    relCtx.stroke();
  }

  // Target Marker
  const tx = pad.left + (timeTarget / maxT) * plotW;
  if (tx <= pad.left + plotW) {
    relCtx.strokeStyle = "#fbbf24";
    relCtx.lineWidth = 1.5;
    relCtx.setLineDash([4, 4]);
    relCtx.beginPath();
    relCtx.moveTo(tx, pad.top); relCtx.lineTo(tx, pad.top + plotH);
    relCtx.stroke();
    relCtx.setLineDash([]);
  }
}

let costCanvas, costCtx;
function initCostCanvas() {
  costCanvas = document.getElementById('costPolicyCanvas');
  if (!costCanvas) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = costCanvas.parentElement.getBoundingClientRect();
  costCanvas.width = rect.width * dpr;
  costCanvas.height = 260 * dpr;
  costCtx = costCanvas.getContext('2d');
  costCtx.scale(dpr, dpr);
  drawCostCanvas();
}

function drawCostCanvas() {
  if (!costCanvas || !costCtx) return;
  const dpr = window.devicePixelRatio || 1;
  const w = costCanvas.width / dpr;
  const h = 260;

  costCtx.clearRect(0, 0, w, h);

  if (beta <= 1.0) {
    costCtx.fillStyle = "#94a3b8";
    costCtx.font = "13px Plus Jakarta Sans, sans-serif";
    costCtx.textAlign = "center";
    costCtx.fillText(
      currentLang === 'ar' ? 'لا يوجد عمر إحلال وقائي مثالي لأن β ≤ 1.0 (الأعطال عشوائية)' : 'No finite optimal replacement age for β ≤ 1.0 (Run-to-Failure is optimal)',
      w / 2, h / 2
    );
    return;
  }

  const opt = computeOptimalReplacementAge(beta, eta, costCp, costCf);
  if (!opt) return;

  const pad = { top: 20, right: 30, bottom: 35, left: 55 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;
  const maxT = eta * 1.5;
  const step = maxT / 80;

  const points = [];
  let integralR = 0;
  let prevR = 1.0;

  for (let t = step; t <= maxT; t += step) {
    const curR = getReliability(t, beta, eta);
    integralR += ((prevR + curR) / 2) * step;
    prevR = curR;
    points.push({ t, costRate: (costCp * curR + costCf * (1 - curR)) / integralR });
  }

  const maxC = Math.max(...points.map(p => p.costRate)) * 1.1;
  const minC = opt.minCostRate * 0.85;

  costCtx.beginPath();
  points.forEach((pt, idx) => {
    const x = pad.left + (pt.t / maxT) * plotW;
    const y = pad.top + ((maxC - pt.costRate) / (maxC - minC)) * plotH;
    if (idx === 0) costCtx.moveTo(x, y);
    else costCtx.lineTo(x, y);
  });
  costCtx.strokeStyle = "#f43f5e";
  costCtx.lineWidth = 2.5;
  costCtx.stroke();

  // Min point
  const mx = pad.left + (opt.optimalT / maxT) * plotW;
  const my = pad.top + ((maxC - opt.minCostRate) / (maxC - minC)) * plotH;

  costCtx.beginPath();
  costCtx.arc(mx, my, 5, 0, Math.PI * 2);
  costCtx.fillStyle = "#10b981";
  costCtx.fill();
  costCtx.strokeStyle = "#fff";
  costCtx.stroke();
}

function renderPolicyInsights(opt) {
  const box = document.getElementById('policyInsightsBox');
  if (beta <= 1.0 || !opt) {
    box.innerHTML = `
      <div style="color:var(--aurora-cyan); font-weight:700; margin-bottom:8px;">[POLICY: RUN-TO-FAILURE]</div>
      <p style="color:#94a3b8; font-size:12.5px; line-height:1.5;">Since shape parameter β ≤ 1.0, failure rate does not accelerate over operating time. Proactive replacement yields zero reliability gain. Enforce condition monitoring.</p>
    `;
    return;
  }

  const optAge = Math.round(opt.optimalT);
  box.innerHTML = `
    <div style="color:var(--aurora-rose); font-weight:700; margin-bottom:8px;">[POLICY: OPTIMAL AGE OVERHAUL]</div>
    <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
      <span style="color:#94a3b8;">Optimal Interval (Tp*):</span>
      <span style="color:var(--aurora-emerald); font-weight:800; font-family:var(--font-mono);">${optAge.toLocaleString()} hrs</span>
    </div>
    <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
      <span style="color:#94a3b8;">Minimum Cost Rate:</span>
      <span style="color:var(--aurora-cyan); font-weight:800; font-family:var(--font-mono);">$${opt.minCostRate.toFixed(2)}/hr</span>
    </div>
    <p style="color:#94a3b8; font-size:12px; margin-top:8px;">Replace asset strictly before ${optAge.toLocaleString()} operating hours to avoid the catastrophic failure penalty of $${costCf.toLocaleString()}.</p>
  `;
}

function renderMedianRankTable() {
  const table = document.getElementById('medianRankTable');
  let html = `<thead><tr><th>Rank</th><th>Failure Cycles</th><th>Benard's F(i)</th><th>Model Fitted R(t)</th></tr></thead><tbody>`;
  TEST_FAILURES.forEach(row => {
    const benardF = (row.rank - 0.3) / (TEST_FAILURES.length + 0.4);
    const modelR = getReliability(row.cycles, beta, eta);
    html += `<tr><td>#${row.rank}</td><td>${row.cycles.toLocaleString()} hrs</td><td>${(benardF * 100).toFixed(1)}%</td><td style="color:var(--aurora-cyan);">${(modelR * 100).toFixed(1)}%</td></tr>`;
  });
  html += `</tbody>`;
  table.innerHTML = html;
}

function renderRCMStrategy() {
  const grid = document.getElementById('rcmGrid');
  grid.innerHTML = `
    <div class="rcm-card ${beta < 0.95 ? 'active-regime' : ''}">
      <div style="font-weight:700; color:var(--aurora-cyan); margin-bottom:4px;">⚡ Infant Mortality (β < 1.0)</div>
      <p style="font-size:12px; color:#94a3b8;">Root cause manufacturing and installation errors. Execute Burn-in stress screening.</p>
    </div>
    <div class="rcm-card ${beta >= 0.95 && beta <= 1.05 ? 'active-regime' : ''}">
      <div style="font-weight:700; color:var(--aurora-amber); margin-bottom:4px;">🔌 Random Useful Life (β ≈ 1.0)</div>
      <p style="font-size:12px; color:#94a3b8;">Constant hazard rate. Age-based maintenance ineffective. Rely on telemetry.</p>
    </div>
    <div class="rcm-card ${beta > 1.05 ? 'active-regime' : ''}">
      <div style="font-weight:700; color:var(--aurora-rose); margin-bottom:4px;">⚙️ Wear-Out Aging (β > 1.0)</div>
      <p style="font-size:12px; color:#94a3b8;">Rapid mechanical wear. Apply mathematical Tp* overhaul policy for guaranteed cost savings.</p>
    </div>
  `;
}

function exportAuditReport() {
  const mttf = getMTTF(beta, eta);
  const rel = getReliability(timeTarget, beta, eta);
  const opt = computeOptimalReplacementAge(beta, eta, costCp, costCf);

  const reportLines = [
    "=========================================================",
    "      WEIBULL RELIABILITY & MAINTENANCE AUDIT REPORT",
    "      Luxury Aurora Liquid Glass Standard",
    "=========================================================",
    `Generated: ${new Date().toISOString()}`,
    `Author: Tareq Abu Ashee (أ. طارق ابوعشي)`,
    "",
    "ASSET LIFETIME PARAMETERS:",
    `  - Shape Parameter (Beta): ${beta.toFixed(2)}`,
    `  - Characteristic Life (Eta): ${eta.toLocaleString()} hrs`,
    `  - Mission Evaluation Time (t): ${timeTarget.toLocaleString()} hrs`,
    `  - Preventive Cost (Cp): $${costCp}`,
    `  - Breakdown Cost (Cf): $${costCf}`,
    "",
    "RELIABILITY EVALUATION:",
    `  - Mission Reliability R(t): ${(rel * 100).toFixed(2)}%`,
    `  - Mean Time to Failure (MTTF): ${Math.round(mttf).toLocaleString()} hrs`,
    `  - Instantaneous Hazard Rate: ${(getHazardRate(timeTarget, beta, eta) * 1000).toFixed(3)} failures / 1k hrs`,
    beta > 1.0 && opt ? `  - Optimal Replacement Age Tp*: ${Math.round(opt.optimalT).toLocaleString()} hrs` : `  - Recommended Strategy: Run-to-Failure (β <= 1.0)`
  ];

  const report = reportLines.join("\n");
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Weibull_Aurora_Audit_${Date.now()}.txt`;
  a.click();
}
