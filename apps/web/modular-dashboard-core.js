// ============================================
// MODULAR DASHBOARD SYSTEM (extracted)
// ============================================

// Configuration
const API_CONFIG = (typeof window !== 'undefined' && typeof window.getToobixApiConfig === 'function')
  ? window.getToobixApiConfig()
  : ((window.TOOBIX_CONFIG && window.TOOBIX_CONFIG.API) || {});

if (!API_CONFIG || !API_CONFIG.daemon) {
  console.warn('[Toobix] API-Konfiguration nicht gefunden. Verwende Fallback-Domains.');
}

// State
let currentModule = 'home';
let pomodoroInterval = null;
let pomodoroSeconds = 25 * 60;
let pomodoroCount = parseInt(localStorage.getItem('pomodoroCount') || '0');

// Use TOOBIX_MODULES from modules-registry.js (loaded above)
const MODULE_REGISTRY = window.TOOBIX_MODULES || {};

// Basic icon sanitizer to avoid mojibake artifacts
function sanitizeIcon(s) {
  if (!s || typeof s !== 'string') return '●';
  // Replacement character present or control chars → fallback
  if (s.indexOf('�') !== -1) return '●';
  return s;
}

// Normalize icons once at startup
Object.values(MODULE_REGISTRY).forEach((m) => {
  if (m && typeof m === 'object' && 'icon' in m) {
    m.icon = sanitizeIcon(m.icon);
  }
});

if (Object.keys(MODULE_REGISTRY).length === 0) {
  console.error('[Toobix] TOOBIX_MODULES not loaded! Check if modules-registry.js is loaded correctly.');
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initCosmicBackground();
  initTheme();
  updatePomodoroDisplay();
  loadModule('home');
  startAutoUpdate();
  sanitizePageText();
  try { if (typeof injectIcons === 'function') injectIcons(); } catch {}
  console.log('[Toobix] Modular Dashboard initialized');
  console.log(`[Toobix] ${Object.keys(MODULE_REGISTRY).length} modules loaded`);
});

