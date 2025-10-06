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
    version: '1.0.0',
    author: 'Toobix Games',
    dependencies: ['story-idle-api', 'achievement-system'],
    loader: async (container) => {
      container.innerHTML = `
        <div class="card">
          <h2>📖 Story-Idle Game</h2>
          <p style="color: var(--text-secondary); margin-bottom: 30px;">
            "Jeder Moment ist Teil deiner Story. Lass das System für dich spielen."
          </p>
          
          <div class="game-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <!-- Story Progress -->
            <div style="background: var(--bg-tertiary); padding: 25px; border-radius: 15px;">
              <h3 style="margin-bottom: 20px;">📚 Story Progress</h3>
              <div id="story-progress" style="margin-bottom: 20px;">
                <div class="progress-bar" style="height: 25px; background: rgba(102, 126, 234, 0.2); border-radius: 12px; overflow: hidden;">
                  <div style="height: 100%; width: 45%; background: linear-gradient(90deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">
                    Level 5
                  </div>
                </div>
              </div>
              <div class="story-stats">
                <div class="stat-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>Current Chapter:</span>
                  <strong>Die Reise beginnt</strong>
                </div>
                <div class="stat-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>Quests Completed:</span>
                  <strong>12 / 50</strong>
                </div>
                <div class="stat-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>Companions:</span>
                  <strong>3</strong>
                </div>
                <div class="stat-row" style="display: flex; justify-content: space-between;">
                  <span>Story Points:</span>
                  <strong style="color: #667eea;">2,450</strong>
                </div>
              </div>
            </div>
            
            <!-- Idle Resources -->
            <div style="background: var(--bg-tertiary); padding: 25px; border-radius: 15px;">
              <h3 style="margin-bottom: 20px;">⚡ Idle Resources</h3>
              <div class="resources-list">
                <div class="resource-item" style="margin-bottom: 15px; padding: 15px; background: rgba(102, 126, 234, 0.1); border-radius: 10px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 24px;">💎</span>
                    <div style="flex: 1; margin-left: 15px;">
                      <div style="font-weight: bold;">Consciousness Gems</div>
                      <div style="font-size: 14px; color: var(--text-secondary);">+12/min</div>
                    </div>
                    <div style="font-size: 20px; font-weight: bold; color: #667eea;">1,234</div>
                  </div>
                </div>
                <div class="resource-item" style="margin-bottom: 15px; padding: 15px; background: rgba(118, 75, 162, 0.1); border-radius: 10px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 24px;">⭐</span>
                    <div style="flex: 1; margin-left: 15px;">
                      <div style="font-weight: bold;">Experience Stars</div>
                      <div style="font-size: 14px; color: var(--text-secondary);">+8/min</div>
                    </div>
                    <div style="font-size: 20px; font-weight: bold; color: #764ba2;">567</div>
                  </div>
                </div>
                <div class="resource-item" style="padding: 15px; background: rgba(240, 147, 251, 0.1); border-radius: 10px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 24px;">🌟</span>
                    <div style="flex: 1; margin-left: 15px;">
                      <div style="font-weight: bold;">Story Tokens</div>
                      <div style="font-size: 14px; color: var(--text-secondary);">+5/min</div>
                    </div>
                    <div style="font-size: 20px; font-weight: bold; color: #f093fb;">89</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Current Quest -->
          <div style="margin-top: 30px; padding: 25px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); border-radius: 15px; border: 1px solid rgba(102, 126, 234, 0.3);">
            <h3 style="margin-bottom: 15px;">🎯 Active Quest</h3>
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">The First Steps</div>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">
              "Beginne deine Reise durch das Toobix-System. Jeder Service, den du entdeckst, bringt dich weiter."
            </p>
            <div class="progress-bar" style="height: 20px; background: rgba(0, 0, 0, 0.3); border-radius: 10px; overflow: hidden; margin-bottom: 15px;">
              <div style="height: 100%; width: 68%; background: linear-gradient(90deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold;">
                68% Complete
              </div>
            </div>
            <div style="display: flex; gap: 15px; flex-wrap: wrap;">
              <button class="btn btn-primary" style="padding: 10px 20px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                Continue Quest
              </button>
              <button class="btn btn-secondary" style="padding: 10px 20px; background: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; cursor: pointer;">
                View All Quests
              </button>
            </div>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: rgba(102, 126, 234, 0.1); border-radius: 10px; border-left: 4px solid #667eea;">
            <strong>💡 Tipp:</strong> Das Story-Idle Game läuft automatisch im Hintergrund. Je mehr Services du nutzt, desto schneller levelst du!
          </div>
        </div>
      `;
      
      // Connect to Story-Idle API
      if (window.ToobixAPI) {
        try {
          const gameState = await window.ToobixAPI.getGameState();
          console.log('📖 Story-Idle Game State:', gameState);
        } catch (error) {
          console.warn('⚠️ Story-Idle API not available:', error);
        }
      }
    }
  },

  'blockworld': {
    name: 'BlockWorld',
    icon: '⛏️',
    description: 'Voxel-basierte 3D-Welt (Minecraft-ähnlich) mit AI-Agent',
    category: 'Games',
    version: '1.0.0',
    author: 'Toobix Games',
    dependencies: ['blockworld-server', 'blockworld-ai', 'achievement-system'],
    loader: async (container) => {
      container.innerHTML = `
        <div class="card">
          <h2>⛏️ BlockWorld</h2>
          <p style="color: var(--text-secondary); margin-bottom: 30px;">
            "Baue deine Welt, Block für Block. Der AI-Agent hilft dir dabei."
          </p>
          
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px;">
            <!-- World Viewer -->
            <div>
              <div style="background: #1a1a2e; padding: 20px; border-radius: 15px; aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: repeating-linear-gradient(0deg, rgba(102, 126, 234, 0.1) 0px, rgba(102, 126, 234, 0.1) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0px, rgba(102, 126, 234, 0.1) 1px, transparent 1px, transparent 20px);"></div>
                <div style="position: relative; text-align: center; z-index: 1;">
                  <div style="font-size: 64px; margin-bottom: 20px;">🎮</div>
                  <div style="font-size: 18px; color: var(--text-secondary);">3D World View</div>
                  <div style="font-size: 14px; color: var(--text-secondary); margin-top: 10px;">(Coming Soon)</div>
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 20px;">
                <button class="block-btn" style="padding: 15px; background: #8B4513; border: none; border-radius: 8px; cursor: pointer; font-size: 24px;">🟫</button>
                <button class="block-btn" style="padding: 15px; background: #228B22; border: none; border-radius: 8px; cursor: pointer; font-size: 24px;">🟩</button>
                <button class="block-btn" style="padding: 15px; background: #808080; border: none; border-radius: 8px; cursor: pointer; font-size: 24px;">⬜</button>
                <button class="block-btn" style="padding: 15px; background: #4169E1; border: none; border-radius: 8px; cursor: pointer; font-size: 24px;">🟦</button>
              </div>
            </div>
            
            <!-- Stats & AI Agent -->
            <div>
              <div style="background: var(--bg-tertiary); padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                <h3 style="margin-bottom: 15px;">📊 World Stats</h3>
                <div class="stat-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>Chunks Loaded:</span>
                  <strong>16</strong>
                </div>
                <div class="stat-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>Blocks Placed:</span>
                  <strong>1,234</strong>
                </div>
                <div class="stat-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>Player Position:</span>
                  <strong>0, 64, 0</strong>
                </div>
                <div class="stat-row" style="display: flex; justify-content: space-between;">
                  <span>Biome:</span>
                  <strong>Plains</strong>
                </div>
              </div>
              
              <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2)); padding: 20px; border-radius: 15px; border: 1px solid rgba(102, 126, 234, 0.3);">
                <h3 style="margin-bottom: 15px;">🤖 AI Agent</h3>
                <div id="ai-status" style="padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; margin-bottom: 15px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="status-indicator" style="width: 10px; height: 10px; border-radius: 50%; background: #4ade80;"></div>
                    <span style="font-size: 14px;">Active</span>
                  </div>
                </div>
                <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 15px;">
                  Current Goal: Building a house
                </div>
                <button class="btn" style="width: 100%; padding: 10px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                  Give AI Command
                </button>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: var(--bg-tertiary); border-radius: 15px;">
            <h3 style="margin-bottom: 15px;">🎯 Recent Activity</h3>
            <div class="activity-log" style="font-family: monospace; font-size: 13px; color: var(--text-secondary);">
              <div style="margin-bottom: 5px;">→ AI Agent placed 5 blocks</div>
              <div style="margin-bottom: 5px;">→ Chunk (0, 0) generated</div>
              <div style="margin-bottom: 5px;">→ Player moved to position (5, 65, -3)</div>
              <div style="margin-bottom: 5px;">→ Achievement unlocked: First Block!</div>
            </div>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: rgba(102, 126, 234, 0.1); border-radius: 10px; border-left: 4px solid #667eea;">
            <strong>💡 Backend Status:</strong> BlockWorld Server (Port 9993) + AI Agent (Port 9990)
          </div>
        </div>
      `;
      
      // Connect to BlockWorld APIs
      if (window.ToobixAPI) {
        try {
          const worldState = await window.ToobixAPI.getWorld();
          const aiStatus = await window.ToobixAPI.getAIStatus();
          console.log('⛏️ BlockWorld State:', worldState);
          console.log('🤖 AI Agent Status:', aiStatus);
        } catch (error) {
          console.warn('⚠️ BlockWorld API not available:', error);
        }
      }
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
  }
};

// Export for use in main dashboard
if (typeof window !== 'undefined') {
  window.TOOBIX_MODULES = TOOBIX_MODULES;
}
