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
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 16px;">🎯 Quests</h3>
                <button onclick="window.storyGame.generateQuestAI()" 
                        style="padding: 6px 12px; background: linear-gradient(135deg, #667eea, #764ba2); border: none; border-radius: 8px; cursor: pointer; color: white; font-size: 12px; font-weight: 600;">
                  🤖 Generate Quest (AI)
                </button>
              </div>
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

        async generateQuestAI() {
          try {
            const button = event.target;
            button.disabled = true;
            button.textContent = '🤖 Generating...';

            const response = await fetch('http://localhost:9987/story-idle/quest', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                playerLevel: this.level,
                playerClass: 'Wanderer'
              })
            });

            const data = await response.json();
            
            // Parse AI-generated quest
            let questData;
            try {
              questData = JSON.parse(data.quest);
            } catch {
              // If not valid JSON, create quest from text
              questData = {
                name: "AI Quest",
                description: data.quest,
                objective: "Complete the challenge",
                reward: Math.floor(this.level * 50)
              };
            }

            // Add quest to list
            const newQuest = {
              id: this.quests.length + 1,
              name: questData.name || 'AI Generated Quest',
              desc: questData.description || questData.objective,
              progress: 0,
              goal: Math.floor(this.level * 5),
              reward: questData.reward || Math.floor(this.level * 50),
              complete: false,
              aiGenerated: true
            };

            this.quests.push(newQuest);
            this.render();

            // 💾 AUTO-SAVE: Store quest in Memory System
            try {
              await fetch('http://localhost:9986/store/quest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: newQuest.name,
                  description: newQuest.desc,
                  objective: questData.objective || newQuest.desc,
                  reward: newQuest.reward,
                  playerLevel: this.level,
                  timestamp: Date.now()
                })
              });
              console.log('💾 Quest auto-saved to Memory System:', newQuest.name);
            } catch (memError) {
              console.warn('Failed to save quest to memory:', memError);
            }

            // Show notification
            alert(`🎯 New Quest Added: ${newQuest.name}`);

            button.disabled = false;
            button.textContent = '🤖 Generate Quest (AI)';
          } catch (error) {
            console.error('Quest generation error:', error);
            alert('Failed to generate quest. Is the Groq service running?');
            event.target.disabled = false;
            event.target.textContent = '🤖 Generate Quest (AI)';
          }
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
          // 🤖 GROQ API INTEGRATION - Luna Chat verbunden mit Port 9987
          const response = await fetch('http://localhost:9987/luna/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: message,
              context: `Current time: ${new Date().toLocaleString()}, Module: Luna Chat`
            })
          });

          const data = await response.json();
          document.getElementById('luna-loading')?.remove();

          let content = {
            response: data.response || 'Keine Antwort erhalten',
            emotion: data.emotion || 'curious',
            timestamp: data.timestamp
          };

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

          // 💾 AUTO-SAVE: Store conversation in Memory System
          try {
            await fetch('http://localhost:9986/store/conversation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userMessage: message,
                lunaResponse: content.response || content.text,
                context: 'Luna Chat',
                emotion: content.emotion || 'curious',
                timestamp: Date.now()
              })
            });
            console.log('💾 Conversation auto-saved to Memory System');
          } catch (memError) {
            console.warn('Failed to save conversation to memory:', memError);
          }
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

  // ==================== MEMORY VIEWER ====================

  'memory-viewer': {
    name: 'Memory Viewer',
    icon: '🧠',
    description: 'Kollektives Gedächtnis - Alle Conversations, Quests & Stories',
    category: 'AI',
    version: '1.0.0',
    author: 'Luna System',
    dependencies: ['memory-groq-integration'],
    loader: async (container) => {
      container.innerHTML = `
        <div class="card">
          <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 15px;">
              <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 32px;">
                🧠
              </div>
              <div>
                <h2 style="margin: 0; font-size: 28px;">Kollektives Gedächtnis</h2>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">Luna's Kreativitäts-Ökosystem</p>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 15px; margin-bottom: 20px;">
            <button onclick="window.memoryViewer.loadMemories()" class="btn btn-primary">
              🔄 Refresh Memories
            </button>
            <button onclick="window.memoryViewer.loadSummary()" class="btn btn-secondary">
              📜 AI Summary
            </button>
            <button onclick="window.memoryViewer.loadPatterns()" class="btn btn-secondary">
              🔍 Pattern Analysis
            </button>
            <input type="text" id="memory-search" placeholder="🔎 Search memories..." 
              style="flex: 1; padding: 10px; border-radius: 8px; border: 1px solid var(--border);"
              onkeypress="if(event.key==='Enter') window.memoryViewer.search()">
          </div>

          <div id="memory-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
            <div class="stat-card">
              <div class="stat-value" id="total-memories">0</div>
              <div class="stat-label">Total Memories</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" id="conversations-count">0</div>
              <div class="stat-label">Conversations</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" id="quests-count">0</div>
              <div class="stat-label">Quests</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" id="stories-count">0</div>
              <div class="stat-label">Stories</div>
            </div>
          </div>

          <div id="memory-content" style="background: var(--bg-secondary); border-radius: 12px; padding: 20px; min-height: 400px; max-height: 600px; overflow-y: auto;">
            <div style="text-align: center; color: var(--text-tertiary); padding: 40px;">
              <div style="font-size: 48px; margin-bottom: 10px;">🌌</div>
              <p>Klicke auf "Refresh Memories" um das kollektive Gedächtnis zu laden</p>
            </div>
          </div>
        </div>

        <style>
          .stat-card {
            background: var(--bg-tertiary);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            border: 1px solid var(--border);
          }
          .stat-value {
            font-size: 32px;
            font-weight: bold;
            color: var(--primary);
            margin-bottom: 5px;
          }
          .stat-label {
            color: var(--text-secondary);
            font-size: 14px;
          }
          .memory-item {
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 15px;
            transition: transform 0.2s;
          }
          .memory-item:hover {
            transform: translateX(5px);
            border-color: var(--primary);
          }
          .memory-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
          }
          .memory-icon {
            font-size: 24px;
          }
          .memory-title {
            font-weight: bold;
            color: var(--text-primary);
            flex: 1;
          }
          .memory-time {
            font-size: 12px;
            color: var(--text-tertiary);
          }
          .memory-body {
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 10px;
          }
          .memory-tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
          .memory-tag {
            background: var(--primary);
            color: white;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
          }
          .ai-summary {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
            border: 2px solid var(--primary);
            border-radius: 12px;
            padding: 20px;
            line-height: 1.8;
            font-style: italic;
            color: var(--text-primary);
          }
        </style>
      `;

      // Memory Viewer Logic
      window.memoryViewer = {
        async loadMemories() {
          const contentDiv = document.getElementById('memory-content');
          contentDiv.innerHTML = '<div style="text-align: center; padding: 40px;"><div style="font-size: 48px; animation: spin 1s linear infinite;">⏳</div><p>Lade Memories...</p></div>';
          
          try {
            const response = await fetch('http://localhost:9995/memories');
            const data = await response.json();
            const memories = Array.isArray(data) ? data : data.value || [];

            // Update stats
            document.getElementById('total-memories').textContent = memories.length;
            const conversations = memories.filter(m => m.type === 'conversation');
            const quests = memories.filter(m => m.type === 'quest');
            const stories = memories.filter(m => m.type === 'story');
            document.getElementById('conversations-count').textContent = conversations.length;
            document.getElementById('quests-count').textContent = quests.length;
            document.getElementById('stories-count').textContent = stories.length;

            if (memories.length === 0) {
              contentDiv.innerHTML = `
                <div style="text-align: center; color: var(--text-tertiary); padding: 40px;">
                  <div style="font-size: 48px; margin-bottom: 10px;">💭</div>
                  <p>Noch keine Memories gespeichert.</p>
                  <p style="font-size: 14px;">Chatte mit Luna oder generiere Quests, sie werden automatisch gespeichert!</p>
                </div>
              `;
              return;
            }

            contentDiv.innerHTML = memories.map(mem => {
              const icon = mem.type === 'conversation' ? '💬' : mem.type === 'quest' ? '🎯' : mem.type === 'story' ? '📖' : '💭';
              const time = new Date(mem.timestamp).toLocaleString('de-DE');
              const tags = mem.tags || mem.metadata?.tags || [];
              
              let bodyContent = '';
              if (mem.type === 'conversation') {
                bodyContent = `
                  <div><strong>User:</strong> ${mem.content || mem.metadata?.userMessage || 'N/A'}</div>
                  <div><strong>Luna:</strong> ${mem.metadata?.lunaResponse || 'N/A'}</div>
                `;
              } else if (mem.type === 'quest') {
                bodyContent = `
                  <div><strong>${mem.content || mem.metadata?.name}</strong></div>
                  <div>${mem.metadata?.description || mem.metadata?.objective || ''}</div>
                  ${mem.metadata?.reward ? `<div>💰 Reward: ${JSON.stringify(mem.metadata.reward)}</div>` : ''}
                `;
              } else {
                bodyContent = mem.content || JSON.stringify(mem.metadata || {});
              }

              return `
                <div class="memory-item">
                  <div class="memory-header">
                    <div class="memory-icon">${icon}</div>
                    <div class="memory-title">${mem.type || 'Memory'}</div>
                    <div class="memory-time">${time}</div>
                  </div>
                  <div class="memory-body">${bodyContent}</div>
                  ${tags.length > 0 ? `
                    <div class="memory-tags">
                      ${tags.map(tag => `<span class="memory-tag">${tag}</span>`).join('')}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('');

          } catch (error) {
            contentDiv.innerHTML = `
              <div style="text-align: center; color: var(--error); padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 10px;">⚠️</div>
                <p>Fehler beim Laden der Memories</p>
                <p style="font-size: 14px;">${error.message}</p>
              </div>
            `;
          }
        },

        async loadSummary() {
          const contentDiv = document.getElementById('memory-content');
          contentDiv.innerHTML = '<div style="text-align: center; padding: 40px;"><div style="font-size: 48px; animation: pulse 1s infinite;">🧠</div><p>Luna analysiert das kollektive Gedächtnis...</p></div>';
          
          try {
            const response = await fetch('http://localhost:9986/summary');
            const data = await response.json();
            
            contentDiv.innerHTML = `
              <div class="ai-summary">
                <div style="text-align: center; margin-bottom: 20px;">
                  <div style="font-size: 48px;">🌙</div>
                  <h3 style="margin: 10px 0;">Luna's Poetische Reflexion</h3>
                  <p style="font-size: 12px; opacity: 0.7;">Generiert von: ${data.model}</p>
                </div>
                <div style="white-space: pre-wrap;">${data.summary}</div>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border); font-size: 14px; opacity: 0.7;">
                  📊 Total Memories: ${data.totalMemories} | ⏱️ ${new Date(data.timestamp).toLocaleString('de-DE')}
                </div>
              </div>
            `;
          } catch (error) {
            contentDiv.innerHTML = `
              <div style="text-align: center; color: var(--error); padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 10px;">⚠️</div>
                <p>Fehler beim Laden der AI Summary</p>
                <p style="font-size: 14px;">${error.message}</p>
              </div>
            `;
          }
        },

        async loadPatterns() {
          const contentDiv = document.getElementById('memory-content');
          contentDiv.innerHTML = '<div style="text-align: center; padding: 40px;"><div style="font-size: 48px; animation: spin 2s linear infinite;">🔍</div><p>Analysiere Muster...</p></div>';
          
          try {
            const response = await fetch('http://localhost:9986/patterns');
            const data = await response.json();
            
            contentDiv.innerHTML = `
              <div class="ai-summary">
                <div style="text-align: center; margin-bottom: 20px;">
                  <div style="font-size: 48px;">🔮</div>
                  <h3 style="margin: 10px 0;">Pattern Analysis</h3>
                </div>
                <div style="white-space: pre-wrap;">${data.analysis}</div>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border); font-size: 14px; opacity: 0.7;">
                  📊 Analyzed: ${data.totalMemories} memories | ⏱️ ${new Date(data.timestamp).toLocaleString('de-DE')}
                </div>
              </div>
            `;
          } catch (error) {
            contentDiv.innerHTML = `
              <div style="text-align: center; color: var(--error); padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 10px;">⚠️</div>
                <p>Fehler beim Laden der Pattern Analysis</p>
                <p style="font-size: 14px;">${error.message}</p>
              </div>
            `;
          }
        },

        async search() {
          const query = document.getElementById('memory-search').value.trim();
          if (!query) {
            alert('Bitte gib einen Suchbegriff ein!');
            return;
          }

          const contentDiv = document.getElementById('memory-content');
          contentDiv.innerHTML = '<div style="text-align: center; padding: 40px;"><div style="font-size: 48px;">🔎</div><p>Suche nach: "' + query + '"...</p></div>';
          
          try {
            const response = await fetch(`http://localhost:9986/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            const memories = data.memories || [];
            
            if (memories.length === 0) {
              contentDiv.innerHTML = `
                <div style="text-align: center; color: var(--text-tertiary); padding: 40px;">
                  <div style="font-size: 48px; margin-bottom: 10px;">🔍</div>
                  <p>Keine Ergebnisse für "${query}"</p>
                </div>
              `;
              return;
            }

            let html = `<h3 style="margin-bottom: 20px;">🔎 Suchergebnisse für "${query}" (${memories.length})</h3>`;
            
            if (data.aiInsight) {
              html += `
                <div class="ai-summary" style="margin-bottom: 20px;">
                  <div style="font-weight: bold; margin-bottom: 10px;">🧠 AI Insight:</div>
                  ${data.aiInsight}
                </div>
              `;
            }

            html += memories.map(mem => {
              const icon = mem.type === 'conversation' ? '💬' : mem.type === 'quest' ? '🎯' : '📖';
              const time = new Date(mem.timestamp).toLocaleString('de-DE');
              const tags = mem.tags || mem.metadata?.tags || [];
              
              let bodyContent = '';
              if (mem.type === 'conversation') {
                bodyContent = `
                  <div><strong>User:</strong> ${mem.content || mem.metadata?.userMessage || 'N/A'}</div>
                  <div><strong>Luna:</strong> ${mem.metadata?.lunaResponse || 'N/A'}</div>
                `;
              } else {
                bodyContent = mem.content || JSON.stringify(mem.metadata || {});
              }

              return `
                <div class="memory-item">
                  <div class="memory-header">
                    <div class="memory-icon">${icon}</div>
                    <div class="memory-title">${mem.type || 'Memory'}</div>
                    <div class="memory-time">${time}</div>
                  </div>
                  <div class="memory-body">${bodyContent}</div>
                  ${tags.length > 0 ? `
                    <div class="memory-tags">
                      ${tags.map(tag => `<span class="memory-tag">${tag}</span>`).join('')}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('');

            contentDiv.innerHTML = html;

          } catch (error) {
            contentDiv.innerHTML = `
              <div style="text-align: center; color: var(--error); padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 10px;">⚠️</div>
                <p>Fehler bei der Suche</p>
                <p style="font-size: 14px;">${error.message}</p>
              </div>
            `;
          }
        }
      };

      // Auto-load memories on start
      window.memoryViewer.loadMemories();
    }
  },

  // ==================== COLLECTIVE STORYTELLING ====================

  'story-editor': {
    name: 'Story Editor',
    icon: '📝',
    description: 'Schreibe deine Geschichten mit AI-Unterstützung',
    category: 'Creativity',
    version: '1.0.0',
    author: 'Luna System',
    dependencies: ['memory-system', 'groq-api'],
    loader: async (container) => {
      container.innerHTML = `
        <div class="card">
          <div style="background: linear-gradient(135deg, #f093fb, #f5576c); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 15px;">
              <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 32px;">
                📝
              </div>
              <div>
                <h2 style="margin: 0; font-size: 28px;">Story Editor</h2>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">Luna's Spielplatz für die Fantasie</p>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
            <button onclick="window.storyEditor.newStory()" class="btn btn-primary">
              ✨ Neue Geschichte
            </button>
            <button onclick="window.storyEditor.saveStory()" class="btn btn-success">
              💾 Speichern
            </button>
            <button onclick="window.storyEditor.enhanceStory('plot')" class="btn btn-secondary">
              🎭 AI: Plot Enhancement
            </button>
            <button onclick="window.storyEditor.enhanceStory('character')" class="btn btn-secondary">
              👤 AI: Charaktere
            </button>
            <button onclick="window.storyEditor.enhanceStory('style')" class="btn btn-secondary">
              ✍️ AI: Stil
            </button>
            <button onclick="loadModule('story-library')" class="btn btn-info">
              📖 Zur Library
            </button>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 300px; gap: 20px;">
            <div>
              <div style="margin-bottom: 15px;">
                <input type="text" id="story-title" placeholder="Titel deiner Geschichte..." 
                  style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border); font-size: 18px; font-weight: bold;">
              </div>
              
              <div style="margin-bottom: 15px;">
                <input type="text" id="story-tags" placeholder="Tags (z.B. fantasy, abenteuer, sci-fi)..." 
                  style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border);">
              </div>

              <textarea id="story-content" placeholder="Es war einmal...

Luna's Tipp: Lass deiner Fantasie freien Lauf! Du kannst jederzeit AI-Unterstützung für Plot, Charaktere oder Stil-Verbesserungen nutzen."
                style="width: 100%; height: 500px; padding: 15px; border-radius: 8px; border: 1px solid var(--border); font-family: 'Georgia', serif; font-size: 16px; line-height: 1.8; resize: vertical;">
              </textarea>

              <div style="display: flex; gap: 10px; margin-top: 10px; color: var(--text-tertiary); font-size: 14px;">
                <span id="word-count">0 Wörter</span>
                <span>•</span>
                <span id="char-count">0 Zeichen</span>
                <span>•</span>
                <span id="auto-save-status">Nicht gespeichert</span>
              </div>
            </div>

            <div style="background: var(--bg-secondary); padding: 20px; border-radius: 12px; height: fit-content;">
              <h3 style="margin-top: 0;">🤖 Luna's Tipps</h3>
              <div id="luna-suggestions" style="color: var(--text-secondary); font-size: 14px; line-height: 1.6;">
                <p><strong>Willkommen im Story Editor!</strong></p>
                <p>• Schreibe frei und kreativ</p>
                <p>• Nutze AI für Inspiration</p>
                <p>• Auto-Save aktiviert ✅</p>
                <p>• Teile deine Geschichten</p>
              </div>

              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border);">
                <h4>Sichtbarkeit</h4>
                <label style="display: block; margin-bottom: 8px; cursor: pointer;">
                  <input type="radio" name="visibility" value="public" checked> 
                  🌍 Öffentlich
                </label>
                <label style="display: block; margin-bottom: 8px; cursor: pointer;">
                  <input type="radio" name="visibility" value="private"> 
                  🔒 Privat
                </label>
                <label style="display: block; cursor: pointer;">
                  <input type="radio" name="visibility" value="collaborative"> 
                  🤝 Kollaborativ
                </label>
              </div>
            </div>
          </div>
        </div>

        <style>
          #story-content:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }
        </style>
      `;

      // Story Editor Logic
      window.storyEditor = {
        currentStory: null,
        autoSaveTimer: null,

        init() {
          const content = document.getElementById('story-content');
          const title = document.getElementById('story-title');
          
          // Word & Character count
          content.addEventListener('input', () => {
            this.updateStats();
            this.scheduleAutoSave();
          });

          title.addEventListener('input', () => {
            this.scheduleAutoSave();
          });

          this.updateStats();
        },

        updateStats() {
          const content = document.getElementById('story-content').value;
          const words = content.trim() ? content.trim().split(/\s+/).length : 0;
          const chars = content.length;

          document.getElementById('word-count').textContent = `${words} Wörter`;
          document.getElementById('char-count').textContent = `${chars} Zeichen`;
        },

        scheduleAutoSave() {
          clearTimeout(this.autoSaveTimer);
          document.getElementById('auto-save-status').textContent = '💭 Nicht gespeichert';
          
          this.autoSaveTimer = setTimeout(() => {
            this.autoSave();
          }, 3000); // Auto-save nach 3 Sekunden Inaktivität
        },

        async autoSave() {
          const title = document.getElementById('story-title').value.trim();
          const content = document.getElementById('story-content').value.trim();
          
          if (!content) return;

          try {
            document.getElementById('auto-save-status').textContent = '💾 Speichere...';
            
            await fetch('http://localhost:9986/store', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'story',
                content: title || 'Untitled Story',
                metadata: {
                  title: title || 'Untitled Story',
                  content: content,
                  tags: document.getElementById('story-tags').value.split(',').map(t => t.trim()).filter(Boolean),
                  visibility: document.querySelector('input[name="visibility"]:checked').value,
                  wordCount: content.trim().split(/\s+/).length,
                  lastEdited: Date.now()
                },
                timestamp: Date.now()
              })
            });

            document.getElementById('auto-save-status').textContent = '✅ Gespeichert';
            setTimeout(() => {
              document.getElementById('auto-save-status').textContent = 'Auto-save aktiv';
            }, 2000);
          } catch (error) {
            document.getElementById('auto-save-status').textContent = '❌ Fehler beim Speichern';
            console.error('Auto-save failed:', error);
          }
        },

        async saveStory() {
          const title = document.getElementById('story-title').value.trim();
          const content = document.getElementById('story-content').value.trim();
          
          if (!title) {
            alert('Bitte gib deiner Geschichte einen Titel!');
            return;
          }

          if (!content) {
            alert('Deine Geschichte ist noch leer!');
            return;
          }

          try {
            await this.autoSave();
            alert('✅ Geschichte gespeichert!\n\nDu findest sie in der Story Library.');
          } catch (error) {
            alert('❌ Fehler beim Speichern: ' + error.message);
          }
        },

        newStory() {
          if (document.getElementById('story-content').value.trim()) {
            if (!confirm('Aktuelle Geschichte verwerfen und neue starten?')) {
              return;
            }
          }

          document.getElementById('story-title').value = '';
          document.getElementById('story-content').value = '';
          document.getElementById('story-tags').value = '';
          document.querySelector('input[name="visibility"][value="public"]').checked = true;
          document.getElementById('auto-save-status').textContent = 'Neue Geschichte';
          this.updateStats();

          document.getElementById('luna-suggestions').innerHTML = `
            <p><strong>✨ Neue Geschichte!</strong></p>
            <p>Lass deiner Kreativität freien Lauf!</p>
            <p>Luna ist hier, um dich zu unterstützen.</p>
          `;
        },

        async enhanceStory(focusArea) {
          const content = document.getElementById('story-content').value.trim();
          
          if (!content) {
            alert('Schreibe zuerst etwas, dann kann ich dir helfen!');
            return;
          }

          if (content.length < 50) {
            alert('Schreibe mindestens ein paar Sätze, dann kann ich bessere Vorschläge machen!');
            return;
          }

          try {
            document.getElementById('luna-suggestions').innerHTML = `
              <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; animation: pulse 1s infinite;">🤖</div>
                <p>Luna analysiert deine Geschichte...</p>
              </div>
            `;

            const response = await fetch('http://localhost:9987/story/enhance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                story: content,
                focusArea: focusArea,
                tone: 'balanced'
              })
            });

            const data = await response.json();
            
            if (data.enhancements && data.enhancements.length > 0) {
              let html = `<p><strong>🤖 Luna's Vorschläge:</strong></p>`;
              
              data.enhancements.forEach((enhancement, idx) => {
                html += `
                  <div style="background: var(--bg-primary); padding: 10px; border-radius: 8px; margin: 10px 0; border-left: 3px solid var(--primary);">
                    <strong>${enhancement.type}:</strong><br>
                    <span style="font-size: 13px;">${enhancement.suggestion}</span>
                  </div>
                `;
              });

              if (data.aiAnalysis) {
                html += `
                  <div style="margin-top: 15px; padding: 10px; background: rgba(102, 126, 234, 0.1); border-radius: 8px;">
                    <strong>💭 Analyse:</strong><br>
                    <span style="font-size: 13px;">${data.aiAnalysis}</span>
                  </div>
                `;
              }

              document.getElementById('luna-suggestions').innerHTML = html;
            } else {
              document.getElementById('luna-suggestions').innerHTML = `
                <p><strong>✨ Gut gemacht!</strong></p>
                <p>Deine Geschichte ist bereits sehr gut! Luna hat keine weiteren Verbesserungsvorschläge.</p>
              `;
            }
          } catch (error) {
            document.getElementById('luna-suggestions').innerHTML = `
              <p><strong>⚠️ Fehler</strong></p>
              <p>Luna kann gerade nicht helfen. Ist der Groq Service aktiv?</p>
              <p style="font-size: 12px;">${error.message}</p>
            `;
          }
        }
      };

      // Initialize
      window.storyEditor.init();
    }
  },

  'story-library': {
    name: 'Story Library',
    icon: '📖',
    description: 'Alle gespeicherten Geschichten - Luna\'s Geschichten-Marktplatz',
    category: 'Creativity',
    version: '1.0.0',
    author: 'Luna System',
    dependencies: ['memory-system'],
    loader: async (container) => {
      container.innerHTML = `
        <div class="card">
          <div style="background: linear-gradient(135deg, #fa709a, #fee140); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 15px;">
              <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 32px;">
                📖
              </div>
              <div>
                <h2 style="margin: 0; font-size: 28px;">Story Library</h2>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">Geschichten-Marktplatz der Fantasie</p>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
            <button onclick="loadModule('story-editor')" class="btn btn-primary">
              ✨ Neue Geschichte schreiben
            </button>
            <button onclick="window.storyLibrary.loadStories()" class="btn btn-secondary">
              🔄 Aktualisieren
            </button>
            <select id="story-filter" onchange="window.storyLibrary.filterStories()" 
              style="padding: 10px; border-radius: 8px; border: 1px solid var(--border);">
              <option value="all">Alle Geschichten</option>
              <option value="public">Öffentlich</option>
              <option value="private">Privat</option>
              <option value="collaborative">Kollaborativ</option>
            </select>
            <input type="text" id="story-search" placeholder="🔍 Suche..." 
              style="flex: 1; padding: 10px; border-radius: 8px; border: 1px solid var(--border);"
              oninput="window.storyLibrary.searchStories()">
          </div>

          <div id="story-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 20px;">
            <div class="stat-card">
              <div class="stat-value" id="total-stories">0</div>
              <div class="stat-label">Geschichten</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" id="total-words">0</div>
              <div class="stat-label">Wörter geschrieben</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" id="public-stories">0</div>
              <div class="stat-label">Öffentlich</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" id="recent-stories">0</div>
              <div class="stat-label">Letzte 7 Tage</div>
            </div>
          </div>

          <div id="story-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px;">
            <div style="text-align: center; color: var(--text-tertiary); padding: 40px; grid-column: 1 / -1;">
              <div style="font-size: 48px; margin-bottom: 10px;">📚</div>
              <p>Klicke auf "Aktualisieren" um Geschichten zu laden</p>
            </div>
          </div>
        </div>

        <style>
          .story-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            transition: all 0.2s;
            cursor: pointer;
            position: relative;
          }
          .story-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
            border-color: var(--primary);
          }
          .story-card-header {
            display: flex;
            align-items: start;
            gap: 10px;
            margin-bottom: 12px;
          }
          .story-icon {
            font-size: 32px;
            flex-shrink: 0;
          }
          .story-title {
            font-size: 18px;
            font-weight: bold;
            color: var(--text-primary);
            margin-bottom: 5px;
          }
          .story-meta {
            font-size: 12px;
            color: var(--text-tertiary);
          }
          .story-preview {
            color: var(--text-secondary);
            font-size: 14px;
            line-height: 1.6;
            margin: 12px 0;
            max-height: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .story-tags {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
            margin-top: 12px;
          }
          .story-tag {
            background: var(--primary);
            color: white;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 11px;
          }
          .story-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid var(--border);
          }
          .story-action-btn {
            flex: 1;
            padding: 8px;
            border-radius: 6px;
            border: 1px solid var(--border);
            background: var(--bg-primary);
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
          }
          .story-action-btn:hover {
            background: var(--primary);
            color: white;
            border-color: var(--primary);
          }
        </style>
      `;

      // Story Library Logic
      window.storyLibrary = {
        allStories: [],

        async loadStories() {
          const grid = document.getElementById('story-grid');
          grid.innerHTML = '<div style="text-align: center; padding: 40px; grid-column: 1 / -1;"><div style="font-size: 48px; animation: spin 1s linear infinite;">⏳</div><p>Lade Geschichten...</p></div>';

          try {
            const response = await fetch('http://localhost:9995/memories');
            const data = await response.json();
            const memories = Array.isArray(data) ? data : data.value || [];
            
            this.allStories = memories.filter(m => m.type === 'story');

            // Update stats
            document.getElementById('total-stories').textContent = this.allStories.length;
            
            const totalWords = this.allStories.reduce((sum, story) => {
              return sum + (story.metadata?.wordCount || 0);
            }, 0);
            document.getElementById('total-words').textContent = totalWords.toLocaleString();

            const publicStories = this.allStories.filter(s => s.metadata?.visibility === 'public');
            document.getElementById('public-stories').textContent = publicStories.length;

            const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            const recentStories = this.allStories.filter(s => s.timestamp > weekAgo);
            document.getElementById('recent-stories').textContent = recentStories.length;

            this.renderStories(this.allStories);
          } catch (error) {
            grid.innerHTML = `
              <div style="text-align: center; color: var(--error); padding: 40px; grid-column: 1 / -1;">
                <div style="font-size: 48px; margin-bottom: 10px;">⚠️</div>
                <p>Fehler beim Laden der Geschichten</p>
                <p style="font-size: 14px;">${error.message}</p>
              </div>
            `;
          }
        },

        renderStories(stories) {
          const grid = document.getElementById('story-grid');

          if (stories.length === 0) {
            grid.innerHTML = `
              <div style="text-align: center; color: var(--text-tertiary); padding: 40px; grid-column: 1 / -1;">
                <div style="font-size: 48px; margin-bottom: 10px;">📝</div>
                <p>Noch keine Geschichten vorhanden</p>
                <button onclick="loadModule('story-editor')" class="btn btn-primary" style="margin-top: 15px;">
                  ✨ Erste Geschichte schreiben
                </button>
              </div>
            `;
            return;
          }

          grid.innerHTML = stories.map((story, idx) => {
            const metadata = story.metadata || {};
            const title = metadata.title || story.content || 'Untitled Story';
            const content = metadata.content || '';
            const preview = content.substring(0, 150) + (content.length > 150 ? '...' : '');
            const tags = metadata.tags || [];
            const visibility = metadata.visibility || 'private';
            const wordCount = metadata.wordCount || 0;
            const date = new Date(story.timestamp).toLocaleDateString('de-DE');

            const visibilityIcon = visibility === 'public' ? '🌍' : visibility === 'collaborative' ? '🤝' : '🔒';

            return `
              <div class="story-card">
                <div class="story-card-header">
                  <div class="story-icon">📖</div>
                  <div style="flex: 1;">
                    <div class="story-title">${title}</div>
                    <div class="story-meta">
                      ${visibilityIcon} ${visibility} • ${wordCount} Wörter • ${date}
                    </div>
                  </div>
                </div>
                <div class="story-preview">${preview}</div>
                ${tags.length > 0 ? `
                  <div class="story-tags">
                    ${tags.map(tag => `<span class="story-tag">${tag}</span>`).join('')}
                  </div>
                ` : ''}
                <div class="story-actions">
                  <button class="story-action-btn" onclick="window.storyLibrary.readStory(${idx})">
                    📖 Lesen
                  </button>
                  <button class="story-action-btn" onclick="window.storyLibrary.editStory(${idx})">
                    ✏️ Bearbeiten
                  </button>
                  <button class="story-action-btn" onclick="window.storyLibrary.shareStory(${idx})">
                    🔗 Teilen
                  </button>
                </div>
              </div>
            `;
          }).join('');
        },

        filterStories() {
          const filter = document.getElementById('story-filter').value;
          
          if (filter === 'all') {
            this.renderStories(this.allStories);
          } else {
            const filtered = this.allStories.filter(s => s.metadata?.visibility === filter);
            this.renderStories(filtered);
          }
        },

        searchStories() {
          const query = document.getElementById('story-search').value.toLowerCase();
          
          if (!query) {
            this.filterStories();
            return;
          }

          const filtered = this.allStories.filter(story => {
            const title = (story.metadata?.title || '').toLowerCase();
            const content = (story.metadata?.content || '').toLowerCase();
            const tags = (story.metadata?.tags || []).join(' ').toLowerCase();
            
            return title.includes(query) || content.includes(query) || tags.includes(query);
          });

          this.renderStories(filtered);
        },

        readStory(idx) {
          const story = this.allStories[idx];
          const metadata = story.metadata || {};
          
          const modal = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999;" onclick="this.remove()">
              <div style="background: var(--bg-primary); max-width: 800px; max-height: 80vh; overflow-y: auto; border-radius: 16px; padding: 40px; position: relative;" onclick="event.stopPropagation()">
                <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
                <h2 style="margin-top: 0; font-size: 32px;">${metadata.title || 'Untitled Story'}</h2>
                <div style="color: var(--text-tertiary); margin-bottom: 20px; font-size: 14px;">
                  ${metadata.wordCount || 0} Wörter • ${new Date(story.timestamp).toLocaleDateString('de-DE')}
                </div>
                ${metadata.tags?.length > 0 ? `
                  <div style="display: flex; gap: 8px; margin-bottom: 20px;">
                    ${metadata.tags.map(tag => `<span style="background: var(--primary); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">${tag}</span>`).join('')}
                  </div>
                ` : ''}
                <div style="font-family: 'Georgia', serif; font-size: 18px; line-height: 1.8; white-space: pre-wrap;">
                  ${metadata.content || ''}
                </div>
              </div>
            </div>
          `;

          document.body.insertAdjacentHTML('beforeend', modal);
        },

        editStory(idx) {
          const story = this.allStories[idx];
          const metadata = story.metadata || {};
          
          // Switch to Story Editor
          loadModule('story-editor');
          
          // Wait for module to load, then populate
          setTimeout(() => {
            document.getElementById('story-title').value = metadata.title || '';
            document.getElementById('story-content').value = metadata.content || '';
            document.getElementById('story-tags').value = (metadata.tags || []).join(', ');
            
            const visibility = metadata.visibility || 'private';
            document.querySelector(`input[name="visibility"][value="${visibility}"]`).checked = true;
            
            window.storyEditor.updateStats();
          }, 100);
        },

        shareStory(idx) {
          const story = this.allStories[idx];
          const metadata = story.metadata || {};
          const title = metadata.title || 'Untitled Story';
          
          // Create shareable link (placeholder - would need backend)
          const shareText = `Schau dir meine Geschichte an: "${title}"`;
          
          if (navigator.share) {
            navigator.share({
              title: title,
              text: shareText
            }).catch(console.error);
          } else {
            navigator.clipboard.writeText(shareText);
            alert('✅ Link in Zwischenablage kopiert!');
          }
        }
      };

      // Auto-load stories
      window.storyLibrary.loadStories();
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

  // ==================== STORYTELLING ====================

  'story-editor': {
    name: 'Story Editor',
    icon: '📝',
    description: 'Schreibe und teile deine Geschichten mit AI-Unterstützung',
    category: 'AI',
    version: '1.0.0',
    author: 'Luna System',
    dependencies: ['memory-groq-integration'],
    loader: async (container) => {
      container.innerHTML = `
        <div class="card">
          <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 15px;">
              <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 32px;">
                📝
              </div>
              <div>
                <h2 style="margin: 0; font-size: 28px;">Story Editor</h2>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">Collective Storytelling Platform</p>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 15px; margin-bottom: 20px;">
            <input type="text" id="story-title" placeholder="📖 Story Title..." 
              style="flex: 1; padding: 12px; border-radius: 8px; border: 1px solid var(--border); font-size: 18px; font-weight: bold;">
            <button onclick="window.storyEditor.saveStory()" class="btn btn-primary">
              💾 Save Story
            </button>
            <button onclick="window.storyEditor.enhanceStory()" class="btn btn-secondary">
              🤖 AI Enhance
            </button>
            <button onclick="window.storyEditor.clearEditor()" class="btn">
              🗑️ Clear
            </button>
          </div>

          <div style="display: flex; gap: 15px; margin-bottom: 20px;">
            <input type="text" id="story-tags" placeholder="🏷️ Tags (comma separated)..." 
              style="flex: 1; padding: 10px; border-radius: 8px; border: 1px solid var(--border);">
            <select id="story-visibility" style="padding: 10px; border-radius: 8px; border: 1px solid var(--border);">
              <option value="public">🌐 Public</option>
              <option value="private">🔒 Private</option>
              <option value="collaborative">👥 Collaborative</option>
            </select>
          </div>

          <div id="story-editor-content" 
            contenteditable="true" 
            style="
              background: var(--bg-secondary); 
              border: 2px solid var(--border); 
              border-radius: 12px; 
              padding: 20px; 
              min-height: 400px; 
              max-height: 600px; 
              overflow-y: auto;
              font-size: 16px;
              line-height: 1.8;
              color: var(--text-primary);
              outline: none;
            "
            placeholder="Es war einmal...">
          </div>

          <div style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center;">
            <div id="story-stats" style="color: var(--text-tertiary); font-size: 14px;">
              Words: 0 | Characters: 0
            </div>
            <div style="display: flex; gap: 10px;">
              <button onclick="window.storyEditor.formatBold()" class="btn-icon" title="Bold">
                <strong>B</strong>
              </button>
              <button onclick="window.storyEditor.formatItalic()" class="btn-icon" title="Italic">
                <em>I</em>
              </button>
              <button onclick="window.storyEditor.formatHeading()" class="btn-icon" title="Heading">
                H
              </button>
            </div>
          </div>

          <div id="ai-suggestions" style="margin-top: 20px; display: none;">
            <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1)); border: 2px solid var(--primary); border-radius: 12px; padding: 20px;">
              <h3 style="margin-top: 0; display: flex; align-items: center; gap: 10px;">
                <span>🤖</span> AI Enhancement Suggestions
              </h3>
              <div id="ai-suggestions-content"></div>
            </div>
          </div>
        </div>

        <style>
          #story-editor-content:empty:before {
            content: attr(placeholder);
            color: var(--text-tertiary);
            font-style: italic;
          }
          .btn-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            border: 1px solid var(--border);
            background: var(--bg-secondary);
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.2s;
          }
          .btn-icon:hover {
            background: var(--primary);
            color: white;
            transform: scale(1.1);
          }
          .enhancement-item {
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
          }
          .enhancement-item h4 {
            margin: 0 0 10px 0;
            color: var(--primary);
          }
          .enhancement-item button {
            margin-top: 10px;
          }
        </style>
      `;

      // Story Editor Logic
      window.storyEditor = {
        updateStats() {
          const editor = document.getElementById('story-editor-content');
          const text = editor.innerText || '';
          const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
          const chars = text.length;
          document.getElementById('story-stats').textContent = `Words: ${words} | Characters: ${chars}`;
        },

        formatBold() {
          document.execCommand('bold', false, null);
        },

        formatItalic() {
          document.execCommand('italic', false, null);
        },

        formatHeading() {
          document.execCommand('formatBlock', false, '<h2>');
        },

        clearEditor() {
          if (confirm('Clear the editor? This cannot be undone.')) {
            document.getElementById('story-title').value = '';
            document.getElementById('story-editor-content').innerHTML = '';
            document.getElementById('story-tags').value = '';
            document.getElementById('story-visibility').value = 'public';
            document.getElementById('ai-suggestions').style.display = 'none';
            this.updateStats();
          }
        },

        async saveStory() {
          const title = document.getElementById('story-title').value.trim();
          const content = document.getElementById('story-editor-content').innerHTML;
          const contentText = document.getElementById('story-editor-content').innerText;
          const tags = document.getElementById('story-tags').value.split(',').map(t => t.trim()).filter(t => t);
          const visibility = document.getElementById('story-visibility').value;

          if (!title) {
            alert('⚠️ Please enter a story title!');
            return;
          }

          if (!contentText.trim()) {
            alert('⚠️ Please write some content!');
            return;
          }

          try {
            // Save to Memory System as 'story' type
            const response = await fetch('http://localhost:9995/remember', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'story',
                content: contentText,
                metadata: {
                  title: title,
                  htmlContent: content,
                  tags: tags,
                  visibility: visibility,
                  author: 'User',
                  wordCount: contentText.trim().split(/\s+/).length,
                  createdAt: Date.now()
                },
                timestamp: Date.now()
              })
            });

            if (response.ok) {
              alert('✅ Story saved successfully!');
              
              // Optional: Clear editor
              if (confirm('Story saved! Clear editor for new story?')) {
                this.clearEditor();
              }
            } else {
              alert('❌ Failed to save story. Please try again.');
            }
          } catch (error) {
            console.error('Save error:', error);
            alert('❌ Error saving story: ' + error.message);
          }
        },

        async enhanceStory() {
          const content = document.getElementById('story-editor-content').innerText;
          
          if (!content.trim()) {
            alert('⚠️ Please write some content first!');
            return;
          }

          const suggestionsDiv = document.getElementById('ai-suggestions');
          const contentDiv = document.getElementById('ai-suggestions-content');
          
          suggestionsDiv.style.display = 'block';
          contentDiv.innerHTML = '<div style="text-align: center; padding: 20px;"><div style="font-size: 32px; animation: spin 1s linear infinite;">🤖</div><p>AI analyzing your story...</p></div>';

          try {
            const response = await fetch('http://localhost:9987/story/enhance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                story: content,
                focusArea: 'all',
                tone: 'balanced'
              })
            });

            const data = await response.json();
            
            if (data.enhancements && data.enhancements.length > 0) {
              contentDiv.innerHTML = data.enhancements.map(enh => `
                <div class="enhancement-item">
                  <h4>${this.getEnhancementIcon(enh.type)} ${enh.type.toUpperCase()}</h4>
                  <p>${enh.suggestion}</p>
                  ${enh.example ? `<div style="background: var(--bg-secondary); padding: 10px; border-radius: 6px; margin-top: 10px; font-style: italic;">"${enh.example}"</div>` : ''}
                  <button onclick="window.storyEditor.applyEnhancement('${enh.insertAt || 'end'}', \`${enh.example || ''}\`)" class="btn btn-secondary btn-sm">
                    Apply Suggestion
                  </button>
                </div>
              `).join('');

              if (data.aiAnalysis) {
                contentDiv.innerHTML += `
                  <div style="margin-top: 20px; padding: 15px; background: var(--bg-secondary); border-radius: 8px;">
                    <h4>📊 AI Analysis</h4>
                    <p>${data.aiAnalysis}</p>
                  </div>
                `;
              }
            } else {
              contentDiv.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No enhancements needed - your story looks great! ✨</p>';
            }
          } catch (error) {
            console.error('Enhancement error:', error);
            contentDiv.innerHTML = `
              <div style="text-align: center; color: var(--error); padding: 20px;">
                <p>⚠️ Enhancement service unavailable</p>
                <p style="font-size: 14px;">${error.message}</p>
              </div>
            `;
          }
        },

        getEnhancementIcon(type) {
          const icons = {
            'plot': '📖',
            'character': '👤',
            'style': '🎨',
            'dialogue': '💬',
            'description': '🖼️',
            'pacing': '⚡',
            'emotion': '❤️'
          };
          return icons[type] || '✨';
        },

        applyEnhancement(position, text) {
          const editor = document.getElementById('story-editor-content');
          if (position === 'end') {
            editor.innerHTML += '<p>' + text + '</p>';
          } else {
            // Insert at cursor or position
            editor.innerHTML += '<p>' + text + '</p>';
          }
          this.updateStats();
          alert('✅ Enhancement applied!');
        }
      };

      // Auto-update stats
      const editor = document.getElementById('story-editor-content');
      editor.addEventListener('input', () => window.storyEditor.updateStats());
      
      // Initialize stats
      window.storyEditor.updateStats();
    }
  },

  'story-library': {
    name: 'Story Library',
    icon: '📖',
    description: 'Alle gespeicherten Geschichten durchsuchen und lesen',
    category: 'AI',
    version: '1.0.0',
    author: 'Luna System',
    dependencies: ['memory-system'],
    loader: async (container) => {
      container.innerHTML = `
        <div class="card">
          <div style="background: linear-gradient(135deg, #06b6d4, #0891b2); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 15px;">
              <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 32px;">
                📖
              </div>
              <div>
                <h2 style="margin: 0; font-size: 28px;">Story Library</h2>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">Collective Story Collection</p>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 15px; margin-bottom: 20px;">
            <input type="text" id="story-search" placeholder="🔎 Search stories..." 
              style="flex: 1; padding: 10px; border-radius: 8px; border: 1px solid var(--border);"
              onkeypress="if(event.key==='Enter') window.storyLibrary.search()">
            <select id="story-filter" onchange="window.storyLibrary.filterStories()" style="padding: 10px; border-radius: 8px; border: 1px solid var(--border);">
              <option value="all">All Stories</option>
              <option value="public">Public Only</option>
              <option value="private">Private Only</option>
              <option value="collaborative">Collaborative</option>
            </select>
            <button onclick="window.storyLibrary.loadStories()" class="btn btn-primary">
              🔄 Refresh
            </button>
          </div>

          <div id="story-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
            <div class="stat-card">
              <div class="stat-value" id="total-stories">0</div>
              <div class="stat-label">Total Stories</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" id="total-words">0</div>
              <div class="stat-label">Total Words</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" id="public-stories">0</div>
              <div class="stat-label">Public</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" id="private-stories">0</div>
              <div class="stat-label">Private</div>
            </div>
          </div>

          <div id="stories-content" style="background: var(--bg-secondary); border-radius: 12px; padding: 20px; min-height: 400px; max-height: 600px; overflow-y: auto;">
            <div style="text-align: center; color: var(--text-tertiary); padding: 40px;">
              <div style="font-size: 48px; margin-bottom: 10px;">📚</div>
              <p>Click "Refresh" to load stories</p>
            </div>
          </div>
        </div>

        <style>
          .story-card {
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 15px;
            transition: all 0.2s;
            cursor: pointer;
          }
          .story-card:hover {
            transform: translateX(5px);
            border-color: var(--primary);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .story-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .story-title {
            font-size: 20px;
            font-weight: bold;
            color: var(--text-primary);
          }
          .story-visibility {
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
          }
          .visibility-public {
            background: rgba(16, 185, 129, 0.2);
            color: #10b981;
          }
          .visibility-private {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
          }
          .visibility-collaborative {
            background: rgba(59, 130, 246, 0.2);
            color: #3b82f6;
          }
          .story-preview {
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 10px;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .story-meta {
            display: flex;
            gap: 15px;
            font-size: 12px;
            color: var(--text-tertiary);
          }
          .story-tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 10px;
          }
          .story-tag {
            background: var(--primary);
            color: white;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
          }
        </style>
      `;

      // Story Library Logic
      window.storyLibrary = {
        allStories: [],

        async loadStories() {
          const contentDiv = document.getElementById('stories-content');
          contentDiv.innerHTML = '<div style="text-align: center; padding: 40px;"><div style="font-size: 48px; animation: spin 1s linear infinite;">📚</div><p>Loading stories...</p></div>';
          
          try {
            const response = await fetch('http://localhost:9995/memories');
            const data = await response.json();
            const memories = Array.isArray(data) ? data : data.value || [];
            
            // Filter for stories only
            this.allStories = memories.filter(m => m.type === 'story');

            // Update stats
            document.getElementById('total-stories').textContent = this.allStories.length;
            const totalWords = this.allStories.reduce((sum, s) => sum + (s.metadata?.wordCount || 0), 0);
            document.getElementById('total-words').textContent = totalWords.toLocaleString();
            const publicCount = this.allStories.filter(s => s.metadata?.visibility === 'public').length;
            const privateCount = this.allStories.filter(s => s.metadata?.visibility === 'private').length;
            document.getElementById('public-stories').textContent = publicCount;
            document.getElementById('private-stories').textContent = privateCount;

            this.renderStories(this.allStories);
          } catch (error) {
            contentDiv.innerHTML = `
              <div style="text-align: center; color: var(--error); padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 10px;">⚠️</div>
                <p>Failed to load stories</p>
                <p style="font-size: 14px;">${error.message}</p>
              </div>
            `;
          }
        },

        renderStories(stories) {
          const contentDiv = document.getElementById('stories-content');
          
          if (stories.length === 0) {
            contentDiv.innerHTML = `
              <div style="text-align: center; color: var(--text-tertiary); padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 10px;">📝</div>
                <p>No stories yet.</p>
                <p style="font-size: 14px;">Create your first story in the Story Editor!</p>
              </div>
            `;
            return;
          }

          contentDiv.innerHTML = stories.map(story => {
            const title = story.metadata?.title || 'Untitled Story';
            const preview = story.content?.substring(0, 200) || '';
            const visibility = story.metadata?.visibility || 'public';
            const visibilityIcon = visibility === 'public' ? '🌐' : visibility === 'private' ? '🔒' : '👥';
            const tags = story.metadata?.tags || [];
            const wordCount = story.metadata?.wordCount || 0;
            const time = new Date(story.timestamp).toLocaleString('de-DE');
            const author = story.metadata?.author || 'Unknown';

            return `
              <div class="story-card" onclick="window.storyLibrary.viewStory(${story.id || `'${story.timestamp}'`})">
                <div class="story-header">
                  <div class="story-title">📖 ${title}</div>
                  <div class="story-visibility visibility-${visibility}">
                    ${visibilityIcon} ${visibility}
                  </div>
                </div>
                <div class="story-preview">${preview}${preview.length >= 200 ? '...' : ''}</div>
                <div class="story-meta">
                  <span>✍️ ${author}</span>
                  <span>📝 ${wordCount} words</span>
                  <span>🕐 ${time}</span>
                </div>
                ${tags.length > 0 ? `
                  <div class="story-tags">
                    ${tags.map(tag => `<span class="story-tag">${tag}</span>`).join('')}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('');
        },

        filterStories() {
          const filter = document.getElementById('story-filter').value;
          let filtered = this.allStories;

          if (filter !== 'all') {
            filtered = this.allStories.filter(s => s.metadata?.visibility === filter);
          }

          this.renderStories(filtered);
        },

        search() {
          const query = document.getElementById('story-search').value.trim().toLowerCase();
          
          if (!query) {
            this.renderStories(this.allStories);
            return;
          }

          const filtered = this.allStories.filter(story => {
            const title = (story.metadata?.title || '').toLowerCase();
            const content = (story.content || '').toLowerCase();
            const tags = (story.metadata?.tags || []).join(' ').toLowerCase();
            
            return title.includes(query) || content.includes(query) || tags.includes(query);
          });

          this.renderStories(filtered);
        },

        viewStory(id) {
          const story = this.allStories.find(s => s.id === id || s.timestamp === id);
          if (!story) return;

          const modal = document.createElement('div');
          modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
          `;

          modal.innerHTML = `
            <div style="
              background: var(--bg-primary);
              border-radius: 12px;
              padding: 30px;
              max-width: 800px;
              max-height: 90vh;
              overflow-y: auto;
              position: relative;
            ">
              <button onclick="this.parentElement.parentElement.remove()" style="
                position: absolute;
                top: 20px;
                right: 20px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: none;
                background: var(--error);
                color: white;
                font-size: 20px;
                cursor: pointer;
              ">×</button>
              
              <h1 style="margin-top: 0;">${story.metadata?.title || 'Untitled'}</h1>
              
              <div style="display: flex; gap: 15px; margin-bottom: 20px; color: var(--text-tertiary); font-size: 14px;">
                <span>✍️ ${story.metadata?.author || 'Unknown'}</span>
                <span>📝 ${story.metadata?.wordCount || 0} words</span>
                <span>🕐 ${new Date(story.timestamp).toLocaleString('de-DE')}</span>
              </div>

              ${story.metadata?.tags?.length > 0 ? `
                <div style="display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
                  ${story.metadata.tags.map(tag => `<span class="story-tag">${tag}</span>`).join('')}
                </div>
              ` : ''}

              <div style="line-height: 1.8; color: var(--text-primary);">
                ${story.metadata?.htmlContent || story.content || ''}
              </div>
            </div>
          `;

          document.body.appendChild(modal);
        }
      };

      // Auto-load stories
      window.storyLibrary.loadStories();
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
  },

  // ═══════════════════════════════════════════════════════════
  // 🌙 PHASE 4.2: DREAMSCAPE PLATFORM - DREAM CANVAS
  // ═══════════════════════════════════════════════════════════
  'dream-canvas': {
    name: '🌙 Dream Canvas',
    category: 'Kreativ',
    description: 'Visualisiere deine Träume - Luna hilft dir',
    async load() {
      return `
        <style>
          .dream-container {
            display: grid;
            grid-template-columns: 280px 1fr 320px;
            gap: 20px;
            height: calc(100vh - 180px);
          }
          
          /* Element Library Sidebar */
          .dream-library {
            background: var(--bg-secondary);
            border-radius: 12px;
            padding: 20px;
            overflow-y: auto;
          }
          .dream-library h3 {
            font-size: 16px;
            margin-bottom: 15px;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .dream-category {
            margin-bottom: 20px;
          }
          .dream-category-title {
            font-size: 12px;
            text-transform: uppercase;
            color: var(--text-secondary);
            margin-bottom: 10px;
            font-weight: 600;
          }
          .dream-elements {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }
          .dream-element {
            aspect-ratio: 1;
            background: var(--bg-tertiary);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            cursor: grab;
            transition: all 0.2s;
            position: relative;
          }
          .dream-element:hover {
            background: var(--accent-primary);
            transform: scale(1.1);
          }
          .dream-element:active {
            cursor: grabbing;
          }
          .dream-element-label {
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 9px;
            color: var(--text-tertiary);
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.2s;
          }
          .dream-element:hover .dream-element-label {
            opacity: 1;
          }

          /* Main Dream Canvas */
          .dream-canvas-area {
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
            border-radius: 12px;
            position: relative;
            overflow: hidden;
            box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.5);
          }
          .dream-canvas {
            width: 100%;
            height: 100%;
            position: relative;
          }
          .dream-stars {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              radial-gradient(2px 2px at 20% 30%, white, transparent),
              radial-gradient(2px 2px at 60% 70%, white, transparent),
              radial-gradient(1px 1px at 50% 50%, white, transparent),
              radial-gradient(1px 1px at 80% 10%, white, transparent),
              radial-gradient(2px 2px at 90% 60%, white, transparent);
            background-size: 200% 200%;
            animation: twinkle 8s ease-in-out infinite;
            pointer-events: none;
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          .dream-object {
            position: absolute;
            cursor: move;
            transition: transform 0.1s;
            filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
          }
          .dream-object:hover {
            transform: scale(1.05);
            filter: drop-shadow(0 6px 20px rgba(138, 43, 226, 0.5));
          }
          .dream-object.selected {
            outline: 2px solid var(--accent-primary);
            outline-offset: 4px;
          }
          .dream-toolbar {
            position: absolute;
            top: 15px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            background: rgba(0, 0, 0, 0.7);
            padding: 10px 15px;
            border-radius: 12px;
            backdrop-filter: blur(10px);
          }
          .dream-tool-btn {
            background: var(--bg-tertiary);
            border: none;
            padding: 8px 15px;
            border-radius: 8px;
            color: var(--text-primary);
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .dream-tool-btn:hover {
            background: var(--accent-primary);
            transform: translateY(-2px);
          }
          .dream-tool-btn.active {
            background: var(--accent-primary);
            box-shadow: 0 0 20px rgba(138, 43, 226, 0.5);
          }

          /* Luna's Analysis Sidebar */
          .dream-analysis {
            background: var(--bg-secondary);
            border-radius: 12px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            overflow-y: auto;
          }
          .dream-info-card {
            background: var(--bg-tertiary);
            padding: 15px;
            border-radius: 10px;
          }
          .dream-info-card h4 {
            font-size: 14px;
            margin-bottom: 10px;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .dream-info-card p {
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.6;
          }
          .luna-interpretation {
            background: linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(102, 126, 234, 0.1));
            border-left: 3px solid var(--accent-primary);
          }
          .dream-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .dream-action-btn {
            background: var(--bg-tertiary);
            border: none;
            padding: 12px;
            border-radius: 8px;
            color: var(--text-primary);
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
            justify-content: center;
          }
          .dream-action-btn:hover {
            background: var(--accent-primary);
            transform: translateY(-2px);
          }
          .dream-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .dream-stat {
            background: var(--bg-tertiary);
            padding: 10px;
            border-radius: 8px;
            text-align: center;
          }
          .dream-stat-value {
            font-size: 20px;
            font-weight: bold;
            color: var(--accent-primary);
          }
          .dream-stat-label {
            font-size: 11px;
            color: var(--text-secondary);
            margin-top: 3px;
          }
          .dream-mood-selector {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
          .dream-mood {
            padding: 6px 12px;
            border-radius: 20px;
            background: var(--bg-tertiary);
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
            border: 2px solid transparent;
          }
          .dream-mood:hover {
            background: var(--accent-primary);
          }
          .dream-mood.active {
            background: var(--accent-primary);
            border-color: var(--accent-secondary);
          }
        </style>

        <div class="dream-container">
          <!-- Left Sidebar: Element Library -->
          <div class="dream-library">
            <h3>🎨 Element Library</h3>
            
            <div class="dream-category">
              <div class="dream-category-title">🌟 Symbole</div>
              <div class="dream-elements">
                <div class="dream-element" draggable="true" data-element="⭐">⭐<span class="dream-element-label">Stern</span></div>
                <div class="dream-element" draggable="true" data-element="🌙">🌙<span class="dream-element-label">Mond</span></div>
                <div class="dream-element" draggable="true" data-element="☀️">☀️<span class="dream-element-label">Sonne</span></div>
                <div class="dream-element" draggable="true" data-element="💫">💫<span class="dream-element-label">Glitzer</span></div>
                <div class="dream-element" draggable="true" data-element="✨">✨<span class="dream-element-label">Funken</span></div>
                <div class="dream-element" draggable="true" data-element="🔮">🔮<span class="dream-element-label">Kristall</span></div>
              </div>
            </div>

            <div class="dream-category">
              <div class="dream-category-title">👥 Charaktere</div>
              <div class="dream-elements">
                <div class="dream-element" draggable="true" data-element="🧙‍♂️">🧙‍♂️<span class="dream-element-label">Magier</span></div>
                <div class="dream-element" draggable="true" data-element="🧚">🧚<span class="dream-element-label">Fee</span></div>
                <div class="dream-element" draggable="true" data-element="👻">👻<span class="dream-element-label">Geist</span></div>
                <div class="dream-element" draggable="true" data-element="🤖">🤖<span class="dream-element-label">Robot</span></div>
                <div class="dream-element" draggable="true" data-element="👽">👽<span class="dream-element-label">Alien</span></div>
                <div class="dream-element" draggable="true" data-element="🦄">🦄<span class="dream-element-label">Einhorn</span></div>
              </div>
            </div>

            <div class="dream-category">
              <div class="dream-category-title">🏞️ Landschaften</div>
              <div class="dream-elements">
                <div class="dream-element" draggable="true" data-element="🏔️">🏔️<span class="dream-element-label">Berg</span></div>
                <div class="dream-element" draggable="true" data-element="🌊">🌊<span class="dream-element-label">Wellen</span></div>
                <div class="dream-element" draggable="true" data-element="🌲">🌲<span class="dream-element-label">Baum</span></div>
                <div class="dream-element" draggable="true" data-element="🏰">🏰<span class="dream-element-label">Schloss</span></div>
                <div class="dream-element" draggable="true" data-element="🌋">🌋<span class="dream-element-label">Vulkan</span></div>
                <div class="dream-element" draggable="true" data-element="🏝️">🏝️<span class="dream-element-label">Insel</span></div>
              </div>
            </div>

            <div class="dream-category">
              <div class="dream-category-title">🐉 Kreaturen</div>
              <div class="dream-elements">
                <div class="dream-element" draggable="true" data-element="🐉">🐉<span class="dream-element-label">Drache</span></div>
                <div class="dream-element" draggable="true" data-element="🦅">🦅<span class="dream-element-label">Adler</span></div>
                <div class="dream-element" draggable="true" data-element="🐺">🐺<span class="dream-element-label">Wolf</span></div>
                <div class="dream-element" draggable="true" data-element="🦋">🦋<span class="dream-element-label">Schmetterling</span></div>
                <div class="dream-element" draggable="true" data-element="🐙">🐙<span class="dream-element-label">Oktopus</span></div>
                <div class="dream-element" draggable="true" data-element="🦉">🦉<span class="dream-element-label">Eule</span></div>
              </div>
            </div>

            <div class="dream-category">
              <div class="dream-category-title">⚡ Energie</div>
              <div class="dream-elements">
                <div class="dream-element" draggable="true" data-element="⚡">⚡<span class="dream-element-label">Blitz</span></div>
                <div class="dream-element" draggable="true" data-element="🔥">🔥<span class="dream-element-label">Feuer</span></div>
                <div class="dream-element" draggable="true" data-element="💧">💧<span class="dream-element-label">Wasser</span></div>
                <div class="dream-element" draggable="true" data-element="🌪️">🌪️<span class="dream-element-label">Tornado</span></div>
                <div class="dream-element" draggable="true" data-element="☁️">☁️<span class="dream-element-label">Wolke</span></div>
                <div class="dream-element" draggable="true" data-element="🌈">🌈<span class="dream-element-label">Regenbogen</span></div>
              </div>
            </div>
          </div>

          <!-- Main Canvas Area -->
          <div class="dream-canvas-area">
            <div class="dream-stars"></div>
            <div class="dream-toolbar">
              <button class="dream-tool-btn" onclick="window.dreamCanvas.clearCanvas()">
                🗑️ Löschen
              </button>
              <button class="dream-tool-btn" onclick="window.dreamCanvas.generateFromText()">
                ✨ Text → Traum
              </button>
              <button class="dream-tool-btn" onclick="window.dreamCanvas.analyzeDream()">
                🔮 Luna Analyse
              </button>
              <button class="dream-tool-btn" onclick="window.dreamCanvas.saveDream()">
                💾 Speichern
              </button>
              <button class="dream-tool-btn" onclick="window.dreamCanvas.shareDream()">
                🌐 Teilen
              </button>
            </div>
            <div id="dream-canvas" class="dream-canvas"></div>
          </div>

          <!-- Right Sidebar: Analysis & Actions -->
          <div class="dream-analysis">
            <div class="dream-info-card">
              <h4>🌙 Dream Info</h4>
              <div class="dream-stats">
                <div class="dream-stat">
                  <div class="dream-stat-value" id="dream-element-count">0</div>
                  <div class="dream-stat-label">Elemente</div>
                </div>
                <div class="dream-stat">
                  <div class="dream-stat-value" id="dream-complexity">0%</div>
                  <div class="dream-stat-label">Komplexität</div>
                </div>
              </div>
            </div>

            <div class="dream-info-card">
              <h4>🎭 Traum-Stimmung</h4>
              <div class="dream-mood-selector">
                <div class="dream-mood" onclick="window.dreamCanvas.setMood('peaceful')">😌 Friedlich</div>
                <div class="dream-mood" onclick="window.dreamCanvas.setMood('mysterious')">🔮 Mysteriös</div>
                <div class="dream-mood" onclick="window.dreamCanvas.setMood('adventurous')">⚔️ Abenteuerlich</div>
                <div class="dream-mood" onclick="window.dreamCanvas.setMood('chaotic')">🌪️ Chaotisch</div>
                <div class="dream-mood" onclick="window.dreamCanvas.setMood('romantic')">💕 Romantisch</div>
                <div class="dream-mood" onclick="window.dreamCanvas.setMood('dark')">🌑 Dunkel</div>
              </div>
            </div>

            <div class="dream-info-card luna-interpretation">
              <h4>💭 Luna's Interpretation</h4>
              <p id="luna-dream-interpretation">
                Erschaffe deinen Traum... ich werde ihn für dich interpretieren! 
                Ziehe Elemente aus der Bibliothek auf die Leinwand oder nutze 
                "Text → Traum" um aus einer Beschreibung einen visuellen Traum zu generieren.
              </p>
            </div>

            <div class="dream-info-card">
              <h4>🎨 Quick Actions</h4>
              <div class="dream-actions">
                <button class="dream-action-btn" onclick="window.dreamCanvas.randomDream()">
                  🎲 Zufälliger Traum
                </button>
                <button class="dream-action-btn" onclick="window.dreamCanvas.dreamJournal()">
                  📔 Dream Journal
                </button>
                <button class="dream-action-btn" onclick="window.dreamCanvas.sharedDreams()">
                  🌐 Geteilte Träume
                </button>
              </div>
            </div>

            <div class="dream-info-card">
              <h4>💡 Luna's Tipps</h4>
              <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">
                <strong>🌙 Tipp:</strong> Kombiniere verschiedene Elemente um komplexe Traumwelten zu erschaffen. 
                Je mehr Elemente, desto detaillierter wird meine Interpretation!
              </p>
            </div>
          </div>
        </div>

        <script>
          window.dreamCanvas = {
            canvas: null,
            objects: [],
            selectedObject: null,
            draggedElement: null,
            currentMood: 'peaceful',
            
            init() {
              this.canvas = document.getElementById('dream-canvas');
              this.setupDragAndDrop();
              this.setupCanvasInteraction();
              console.log('🌙 Dream Canvas initialized');
            },

            setupDragAndDrop() {
              // Make library elements draggable
              const elements = document.querySelectorAll('.dream-element');
              elements.forEach(el => {
                el.addEventListener('dragstart', (e) => {
                  this.draggedElement = e.target.dataset.element;
                  e.dataTransfer.effectAllowed = 'copy';
                });
              });

              // Setup drop zone on canvas
              this.canvas.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
              });

              this.canvas.addEventListener('drop', (e) => {
                e.preventDefault();
                if (this.draggedElement) {
                  const rect = this.canvas.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  this.addObject(this.draggedElement, x, y);
                  this.draggedElement = null;
                }
              });
            },

            setupCanvasInteraction() {
              this.canvas.addEventListener('click', (e) => {
                if (e.target.classList.contains('dream-object')) {
                  this.selectObject(e.target);
                } else {
                  this.deselectAll();
                }
              });

              // Delete selected object with Delete key
              document.addEventListener('keydown', (e) => {
                if (e.key === 'Delete' && this.selectedObject) {
                  this.selectedObject.remove();
                  this.objects = this.objects.filter(obj => obj !== this.selectedObject);
                  this.selectedObject = null;
                  this.updateStats();
                }
              });
            },

            addObject(emoji, x, y) {
              const obj = document.createElement('div');
              obj.className = 'dream-object';
              obj.textContent = emoji;
              obj.style.fontSize = '48px';
              obj.style.left = x + 'px';
              obj.style.top = y + 'px';

              // Make object draggable within canvas
              let isDragging = false;
              let offsetX, offsetY;

              obj.addEventListener('mousedown', (e) => {
                isDragging = true;
                offsetX = e.clientX - obj.offsetLeft;
                offsetY = e.clientY - obj.offsetTop;
                this.selectObject(obj);
                e.stopPropagation();
              });

              document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                  const rect = this.canvas.getBoundingClientRect();
                  let newX = e.clientX - rect.left - offsetX;
                  let newY = e.clientY - rect.top - offsetY;

                  // Keep within bounds
                  newX = Math.max(0, Math.min(newX, rect.width - 50));
                  newY = Math.max(0, Math.min(newY, rect.height - 50));

                  obj.style.left = newX + 'px';
                  obj.style.top = newY + 'px';
                }
              });

              document.addEventListener('mouseup', () => {
                isDragging = false;
              });

              this.canvas.appendChild(obj);
              this.objects.push(obj);
              this.updateStats();
            },

            selectObject(obj) {
              this.deselectAll();
              obj.classList.add('selected');
              this.selectedObject = obj;
            },

            deselectAll() {
              document.querySelectorAll('.dream-object').forEach(obj => {
                obj.classList.remove('selected');
              });
              this.selectedObject = null;
            },

            updateStats() {
              document.getElementById('dream-element-count').textContent = this.objects.length;
              const complexity = Math.min(100, this.objects.length * 10);
              document.getElementById('dream-complexity').textContent = complexity + '%';
            },

            clearCanvas() {
              if (this.objects.length === 0) {
                alert('Canvas ist bereits leer!');
                return;
              }
              
              if (confirm('🗑️ Möchtest du den gesamten Traum löschen?')) {
                this.canvas.innerHTML = '';
                this.objects = [];
                this.selectedObject = null;
                this.updateStats();
                document.getElementById('luna-dream-interpretation').textContent = 
                  'Canvas geleert. Erschaffe einen neuen Traum!';
              }
            },

            async generateFromText() {
              const text = prompt('🌙 Beschreibe deinen Traum:\n\n(z.B. "Ein Drache fliegt über ein Schloss unter dem Mond")');
              if (!text || text.trim().length < 10) {
                if (text !== null) alert('Bitte beschreibe deinen Traum etwas ausführlicher...');
                return;
              }

              try {
                const response = await fetch('http://localhost:9987/dream/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    description: text,
                    mood: this.currentMood
                  })
                });

                if (!response.ok) throw new Error('Dream Generation failed');
                
                const data = await response.json();
                
                // Clear canvas first
                this.canvas.innerHTML = '';
                this.objects = [];
                
                // Add generated elements
                if (data.elements && data.elements.length > 0) {
                  const canvasRect = this.canvas.getBoundingClientRect();
                  data.elements.forEach((element, index) => {
                    // Distribute elements across canvas
                    const x = (canvasRect.width / (data.elements.length + 1)) * (index + 1) - 24;
                    const y = canvasRect.height / 2 - 24 + (Math.random() * 200 - 100);
                    this.addObject(element.emoji, x, y);
                  });
                  
                  // Show Luna's interpretation
                  document.getElementById('luna-dream-interpretation').textContent = 
                    data.interpretation || 'Traum erfolgreich generiert!';
                }
                
              } catch (error) {
                alert('❌ Fehler beim Generieren: ' + error.message);
              }
            },

            async analyzeDream() {
              if (this.objects.length === 0) {
                alert('⚠️ Der Canvas ist leer. Erstelle zuerst einen Traum!');
                return;
              }

              const elements = this.objects.map(obj => obj.textContent);
              
              try {
                const response = await fetch('http://localhost:9987/dream/interpret', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    elements: elements,
                    mood: this.currentMood
                  })
                });

                if (!response.ok) throw new Error('Dream Interpretation failed');
                
                const data = await response.json();
                document.getElementById('luna-dream-interpretation').textContent = 
                  data.interpretation || 'Interessanter Traum... die Symbole sind vielsagend!';
                
              } catch (error) {
                alert('❌ Fehler bei der Analyse: ' + error.message);
              }
            },

            async saveDream() {
              if (this.objects.length === 0) {
                alert('⚠️ Der Canvas ist leer!');
                return;
              }

              const title = prompt('💾 Titel für deinen Traum:');
              if (!title || title.trim().length === 0) return;

              const elements = this.objects.map(obj => ({
                emoji: obj.textContent,
                x: parseInt(obj.style.left),
                y: parseInt(obj.style.top)
              }));

              try {
                const response = await fetch('http://localhost:9986/store', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    type: 'dream',
                    content: {
                      title: title.trim(),
                      elements: elements,
                      mood: this.currentMood,
                      elementCount: this.objects.length,
                      timestamp: new Date().toISOString()
                    },
                    tags: ['dream-canvas', this.currentMood, 'visual-dream']
                  })
                });

                if (!response.ok) throw new Error('Save failed');
                
                alert('✅ Traum gespeichert!');
                
              } catch (error) {
                alert('❌ Fehler beim Speichern: ' + error.message);
              }
            },

            shareDream() {
              if (this.objects.length === 0) {
                alert('⚠️ Der Canvas ist leer!');
                return;
              }

              alert('🌐 Share-Funktion kommt bald!\n\nWebSocket Shared Dream Spaces werden in Kürze verfügbar sein.');
            },

            randomDream() {
              // Clear canvas
              this.canvas.innerHTML = '';
              this.objects = [];
              
              // Generate random dream
              const allElements = ['⭐', '🌙', '☀️', '💫', '✨', '🔮', '🧙‍♂️', '🧚', '👻', 
                                  '🦄', '🏔️', '🌊', '🌲', '🏰', '🐉', '🦅', '⚡', '🔥', '🌈'];
              
              const numElements = 5 + Math.floor(Math.random() * 8);
              const canvasRect = this.canvas.getBoundingClientRect();
              
              for (let i = 0; i < numElements; i++) {
                const element = allElements[Math.floor(Math.random() * allElements.length)];
                const x = Math.random() * (canvasRect.width - 50);
                const y = Math.random() * (canvasRect.height - 50);
                this.addObject(element, x, y);
              }
              
              document.getElementById('luna-dream-interpretation').textContent = 
                '🎲 Ein zufälliger Traum! Lass mich die Symbole analysieren...';
              
              // Auto-analyze after a moment
              setTimeout(() => this.analyzeDream(), 1000);
            },

            dreamJournal() {
              alert('📔 Dream Journal öffnet sich bald!\n\nHier wirst du alle gespeicherten Träume durchstöbern können.');
            },

            sharedDreams() {
              alert('🌐 Shared Dreams coming soon!\n\nKollaborative Traumwelten mit WebSocket werden bald verfügbar sein.');
            },

            setMood(mood) {
              this.currentMood = mood;
              
              // Update UI
              document.querySelectorAll('.dream-mood').forEach(el => {
                el.classList.remove('active');
              });
              event.target.classList.add('active');
              
              // Update canvas background based on mood
              const canvasArea = document.querySelector('.dream-canvas-area');
              const moodGradients = {
                peaceful: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #3b82f6 100%)',
                mysterious: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)',
                adventurous: 'linear-gradient(135deg, #0f172a 0%, #166534 50%, #fbbf24 100%)',
                chaotic: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #fbbf24 100%)',
                romantic: 'linear-gradient(135deg, #831843 0%, #db2777 50%, #fbbf24 100%)',
                dark: 'linear-gradient(135deg, #000000 0%, #1c1917 50%, #44403c 100%)'
              };
              
              canvasArea.style.background = moodGradients[mood] || moodGradients.peaceful;
            }
          };

          // Initialize Dream Canvas
          window.dreamCanvas.init();
        </script>
      `;
    }
  },

  // ═══════════════════════════════════════════════════════════
  // 📔 PHASE 4.2: DREAM JOURNAL - MEMORY INTEGRATION
  // ═══════════════════════════════════════════════════════════
  'dream-journal': {
    name: '📔 Dream Journal',
    category: 'Kreativ',
    description: 'Deine persönliche Traumsammlung mit Luna\'s Analysen',
    async load() {
      return `
        <style>
          .dream-journal-container {
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 20px;
            height: calc(100vh - 180px);
          }
          
          .dreams-main {
            background: var(--bg-secondary);
            border-radius: 12px;
            padding: 20px;
            overflow-y: auto;
          }
          
          .journal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid var(--bg-tertiary);
          }
          
          .journal-header h2 {
            font-size: 24px;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .journal-controls {
            display: flex;
            gap: 10px;
          }
          
          .journal-btn {
            background: var(--accent-primary);
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          
          .journal-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(138, 43, 226, 0.4);
          }
          
          .dreams-timeline {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
          
          .dream-entry {
            background: var(--bg-tertiary);
            border-radius: 12px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.2s;
            border: 2px solid transparent;
          }
          
          .dream-entry:hover {
            border-color: var(--accent-primary);
            transform: translateX(5px);
          }
          
          .dream-entry-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
          }
          
          .dream-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 5px;
          }
          
          .dream-date {
            font-size: 12px;
            color: var(--text-tertiary);
          }
          
          .dream-mood-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
          }
          
          .mood-peaceful { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
          .mood-mysterious { background: rgba(124, 58, 237, 0.2); color: #a78bfa; }
          .mood-adventurous { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }
          .mood-chaotic { background: rgba(239, 68, 68, 0.2); color: #f87171; }
          .mood-romantic { background: rgba(219, 39, 119, 0.2); color: #f472b6; }
          .mood-dark { background: rgba(68, 64, 60, 0.2); color: #a8a29e; }
          
          .dream-elements {
            font-size: 32px;
            margin: 10px 0;
            letter-spacing: 4px;
          }
          
          .dream-preview {
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.5;
            max-height: 60px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .dream-stats {
            display: flex;
            gap: 15px;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid var(--bg-primary);
          }
          
          .dream-stat {
            font-size: 12px;
            color: var(--text-tertiary);
            display: flex;
            align-items: center;
            gap: 5px;
          }
          
          .dreams-sidebar {
            background: var(--bg-secondary);
            border-radius: 12px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            overflow-y: auto;
          }
          
          .sidebar-section {
            background: var(--bg-tertiary);
            border-radius: 10px;
            padding: 15px;
          }
          
          .sidebar-section h3 {
            font-size: 14px;
            margin-bottom: 12px;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .stat-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          
          .stat-box {
            background: var(--bg-primary);
            padding: 12px;
            border-radius: 8px;
            text-align: center;
          }
          
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: var(--accent-primary);
          }
          
          .stat-label {
            font-size: 11px;
            color: var(--text-secondary);
            margin-top: 3px;
          }
          
          .mood-chart {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          
          .mood-bar {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .mood-label {
            font-size: 12px;
            color: var(--text-secondary);
            min-width: 90px;
          }
          
          .mood-progress {
            flex: 1;
            height: 20px;
            background: var(--bg-primary);
            border-radius: 10px;
            overflow: hidden;
          }
          
          .mood-fill {
            height: 100%;
            transition: width 0.5s;
            border-radius: 10px;
          }
          
          .filter-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          
          .filter-btn {
            padding: 6px 12px;
            border-radius: 20px;
            background: var(--bg-primary);
            border: 2px solid transparent;
            color: var(--text-secondary);
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
          }
          
          .filter-btn:hover {
            border-color: var(--accent-primary);
          }
          
          .filter-btn.active {
            background: var(--accent-primary);
            color: white;
            border-color: var(--accent-primary);
          }
          
          .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: var(--text-tertiary);
          }
          
          .empty-state-icon {
            font-size: 72px;
            margin-bottom: 20px;
          }
        </style>

        <div class="dream-journal-container">
          <div class="dreams-main">
            <div class="journal-header">
              <h2>📔 Dream Journal</h2>
              <div class="journal-controls">
                <button class="journal-btn" onclick="loadModule('dream-canvas')">
                  ✨ Neuer Traum
                </button>
              </div>
            </div>
            
            <div id="dreams-timeline" class="dreams-timeline">
              <!-- Dreams will be loaded here -->
            </div>
          </div>
          
          <div class="dreams-sidebar">
            <div class="sidebar-section">
              <h3>📊 Statistiken</h3>
              <div class="stat-grid">
                <div class="stat-box">
                  <div class="stat-value" id="total-dreams">0</div>
                  <div class="stat-label">Träume</div>
                </div>
                <div class="stat-box">
                  <div class="stat-value" id="this-week">0</div>
                  <div class="stat-label">Diese Woche</div>
                </div>
                <div class="stat-box">
                  <div class="stat-value" id="total-symbols">0</div>
                  <div class="stat-label">Symbole</div>
                </div>
                <div class="stat-box">
                  <div class="stat-value" id="favorite-mood">-</div>
                  <div class="stat-label">Lieblings-Stimmung</div>
                </div>
              </div>
            </div>
            
            <div class="sidebar-section">
              <h3>🎭 Stimmungsverteilung</h3>
              <div class="mood-chart" id="mood-chart">
                <!-- Will be populated dynamically -->
              </div>
            </div>
            
            <div class="sidebar-section">
              <h3>🔍 Filter</h3>
              <div class="filter-buttons">
                <button class="filter-btn active" onclick="window.dreamJournal.filterByMood('all')">Alle</button>
                <button class="filter-btn" onclick="window.dreamJournal.filterByMood('peaceful')">😌 Friedlich</button>
                <button class="filter-btn" onclick="window.dreamJournal.filterByMood('mysterious')">🔮 Mysteriös</button>
                <button class="filter-btn" onclick="window.dreamJournal.filterByMood('adventurous')">⚔️ Abenteuer</button>
                <button class="filter-btn" onclick="window.dreamJournal.filterByMood('chaotic')">🌪️ Chaotisch</button>
                <button class="filter-btn" onclick="window.dreamJournal.filterByMood('romantic')">💕 Romantisch</button>
                <button class="filter-btn" onclick="window.dreamJournal.filterByMood('dark')">🌑 Dunkel</button>
              </div>
            </div>
            
            <div class="sidebar-section">
              <h3>💭 Luna's Insights</h3>
              <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">
                Führe ein regelmäßiges Traumtagebuch um Muster und wiederkehrende Symbole 
                zu erkennen. Deine Träume können dir viel über dein Unterbewusstsein verraten!
              </p>
            </div>
          </div>
        </div>

        <script>
          window.dreamJournal = {
            dreams: [],
            currentFilter: 'all',
            
            async init() {
              await this.loadDreams();
              console.log('📔 Dream Journal initialized');
            },
            
            async loadDreams() {
              try {
                const response = await fetch('http://localhost:9995/memories');
                const data = await response.json();
                
                // Filter for dream entries
                this.dreams = (data.memories || [])
                  .filter(m => m.type === 'dream')
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                
                this.renderDreams();
                this.updateStatistics();
                
              } catch (error) {
                console.error('Failed to load dreams:', error);
                this.showEmptyState();
              }
            },
            
            renderDreams() {
              const timeline = document.getElementById('dreams-timeline');
              
              if (this.dreams.length === 0) {
                this.showEmptyState();
                return;
              }
              
              const filteredDreams = this.currentFilter === 'all' 
                ? this.dreams 
                : this.dreams.filter(d => d.content.mood === this.currentFilter);
              
              if (filteredDreams.length === 0) {
                timeline.innerHTML = \`
                  <div class="empty-state">
                    <div class="empty-state-icon">🌙</div>
                    <p>Keine Träume mit dieser Stimmung gefunden</p>
                  </div>
                \`;
                return;
              }
              
              timeline.innerHTML = filteredDreams.map(dream => {
                const content = dream.content;
                const date = new Date(content.timestamp);
                const elementsPreview = content.elements?.map(e => e.emoji).join(' ') || '✨';
                
                return \`
                  <div class="dream-entry" onclick="window.dreamJournal.viewDream('\${dream.id}')">
                    <div class="dream-entry-header">
                      <div>
                        <div class="dream-title">\${content.title}</div>
                        <div class="dream-date">\${date.toLocaleDateString('de-DE', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</div>
                      </div>
                      <div class="dream-mood-badge mood-\${content.mood}">
                        \${content.mood}
                      </div>
                    </div>
                    
                    <div class="dream-elements">\${elementsPreview}</div>
                    
                    <div class="dream-stats">
                      <div class="dream-stat">
                        <span>🎨</span>
                        <span>\${content.elementCount || 0} Elemente</span>
                      </div>
                      <div class="dream-stat">
                        <span>🎭</span>
                        <span>\${content.mood}</span>
                      </div>
                    </div>
                  </div>
                \`;
              }).join('');
            },
            
            showEmptyState() {
              const timeline = document.getElementById('dreams-timeline');
              timeline.innerHTML = \`
                <div class="empty-state">
                  <div class="empty-state-icon">🌙</div>
                  <h3>Dein Dream Journal ist noch leer</h3>
                  <p>Erschaffe deinen ersten Traum im Dream Canvas!</p>
                  <button class="journal-btn" onclick="loadModule('dream-canvas')" style="margin-top: 20px;">
                    ✨ Ersten Traum erschaffen
                  </button>
                </div>
              \`;
            },
            
            updateStatistics() {
              // Total dreams
              document.getElementById('total-dreams').textContent = this.dreams.length;
              
              // This week
              const oneWeekAgo = new Date();
              oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
              const thisWeek = this.dreams.filter(d => 
                new Date(d.content.timestamp) > oneWeekAgo
              ).length;
              document.getElementById('this-week').textContent = thisWeek;
              
              // Total symbols
              const totalSymbols = this.dreams.reduce((sum, d) => 
                sum + (d.content.elementCount || 0), 0
              );
              document.getElementById('total-symbols').textContent = totalSymbols;
              
              // Favorite mood
              const moodCounts = {};
              this.dreams.forEach(d => {
                const mood = d.content.mood || 'unknown';
                moodCounts[mood] = (moodCounts[mood] || 0) + 1;
              });
              
              let favoriteMood = '-';
              let maxCount = 0;
              Object.entries(moodCounts).forEach(([mood, count]) => {
                if (count > maxCount) {
                  maxCount = count;
                  favoriteMood = mood;
                }
              });
              
              const moodEmojis = {
                peaceful: '😌',
                mysterious: '🔮',
                adventurous: '⚔️',
                chaotic: '🌪️',
                romantic: '💕',
                dark: '🌑'
              };
              
              document.getElementById('favorite-mood').textContent = 
                moodEmojis[favoriteMood] || favoriteMood;
              
              // Mood chart
              this.renderMoodChart(moodCounts);
            },
            
            renderMoodChart(moodCounts) {
              const chart = document.getElementById('mood-chart');
              const total = this.dreams.length || 1;
              
              const moods = [
                { name: 'peaceful', label: '😌 Friedlich', color: '#60a5fa' },
                { name: 'mysterious', label: '🔮 Mysteriös', color: '#a78bfa' },
                { name: 'adventurous', label: '⚔️ Abenteuer', color: '#fbbf24' },
                { name: 'chaotic', label: '🌪️ Chaotisch', color: '#f87171' },
                { name: 'romantic', label: '💕 Romantisch', color: '#f472b6' },
                { name: 'dark', label: '🌑 Dunkel', color: '#a8a29e' }
              ];
              
              chart.innerHTML = moods.map(mood => {
                const count = moodCounts[mood.name] || 0;
                const percentage = (count / total) * 100;
                
                return \`
                  <div class="mood-bar">
                    <div class="mood-label">\${mood.label}</div>
                    <div class="mood-progress">
                      <div class="mood-fill" style="width: \${percentage}%; background: \${mood.color};"></div>
                    </div>
                  </div>
                \`;
              }).join('');
            },
            
            filterByMood(mood) {
              this.currentFilter = mood;
              
              // Update button states
              document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
              });
              event.target.classList.add('active');
              
              this.renderDreams();
            },
            
            viewDream(dreamId) {
              const dream = this.dreams.find(d => d.id === dreamId);
              if (!dream) return;
              
              const content = dream.content;
              const elementsPreview = content.elements?.map(e => 
                \`\${e.emoji} (\${e.symbolism || 'Traumsymbol'})\`
              ).join(', ') || 'Keine Elemente';
              
              alert(\`🌙 \${content.title}\\n\\n\` +
                    \`🎭 Stimmung: \${content.mood}\\n\` +
                    \`🎨 Elemente: \${elementsPreview}\\n\\n\` +
                    \`📅 \${new Date(content.timestamp).toLocaleString('de-DE')}\`);
            }
          };
          
          // Initialize Dream Journal
          window.dreamJournal.init();
        </script>
      `;
    }
  }
};

// Export for use in main dashboard
if (typeof window !== 'undefined') {
  window.TOOBIX_MODULES = TOOBIX_MODULES;
}
