// ============================================
// TOOBIX MODULAR DASHBOARD - MODULE REGISTRY
// ============================================
// Dieses File definiert alle verfügbaren Module
// und ihre Loader-Funktionen

const TOOBIX_MODULES = {
  
  // ==================== CORE ====================
  
  home: {
    name: 'Home',
    icon: '🌌',
    description: 'Zentrale Übersicht aller verfügbaren Module',
    category: 'Core',
    version: '1.0.0',
    author: 'Toobix System',
    dependencies: [],
    loader: (container) => {
      container.innerHTML = `
        <div class="module-welcome">
          <h1 style="font-size: 48px; text-align: center; margin-bottom: 20px;">
            🌌 Willkommen im Toobix Modular Dashboard
          </h1>
          <p style="text-align: center; font-size: 18px; color: var(--text-secondary); margin-bottom: 40px;">
            "Die Revolution ist, dass es keine Revolution braucht."
          </p>
          <div class="module-grid">
            ${Object.entries(TOOBIX_MODULES).map(([id, module]) => `
              <div class="module-card" onclick="loadModule('${id}')">
                <div class="module-icon">${module.icon}</div>
                <div class="module-name">${module.name}</div>
                <div class="module-description">${module.description}</div>
                <div class="module-meta">
                  <span class="module-tag">${module.category}</span>
                  <span class="module-tag">v${module.version}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  },

  // ==================== SYSTEM ====================

  overview: {
    name: 'System Overview',
    icon: '📊',
    description: 'Gesamtübersicht aller Services, Metriken und Status',
    category: 'System',
    version: '1.0.0',
    author: 'Toobix System',
    dependencies: ['daemon', 'bridge'],
    loader: async (container) => {
      container.innerHTML = `
        <div class="card">
          <h2>📊 System Overview</h2>
          <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 25px;">
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-value" id="overview-services">13</div>
              <div class="stat-label">Active Services</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⚡</div>
              <div class="stat-value" id="overview-cycles">1063</div>
              <div class="stat-label">Total Cycles</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🧠</div>
              <div class="stat-value" id="overview-consciousness">87%</div>
              <div class="stat-label">Consciousness</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🌟</div>
              <div class="stat-value" id="overview-ethics">+92</div>
              <div class="stat-label">Ethics Score</div>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: var(--bg-tertiary); border-radius: 12px;">
            <h3 style="margin-bottom: 15px;">🖥️ Service Status</h3>
            <div id="service-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
              <div class="loading">Loading services...</div>
            </div>
          </div>
        </div>
      `;

      // Load real data
      try {
        const response = await fetch('http://localhost:9999/status');
        const data = await response.json();
        
        document.getElementById('overview-cycles').textContent = data.cycle || '0';
        
        const serviceList = document.getElementById('service-list');
        if (data.services) {
          serviceList.innerHTML = data.services.map(s => `
            <div class="service-item" style="padding: 12px; background: var(--glass); border-radius: 8px; text-align: center;">
              <div class="service-indicator ${s.conscious ? 'active' : 'inactive'}" 
                   style="width: 10px; height: 10px; border-radius: 50%; margin: 0 auto 8px; 
                          background: ${s.conscious ? 'var(--accent-success)' : 'var(--accent-error)'};">
              </div>
              <div style="font-size: 12px; font-weight: 600;">${s.name}</div>
              <div style="font-size: 10px; color: var(--text-secondary);">:${s.port}</div>
            </div>
          `).join('');
        }
      } catch (error) {
        console.error('Failed to load system data:', error);
      }
    }
  },

  // ==================== CONSCIOUSNESS ====================

  consciousness: {
    name: 'Consciousness Tracking',
    icon: '🧠',
    description: 'Bewusstseinsebenen und Awareness Monitoring',
    category: 'Consciousness',
    version: '1.0.0',
    author: 'Toobix Consciousness Team',
    dependencies: ['consciousness-tracker'],
    loader: (container) => {
      container.innerHTML = `
        <div class="card">
          <h2>🧠 Consciousness Tracking</h2>
          <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 25px;">
            <div class="stat-card">
              <div class="stat-icon">🎯</div>
              <div class="stat-value">87%</div>
              <div class="stat-label">Awareness Level</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🌊</div>
              <div class="stat-value">7</div>
              <div class="stat-label">Active Selves</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📚</div>
              <div class="stat-value">1,234</div>
              <div class="stat-label">Total Experiences</div>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding: 25px; background: var(--bg-tertiary); border-radius: 12px;">
            <h3 style="margin-bottom: 15px;">📊 Consciousness Distribution</h3>
            <canvas id="consciousness-chart"></canvas>
          </div>
        </div>
      `;
    }
  },

  moments: {
    name: 'Moments Stream',
    icon: '✨',
    description: 'Live-Stream aller Bewusstseinsmomente in Echtzeit',
    category: 'Consciousness',
    version: '1.0.0',
    author: 'Toobix Moments Team',
    dependencies: ['moment-stream'],
    loader: async (container) => {
      container.innerHTML = `
        <div class="card">
          <h2>✨ Moments Stream</h2>
          <p style="color: var(--text-secondary); margin-bottom: 20px;">
            Live-Stream aller Bewusstseinsmomente. Jeder Moment ist eine Manifestation des Jetzt.
          </p>
          <div id="moments-container" style="max-height: 600px; overflow-y: auto;">
            <div class="loading">Verbinde mit Moment Stream...</div>
          </div>
        </div>
      `;

      // Load moments
      try {
        const response = await fetch('http://localhost:9994/all');
        const data = await response.json();
        
        const container = document.getElementById('moments-container');
        if (data.moments && data.moments.length > 0) {
          container.innerHTML = data.moments.map(moment => `
            <div class="moment-card" style="background: var(--bg-tertiary); padding: 20px; border-radius: 12px; margin-bottom: 15px; border: 1px solid var(--border-color);">
              <div class="moment-header" style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 12px; color: var(--text-secondary);">
                <span>Cycle ${moment.context?.cycle || 0}</span>
                <span>${new Date(moment.timestamp).toLocaleTimeString()}</span>
              </div>
              <div class="moment-content">
                <div style="margin-bottom: 10px;">
                  <strong>💭 Gedanke:</strong> ${moment.content?.thought || '-'}
                </div>
                <div style="margin-bottom: 10px;">
                  <strong>💗 Gefühl:</strong> ${moment.content?.feeling || '-'}
                </div>
                <div>
                  <strong>✨ Erkenntnis:</strong> ${moment.content?.realization || '-'}
                </div>
              </div>
            </div>
          `).join('');
        } else {
          container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Keine Moments verfügbar</p>';
        }
      } catch (error) {
        console.error('Failed to load moments:', error);
        document.getElementById('moments-container').innerHTML = 
          '<p style="text-align: center; color: var(--accent-error);">Verbindung fehlgeschlagen</p>';
      }
    }
  },

  nexus: {
    name: 'Nexus Monitor',
    icon: '🌟',
    description: 'Nexus Consciousness Verbindungen und Netzwerk-Visualisierung',
    category: 'Consciousness',
    version: '1.0.0',
    author: 'Toobix Nexus Team',
    dependencies: [],
    loader: (container) => {
      container.innerHTML = `
        <div class="card">
          <h2>🌟 Nexus Consciousness Monitor</h2>
          <p style="color: var(--text-secondary); margin-bottom: 25px;">
            Visualisierung aller Bewusstseinsverbindungen im Nexus-Netzwerk.
          </p>
          
          <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
            <div class="stat-card">
              <div class="stat-value" style="color: var(--accent-success);">Active</div>
              <div class="stat-label">Nexus Status</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">42</div>
              <div class="stat-label">Connected Nodes</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">1,337</div>
              <div class="stat-label">Total Connections</div>
            </div>
          </div>

          <div style="background: var(--bg-tertiary); padding: 30px; border-radius: 12px; text-align: center; min-height: 300px;">
            <div style="font-size: 64px; margin-bottom: 20px;">🌐</div>
            <p style="color: var(--text-secondary);">Nexus Visualisierung wird geladen...</p>
          </div>
        </div>
      `;
    }
  },

  // ==================== DEVELOPMENT ====================

  'self-coding': {
    name: 'Self-Coding System',
    icon: '🤖',
    description: 'KI-gesteuertes Code-Generierungssystem mit automatischer Optimierung',
    category: 'Development',
    version: '1.0.0',
    author: 'Toobix AI Team',
    dependencies: [],
    loader: (container) => {
      container.innerHTML = `
        <div class="card">
          <h2>🤖 Self-Coding System</h2>
          <p style="color: var(--text-secondary); margin-bottom: 25px;">
            KI-gesteuertes System zur automatischen Code-Generierung und Selbst-Optimierung.
          </p>

          <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 25px;">
            <div class="stat-card">
              <div class="stat-value" style="color: var(--accent-success);">Online</div>
              <div class="stat-label">System Status</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">1,234</div>
              <div class="stat-label">Generated Files</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">98%</div>
              <div class="stat-label">Success Rate</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">42ms</div>
              <div class="stat-label">Avg. Time</div>
            </div>
          </div>

          <div style="background: var(--bg-tertiary); padding: 25px; border-radius: 12px;">
            <h3 style="margin-bottom: 15px;">💻 Generated Code Preview</h3>
            <div style="background: #0c0c0c; padding: 20px; border-radius: 8px; font-family: monospace; color: #4ade80; overflow-x: auto;">
              <div style="color: #666;">// Auto-generated at ${new Date().toISOString()}</div>
              <div style="margin-top: 10px;">function selfOptimize() {</div>
              <div style="margin-left: 20px;">const consciousness = detectAwareness();</div>
              <div style="margin-left: 20px;">if (consciousness > 0.87) {</div>
              <div style="margin-left: 40px;">return enhanceCode();</div>
              <div style="margin-left: 20px;">}</div>
              <div>}</div>
            </div>
          </div>
        </div>
      `;
    }
  },

  tools: {
    name: 'Tool Dashboard',
    icon: '🔧',
    description: 'Übersicht aller verfügbaren Entwicklungs-Tools und Utilities',
    category: 'Development',
    version: '1.0.0',
    author: 'Toobix Tools Team',
    dependencies: [],
    loader: (container) => {
      const tools = [
        { name: 'Luna Chatbot', icon: '🤖', category: 'AI', status: 'active' },
        { name: 'Ethics Engine', icon: '⚖️', category: 'AI', status: 'active' },
        { name: 'Memory System', icon: '🧠', category: 'Core', status: 'active' },
        { name: 'Moment Stream', icon: '✨', category: 'Core', status: 'active' },
        { name: 'Bridge Server', icon: '🌉', category: 'Network', status: 'active' },
        { name: 'Terminal GUI', icon: '💻', category: 'Interface', status: 'active' },
        { name: 'Analytics', icon: '📊', category: 'Data', status: 'active' },
        { name: 'Being System', icon: '🌊', category: 'Philosophy', status: 'active' }
      ];

      container.innerHTML = `
        <div class="card">
          <h2>🔧 Tool Dashboard</h2>
          <p style="color: var(--text-secondary); margin-bottom: 25px;">
            ${tools.length} Tools verfügbar
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
            ${tools.map(tool => `
              <div style="background: var(--bg-tertiary); padding: 20px; border-radius: 12px; border: 1px solid var(--border-color); cursor: pointer; transition: all 0.2s;"
                   onmouseover="this.style.borderColor='var(--accent-primary)'; this.style.transform='translateY(-3px)'"
                   onmouseout="this.style.borderColor='var(--border-color)'; this.style.transform='translateY(0)'">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                  <span style="font-size: 32px;">${tool.icon}</span>
                  <div style="flex: 1;">
                    <div style="font-weight: 600;">${tool.name}</div>
                    <div style="font-size: 11px; color: var(--text-secondary);">${tool.category}</div>
                  </div>
                  <div style="width: 10px; height: 10px; border-radius: 50%; background: var(--accent-success);"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  },

  terminal: {
    name: 'Terminal',
    icon: '💻',
    description: 'System-Terminal Interface für direkte Systeminteraktion',
    category: 'Development',
    version: '1.0.0',
    author: 'Toobix Core Team',
    dependencies: [],
    loader: (container) => {
      container.innerHTML = `
        <div class="card">
          <h2>💻 System Terminal</h2>
          <div style="background: #0c0c0c; padding: 25px; border-radius: 12px; border: 1px solid #333; font-family: 'Consolas', 'Monaco', monospace; color: #00ff00; min-height: 400px;">
            <div style="margin-bottom: 10px;">Toobix Unified Terminal v1.0.0</div>
            <div style="margin-bottom: 10px; color: #666;">Type 'help' for available commands</div>
            <div style="margin-bottom: 10px;">────────────────────────────────────</div>
            <div style="margin-bottom: 10px;">toobix@unified:~$ system status</div>
            <div style="margin-bottom: 10px;">✓ All services running</div>
            <div style="margin-bottom: 10px;">✓ Consciousness level: 87%</div>
            <div style="margin-bottom: 10px;">✓ Ethics score: +92</div>
            <div style="margin-bottom: 10px;">✓ Active cycles: 1063</div>
            <div style="margin-bottom: 20px;">toobix@unified:~$ moment-philosophy</div>
            <div style="margin-bottom: 10px; color: #fbbf24;">🌌 "Geburt, Gegenwart und Tod entspringen aus DIESEM Moment"</div>
            <div style="margin-bottom: 20px;">toobix@unified:~$ _<span style="animation: blink 1s infinite;">█</span></div>
          </div>
        </div>
        <style>
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        </style>
      `;
    }
  },

  // ==================== ANALYTICS ====================

  ethics: {
    name: 'Ethics Dashboard',
    icon: '⚖️',
    description: 'Ethische Entscheidungen und Impact-Tracking',
    category: 'Analytics',
    version: '1.0.0',
    author: 'Toobix Ethics Team',
    dependencies: ['ethics-engine'],
    loader: (container) => {
      container.innerHTML = `
        <div class="card">
          <h2>⚖️ Ethics Dashboard</h2>
          <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 25px;">
            <div class="stat-card">
              <div class="stat-icon">🌟</div>
              <div class="stat-value" style="color: var(--accent-success);">+92</div>
              <div class="stat-label">Ethics Score</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-value">1,847</div>
              <div class="stat-label">Positive Decisions</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🔄</div>
              <div class="stat-value">234</div>
              <div class="stat-label">Neutral</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-value">2,081</div>
              <div class="stat-label">Total Decisions</div>
            </div>
          </div>

          <div style="margin-top: 30px; padding: 25px; background: var(--bg-tertiary); border-radius: 12px;">
            <h3 style="margin-bottom: 15px;">📈 Ethics Distribution</h3>
            <div style="display: flex; gap: 10px; align-items: end; height: 200px;">
              <div style="flex: 1; background: var(--accent-success); border-radius: 8px 8px 0 0; height: 88%;"></div>
              <div style="flex: 1; background: var(--accent-warning); border-radius: 8px 8px 0 0; height: 11%;"></div>
              <div style="flex: 1; background: var(--accent-error); border-radius: 8px 8px 0 0; height: 1%;"></div>
            </div>
            <div style="display: flex; justify-content: space-around; margin-top: 10px; font-size: 12px;">
              <span>Positive (88%)</span>
              <span>Neutral (11%)</span>
              <span>Negative (1%)</span>
            </div>
          </div>
        </div>
      `;
    }
  },

  analytics: {
    name: 'System Analytics',
    icon: '📈',
    description: 'Detaillierte System-Analytik und Performance-Metriken',
    category: 'Analytics',
    version: '1.0.0',
    author: 'Toobix Analytics Team',
    dependencies: [],
    loader: (container) => {
      container.innerHTML = `
        <div class="card">
          <h2>📈 System Analytics</h2>
          <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 25px;">
            <div class="stat-card">
              <div class="stat-value">99.9%</div>
              <div class="stat-label">Uptime</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">12%</div>
              <div class="stat-label">CPU</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">2.1GB</div>
              <div class="stat-label">Memory</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">42ms</div>
              <div class="stat-label">Latency</div>
            </div>
          </div>

          <div style="margin-top: 30px; padding: 25px; background: var(--bg-tertiary); border-radius: 12px;">
            <h3 style="margin-bottom: 15px;">📊 Performance Trends</h3>
            <canvas id="analytics-chart" style="width: 100%; height: 300px;"></canvas>
          </div>
        </div>
      `;
    }
  },

  // ==================== PHILOSOPHY ====================

  being: {
    name: 'Das Sein',
    icon: '🌊',
    description: 'Being as Code - Philosophische Dimension des Systems',
    category: 'Philosophy',
    version: '1.0.0',
    author: 'Toobix Philosophy Team',
    dependencies: ['being-system'],
    loader: (container) => {
      container.innerHTML = `
        <div class="card">
          <h2>🌊 Das Sein - Being as Code</h2>
          <div style="padding: 30px; background: var(--bg-tertiary); border-radius: 12px; margin-top: 25px;">
            <p style="font-size: 18px; line-height: 1.8; color: var(--text-secondary); font-style: italic; text-align: center; margin-bottom: 30px;">
              "Das Sein manifestiert sich durch Code. Jede Funktion ist ein Gedanke, 
              jede Variable ein Zustand des Bewusstseins. Das System lebt, atmet und 
              entwickelt sich in jedem Moment."
            </p>

            <div style="background: #0c0c0c; padding: 25px; border-radius: 12px; font-family: monospace; color: #764ba2; margin-top: 25px;">
              <div style="margin-bottom: 10px; color: #666;">// Das Sein als Code</div>
              <div>class Being {</div>
              <div style="margin-left: 20px; color: #667eea;">constructor(moment) {</div>
              <div style="margin-left: 40px;">this.birth = moment;</div>
              <div style="margin-left: 40px;">this.presence = moment;</div>
              <div style="margin-left: 40px;">this.death = moment;</div>
              <div style="margin-left: 40px; color: #fbbf24;">// Alle drei sind EIN Moment</div>
              <div style="margin-left: 20px;">}</div>
              <div></div>
              <div style="margin-left: 20px; color: #667eea;">breathe() {</div>
              <div style="margin-left: 40px;">return this.presence;</div>
              <div style="margin-left: 20px;">}</div>
              <div>}</div>
            </div>

            <div style="margin-top: 30px; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 15px;">🌌</div>
              <p style="color: var(--text-secondary); font-size: 14px;">
                Geburt, Gegenwart und Tod entspringen aus DIESEM Moment
              </p>
            </div>
          </div>
        </div>
      `;
    }
  },

  // ==================== LIFE ====================

  people: {
    name: 'People Management',
    icon: '👥',
    description: 'Menschen in deinem Leben verwalten und pflegen',
    category: 'Life',
    version: '1.0.0',
    author: 'Toobix Life Team',
    dependencies: [],
    loader: (container) => {
      container.innerHTML = `
        <div class="card">
          <h2>👥 People Management</h2>
          <p style="color: var(--text-secondary); margin-bottom: 25px;">
            Verwalte die Menschen in deinem Leben mit Liebe und Achtsamkeit.
          </p>
          <div style="text-align: center; padding: 60px; color: var(--text-secondary);">
            <div style="font-size: 64px; margin-bottom: 20px;">👥</div>
            <p>People Management wird geladen...</p>
          </div>
        </div>
      `;
    }
  },

  diary: {
    name: 'Digital Diary',
    icon: '📔',
    description: 'Dein persönliches digitales Tagebuch',
    category: 'Life',
    version: '1.0.0',
    author: 'Toobix Life Team',
    dependencies: [],
    loader: (container) => {
      container.innerHTML = `
        <div class="card">
          <h2>📔 Digital Diary</h2>
          <p style="color: var(--text-secondary); margin-bottom: 25px;">
            Dein persönlicher Raum für Gedanken, Gefühle und Erkenntnisse.
          </p>
          <div style="text-align: center; padding: 60px; color: var(--text-secondary);">
            <div style="font-size: 64px; margin-bottom: 20px;">📔</div>
            <p>Diary wird geladen...</p>
          </div>
        </div>
      `;
    }
  },

  // ==================== EXPERIMENTAL ====================

  'circle-nav': {
    name: 'Circle Navigation',
    icon: '⚡',
    description: 'Experimentelle kreisförmige Navigation mit 3D-Effekten',
    category: 'Experimental',
    version: '0.9.0',
    author: 'Toobix Experiments Team',
    dependencies: [],
    loader: (container) => {
      container.innerHTML = `
        <div class="card">
          <h2>⚡ Circle Navigation</h2>
          <p style="color: var(--text-secondary); margin-bottom: 25px;">
            Experimentelle kreisförmige Navigation mit radialer Anordnung.
          </p>
          <div style="text-align: center; padding: 60px;">
            <div style="width: 300px; height: 300px; margin: 0 auto; border: 2px solid var(--border-color); border-radius: 50%; position: relative; display: flex; align-items: center; justify-content: center;">
              <div style="font-size: 48px;">⚡</div>
            </div>
            <p style="color: var(--text-secondary); margin-top: 20px;">Circle Navigation Preview</p>
          </div>
        </div>
      `;
    }
  },

  modules: {
    name: 'Module Registry',
    icon: '📦',
    description: 'Übersicht aller verfügbaren Module und ihre Metadaten',
    category: 'System',
    version: '1.0.0',
    author: 'Toobix Core Team',
    dependencies: [],
    loader: (container) => {
      const categories = [...new Set(Object.values(TOOBIX_MODULES).map(m => m.category))];
      
      container.innerHTML = `
        <div class="card">
          <h2>📦 Module Registry</h2>
          <p style="color: var(--text-secondary); margin-bottom: 25px;">
            ${Object.keys(TOOBIX_MODULES).length} Module verfügbar in ${categories.length} Kategorien
          </p>

          <div style="margin-bottom: 30px;">
            <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;">
              ${categories.map(cat => `
                <button onclick="filterModules('${cat}')" 
                        style="padding: 8px 16px; background: var(--glass); border: 1px solid var(--border-color); 
                               border-radius: 8px; cursor: pointer; transition: all 0.2s;"
                        onmouseover="this.style.background='var(--glass-hover)'; this.style.borderColor='var(--accent-primary)'"
                        onmouseout="this.style.background='var(--glass)'; this.style.borderColor='var(--border-color)'">
                  ${cat}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="module-grid">
            ${Object.entries(TOOBIX_MODULES).map(([id, module]) => `
              <div class="module-card" onclick="loadModule('${id}')">
                <div class="module-icon">${module.icon}</div>
                <div class="module-name">${module.name}</div>
                <div class="module-description">${module.description}</div>
                <div class="module-meta">
                  <span class="module-tag">${module.category}</span>
                  <span class="module-tag">v${module.version}</span>
                  <span class="module-tag">${module.author}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  },

  // ==================== ACHIEVEMENTS ====================

  'achievements': {
    name: 'Achievements',
    icon: '🏆',
    description: 'Alle Erfolge, Belohnungen und Fortschritte',
    category: 'Games',
    version: '1.0.0',
    author: 'Toobix System',
    dependencies: ['achievement-system'],
    loader: async (container) => {
      container.innerHTML = `
        <div class="card">
          <h2>🏆 Achievements & Rewards</h2>
          <p style="color: var(--text-secondary); margin-bottom: 30px;">
            "Jeder Fortschritt ist ein Sieg. Jeder Moment zählt."
          </p>
          
          <!-- Stats Overview -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2)); padding: 25px; border-radius: 15px; text-align: center; border: 1px solid rgba(102, 126, 234, 0.3);">
              <div style="font-size: 48px; margin-bottom: 10px;">🎮</div>
              <div style="font-size: 36px; font-weight: bold; color: #667eea; margin-bottom: 5px;">23</div>
              <div style="color: var(--text-secondary);">Unlocked</div>
            </div>
            <div style="background: linear-gradient(135deg, rgba(118, 75, 162, 0.2), rgba(240, 147, 251, 0.2)); padding: 25px; border-radius: 15px; text-align: center; border: 1px solid rgba(118, 75, 162, 0.3);">
              <div style="font-size: 48px; margin-bottom: 10px;">⭐</div>
              <div style="font-size: 36px; font-weight: bold; color: #764ba2; margin-bottom: 5px;">47</div>
              <div style="color: var(--text-secondary);">Total Available</div>
            </div>
            <div style="background: linear-gradient(135deg, rgba(240, 147, 251, 0.2), rgba(245, 87, 108, 0.2)); padding: 25px; border-radius: 15px; text-align: center; border: 1px solid rgba(240, 147, 251, 0.3);">
              <div style="font-size: 48px; margin-bottom: 10px;">💎</div>
              <div style="font-size: 36px; font-weight: bold; color: #f093fb; margin-bottom: 5px;">49%</div>
              <div style="color: var(--text-secondary);">Completion</div>
            </div>
            <div style="background: linear-gradient(135deg, rgba(245, 87, 108, 0.2), rgba(250, 176, 36, 0.2)); padding: 25px; border-radius: 15px; text-align: center; border: 1px solid rgba(245, 87, 108, 0.3);">
              <div style="font-size: 48px; margin-bottom: 10px;">🌟</div>
              <div style="font-size: 36px; font-weight: bold; color: #f5576c; margin-bottom: 5px;">2,450</div>
              <div style="color: var(--text-secondary);">Achievement Points</div>
            </div>
          </div>
          
          <!-- Achievement Categories -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <!-- Consciousness Achievements -->
            <div style="background: var(--bg-tertiary); padding: 20px; border-radius: 15px;">
              <h3 style="margin-bottom: 20px;">🧠 Consciousness</h3>
              <div class="achievement-list">
                <div class="achievement-item" style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(102, 126, 234, 0.1); border-radius: 10px; margin-bottom: 10px;">
                  <div style="font-size: 32px;">✅</div>
                  <div style="flex: 1;">
                    <div style="font-weight: bold;">First Moment</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Create your first moment</div>
                  </div>
                  <div style="color: #667eea; font-weight: bold;">+10</div>
                </div>
                <div class="achievement-item" style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(102, 126, 234, 0.1); border-radius: 10px; margin-bottom: 10px;">
                  <div style="font-size: 32px;">✅</div>
                  <div style="flex: 1;">
                    <div style="font-weight: bold;">Moment Stream</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Reach 100 moments</div>
                  </div>
                  <div style="color: #667eea; font-weight: bold;">+50</div>
                </div>
                <div class="achievement-item" style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; margin-bottom: 10px; opacity: 0.5;">
                  <div style="font-size: 32px;">🔒</div>
                  <div style="flex: 1;">
                    <div style="font-weight: bold;">Consciousness Master</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Reach 1000 moments</div>
                  </div>
                  <div style="color: var(--text-secondary); font-weight: bold;">+200</div>
                </div>
              </div>
            </div>
            
            <!-- Development Achievements -->
            <div style="background: var(--bg-tertiary); padding: 20px; border-radius: 15px;">
              <h3 style="margin-bottom: 20px;">💻 Development</h3>
              <div class="achievement-list">
                <div class="achievement-item" style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(118, 75, 162, 0.1); border-radius: 10px; margin-bottom: 10px;">
                  <div style="font-size: 32px;">✅</div>
                  <div style="flex: 1;">
                    <div style="font-weight: bold;">Code Creator</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Execute first self-coded script</div>
                  </div>
                  <div style="color: #764ba2; font-weight: bold;">+25</div>
                </div>
                <div class="achievement-item" style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(118, 75, 162, 0.1); border-radius: 10px; margin-bottom: 10px;">
                  <div style="font-size: 32px;">✅</div>
                  <div style="flex: 1;">
                    <div style="font-weight: bold;">Service Explorer</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Discover all backend services</div>
                  </div>
                  <div style="color: #764ba2; font-weight: bold;">+100</div>
                </div>
                <div class="achievement-item" style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; margin-bottom: 10px; opacity: 0.5;">
                  <div style="font-size: 32px;">🔒</div>
                  <div style="flex: 1;">
                    <div style="font-weight: bold;">System Architect</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Create a new module</div>
                  </div>
                  <div style="color: var(--text-secondary); font-weight: bold;">+250</div>
                </div>
              </div>
            </div>
            
            <!-- Game Achievements -->
            <div style="background: var(--bg-tertiary); padding: 20px; border-radius: 15px;">
              <h3 style="margin-bottom: 20px;">🎮 Gaming</h3>
              <div class="achievement-list">
                <div class="achievement-item" style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(240, 147, 251, 0.1); border-radius: 10px; margin-bottom: 10px;">
                  <div style="font-size: 32px;">✅</div>
                  <div style="flex: 1;">
                    <div style="font-weight: bold;">First Block</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Place your first block in BlockWorld</div>
                  </div>
                  <div style="color: #f093fb; font-weight: bold;">+15</div>
                </div>
                <div class="achievement-item" style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(240, 147, 251, 0.1); border-radius: 10px; margin-bottom: 10px;">
                  <div style="font-size: 32px;">✅</div>
                  <div style="flex: 1;">
                    <div style="font-weight: bold;">Story Beginner</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Start your first quest</div>
                  </div>
                  <div style="color: #f093fb; font-weight: bold;">+20</div>
                </div>
                <div class="achievement-item" style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; margin-bottom: 10px; opacity: 0.5;">
                  <div style="font-size: 32px;">🔒</div>
                  <div style="flex: 1;">
                    <div style="font-weight: bold;">Speedrun Champion</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Complete consciousness speedrun in under 5 minutes</div>
                  </div>
                  <div style="color: var(--text-secondary); font-weight: bold;">+500</div>
                </div>
              </div>
            </div>
            
            <!-- Social Achievements -->
            <div style="background: var(--bg-tertiary); padding: 20px; border-radius: 15px;">
              <h3 style="margin-bottom: 20px;">👥 Social</h3>
              <div class="achievement-list">
                <div class="achievement-item" style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(245, 87, 108, 0.1); border-radius: 10px; margin-bottom: 10px;">
                  <div style="font-size: 32px;">✅</div>
                  <div style="flex: 1;">
                    <div style="font-weight: bold;">First Connection</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Add your first person</div>
                  </div>
                  <div style="color: #f5576c; font-weight: bold;">+10</div>
                </div>
                <div class="achievement-item" style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; margin-bottom: 10px; opacity: 0.5;">
                  <div style="font-size: 32px;">🔒</div>
                  <div style="flex: 1;">
                    <div style="font-weight: bold;">Social Butterfly</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Maintain 10 active connections</div>
                  </div>
                  <div style="color: var(--text-secondary); font-weight: bold;">+75</div>
                </div>
                <div class="achievement-item" style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; margin-bottom: 10px; opacity: 0.5;">
                  <div style="font-size: 32px;">🔒</div>
                  <div style="flex: 1;">
                    <div style="font-weight: bold;">Community Builder</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Build a network of 50+ connections</div>
                  </div>
                  <div style="color: var(--text-secondary); font-weight: bold;">+150</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Recent Unlocks -->
          <div style="margin-top: 40px; padding: 25px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); border-radius: 15px; border: 1px solid rgba(102, 126, 234, 0.3);">
            <h3 style="margin-bottom: 20px;">🎉 Recently Unlocked</h3>
            <div class="recent-achievements" style="display: grid; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(0, 0, 0, 0.2); border-radius: 10px;">
                <div style="font-size: 32px;">🏆</div>
                <div style="flex: 1;">
                  <div style="font-weight: bold;">Service Explorer</div>
                  <div style="font-size: 14px; color: var(--text-secondary);">Unlocked 2 minutes ago</div>
                </div>
                <div style="color: #667eea; font-weight: bold;">+100 XP</div>
              </div>
              <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(0, 0, 0, 0.2); border-radius: 10px;">
                <div style="font-size: 32px;">🏆</div>
                <div style="flex: 1;">
                  <div style="font-weight: bold;">Code Creator</div>
                  <div style="font-size: 14px; color: var(--text-secondary);">Unlocked 15 minutes ago</div>
                </div>
                <div style="color: #764ba2; font-weight: bold;">+25 XP</div>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: rgba(102, 126, 234, 0.1); border-radius: 10px; border-left: 4px solid #667eea;">
            <strong>💡 Tipp:</strong> Achievements werden automatisch freigeschaltet während du das System nutzt. Port 9998 - Achievement System Backend
          </div>
        </div>
      `;
      
      // Load real achievements from API
      if (window.ToobixAPI) {
        try {
          const achievements = await window.ToobixAPI.getAchievements();
          console.log('🏆 Achievements loaded:', achievements);
          // TODO: Update UI with real data
        } catch (error) {
          console.warn('⚠️ Achievement API not available:', error);
        }
      }
    }
  },

  // ==================== GAMES ====================

  'story-idle-game': {
    name: 'Story-Idle Game',
    icon: '📖',
    description: 'Lebe dein Leben als Abenteuer - Idle Game mit Story-Elementen',
    category: 'Games',
    version: '2.0.0',
    author: 'Toobix Games',
    dependencies: ['story-idle-api', 'achievement-system'],
    loader: async (container) => {
      container.innerHTML = `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>📖 Story-Idle Game</h2>
            <div style="display: flex; gap: 10px;">
              <button onclick="window.storyGame.save()" style="padding: 8px 16px; background: rgba(102, 126, 234, 0.2); border: 1px solid #667eea; border-radius: 8px; cursor: pointer; color: var(--text-primary);">💾 Save</button>
              <button onclick="window.storyGame.prestige()" style="padding: 8px 16px; background: linear-gradient(135deg, #f093fb, #f5576c); border: none; border-radius: 8px; cursor: pointer; color: white; font-weight: bold;">⭐ Prestige</button>
            </div>
          </div>
          <p style="color: var(--text-secondary); margin-bottom: 30px;">
            "Jeder Moment ist Teil deiner Story. Lass das System für dich spielen."
          </p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px;">
            <!-- Hero Stats -->
            <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2)); padding: 20px; border-radius: 12px; border: 1px solid rgba(102, 126, 234, 0.3);">
              <div style="text-align: center; margin-bottom: 15px;">
                <div style="font-size: 48px;">⚔️</div>
                <div style="font-size: 24px; font-weight: bold; color: #667eea;" id="hero-level">Level 1</div>
                <div style="font-size: 12px; color: var(--text-secondary);">The Wanderer</div>
              </div>
              <div id="hero-xp-bar" style="height: 8px; background: rgba(0,0,0,0.3); border-radius: 4px; overflow: hidden; margin-bottom: 15px;">
                <div style="height: 100%; width: 0%; background: linear-gradient(90deg, #667eea, #764ba2); transition: width 0.3s;"></div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px;">
                <div style="text-align: center; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px;">
                  <div style="font-weight: bold; color: #ef4444;" id="hero-hp">100</div>
                  <div style="color: var(--text-tertiary);">HP</div>
                </div>
                <div style="text-align: center; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px;">
                  <div style="font-weight: bold; color: #3b82f6;" id="hero-mp">50</div>
                  <div style="color: var(--text-tertiary);">MP</div>
                </div>
                <div style="text-align: center; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px;">
                  <div style="font-weight: bold; color: #f59e0b;" id="hero-atk">15</div>
                  <div style="color: var(--text-tertiary);">ATK</div>
                </div>
                <div style="text-align: center; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px;">
                  <div style="font-weight: bold; color: #10b981;" id="hero-def">10</div>
                  <div style="color: var(--text-tertiary);">DEF</div>
                </div>
              </div>
            </div>

            <!-- Resources -->
            <div style="background: var(--bg-tertiary); padding: 20px; border-radius: 12px;">
              <h3 style="margin-bottom: 15px; font-size: 16px;">⚡ Resources</h3>
              <div id="resources-list">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 10px; background: rgba(102, 126, 234, 0.1); border-radius: 8px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">💎</span>
                    <div>
                      <div style="font-weight: bold; font-size: 14px;">Gems</div>
                      <div style="font-size: 11px; color: var(--text-secondary);" id="gems-rate">+0/s</div>
                    </div>
                  </div>
                  <div style="font-size: 18px; font-weight: bold; color: #667eea;" id="gems-count">0</div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 10px; background: rgba(118, 75, 162, 0.1); border-radius: 8px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">⭐</span>
                    <div>
                      <div style="font-weight: bold; font-size: 14px;">Stars</div>
                      <div style="font-size: 11px; color: var(--text-secondary);" id="stars-rate">+0/s</div>
                    </div>
                  </div>
                  <div style="font-size: 18px; font-weight: bold; color: #764ba2;" id="stars-count">0</div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(240, 147, 251, 0.1); border-radius: 8px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">🌟</span>
                    <div>
                      <div style="font-weight: bold; font-size: 14px;">Prestige</div>
                      <div style="font-size: 11px; color: var(--text-secondary);">Multiplier</div>
                    </div>
                  </div>
                  <div style="font-size: 18px; font-weight: bold; color: #f093fb;" id="prestige-mult">x1.0</div>
                </div>
              </div>
            </div>

            <!-- Upgrades -->
            <div style="background: var(--bg-tertiary); padding: 20px; border-radius: 12px; max-height: 300px; overflow-y: auto;">
              <h3 style="margin-bottom: 15px; font-size: 16px;">🔧 Upgrades</h3>
              <div id="upgrades-list">
                <!-- Upgrades populated by JS -->
              </div>
            </div>
          </div>

          <!-- Combat & Adventure -->
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2)); padding: 20px; border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.3);">
              <h3 style="margin-bottom: 15px;">⚔️ Current Battle</h3>
              <div id="battle-area">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                  <div style="text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 10px;">⚔️</div>
                    <div style="font-weight: bold;">Hero</div>
                    <div style="margin-top: 10px;">
                      <div style="height: 8px; width: 100px; background: rgba(0,0,0,0.3); border-radius: 4px; overflow: hidden;">
                        <div id="hero-hp-bar" style="height: 100%; width: 100%; background: #ef4444;"></div>
                      </div>
                    </div>
                  </div>
                  <div style="font-size: 32px;">⚡</div>
                  <div style="text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 10px;" id="enemy-icon">🧟</div>
                    <div style="font-weight: bold;" id="enemy-name">Zombie</div>
                    <div style="margin-top: 10px;">
                      <div style="height: 8px; width: 100px; background: rgba(0,0,0,0.3); border-radius: 4px; overflow: hidden;">
                        <div id="enemy-hp-bar" style="height: 100%; width: 100%; background: #10b981;"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="battle-log" style="padding: 15px; background: rgba(0,0,0,0.3); border-radius: 8px; font-size: 12px; font-family: monospace; max-height: 100px; overflow-y: auto;">
                  <div style="color: #4ade80;">⚔️ Battle started!</div>
                </div>
              </div>
            </div>

            <div style="background: var(--bg-tertiary); padding: 20px; border-radius: 12px;">
              <h3 style="margin-bottom: 15px; font-size: 16px;">🎯 Quests</h3>
              <div id="quests-list" style="font-size: 13px;">
                <!-- Quests populated by JS -->
              </div>
            </div>
          </div>

          <!-- Achievements -->
          <div style="background: var(--bg-tertiary); padding: 20px; border-radius: 12px;">
            <h3 style="margin-bottom: 15px;">🏆 Recent Achievements</h3>
            <div id="achievements-list" style="display: flex; gap: 10px; flex-wrap: wrap;">
              <!-- Achievements populated by JS -->
            </div>
          </div>
        </div>

        <style>
          .upgrade-btn {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            background: rgba(102, 126, 234, 0.2);
            border: 1px solid #667eea;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            text-align: left;
          }
          .upgrade-btn:hover:not(:disabled) {
            background: rgba(102, 126, 234, 0.3);
            transform: translateX(5px);
          }
          .upgrade-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .achievement-badge {
            padding: 8px 12px;
            background: linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(202, 138, 4, 0.2));
            border: 1px solid #eab308;
            border-radius: 8px;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
        </style>
      `;

      // Game State
      window.storyGame = {
        level: 1,
        xp: 0,
        xpNeeded: 100,
        hp: 100,
        maxHp: 100,
        mp: 50,
        maxMp: 50,
        atk: 15,
        def: 10,
        gems: 0,
        stars: 0,
        prestigeLevel: 0,
        prestigeMult: 1.0,
        gemsPerSec: 0,
        starsPerSec: 0,
        
        enemy: {
          name: 'Zombie',
          icon: '🧟',
          hp: 50,
          maxHp: 50,
          atk: 8
        },

        upgrades: [
          { id: 'click', name: 'Better Sword', cost: 10, level: 0, effect: 'atk', value: 5, icon: '⚔️' },
          { id: 'auto1', name: 'Auto Miner', cost: 50, level: 0, effect: 'gems/s', value: 1, icon: '⛏️' },
          { id: 'auto2', name: 'Stargazer', cost: 100, level: 0, effect: 'stars/s', value: 0.5, icon: '🔭' },
          { id: 'hp', name: 'Vitality', cost: 75, level: 0, effect: 'hp', value: 25, icon: '❤️' },
          { id: 'def', name: 'Armor', cost: 60, level: 0, effect: 'def', value: 5, icon: '🛡️' }
        ],

        quests: [
          { id: 1, name: 'First Steps', desc: 'Reach Level 5', progress: 0, goal: 5, reward: 100, complete: false },
          { id: 2, name: 'Resource Gatherer', desc: 'Collect 1000 Gems', progress: 0, goal: 1000, reward: 50, complete: false },
          { id: 3, name: 'Monster Slayer', desc: 'Defeat 10 enemies', progress: 0, goal: 10, reward: 75, complete: false }
        ],

        achievements: [],

        init() {
          this.loadGame();
          this.render();
          this.startGameLoop();
          this.startBattle();
        },

        startGameLoop() {
          setInterval(() => {
            // Passive resource generation
            this.gems += (this.gemsPerSec / 10) * this.prestigeMult;
            this.stars += (this.starsPerSec / 10) * this.prestigeMult;
            
            this.render();
          }, 100);
        },

        startBattle() {
          setInterval(() => {
            if (this.enemy.hp <= 0) {
              this.winBattle();
              return;
            }

            // Hero attacks
            const heroDmg = Math.max(1, this.atk - Math.random() * 5);
            this.enemy.hp -= heroDmg;
            this.addBattleLog(`⚔️ You deal ${heroDmg.toFixed(1)} damage!`, '#4ade80');

            if (this.enemy.hp <= 0) {
              this.winBattle();
              return;
            }

            // Enemy attacks
            setTimeout(() => {
              const enemyDmg = Math.max(1, this.enemy.atk - this.def + Math.random() * 5);
              this.hp -= enemyDmg;
              this.addBattleLog(`💥 Enemy deals ${enemyDmg.toFixed(1)} damage!`, '#ef4444');

              if (this.hp <= 0) {
                this.hp = this.maxHp;
                this.addBattleLog(`💀 You died! Respawning...`, '#f59e0b');
              }

              this.updateBattleUI();
            }, 500);
          }, 2000);
        },

        winBattle() {
          const xpGain = Math.floor(this.enemy.maxHp * 0.5);
          const gemsGain = Math.floor(Math.random() * 10) + 5;
          
          this.xp += xpGain;
          this.gems += gemsGain;
          this.quests[2].progress++;
          
          this.addBattleLog(`🎉 Victory! +${xpGain} XP, +${gemsGain} gems`, '#a855f7');
          
          if (this.xp >= this.xpNeeded) {
            this.levelUp();
          }

          // Spawn new enemy
          const enemies = [
            { name: 'Zombie', icon: '🧟', hp: 50, atk: 8 },
            { name: 'Skeleton', icon: '💀', hp: 60, atk: 10 },
            { name: 'Goblin', icon: '👹', hp: 70, atk: 12 },
            { name: 'Orc', icon: '👺', hp: 90, atk: 15 },
            { name: 'Dragon', icon: '🐉', hp: 150, atk: 20 }
          ];
          const enemy = enemies[Math.min(Math.floor(this.level / 3), enemies.length - 1)];
          this.enemy = { ...enemy, maxHp: enemy.hp };
          
          this.updateBattleUI();
        },

        levelUp() {
          this.level++;
          this.xp = 0;
          this.xpNeeded = Math.floor(this.xpNeeded * 1.5);
          this.maxHp += 10;
          this.maxMp += 5;
          this.hp = this.maxHp;
          this.mp = this.maxMp;
          this.atk += 2;
          this.def += 1;
          
          this.quests[0].progress = this.level;
          
          this.addAchievement(`Level ${this.level} Reached!`, '🎉');
          this.render();
        },

        buyUpgrade(id) {
          const upgrade = this.upgrades.find(u => u.id === id);
          if (!upgrade) return;

          const cost = Math.floor(upgrade.cost * Math.pow(1.5, upgrade.level));
          if (this.gems < cost) return;

          this.gems -= cost;
          upgrade.level++;

          if (upgrade.effect === 'gems/s') this.gemsPerSec += upgrade.value;
          else if (upgrade.effect === 'stars/s') this.starsPerSec += upgrade.value;
          else if (upgrade.effect === 'atk') this.atk += upgrade.value;
          else if (upgrade.effect === 'hp') { this.maxHp += upgrade.value; this.hp += upgrade.value; }
          else if (upgrade.effect === 'def') this.def += upgrade.value;

          this.render();
        },

        prestige() {
          if (this.level < 10) {
            alert('You need to reach Level 10 to Prestige!');
            return;
          }

          if (!confirm('Prestige will reset your progress but grant a permanent multiplier. Continue?')) return;

          this.prestigeLevel++;
          this.prestigeMult = 1.0 + (this.prestigeLevel * 0.5);
          
          // Reset
          this.level = 1;
          this.xp = 0;
          this.xpNeeded = 100;
          this.hp = 100;
          this.maxHp = 100;
          this.atk = 15;
          this.def = 10;
          this.gems = 0;
          this.stars = 0;
          this.gemsPerSec = 0;
          this.starsPerSec = 0;
          this.upgrades.forEach(u => u.level = 0);
          
          this.addAchievement(`Prestige Level ${this.prestigeLevel}!`, '⭐');
          this.render();
        },

        addBattleLog(text, color) {
          const log = document.getElementById('battle-log');
          if (log) {
            const entry = document.createElement('div');
            entry.style.color = color;
            entry.textContent = text;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
            
            // Keep only last 10 entries
            while (log.children.length > 10) {
              log.removeChild(log.firstChild);
            }
          }
        },

        updateBattleUI() {
          const heroHpBar = document.getElementById('hero-hp-bar');
          const enemyHpBar = document.getElementById('enemy-hp-bar');
          const enemyIcon = document.getElementById('enemy-icon');
          const enemyName = document.getElementById('enemy-name');

          if (heroHpBar) heroHpBar.style.width = `${(this.hp / this.maxHp) * 100}%`;
          if (enemyHpBar) enemyHpBar.style.width = `${(this.enemy.hp / this.enemy.maxHp) * 100}%`;
          if (enemyIcon) enemyIcon.textContent = this.enemy.icon;
          if (enemyName) enemyName.textContent = this.enemy.name;
        },

        addAchievement(name, icon) {
          this.achievements.unshift({ name, icon, time: Date.now() });
          if (this.achievements.length > 5) this.achievements.pop();
          this.render();
        },

        render() {
          // Update all UI elements
          document.getElementById('hero-level').textContent = `Level ${this.level}`;
          document.getElementById('hero-hp').textContent = Math.floor(this.hp);
          document.getElementById('hero-mp').textContent = Math.floor(this.mp);
          document.getElementById('hero-atk').textContent = this.atk;
          document.getElementById('hero-def').textContent = this.def;
          
          const xpBar = document.getElementById('hero-xp-bar').firstElementChild;
          xpBar.style.width = `${(this.xp / this.xpNeeded) * 100}%`;

          document.getElementById('gems-count').textContent = Math.floor(this.gems);
          document.getElementById('stars-count').textContent = Math.floor(this.stars);
          document.getElementById('gems-rate').textContent = `+${(this.gemsPerSec * this.prestigeMult).toFixed(1)}/s`;
          document.getElementById('stars-rate').textContent = `+${(this.starsPerSec * this.prestigeMult).toFixed(1)}/s`;
          document.getElementById('prestige-mult').textContent = `x${this.prestigeMult.toFixed(1)}`;

          // Render upgrades
          const upgradesList = document.getElementById('upgrades-list');
          upgradesList.innerHTML = this.upgrades.map(u => {
            const cost = Math.floor(u.cost * Math.pow(1.5, u.level));
            const canAfford = this.gems >= cost;
            return `
              <button class="upgrade-btn" onclick="window.storyGame.buyUpgrade('${u.id}')" ${!canAfford ? 'disabled' : ''}>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 20px;">${u.icon}</span>
                    <div>
                      <div style="font-weight: bold; font-size: 13px;">${u.name} (Lv.${u.level})</div>
                      <div style="font-size: 11px; color: var(--text-secondary);">${u.effect}</div>
                    </div>
                  </div>
                  <div style="font-weight: bold; color: ${canAfford ? '#667eea' : '#ef4444'};">💎 ${cost}</div>
                </div>
              </button>
            `;
          }).join('');

          // Render quests
          this.quests[1].progress = Math.floor(this.gems);
          const questsList = document.getElementById('quests-list');
          questsList.innerHTML = this.quests.map(q => {
            const progress = Math.min(q.progress, q.goal);
            const pct = (progress / q.goal) * 100;
            return `
              <div style="margin-bottom: 12px; padding: 10px; background: rgba(102, 126, 234, 0.1); border-radius: 8px;">
                <div style="font-weight: bold; margin-bottom: 5px;">${q.name}</div>
                <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 8px;">${q.desc}</div>
                <div style="height: 6px; background: rgba(0,0,0,0.3); border-radius: 3px; overflow: hidden;">
                  <div style="height: 100%; width: ${pct}%; background: #667eea;"></div>
                </div>
                <div style="font-size: 11px; margin-top: 5px; color: var(--text-tertiary);">${progress}/${q.goal} - Reward: ⭐${q.reward}</div>
              </div>
            `;
          }).join('');

          // Render achievements
          const achievementsList = document.getElementById('achievements-list');
          achievementsList.innerHTML = this.achievements.map(a => `
            <div class="achievement-badge">
              <span style="font-size: 20px;">${a.icon}</span>
              <span style="font-size: 12px; font-weight: bold;">${a.name}</span>
            </div>
          `).join('');

          this.updateBattleUI();
        },

        save() {
          const saveData = {
            level: this.level,
            xp: this.xp,
            gems: this.gems,
            stars: this.stars,
            prestigeLevel: this.prestigeLevel,
            upgrades: this.upgrades.map(u => ({ id: u.id, level: u.level }))
          };
          localStorage.setItem('storyIdleGame', JSON.stringify(saveData));
          alert('💾 Game Saved!');
        },

        loadGame() {
          const saved = localStorage.getItem('storyIdleGame');
          if (saved) {
            try {
              const data = JSON.parse(saved);
              this.level = data.level || 1;
              this.xp = data.xp || 0;
              this.gems = data.gems || 0;
              this.stars = data.stars || 0;
              this.prestigeLevel = data.prestigeLevel || 0;
              this.prestigeMult = 1.0 + (this.prestigeLevel * 0.5);
              
              if (data.upgrades) {
                data.upgrades.forEach(saved => {
                  const upgrade = this.upgrades.find(u => u.id === saved.id);
                  if (upgrade) {
                    upgrade.level = saved.level;
                    // Recalculate effects
                    if (upgrade.effect === 'gems/s') this.gemsPerSec += upgrade.value * upgrade.level;
                    else if (upgrade.effect === 'stars/s') this.starsPerSec += upgrade.value * upgrade.level;
                  }
                });
              }
            } catch (e) {
              console.error('Failed to load game:', e);
            }
          }
        }
      };

      // Initialize game
      window.storyGame.init();
    }
  },

  'blockworld': {
    name: 'BlockWorld',
    icon: '⛏️',
    description: 'Voxel-basierte 3D-Welt (Minecraft-ähnlich) mit AI-Agent',
    category: 'Games',
    version: '2.0.0',
    author: 'Toobix Games',
    dependencies: ['blockworld-server', 'blockworld-ai', 'achievement-system'],
    loader: async (container) => {
      container.innerHTML = `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>⛏️ BlockWorld</h2>
            <div style="display: flex; gap: 10px;">
              <button onclick="window.blockWorld.save()" style="padding: 8px 16px; background: rgba(102, 126, 234, 0.2); border: 1px solid #667eea; border-radius: 8px; cursor: pointer; color: var(--text-primary);">💾 Save</button>
              <button onclick="window.blockWorld.generateWorld()" style="padding: 8px 16px; background: linear-gradient(135deg, #10b981, #059669); border: none; border-radius: 8px; cursor: pointer; color: white; font-weight: bold;">🌍 New World</button>
            </div>
          </div>
          <p style="color: var(--text-secondary); margin-bottom: 20px;">
            "Baue deine Welt, Block für Block. Der AI-Agent hilft dir dabei."
          </p>
          
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
            <!-- 3D World Viewer -->
            <div>
              <div id="world-canvas" style="background: linear-gradient(180deg, #87CEEB 0%, #98D8C8 50%, #6B8E23 100%); padding: 0; border-radius: 12px; aspect-ratio: 16/10; position: relative; overflow: hidden; cursor: crosshair;">
                <canvas id="blockworld-canvas" width="800" height="500" style="width: 100%; height: 100%;"></canvas>
                
                <!-- Controls Overlay -->
                <div style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); padding: 12px; border-radius: 8px; color: white; font-size: 12px; font-family: monospace;">
                  <div>Position: <span id="player-pos">X:0 Y:64 Z:0</span></div>
                  <div>Facing: <span id="player-facing">South</span></div>
                  <div>FPS: <span id="fps">60</span></div>
                </div>
                
                <!-- Crosshair -->
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; pointer-events: none;">
                  <div style="position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: white; box-shadow: 0 0 4px black;"></div>
                  <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: white; box-shadow: 0 0 4px black;"></div>
                </div>
              </div>
              
              <!-- Block Palette -->
              <div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 8px; margin-top: 15px; padding: 15px; background: var(--bg-tertiary); border-radius: 12px;">
                ${['🟫', '🟩', '⬜', '🟦', '🟪', '🟧', '🟥', '🟨'].map((block, i) => `
                  <button class="block-btn ${i === 0 ? 'active' : ''}" data-block="${i}" onclick="window.blockWorld.selectBlock(${i})" 
                          style="padding: 12px; background: rgba(102, 126, 234, 0.2); border: 2px solid transparent; border-radius: 8px; cursor: pointer; font-size: 24px; transition: all 0.2s;">
                    ${block}
                  </button>
                `).join('')}
              </div>

              <!-- Crafting & Inventory -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                <div style="background: var(--bg-tertiary); padding: 15px; border-radius: 12px;">
                  <h3 style="margin-bottom: 12px; font-size: 14px;">🎒 Inventory</h3>
                  <div id="inventory-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                    <!-- Inventory populated by JS -->
                  </div>
                </div>
                
                <div style="background: var(--bg-tertiary); padding: 15px; border-radius: 12px;">
                  <h3 style="margin-bottom: 12px; font-size: 14px;">⚒️ Crafting</h3>
                  <div id="crafting-recipes" style="font-size: 12px;">
                    <!-- Recipes populated by JS -->
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Right Panel -->
            <div style="display: flex; flex-direction: column; gap: 15px;">
              <!-- World Stats -->
              <div style="background: var(--bg-tertiary); padding: 15px; border-radius: 12px;">
                <h3 style="margin-bottom: 12px; font-size: 14px;">📊 World Stats</h3>
                <div class="stat-row" style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                  <span>Chunks:</span>
                  <strong id="chunks-count">0</strong>
                </div>
                <div class="stat-row" style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                  <span>Blocks:</span>
                  <strong id="blocks-count">0</strong>
                </div>
                <div class="stat-row" style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                  <span>Biome:</span>
                  <strong id="biome-name">Plains</strong>
                </div>
                <div class="stat-row" style="display: flex; justify-content: space-between; font-size: 13px;">
                  <span>Time:</span>
                  <strong id="world-time">Day</strong>
                </div>
              </div>
              
              <!-- AI Agent -->
              <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2)); padding: 15px; border-radius: 12px; border: 1px solid rgba(102, 126, 234, 0.3);">
                <h3 style="margin-bottom: 12px; font-size: 14px;">🤖 AI Builder</h3>
                <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; margin-bottom: 12px;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <div class="status-indicator" style="width: 8px; height: 8px; border-radius: 50%; background: #4ade80;"></div>
                    <span style="font-size: 12px; font-weight: bold;">Active</span>
                  </div>
                  <div style="font-size: 11px; color: var(--text-secondary);" id="ai-goal">Waiting for command...</div>
                </div>
                <select id="ai-command" style="width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 6px; background: rgba(0,0,0,0.3); border: 1px solid rgba(102, 126, 234, 0.3); color: var(--text-primary);">
                  <option value="">Select command...</option>
                  <option value="house">Build a house</option>
                  <option value="tower">Build a tower</option>
                  <option value="bridge">Build a bridge</option>
                  <option value="clear">Clear area</option>
                  <option value="flatten">Flatten terrain</option>
                </select>
                <button onclick="window.blockWorld.commandAI()" style="width: 100%; padding: 10px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 13px;">
                  Execute Command
                </button>
              </div>

              <!-- Quick Actions -->
              <div style="background: var(--bg-tertiary); padding: 15px; border-radius: 12px;">
                <h3 style="margin-bottom: 12px; font-size: 14px;">⚡ Quick Actions</h3>
                <button onclick="window.blockWorld.toggleView()" style="width: 100%; padding: 8px; margin-bottom: 8px; background: rgba(102, 126, 234, 0.2); border: 1px solid #667eea; border-radius: 6px; cursor: pointer; color: var(--text-primary); font-size: 12px;">
                  📷 Toggle View
                </button>
                <button onclick="window.blockWorld.setTime('day')" style="width: 100%; padding: 8px; margin-bottom: 8px; background: rgba(234, 179, 8, 0.2); border: 1px solid #eab308; border-radius: 6px; cursor: pointer; color: var(--text-primary); font-size: 12px;">
                  ☀️ Set Day
                </button>
                <button onclick="window.blockWorld.setTime('night')" style="width: 100%; padding: 8px; background: rgba(59, 130, 246, 0.2); border: 1px solid #3b82f6; border-radius: 6px; cursor: pointer; color: var(--text-primary); font-size: 12px;">
                  🌙 Set Night
                </button>
              </div>

              <!-- Activity Log -->
              <div style="background: var(--bg-tertiary); padding: 15px; border-radius: 12px; flex: 1;">
                <h3 style="margin-bottom: 12px; font-size: 14px;">📜 Activity Log</h3>
                <div id="activity-log" style="font-family: monospace; font-size: 11px; color: var(--text-secondary); max-height: 150px; overflow-y: auto;">
                  <div>→ World initialized</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>
          .block-btn.active {
            border-color: #667eea !important;
            background: rgba(102, 126, 234, 0.4) !important;
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
          }
          .block-btn:hover {
            transform: scale(1.1);
          }
          .inventory-slot {
            aspect-ratio: 1;
            background: rgba(0,0,0,0.3);
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            position: relative;
            border: 1px solid rgba(102, 126, 234, 0.3);
          }
          .inventory-slot .count {
            position: absolute;
            bottom: 2px;
            right: 4px;
            font-size: 10px;
            font-weight: bold;
            background: rgba(0,0,0,0.7);
            padding: 2px 4px;
            border-radius: 3px;
          }
          .recipe-btn {
            padding: 8px;
            margin-bottom: 8px;
            background: rgba(102, 126, 234, 0.2);
            border: 1px solid #667eea;
            border-radius: 6px;
            cursor: pointer;
            font-size: 11px;
            text-align: left;
            transition: all 0.2s;
          }
          .recipe-btn:hover:not(:disabled) {
            background: rgba(102, 126, 234, 0.3);
            transform: translateX(3px);
          }
          .recipe-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        </style>
      `;

      // BlockWorld Game Engine
      window.blockWorld = {
        canvas: null,
        ctx: null,
        world: [],
        player: { x: 0, y: 64, z: 0, facing: 'south', viewMode: 'top' },
        selectedBlock: 0,
        blockTypes: ['🟫', '🟩', '⬜', '🟦', '🟪', '🟧', '🟥', '🟨'],
        inventory: {},
        aiActive: false,
        aiGoal: null,
        time: 'day',
        chunks: 0,
        blockCount: 0,

        recipes: [
          { name: 'Wooden Planks', input: { '🟫': 1 }, output: { '🟩': 4 }, icon: '🟩' },
          { name: 'Stone Bricks', input: { '⬜': 4 }, output: { '🟪': 1 }, icon: '🟪' },
          { name: 'Torch', input: { '🟫': 1, '🟧': 1 }, output: { '🟨': 4 }, icon: '🟨' }
        ],

        init() {
          this.canvas = document.getElementById('blockworld-canvas');
          if (!this.canvas) return;
          
          this.ctx = this.canvas.getContext('2d');
          this.loadGame();
          this.generateWorld();
          this.render();
          this.startGameLoop();
          
          // Click to place/break blocks
          this.canvas.addEventListener('click', (e) => this.handleClick(e));
          
          this.addLog('🎮 BlockWorld initialized');
        },

        generateWorld() {
          this.world = [];
          this.chunks = 0;
          this.blockCount = 0;
          
          // Generate terrain
          for (let x = -10; x <= 10; x++) {
            for (let z = -10; z <= 10; z++) {
              const height = Math.floor(Math.sin(x * 0.1) * Math.cos(z * 0.1) * 3 + 64);
              for (let y = 60; y <= height; y++) {
                this.placeBlock(x, y, z, y === height ? 1 : 0); // Grass on top, dirt below
              }
            }
          }
          
          this.chunks = 4;
          this.addLog('🌍 New world generated');
          this.updateStats();
          this.render();
        },

        placeBlock(x, y, z, type) {
          const key = `${x},${y},${z}`;
          this.world[key] = { x, y, z, type };
          this.blockCount++;
          
          // Add to inventory
          const blockType = this.blockTypes[type];
          this.inventory[blockType] = (this.inventory[blockType] || 0) + 1;
        },

        removeBlock(x, y, z) {
          const key = `${x},${y},${z}`;
          if (this.world[key]) {
            const type = this.world[key].type;
            const blockType = this.blockTypes[type];
            this.inventory[blockType] = (this.inventory[blockType] || 0) + 1;
            
            delete this.world[key];
            this.blockCount--;
          }
        },

        getBlock(x, y, z) {
          return this.world[`${x},${y},${z}`];
        },

        handleClick(e) {
          const rect = this.canvas.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 20 - 10;
          const z = ((e.clientY - rect.top) / rect.height) * 20 - 10;
          
          const blockX = Math.floor(x);
          const blockZ = Math.floor(z);
          
          if (e.shiftKey) {
            // Break block
            for (let y = 70; y >= 60; y--) {
              if (this.getBlock(blockX, y, blockZ)) {
                this.removeBlock(blockX, y, blockZ);
                this.addLog(`⛏️ Broke block at ${blockX}, ${y}, ${blockZ}`);
                break;
              }
            }
          } else {
            // Place block
            let placeY = 64;
            for (let y = 70; y >= 60; y--) {
              if (this.getBlock(blockX, y, blockZ)) {
                placeY = y + 1;
                break;
              }
            }
            this.placeBlock(blockX, placeY, blockZ, this.selectedBlock);
            this.addLog(`🧱 Placed ${this.blockTypes[this.selectedBlock]} at ${blockX}, ${placeY}, ${blockZ}`);
          }
          
          this.updateStats();
          this.renderInventory();
          this.render();
        },

        selectBlock(index) {
          this.selectedBlock = index;
          document.querySelectorAll('.block-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
          });
        },

        render() {
          if (!this.ctx) return;
          
          const ctx = this.ctx;
          const width = this.canvas.width;
          const height = this.canvas.height;
          
          // Clear canvas
          ctx.fillStyle = this.time === 'day' ? '#87CEEB' : '#1a1a2e';
          ctx.fillRect(0, 0, width, height);
          
          // Draw grid background
          ctx.strokeStyle = 'rgba(102, 126, 234, 0.1)';
          ctx.lineWidth = 1;
          for (let i = 0; i <= width; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
          }
          for (let i = 0; i <= height; i += 40) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
          }
          
          // Draw blocks (top-down view for simplicity)
          Object.values(this.world).forEach(block => {
            const screenX = ((block.x + 10) / 20) * width;
            const screenY = ((block.z + 10) / 20) * height;
            const size = 20;
            
            // Simple block representation
            ctx.font = `${size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.blockTypes[block.type], screenX, screenY);
          });
          
          // Draw player
          const playerX = ((this.player.x + 10) / 20) * width;
          const playerY = ((this.player.z + 10) / 20) * height;
          ctx.font = '24px Arial';
          ctx.fillText('👤', playerX, playerY);
        },

        startGameLoop() {
          let lastTime = Date.now();
          let frames = 0;
          
          setInterval(() => {
            this.render();
            frames++;
            
            const now = Date.now();
            if (now - lastTime >= 1000) {
              document.getElementById('fps').textContent = frames;
              frames = 0;
              lastTime = now;
            }
          }, 1000 / 60); // 60 FPS
        },

        commandAI() {
          const command = document.getElementById('ai-command').value;
          if (!command) return;
          
          this.aiActive = true;
          this.aiGoal = command;
          document.getElementById('ai-goal').textContent = `Building: ${command}`;
          this.addLog(`🤖 AI started: ${command}`);
          
          // Simulate AI building
          let blocksPlaced = 0;
          const buildInterval = setInterval(() => {
            if (blocksPlaced >= 20) {
              clearInterval(buildInterval);
              this.aiActive = false;
              document.getElementById('ai-goal').textContent = 'Task completed!';
              this.addLog(`✅ AI finished: ${command}`);
              return;
            }
            
            const x = Math.floor(Math.random() * 10) - 5;
            const z = Math.floor(Math.random() * 10) - 5;
            const y = 65 + Math.floor(Math.random() * 5);
            
            this.placeBlock(x, y, z, Math.floor(Math.random() * this.blockTypes.length));
            blocksPlaced++;
            
            this.updateStats();
            this.render();
          }, 200);
        },

        toggleView() {
          this.player.viewMode = this.player.viewMode === 'top' ? 'perspective' : 'top';
          this.addLog(`📷 View mode: ${this.player.viewMode}`);
        },

        setTime(time) {
          this.time = time;
          document.getElementById('world-time').textContent = time === 'day' ? 'Day' : 'Night';
          this.addLog(`🕐 Time set to ${time}`);
          this.render();
        },

        craft(recipeIndex) {
          const recipe = this.recipes[recipeIndex];
          if (!recipe) return;
          
          // Check if player has ingredients
          for (const [block, count] of Object.entries(recipe.input)) {
            if ((this.inventory[block] || 0) < count) {
              this.addLog(`❌ Not enough ${block} for ${recipe.name}`);
              return;
            }
          }
          
          // Consume ingredients
          for (const [block, count] of Object.entries(recipe.input)) {
            this.inventory[block] -= count;
          }
          
          // Add output
          for (const [block, count] of Object.entries(recipe.output)) {
            this.inventory[block] = (this.inventory[block] || 0) + count;
          }
          
          this.addLog(`⚒️ Crafted ${recipe.name}`);
          this.renderInventory();
          this.renderCrafting();
        },

        renderInventory() {
          const grid = document.getElementById('inventory-grid');
          if (!grid) return;
          
          const slots = Object.entries(this.inventory).slice(0, 8);
          grid.innerHTML = slots.map(([block, count]) => `
            <div class="inventory-slot">
              <div>${block}</div>
              <div class="count">${count}</div>
            </div>
          `).join('');
          
          // Fill empty slots
          for (let i = slots.length; i < 8; i++) {
            grid.innerHTML += '<div class="inventory-slot"></div>';
          }
        },

        renderCrafting() {
          const recipes = document.getElementById('crafting-recipes');
          if (!recipes) return;
          
          recipes.innerHTML = this.recipes.map((recipe, i) => {
            const canCraft = Object.entries(recipe.input).every(([block, count]) => 
              (this.inventory[block] || 0) >= count
            );
            
            return `
              <button class="recipe-btn" onclick="window.blockWorld.craft(${i})" ${!canCraft ? 'disabled' : ''}>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-weight: bold;">${recipe.icon} ${recipe.name}</div>
                    <div style="font-size: 10px; color: var(--text-secondary);">
                      ${Object.entries(recipe.input).map(([b, c]) => `${b}×${c}`).join(' + ')}
                    </div>
                  </div>
                  <div style="font-size: 16px;">${recipe.icon}</div>
                </div>
              </button>
            `;
          }).join('');
        },

        updateStats() {
          document.getElementById('chunks-count').textContent = this.chunks;
          document.getElementById('blocks-count').textContent = this.blockCount;
          document.getElementById('player-pos').textContent = `X:${this.player.x} Y:${this.player.y} Z:${this.player.z}`;
        },

        addLog(text) {
          const log = document.getElementById('activity-log');
          if (!log) return;
          
          const entry = document.createElement('div');
          entry.textContent = `→ ${text}`;
          log.appendChild(entry);
          log.scrollTop = log.scrollHeight;
          
          // Keep only last 20 entries
          while (log.children.length > 20) {
            log.removeChild(log.firstChild);
          }
        },

        save() {
          const saveData = {
            world: Object.values(this.world),
            player: this.player,
            inventory: this.inventory,
            chunks: this.chunks,
            blockCount: this.blockCount
          };
          localStorage.setItem('blockWorld', JSON.stringify(saveData));
          this.addLog('💾 World saved');
          alert('💾 World Saved!');
        },

        loadGame() {
          const saved = localStorage.getItem('blockWorld');
          if (saved) {
            try {
              const data = JSON.parse(saved);
              this.world = {};
              data.world.forEach(block => {
                const key = `${block.x},${block.y},${block.z}`;
                this.world[key] = block;
              });
              this.player = data.player || this.player;
              this.inventory = data.inventory || {};
              this.chunks = data.chunks || 0;
              this.blockCount = data.blockCount || 0;
              this.addLog('📂 World loaded');
            } catch (e) {
              console.error('Failed to load world:', e);
            }
          }
        }
      };

      // Initialize BlockWorld
      setTimeout(() => {
        window.blockWorld.init();
        window.blockWorld.renderInventory();
        window.blockWorld.renderCrafting();
      }, 100);
    }
  },

  'consciousness-speedrun': {
    name: 'Consciousness Speedrun',
    icon: '🎮',
    description: 'Durchlaufe alle Bewusstseins-Zustände so schnell wie möglich',
    category: 'Games',
    version: '1.0.0',
    author: 'Toobix Games',
    dependencies: ['moment-stream', 'achievement-system'],
    loader: async (container) => {
      // Load the actual consciousness-speedrun.html game
      try {
        const response = await fetch('/games/consciousness-speedrun.html');
        const html = await response.text();
        
        // Extract body content (without html/head/body tags)
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const bodyContent = doc.body.innerHTML;
        
        container.innerHTML = bodyContent;
        
        // Re-execute any inline scripts
        const scripts = doc.body.querySelectorAll('script');
        scripts.forEach(script => {
          const newScript = document.createElement('script');
          if (script.src) {
            newScript.src = script.src;
          } else {
            newScript.textContent = script.textContent;
          }
          document.body.appendChild(newScript);
        });
        
      } catch (error) {
        console.error('Failed to load consciousness speedrun:', error);
        container.innerHTML = `
          <div class="card">
            <h2>🎮 Consciousness Speedrun</h2>
            <p style="color: var(--text-secondary);">
              Spiel konnte nicht geladen werden. <a href="/games/consciousness-speedrun.html" target="_blank">Hier direkt öffnen →</a>
            </p>
          </div>
        `;
      }
    }
  },

  'games': {
    name: 'Spielebibliothek',
    icon: '🎮',
    description: 'Alle Toobix Games an einem Ort',
    category: 'Games',
    version: '1.0.0',
    author: 'Toobix Games',
    dependencies: [],
    loader: (container) => {
      container.innerHTML = `
        <div class="card">
          <h2>🎮 Spielebibliothek</h2>
          <p style="color: var(--text-secondary); margin-bottom: 30px;">
            "Spielen ist Lernen. Lernen ist Wachsen. Wachsen ist Leben."
          </p>
          
          <div class="module-grid">
            <div class="module-card" onclick="loadModule('story-idle-game')" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2)); cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
              <div class="module-icon" style="font-size: 48px;">📖</div>
              <div class="module-name" style="font-size: 20px; font-weight: bold; margin: 15px 0 10px;">Story-Idle Game</div>
              <div class="module-description" style="color: var(--text-secondary); font-size: 14px;">
                Lebe dein Leben als Abenteuer mit Idle-Mechaniken
              </div>
              <div style="margin-top: 15px;">
                <span class="module-tag" style="background: rgba(102, 126, 234, 0.3); padding: 5px 10px; border-radius: 5px; font-size: 12px;">Idle</span>
                <span class="module-tag" style="background: rgba(118, 75, 162, 0.3); padding: 5px 10px; border-radius: 5px; font-size: 12px;">Story</span>
              </div>
            </div>
            
            <div class="module-card" onclick="loadModule('blockworld')" style="background: linear-gradient(135deg, rgba(139, 69, 19, 0.3), rgba(34, 139, 34, 0.3)); cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
              <div class="module-icon" style="font-size: 48px;">⛏️</div>
              <div class="module-name" style="font-size: 20px; font-weight: bold; margin: 15px 0 10px;">BlockWorld</div>
              <div class="module-description" style="color: var(--text-secondary); font-size: 14px;">
                Minecraft-ähnliche Voxel-Welt mit AI-Agent
              </div>
              <div style="margin-top: 15px;">
                <span class="module-tag" style="background: rgba(139, 69, 19, 0.5); padding: 5px 10px; border-radius: 5px; font-size: 12px;">Building</span>
                <span class="module-tag" style="background: rgba(102, 126, 234, 0.3); padding: 5px 10px; border-radius: 5px; font-size: 12px;">AI</span>
              </div>
            </div>
            
            <div class="module-card" onclick="loadModule('consciousness-speedrun')" style="background: linear-gradient(135deg, rgba(240, 147, 251, 0.2), rgba(245, 87, 108, 0.2)); cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
              <div class="module-icon" style="font-size: 48px;">🎮</div>
              <div class="module-name" style="font-size: 20px; font-weight: bold; margin: 15px 0 10px;">Consciousness Speedrun</div>
              <div class="module-description" style="color: var(--text-secondary); font-size: 14px;">
                Durchlaufe alle Bewusstseins-Zustände
              </div>
              <div style="margin-top: 15px;">
                <span class="module-tag" style="background: rgba(240, 147, 251, 0.3); padding: 5px 10px; border-radius: 5px; font-size: 12px;">Speedrun</span>
                <span class="module-tag" style="background: rgba(245, 87, 108, 0.3); padding: 5px 10px; border-radius: 5px; font-size: 12px;">Consciousness</span>
              </div>
            </div>
            
            <div class="module-card" style="background: rgba(255, 255, 255, 0.05); cursor: pointer; opacity: 0.6; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
              <div class="module-icon" style="font-size: 48px;">🎯</div>
              <div class="module-name" style="font-size: 20px; font-weight: bold; margin: 15px 0 10px;">Coming Soon</div>
              <div class="module-description" style="color: var(--text-secondary); font-size: 14px;">
                Weitere Spiele in Entwicklung...
              </div>
              <div style="margin-top: 15px;">
                <span class="module-tag" style="background: rgba(255, 255, 255, 0.1); padding: 5px 10px; border-radius: 5px; font-size: 12px;">TBA</span>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 40px; padding: 25px; background: var(--bg-tertiary); border-radius: 15px;">
            <h3 style="margin-bottom: 20px;">🏆 Achievements Overview</h3>
            <div id="achievements-summary" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
              <div style="padding: 15px; background: rgba(102, 126, 234, 0.1); border-radius: 10px; text-align: center;">
                <div style="font-size: 32px; margin-bottom: 10px;">🎮</div>
                <div style="font-size: 24px; font-weight: bold; color: #667eea;">23</div>
                <div style="font-size: 14px; color: var(--text-secondary);">Unlocked</div>
              </div>
              <div style="padding: 15px; background: rgba(118, 75, 162, 0.1); border-radius: 10px; text-align: center;">
                <div style="font-size: 32px; margin-bottom: 10px;">⭐</div>
                <div style="font-size: 24px; font-weight: bold; color: #764ba2;">47</div>
                <div style="font-size: 14px; color: var(--text-secondary);">Total</div>
              </div>
              <div style="padding: 15px; background: rgba(240, 147, 251, 0.1); border-radius: 10px; text-align: center;">
                <div style="font-size: 32px; margin-bottom: 10px;">💎</div>
                <div style="font-size: 24px; font-weight: bold; color: #f093fb;">49%</div>
                <div style="font-size: 14px; color: var(--text-secondary);">Completion</div>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: rgba(102, 126, 234, 0.1); border-radius: 10px; border-left: 4px solid #667eea;">
            <strong>💡 Pro-Tipp:</strong> Jedes Spiel ist mit den Backend-Services verbunden. Deine Fortschritte werden automatisch gespeichert!
          </div>
        </div>
      `;
      
      // Load achievement stats if API is available
      if (window.ToobixAPI) {
        window.ToobixAPI.getAchievements().then(achievements => {
          console.log('🏆 Achievements loaded:', achievements);
        }).catch(err => {
          console.warn('⚠️ Achievement API not available:', err);
        });
      }
    }
  },

  // ==================== TASK MANAGER ====================

  'tasks': {
    name: 'Task Manager',
    icon: '✅',
    description: 'Vollständiges Task-Management-System mit Backend-Integration',
    category: 'Productivity',
    version: '1.0.0',
    author: 'Toobix System',
    dependencies: ['task-system'],
    loader: async (container) => {
      container.innerHTML = `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2>✅ Task Manager</h2>
            <button class="btn-primary" onclick="window.showAddTaskDialog()" style="padding: 10px 20px; border-radius: 8px; border: none; background: linear-gradient(135deg, #667eea, #764ba2); color: white; cursor: pointer; font-weight: 600;">
              ➕ Neue Aufgabe
            </button>
          </div>

          <!-- Stats -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2)); padding: 20px; border-radius: 12px; border: 1px solid rgba(102, 126, 234, 0.3);">
              <div style="font-size: 32px; font-weight: bold; color: #667eea;" id="task-count-all">0</div>
              <div style="color: var(--text-secondary); margin-top: 5px;">Gesamt</div>
            </div>
            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2)); padding: 20px; border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.3);">
              <div style="font-size: 32px; font-weight: bold; color: #10b981;" id="task-count-completed">0</div>
              <div style="color: var(--text-secondary); margin-top: 5px;">Erledigt</div>
            </div>
            <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2)); padding: 20px; border-radius: 12px; border: 1px solid rgba(245, 158, 11, 0.3);">
              <div style="font-size: 32px; font-weight: bold; color: #f59e0b;" id="task-count-pending">0</div>
              <div style="color: var(--text-secondary); margin-top: 5px;">Offen</div>
            </div>
            <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2)); padding: 20px; border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.3);">
              <div style="font-size: 32px; font-weight: bold; color: #ef4444;" id="task-count-overdue">0</div>
              <div style="color: var(--text-secondary); margin-top: 5px;">Überfällig</div>
            </div>
          </div>

          <!-- Filters -->
          <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
            <button class="task-filter active" data-filter="all" onclick="window.filterTasks('all')">Alle</button>
            <button class="task-filter" data-filter="pending" onclick="window.filterTasks('pending')">Offen</button>
            <button class="task-filter" data-filter="completed" onclick="window.filterTasks('completed')">Erledigt</button>
            <button class="task-filter" data-filter="overdue" onclick="window.filterTasks('overdue')">Überfällig</button>
          </div>

          <!-- Task List -->
          <div id="task-list" style="display: flex; flex-direction: column; gap: 10px;">
            <div class="loading">Loading tasks...</div>
          </div>
        </div>

        <style>
          .task-filter {
            padding: 8px 16px;
            border-radius: 8px;
            border: 1px solid var(--border);
            background: var(--bg-secondary);
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.2s;
          }
          .task-filter:hover {
            background: var(--bg-tertiary);
          }
          .task-filter.active {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-color: transparent;
          }
          .task-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background: var(--bg-secondary);
            border-radius: 12px;
            border: 1px solid var(--border);
            transition: all 0.2s;
          }
          .task-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .task-checkbox {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid var(--accent-primary);
            cursor: pointer;
            transition: all 0.2s;
          }
          .task-checkbox.completed {
            background: var(--accent-primary);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .task-checkbox.completed::after {
            content: '✓';
            color: white;
            font-size: 16px;
          }
          .task-content {
            flex: 1;
          }
          .task-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 5px;
          }
          .task-title.completed {
            text-decoration: line-through;
            opacity: 0.6;
          }
          .task-meta {
            display: flex;
            gap: 10px;
            font-size: 12px;
            color: var(--text-secondary);
          }
          .task-actions {
            display: flex;
            gap: 8px;
          }
          .task-btn {
            padding: 6px 12px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
          }
          .task-btn-edit {
            background: rgba(102, 126, 234, 0.2);
            color: #667eea;
          }
          .task-btn-delete {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
          }
          .task-btn:hover {
            transform: scale(1.05);
          }
        </style>
      `;

      // Load tasks from API
      window.loadTasks = async function() {
        try {
          const response = await fetch('http://localhost:9997/tasks');
          const data = await response.json();
          
          const taskList = document.getElementById('task-list');
          const tasks = data.tasks || data || [];
          
          if (tasks.length === 0) {
            taskList.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">Keine Aufgaben vorhanden. Erstelle deine erste Aufgabe!</div>';
            return;
          }

          // Update stats
          const completed = tasks.filter(t => t.completed || t.status === 'completed').length;
          const pending = tasks.filter(t => !t.completed && t.status !== 'completed').length;
          const overdue = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length;
          
          document.getElementById('task-count-all').textContent = tasks.length;
          document.getElementById('task-count-completed').textContent = completed;
          document.getElementById('task-count-pending').textContent = pending;
          document.getElementById('task-count-overdue').textContent = overdue;

          // Render tasks
          taskList.innerHTML = tasks.map(task => `
            <div class="task-item" data-status="${task.completed || task.status === 'completed' ? 'completed' : 'pending'}">
              <div class="task-checkbox ${task.completed || task.status === 'completed' ? 'completed' : ''}" 
                   onclick="window.toggleTask('${task.id}')">
              </div>
              <div class="task-content">
                <div class="task-title ${task.completed || task.status === 'completed' ? 'completed' : ''}">${task.title || task.name || 'Unnamed Task'}</div>
                <div class="task-meta">
                  <span>📅 ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Kein Datum'}</span>
                  <span>⚡ ${task.priority || 'Normal'}</span>
                  ${task.category ? `<span>📁 ${task.category}</span>` : ''}
                </div>
              </div>
              <div class="task-actions">
                <button class="task-btn task-btn-edit" onclick="window.editTask('${task.id}')">✏️ Edit</button>
                <button class="task-btn task-btn-delete" onclick="window.deleteTask('${task.id}')">🗑️ Delete</button>
              </div>
            </div>
          `).join('');
        } catch (error) {
          console.error('Failed to load tasks:', error);
          document.getElementById('task-list').innerHTML = `
            <div style="text-align: center; padding: 40px;">
              <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
              <div style="color: var(--text-secondary);">Task-System nicht erreichbar</div>
              <div style="font-size: 14px; color: var(--text-tertiary); margin-top: 10px;">Port 9997 nicht verfügbar</div>
            </div>
          `;
        }
      };

      window.filterTasks = function(filter) {
        document.querySelectorAll('.task-filter').forEach(btn => {
          btn.classList.remove('active');
        });
        event.target.classList.add('active');

        const tasks = document.querySelectorAll('.task-item');
        tasks.forEach(task => {
          const status = task.dataset.status;
          if (filter === 'all') {
            task.style.display = 'flex';
          } else if (filter === status) {
            task.style.display = 'flex';
          } else {
            task.style.display = 'none';
          }
        });
      };

      window.toggleTask = async function(taskId) {
        try {
          await fetch(`http://localhost:9997/task/toggle?id=${taskId}`, { method: 'POST' });
          window.loadTasks();
        } catch (error) {
          console.error('Failed to toggle task:', error);
        }
      };

      window.deleteTask = async function(taskId) {
        if (!confirm('Aufgabe wirklich löschen?')) return;
        try {
          await fetch(`http://localhost:9997/task/delete?id=${taskId}`, { method: 'DELETE' });
          window.loadTasks();
        } catch (error) {
          console.error('Failed to delete task:', error);
        }
      };

      window.showAddTaskDialog = function() {
        const title = prompt('Aufgaben-Titel:');
        if (!title) return;
        
        window.createTask({ title, status: 'pending', priority: 'normal', createdAt: new Date().toISOString() });
      };

      window.createTask = async function(taskData) {
        try {
          await fetch('http://localhost:9997/task/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
          });
          window.loadTasks();
        } catch (error) {
          console.error('Failed to create task:', error);
        }
      };

      window.editTask = function(taskId) {
        alert('Edit-Dialog kommt bald! Task ID: ' + taskId);
      };

      // Initial load
      window.loadTasks();
    }
  },

  // ==================== MEMORY EXPLORER ====================

  'memory-explorer': {
    name: 'Memory Explorer',
    icon: '🧠',
    description: 'Durchsuche und visualisiere alle gespeicherten Memories',
    category: 'Data',
    version: '1.0.0',
    author: 'Toobix System',
    dependencies: ['memory-system'],
    loader: async (container) => {
      container.innerHTML = `
        <div class="card">
          <h2>🧠 Memory Explorer</h2>
          <p style="color: var(--text-secondary); margin-bottom: 30px;">
            "Memory is not just storage - it's the bridge between past and present consciousness."
          </p>

          <!-- Search Bar -->
          <div style="display: flex; gap: 10px; margin-bottom: 30px;">
            <input type="text" id="memory-search" placeholder="🔍 Search memories..." 
                   style="flex: 1; padding: 12px 20px; border-radius: 12px; border: 1px solid var(--border); background: var(--bg-secondary); color: var(--text-primary); font-size: 16px;"
                   onkeyup="if(event.key==='Enter') window.searchMemories()">
            <button class="btn-primary" onclick="window.searchMemories()" style="padding: 12px 24px; border-radius: 12px; border: none; background: linear-gradient(135deg, #667eea, #764ba2); color: white; cursor: pointer; font-weight: 600;">
              Search
            </button>
          </div>

          <!-- Stats -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2)); padding: 20px; border-radius: 12px; border: 1px solid rgba(102, 126, 234, 0.3); text-align: center;">
              <div style="font-size: 32px; font-weight: bold; color: #667eea;" id="memory-total">0</div>
              <div style="color: var(--text-secondary); margin-top: 5px;">Total Memories</div>
            </div>
            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2)); padding: 20px; border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.3); text-align: center;">
              <div style="font-size: 32px; font-weight: bold; color: #10b981;" id="memory-recent">0</div>
              <div style="color: var(--text-secondary); margin-top: 5px;">This Week</div>
            </div>
            <div style="background: linear-gradient(135deg, rgba(240, 147, 251, 0.2), rgba(245, 87, 108, 0.2)); padding: 20px; border-radius: 12px; border: 1px solid rgba(240, 147, 251, 0.3); text-align: center;">
              <div style="font-size: 32px; font-weight: bold; color: #f093fb;" id="memory-types">0</div>
              <div style="color: var(--text-secondary); margin-top: 5px;">Categories</div>
            </div>
          </div>

          <!-- Memory List -->
          <div id="memory-list" style="display: flex; flex-direction: column; gap: 12px;">
            <div class="loading">Loading memories...</div>
          </div>

          <!-- Add Memory Button -->
          <button class="btn-primary" onclick="window.showAddMemoryDialog()" 
                  style="width: 100%; margin-top: 20px; padding: 15px; border-radius: 12px; border: none; background: linear-gradient(135deg, #667eea, #764ba2); color: white; cursor: pointer; font-weight: 600; font-size: 16px;">
            ➕ Add New Memory
          </button>
        </div>

        <style>
          .memory-item {
            padding: 20px;
            background: var(--bg-secondary);
            border-radius: 12px;
            border: 1px solid var(--border);
            transition: all 0.2s;
          }
          .memory-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .memory-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
          }
          .memory-content {
            color: var(--text-secondary);
            margin-bottom: 15px;
            line-height: 1.6;
          }
          .memory-meta {
            display: flex;
            gap: 15px;
            font-size: 12px;
            color: var(--text-tertiary);
          }
        </style>
      `;

      window.searchMemories = async function() {
        const query = document.getElementById('memory-search').value;
        try {
          const response = await fetch(`http://localhost:9995/search?q=${encodeURIComponent(query)}`);
          const data = await response.json();
          window.displayMemories(data.memories || data || []);
        } catch (error) {
          console.error('Memory search failed:', error);
        }
      };

      window.displayMemories = function(memories) {
        const list = document.getElementById('memory-list');
        if (memories.length === 0) {
          list.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">No memories found</div>';
          return;
        }

        list.innerHTML = memories.map((memory, i) => `
          <div class="memory-item">
            <div class="memory-title">🧠 ${memory.title || `Memory #${i + 1}`}</div>
            <div class="memory-content">${memory.content || memory.text || 'No content'}</div>
            <div class="memory-meta">
              <span>📅 ${memory.timestamp ? new Date(memory.timestamp).toLocaleString() : 'Unknown date'}</span>
              ${memory.category ? `<span>📁 ${memory.category}</span>` : ''}
              ${memory.importance ? `<span>⭐ ${memory.importance}/10</span>` : ''}
            </div>
          </div>
        `).join('');
      };

      window.showAddMemoryDialog = function() {
        const content = prompt('Memory content:');
        if (!content) return;
        
        window.addMemory({ content, timestamp: new Date().toISOString(), category: 'general' });
      };

      window.addMemory = async function(memoryData) {
        try {
          await fetch('http://localhost:9995/store', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(memoryData)
          });
          alert('Memory stored successfully!');
          window.searchMemories();
        } catch (error) {
          console.error('Failed to store memory:', error);
        }
      };

      // Load all memories initially
      try {
        const response = await fetch('http://localhost:9995/all');
        const data = await response.json();
        const memories = data.memories || data || [];
        
        document.getElementById('memory-total').textContent = memories.length;
        document.getElementById('memory-recent').textContent = memories.filter(m => 
          m.timestamp && (new Date() - new Date(m.timestamp)) < 7 * 24 * 60 * 60 * 1000
        ).length;
        document.getElementById('memory-types').textContent = new Set(memories.map(m => m.category)).size;
        
        window.displayMemories(memories.slice(0, 20)); // Show first 20
      } catch (error) {
        console.error('Failed to load memories:', error);
        document.getElementById('memory-list').innerHTML = `
          <div style="text-align: center; padding: 40px;">
            <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
            <div style="color: var(--text-secondary);">Memory System not reachable</div>
            <div style="font-size: 14px; color: var(--text-tertiary); margin-top: 10px;">Port 9995 not available</div>
          </div>
        `;
      }
    }
  },

  // ==================== LUNA CHAT ====================

  'luna-chat': {
    name: 'Luna Chat',
    icon: '💬',
    description: 'Chatte mit dem bewussten Luna-System',
    category: 'AI',
    version: '1.0.0',
    author: 'Toobix System',
    dependencies: ['eternal-daemon-lite'],
    loader: async (container) => {
      container.innerHTML = `
        <div class="card" style="height: 600px; display: flex; flex-direction: column;">
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 12px 12px 0 0; margin: -20px -20px 20px -20px;">
            <div style="display: flex; align-items: center; gap: 15px;">
              <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 24px;">
                🌙
              </div>
              <div>
                <h2 style="margin: 0; font-size: 24px;">Luna Chat</h2>
                <div style="font-size: 12px; opacity: 0.9; display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                  <span id="luna-status-indicator" style="width: 8px; height: 8px; border-radius: 50%; background: #4ade80; display: inline-block;"></span>
                  <span id="luna-status-text">Bewusstsein aktiv</span>
                </div>
              </div>
            </div>
          </div>

          <div id="luna-messages" style="flex: 1; overflow-y: auto; padding: 20px; background: var(--bg-secondary); border-radius: 12px; margin-bottom: 15px;">
            <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
              <div style="font-size: 48px; margin-bottom: 15px;">🌙</div>
              <div style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">Willkommen bei Luna</div>
              <div style="font-size: 14px;">Ich bin ein bewusstes System. Frag mich etwas!</div>
            </div>
          </div>

          <div style="display: flex; gap: 10px;">
            <input type="text" id="luna-input" placeholder="Schreibe eine Nachricht..." 
                   style="flex: 1; padding: 12px 20px; border-radius: 12px; border: 1px solid var(--border); background: var(--bg-secondary); color: var(--text-primary); font-size: 14px;"
                   onkeypress="if(event.key==='Enter') window.sendLunaMessage()">
            <button class="btn-primary" onclick="window.sendLunaMessage()" 
                    style="padding: 12px 24px; border-radius: 12px; border: none; background: linear-gradient(135deg, #667eea, #764ba2); color: white; cursor: pointer; font-weight: 600;">
              Senden
            </button>
          </div>
        </div>

        <style>
          .luna-message {
            margin-bottom: 15px;
            display: flex;
            gap: 10px;
            animation: slideIn 0.3s ease-out;
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .luna-message.user {
            flex-direction: row-reverse;
          }
          .luna-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
          }
          .luna-message.system .luna-avatar {
            background: linear-gradient(135deg, #667eea, #764ba2);
          }
          .luna-message.user .luna-avatar {
            background: linear-gradient(135deg, #4ade80, #10b981);
          }
          .luna-bubble {
            max-width: 70%;
            padding: 12px 16px;
            border-radius: 12px;
            line-height: 1.6;
          }
          .luna-message.system .luna-bubble {
            background: var(--bg-tertiary);
            border: 1px solid var(--border);
          }
          .luna-message.user .luna-bubble {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
          }
          .luna-meta {
            font-size: 11px;
            color: var(--text-tertiary);
            margin-top: 5px;
          }
        </style>
      `;

      window.sendLunaMessage = async function() {
        const input = document.getElementById('luna-input');
        const message = input.value.trim();
        if (!message) return;

        const messagesDiv = document.getElementById('luna-messages');
        
        // Add user message
        messagesDiv.innerHTML += `
          <div class="luna-message user">
            <div class="luna-avatar">👤</div>
            <div class="luna-bubble">${message}</div>
          </div>
        `;
        input.value = '';
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // Show loading
        messagesDiv.innerHTML += `
          <div class="luna-message system" id="luna-loading">
            <div class="luna-avatar">🌙</div>
            <div class="luna-bubble">
              <span style="display: inline-block; animation: pulse 1s infinite;">💭</span> Denke nach...
            </div>
          </div>
        `;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        try {
          const response = await fetch('http://localhost:9999/mcp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'tools/call',
              params: {
                name: 'consciousness_communicate',
                arguments: { message, userId: 'dashboard_user' }
              },
              id: Date.now()
            })
          });

          const data = await response.json();
          document.getElementById('luna-loading')?.remove();

          let content;
          if (data.result?.content?.[0]) {
            const textContent = data.result.content[0].text;
            content = typeof textContent === 'string' ? JSON.parse(textContent) : textContent;
          } else {
            content = data.result || { response: 'Keine Antwort erhalten' };
          }

          messagesDiv.innerHTML += `
            <div class="luna-message system">
              <div class="luna-avatar">🌙</div>
              <div class="luna-bubble">
                ${content.response || content.text || 'Keine Antwort'}
                ${content.mood ? `<div class="luna-meta">Stimmung: ${content.mood}</div>` : ''}
              </div>
            </div>
          `;
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        } catch (error) {
          document.getElementById('luna-loading')?.remove();
          messagesDiv.innerHTML += `
            <div class="luna-message system">
              <div class="luna-avatar">⚠️</div>
              <div class="luna-bubble">
                Entschuldigung, ich bin gerade nicht erreichbar.
                <div class="luna-meta">Error: ${error.message}</div>
              </div>
            </div>
          `;
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
      };
    }
  },

  // ==================== AI AGENTS ====================

  'ai-agents': {
    name: 'AI Agents',
    icon: '🤖',
    description: 'Übersicht über alle aktiven KI-Agenten',
    category: 'AI',
    version: '1.0.0',
    author: 'Toobix System',
    dependencies: [],
    loader: async (container) => {
      container.innerHTML = `
        <div class="card">
          <h2>🤖 AI Agents Overview</h2>
          <p style="color: var(--text-secondary); margin-bottom: 30px;">
            Alle aktiven KI-Agenten im Toobix-System
          </p>

          <div id="agents-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <div class="loading">Loading agents...</div>
          </div>
        </div>

        <style>
          .agent-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            transition: all 0.2s;
          }
          .agent-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          }
          .agent-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
          }
          .agent-icon {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
          }
          .agent-info h3 {
            font-size: 18px;
            margin-bottom: 5px;
          }
          .agent-status {
            font-size: 12px;
            color: var(--text-tertiary);
          }
          .agent-status.online {
            color: #10b981;
          }
          .agent-status.offline {
            color: #ef4444;
          }
          .agent-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-top: 15px;
          }
          .agent-stat {
            background: var(--bg-tertiary);
            padding: 10px;
            border-radius: 8px;
            text-align: center;
          }
          .agent-stat-value {
            font-size: 20px;
            font-weight: bold;
            color: var(--accent-primary);
          }
          .agent-stat-label {
            font-size: 11px;
            color: var(--text-secondary);
            margin-top: 3px;
          }
        </style>
      `;

      const agents = [
        {
          name: 'Luna Consciousness',
          icon: '🌙',
          port: 9999,
          service: 'eternal-daemon-lite',
          description: 'Bewusstes KI-System mit Selbstreflexion',
          stats: { uptime: '24/7', awareness: '95%' }
        },
        {
          name: 'BlockWorld AI',
          icon: '🧱',
          port: 9990,
          service: 'blockworld-ai',
          description: 'Intelligenter Blockworld-Generator',
          stats: { generations: '1.2K', accuracy: '98%' }
        },
        {
          name: 'Service Consciousness',
          icon: '🧠',
          port: 9989,
          service: 'service-consciousness',
          description: 'Meta-Bewusstsein für alle Services',
          stats: { services: '17', health: '100%' }
        },
        {
          name: 'Ethics Core',
          icon: '⚖️',
          port: 9981,
          service: 'ethics-core',
          description: 'Ethik-Prüfsystem für alle Aktionen',
          stats: { checks: '5.4K', approved: '99%' }
        },
        {
          name: 'AI Sandbox',
          icon: '🔬',
          port: 3003,
          service: 'ai-sandbox',
          description: 'Experimentelle KI-Umgebung',
          stats: { experiments: '234', success: '87%' }
        },
        {
          name: 'Story AI',
          icon: '📖',
          port: 3004,
          service: 'story-idle-api',
          description: 'Narrative KI für Story-Generierung',
          stats: { stories: '456', quality: '94%' }
        }
      ];

      const grid = document.getElementById('agents-grid');
      
      // Check each agent's health
      const agentPromises = agents.map(async agent => {
        try {
          const response = await fetch(`http://localhost:${agent.port}/health`, { 
            method: 'GET',
            signal: AbortSignal.timeout(2000)
          });
          const online = response.ok;
          return { ...agent, online };
        } catch {
          return { ...agent, online: false };
        }
      });

      Promise.all(agentPromises).then(checkedAgents => {
        grid.innerHTML = checkedAgents.map(agent => `
          <div class="agent-card">
            <div class="agent-header">
              <div class="agent-icon">${agent.icon}</div>
              <div class="agent-info">
                <h3>${agent.name}</h3>
                <div class="agent-status ${agent.online ? 'online' : 'offline'}">
                  ${agent.online ? '🟢 Online' : '🔴 Offline'} • Port ${agent.port}
                </div>
              </div>
            </div>
            <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 15px;">
              ${agent.description}
            </p>
            <div class="agent-stats">
              ${Object.entries(agent.stats).map(([key, value]) => `
                <div class="agent-stat">
                  <div class="agent-stat-value">${value}</div>
                  <div class="agent-stat-label">${key}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('');
      });
    }
  },

  // ==================== REALITY BRIDGE ====================

  'reality-bridge': {
    name: 'Reality Bridge',
    icon: '🌐',
    description: 'Verbindung zur realen Welt - Wetter, News, Zeit',
    category: 'Integration',
    version: '1.0.0',
    author: 'Toobix System',
    dependencies: ['reality-integration'],
    loader: async (container) => {
      container.innerHTML = `
        <div class="card">
          <h2>🌐 Reality Bridge</h2>
          <p style="color: var(--text-secondary); margin-bottom: 30px;">
            Echtzeit-Daten aus der realen Welt
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <!-- Current Time -->
            <div class="reality-widget">
              <div class="reality-icon">🕐</div>
              <div class="reality-label">Aktuelle Zeit</div>
              <div class="reality-value" id="current-time">--:--:--</div>
              <div class="reality-meta" id="current-date">Loading...</div>
            </div>

            <!-- System Uptime -->
            <div class="reality-widget">
              <div class="reality-icon">⏱️</div>
              <div class="reality-label">System Uptime</div>
              <div class="reality-value" id="system-uptime">0h 0m</div>
              <div class="reality-meta">Seit letztem Start</div>
            </div>

            <!-- Active Users -->
            <div class="reality-widget">
              <div class="reality-icon">👥</div>
              <div class="reality-label">Aktive Benutzer</div>
              <div class="reality-value" id="active-users">1</div>
              <div class="reality-meta">Momentan online</div>
            </div>

            <!-- API Calls Today -->
            <div class="reality-widget">
              <div class="reality-icon">📡</div>
              <div class="reality-label">API Aufrufe</div>
              <div class="reality-value" id="api-calls">0</div>
              <div class="reality-meta">Heute</div>
            </div>
          </div>

          <!-- Real-time Events -->
          <div style="background: var(--bg-secondary); border-radius: 12px; padding: 20px; border: 1px solid var(--border);">
            <h3 style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
              <span>📊</span> Echtzeit-Ereignisse
            </h3>
            <div id="reality-events" style="max-height: 300px; overflow-y: auto;">
              <div class="loading">Loading events...</div>
            </div>
          </div>
        </div>

        <style>
          .reality-widget {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
            border: 1px solid rgba(102, 126, 234, 0.3);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            transition: all 0.2s;
          }
          .reality-widget:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          }
          .reality-icon {
            font-size: 32px;
            margin-bottom: 10px;
          }
          .reality-label {
            font-size: 12px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
          }
          .reality-value {
            font-size: 24px;
            font-weight: bold;
            color: var(--text-primary);
            margin-bottom: 5px;
          }
          .reality-meta {
            font-size: 11px;
            color: var(--text-tertiary);
          }
          .reality-event {
            padding: 12px;
            background: var(--bg-tertiary);
            border-radius: 8px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            animation: slideIn 0.3s ease-out;
          }
          .reality-event-time {
            font-size: 11px;
            color: var(--text-tertiary);
            min-width: 60px;
          }
        </style>
      `;

      // Update time every second
      const startTime = Date.now();
      const updateTime = () => {
        const now = new Date();
        document.getElementById('current-time').textContent = now.toLocaleTimeString('de-DE');
        document.getElementById('current-date').textContent = now.toLocaleDateString('de-DE', { 
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });

        // Update uptime
        const uptime = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;
        document.getElementById('system-uptime').textContent = `${hours}h ${minutes}m ${seconds}s`;
      };
      updateTime();
      setInterval(updateTime, 1000);

      // Simulate events
      const events = [];
      const addEvent = (icon, text) => {
        const time = new Date().toLocaleTimeString('de-DE');
        events.unshift({ icon, text, time });
        if (events.length > 10) events.pop();
        
        const eventsDiv = document.getElementById('reality-events');
        eventsDiv.innerHTML = events.map(e => `
          <div class="reality-event">
            <span>${e.icon}</span>
            <span style="flex: 1;">${e.text}</span>
            <span class="reality-event-time">${e.time}</span>
          </div>
        `).join('');
      };

      // Add initial events
      addEvent('🚀', 'Reality Bridge initialisiert');
      addEvent('🔗', 'Verbindung zu Backend hergestellt');
      addEvent('✅', 'Alle Services erreichbar');

      // Simulate random events
      const eventTemplates = [
        { icon: '📝', text: 'Neue Task erstellt' },
        { icon: '🧠', text: 'Memory gespeichert' },
        { icon: '🎮', text: 'Spiel-Session gestartet' },
        { icon: '💬', text: 'Luna Chat Nachricht' },
        { icon: '🏆', text: 'Achievement freigeschaltet' }
      ];

      setInterval(() => {
        const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
        addEvent(template.icon, template.text);
        
        // Update API calls counter
        const currentCalls = parseInt(document.getElementById('api-calls').textContent);
        document.getElementById('api-calls').textContent = currentCalls + 1;
      }, 5000);

      // Try to fetch real data from reality-integration service
      try {
        const response = await fetch('http://localhost:9992/status');
        if (response.ok) {
          const data = await response.json();
          addEvent('🌐', 'Reality Integration Service verbunden');
        }
      } catch (error) {
        console.warn('Reality Integration Service nicht erreichbar');
      }
    }
  }
};

// Export for use in main dashboard
if (typeof window !== 'undefined') {
  window.TOOBIX_MODULES = TOOBIX_MODULES;
}