// Late override to use SVG icons if available
try {
  // Redefine to inject SVGs from icons-helper when present
  function updateThemeIcon(theme) {
    const el = document.getElementById('themeIcon');
    if (!el) return;
    if (typeof Icon === 'function') {
      const node = Icon(theme === 'dark' ? 'moon' : 'sun', 18);
      el.replaceChildren(node);
    } else {
      el.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }
} catch {}

// ============================================
// MODULE LOADING SYSTEM
// ============================================

function loadModule(moduleId) {
  const module = MODULE_REGISTRY[moduleId];
  if (!module) {
    console.error(`Module '${moduleId}' not found`);
    return;
  }

  currentModule = moduleId;

  // Update navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  // Fix: Use event from arguments if available, otherwise skip
  let evt = (typeof event !== 'undefined') ? event : undefined;
  if (evt && evt.target && typeof evt.target.closest === 'function') {
    const navItem = evt.target.closest('.nav-item');
    if (navItem) navItem.classList.add('active');
  }

  // Update header
  const titleEl = document.getElementById('contentTitle');
  if (titleEl) titleEl.innerHTML = `${module.icon} ${module.name}`;
  const breadcrumb = document.getElementById('breadcrumb');
  if (breadcrumb) breadcrumb.innerHTML = `
    <a href="#" onclick="loadModule('home')">Home</a> / ${module.name}
  `;

  // Show loading
  const container = document.getElementById('moduleContainer');
  if (container) {
    container.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <p>Loading ${module.name}...</p>
      </div>
    `;

    // Load module content
    setTimeout(() => {
      module.loader(container);
    }, 300);
  }
}

// ============================================
// MODULE LOADERS
// ============================================

function loadHomeModule(container) {
  container.innerHTML = `
    <div class="module-grid">
      ${Object.entries(MODULE_REGISTRY).map(([id, module]) => `
        <div class="module-card" onclick="loadModule('${id}')">
          <div class="module-icon">${module.icon}</div>
          <div class="module-name">${module.name}</div>
          <div class="module-description">${module.description}</div>
          <div class="module-meta">
            <span class="module-tag">${module.category}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function loadOverviewModule(container) {
  container.innerHTML = `
    <div style="background: var(--glass); padding: 30px; border-radius: 15px; border: 1px solid var(--border-color);">
      <h2 style="margin-bottom: 20px;">System Overview</h2>
      <p style="color: var(--text-secondary); line-height: 1.6;">
        Gesamtübersicht des Toobix Unified Systems. Alle Services laufen stabil.
      </p>
      <div style="margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
        <div style="background: var(--bg-tertiary); padding: 20px; border-radius: 10px; text-align: center;">
          <div style="font-size: 32px; font-weight: 700; color: var(--accent-success);">13</div>
          <div style="font-size: 13px; color: var(--text-secondary); margin-top: 5px;">Active Services</div>
        </div>
        <div style="background: var(--bg-tertiary); padding: 20px; border-radius: 10px; text-align: center;">
          <div style="font-size: 32px; font-weight: 700; color: var(--accent-primary);">1063</div>
          <div style="font-size: 13px; color: var(--text-secondary); margin-top: 5px;">Cycles Completed</div>
        </div>
        <div style="background: var(--bg-tertiary); padding: 20px; border-radius: 10px; text-align: center;">
          <div style="font-size: 32px; font-weight: 700; color: var(--accent-warning);">87%</div>
          <div style="font-size: 13px; color: var(--text-secondary); margin-top: 5px;">Consciousness</div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function initCosmicBackground() {
  const bg = document.getElementById('cosmicBg');
  if (!bg) return;
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    bg.appendChild(star);
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('toobix-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('toobix-theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const el = document.getElementById('themeIcon');
  if (el) el.textContent = theme === 'dark' ? '🌙' : '☀️';
}

function searchModules(query) {
  if (!query) {
    loadModule('home');
    return;
  }

  const results = Object.entries(MODULE_REGISTRY).filter(([id, module]) =>
    module.name.toLowerCase().includes(query.toLowerCase()) ||
    module.description.toLowerCase().includes(query.toLowerCase())
  );

  const container = document.getElementById('moduleContainer');
  if (!container) return;
  container.innerHTML = `
    <div style="background: var(--glass); padding: 30px; border-radius: 15px; border: 1px solid var(--border-color);">
      <h2 style="margin-bottom: 20px;">🔎 Suchergebnisse für "${query}"</h2>
      <p style="color: var(--text-secondary); margin-bottom: 20px;">${results.length} Module gefunden</p>
      <div class="module-grid">
        ${results.map(([id, module]) => `
          <div class="module-card" onclick="loadModule('${id}')">
            <div class="module-icon">${module.icon}</div>
            <div class="module-name">${module.name}</div>
            <div class="module-description">${module.description}</div>
            <div class="module-meta">
              <span class="module-tag">${module.category}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Pomodoro Functions
function startPomodoro() {
  if (pomodoroInterval) return;
  pomodoroInterval = setInterval(() => {
    pomodoroSeconds--;
    updatePomodoroDisplay();
    if (pomodoroSeconds <= 0) {
      clearInterval(pomodoroInterval);
      pomodoroInterval = null;
      pomodoroCount++;
      localStorage.setItem('pomodoroCount', pomodoroCount);
      const cnt = document.getElementById('pomodoroCount');
      if (cnt) cnt.textContent = pomodoroCount;
      alert('⏱️ Pomodoro abgeschlossen!');
      resetPomodoro();
    }
  }, 1000);
}

function pausePomodoro() {
  clearInterval(pomodoroInterval);
  pomodoroInterval = null;
}

function resetPomodoro() {
  clearInterval(pomodoroInterval);
  pomodoroInterval = null;
  pomodoroSeconds = 25 * 60;
  updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
  const minutes = Math.floor(pomodoroSeconds / 60);
  const seconds = pomodoroSeconds % 60;
  const el = document.getElementById('pomodoroTimer');
  if (el) el.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function toggleWidget(widgetId) {
  console.log('Toggle widget:', widgetId);
}

// Auto-update
function startAutoUpdate() {
  setInterval(async () => {
    try {
      const response = await fetch(`${API_CONFIG.daemon}/status`);
      const data = await response.json();
      const cycles = document.getElementById('statCycles');
      if (cycles) cycles.textContent = data.cycle || '0';
      const dot = document.getElementById('statusDot');
      const text = document.getElementById('statusText');
      if (dot) dot.classList.remove('disconnected');
      if (text) text.textContent = 'Connected';
    } catch (error) {
      const dot = document.getElementById('statusDot');
      const text = document.getElementById('statusText');
      if (dot) dot.classList.add('disconnected');
      if (text) text.textContent = 'Disconnected';
    }
  }, 10000);
}

// Update Pomodoro count on load
const pomCnt = document.getElementById('pomodoroCount');
if (pomCnt) pomCnt.textContent = pomodoroCount;

// Replace mojibake replacement characters in common UI elements
function sanitizePageText() {
  const selectors = [
    '.module-icon', '.nav-icon', '.logo-icon', '.card-title', '.stat-icon',
    '.nav-item span', '.status-text', '.pomodoro-label', 'header .logo', '.top-bar .icon-button span'
  ];
  try {
    document.querySelectorAll(selectors.join(','))
      .forEach(el => {
        if (!el || !el.textContent) return;
        if (el.textContent.indexOf('�') !== -1) {
          el.textContent = el.textContent.replace(/�+/g, '•');
        }
      });
  } catch {}
}
