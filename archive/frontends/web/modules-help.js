'use strict';

(function addHelpModule(global) {
  try {
    if (!global || typeof global !== 'object') return;
    if (!global.TOOBIX_MODULES || typeof global.TOOBIX_MODULES !== 'object') return;

    const API = (typeof global.getToobixApiConfig === 'function')
      ? global.getToobixApiConfig()
      : ((global.TOOBIX_CONFIG && global.TOOBIX_CONFIG.API) || {});

    function bridgeBase() {
      try {
        const saved = global.localStorage ? global.localStorage.getItem('BRIDGE_URL') : '';
        return (saved && saved.trim()) ? saved.replace(/\/$/, '') : (API.bridge || 'http://localhost:3337');
      } catch {
        return (API.bridge || 'http://localhost:3337');
      }
    }

    global.TOOBIX_MODULES['help'] = {
      name: 'Hilfe',
      icon: 'ℹ️',
      description: 'Schnelleinstieg, Ports & Troubleshooting',
      category: 'Core',
      version: '1.0.0',
      author: 'Toobix System',
      dependencies: [],
      loader: function(container) {
        const ports = Object.entries(API || {}).map(([k, v]) => ({ key: k, url: String(v) }));
        const rows = ports.map(p => `<div style="display:flex; justify-content:space-between; gap:8px; padding:6px 0; border-bottom:1px solid var(--border-color);"><span style="font-family:monospace;">${p.key}</span><span style="color:var(--text-secondary)">${p.url}</span></div>`).join('');
        container.innerHTML = `
          <div class="card">
            <h2>ℹ️ Hilfe & Schnellstart</h2>
            <p style="color:var(--text-secondary); margin:6px 0 16px;">
              Zentrale Ressourcen für Start, Status und Fehlersuche.
            </p>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap:12px;">
              <a class="btn" href="../README.md" target="_blank" style="text-decoration:none; padding:10px; border:1px solid var(--border-color); border-radius:10px; background:var(--glass);">📘 Projekt-Readme</a>
              <a class="btn" href="../QUICK_START_NOW.md" target="_blank" style="text-decoration:none; padding:10px; border:1px solid var(--border-color); border-radius:10px; background:var(--glass);">⚡ Quick Start</a>
              <a class="btn" href="../SYSTEM_STATUS.md" target="_blank" style="text-decoration:none; padding:10px; border:1px solid var(--border-color); border-radius:10px; background:var(--glass);">🩺 System Status</a>
              <a class="btn" href="../SECURITY_PLAN.md" target="_blank" style="text-decoration:none; padding:10px; border:1px solid var(--border-color); border-radius:10px; background:var(--glass);">🔐 Security</a>
            </div>
            <div style="margin-top:18px;">
              <div style="font-weight:600; margin-bottom:6px;">Bridge</div>
              <div>Basis: <code>${bridgeBase()}</code></div>
            </div>
            <div style="margin-top:18px;">
              <div style="font-weight:600; margin-bottom:6px;">Services & Ports (aus API-Konfiguration)</div>
              <div>${rows || '<div style="color:var(--text-secondary)">Keine Konfiguration geladen</div>'}</div>
            </div>
          </div>
        `;
      }
    };
  } catch (e) {
    console.warn('[Toobix] Hilfe-Modul konnte nicht geladen werden:', e);
  }
})(typeof window !== 'undefined' ? window : this);

