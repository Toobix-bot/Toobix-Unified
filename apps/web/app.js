// ========================================
// TOOBIX UNIVERSE - APP LOGIC
// Vanilla JS SPA with routing & state
// ========================================

// ========================================
// Types
// ========================================

/** @typedef {'qualitaet'|'dauer'|'freude'|'sinn'|'kraft'|'klang'|'wandel'|'klarheit'} EchoKey */
/** @typedef {Record<EchoKey, number>} EchoStats */

/**
 * @typedef {Object} Quest
 * @property {string} id
 * @property {string} title
 * @property {'fokus'|'pflege'|'bonus'} kind
 * @property {number} xp
 * @property {boolean} done
 */

/**
 * @typedef {Object} Run
 * @property {string} id
 * @property {string} seed
 * @property {number} day
 * @property {EchoStats} stats
 * @property {string[]} log
 */

/**
 * @typedef {Object} SaveGame
 * @property {string} version
 * @property {number} createdAt
 * @property {Run[]} runs
 * @property {Quest[]} quests
 * @property {any[]} inventory
 * @property {any[]} skills
 */

// ========================================
// State Management (Minimal Store)
// ========================================

class GameStore {
  constructor() {
    /** @type {SaveGame} */
    this.save = {
      version: '0.1.0',
      createdAt: Date.now(),
      runs: [],
      quests: this.getDefaultQuests(),
      inventory: [],
      skills: []
    }
    
    this.currentRunId = null
    this.listeners = []
    
    this.load()
  }
  
  /**
   * Get default echo stats
   * @returns {EchoStats}
   */
  getDefaultStats() {
    return {
      qualitaet: 6,
      dauer: 7,
      freude: 7,
      sinn: 7,
      kraft: 6,
      klang: 6,
      wandel: 6,
      klarheit: 6
    }
  }
  
  /**
   * Get default quests
   * @returns {Quest[]}
   */
  getDefaultQuests() {
    return [
      { id: 'q1', title: 'Erste Meditation', kind: 'fokus', xp: 10, done: false },
      { id: 'q2', title: 'Mit Freund sprechen', kind: 'pflege', xp: 15, done: false },
      { id: 'q3', title: 'Spaziergang im Park', kind: 'bonus', xp: 5, done: false }
    ]
  }
  
  /**
   * Start a new run
   * @param {string} [seed]
   */
  startRun(seed = crypto.randomUUID()) {
    /** @type {Run} */
    const run = {
      id: crypto.randomUUID(),
      seed,
      day: 1,
      stats: this.getDefaultStats(),
      log: [`🎮 Run gestartet (seed: ${seed.substring(0, 8)})`]
    }
    
    this.save.runs.push(run)
    this.currentRunId = run.id
    this.persist()
    this.notify()
  }
  
  /**
   * Tick the current run forward
   * @param {string} [decision]
   */
  tick(decision) {
    const run = this.getCurrentRun()
    if (!run) return
    
    run.day += 1
    run.log.push(decision || '⏭️ Weiter')
    
    // Random stat drift (-0.5 to +0.5)
    Object.keys(run.stats).forEach(key => {
      const drift = (Math.random() - 0.5)
      run.stats[key] = Math.max(0, Math.min(10, run.stats[key] + drift))
    })
    
    this.persist()
    this.notify()
  }
  
  /**
   * Complete a quest
   * @param {string} questId
   */
  completeQuest(questId) {
    const quest = this.save.quests.find(q => q.id === questId)
    if (!quest || quest.done) return
    
    quest.done = true
    
    // Apply stat boosts
    const run = this.getCurrentRun()
    if (run) {
      if (quest.kind === 'fokus') run.stats.klarheit += 0.5
      if (quest.kind === 'pflege') run.stats.freude += 0.5
      if (quest.kind === 'bonus') run.stats.kraft += 0.3
    }
    
    this.persist()
    this.notify()
  }
  
  /**
   * Get current run
   * @returns {Run | undefined}
   */
  getCurrentRun() {
    return this.save.runs.find(r => r.id === this.currentRunId)
  }
  
  /**
   * Get current stats (from current run or defaults)
   * @returns {EchoStats}
   */
  getStats() {
    const run = this.getCurrentRun()
    return run ? run.stats : this.getDefaultStats()
  }
  
  /**
   * Subscribe to state changes
   * @param {Function} listener
   * @returns {Function} Unsubscribe function
   */
  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }
  
  /**
   * Notify all listeners
   */
  notify() {
    this.listeners.forEach(l => l(this))
  }
  
  /**
   * Persist to localStorage
   */
  persist() {
    try {
      localStorage.setItem('toobix.save', JSON.stringify(this.save))
    } catch (err) {
      console.error('Failed to persist:', err)
    }
  }
  
  /**
   * Load from localStorage
   */
  load() {
    try {
      const saved = localStorage.getItem('toobix.save')
      if (saved) {
        this.save = JSON.parse(saved)
      }
    } catch (err) {
      console.error('Failed to load:', err)
    }
  }
}

// Global store instance
const store = new GameStore()

// ========================================
// Router (Hash-based SPA)
// ========================================

class Router {
  constructor() {
    this.routes = {}
    this.currentPage = null
    
    window.addEventListener('hashchange', () => this.navigate())
    window.addEventListener('load', () => this.navigate())
  }
  
  /**
   * Register a route
   * @param {string} path
   * @param {Function} render
   */
  route(path, render) {
    this.routes[path] = render
  }
  
  /**
   * Navigate to current hash
   */
  async navigate() {
    const hash = window.location.hash.slice(1) || '/'
    const page = hash.split('/')[1] || 'dashboard'
    
    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page)
    })
    
    // Update page title
    const titles = {
      dashboard: 'Dashboard',
      runs: 'Runs',
      quests: 'Quests',
      story: 'Story',
      skills: 'Skills',
      items: 'Items',
      allies: 'Allies',
      archive: 'Archive',
      settings: 'Settings'
    }
    document.getElementById('pageTitle').textContent = titles[page] || 'Toobix'
    
    // Render page
    const render = this.routes[hash] || this.routes['/']
    if (render) {
      // Show loading state
      document.getElementById('pageContent').innerHTML = `
        <div style="text-align: center; padding: 4rem; color: var(--text-secondary)">
          <div style="font-size: 3rem; margin-bottom: 1rem">⏳</div>
          <p>Laden...</p>
        </div>
      `
      
      // Await render if async
      const content = await render()
      document.getElementById('pageContent').innerHTML = content
      this.currentPage = page
      
      // Re-attach event listeners after render
      this.attachPageListeners(page)
    }
  }
  
  /**
   * Attach event listeners for specific pages
   * @param {string} page
   */
  attachPageListeners(page) {
    if (page === 'dashboard') {
      // System status check
      this.checkSystemStatus()
    }
    
    if (page === 'quests') {
      // Quest complete buttons
      document.querySelectorAll('[data-quest-complete]').forEach(btn => {
        btn.addEventListener('click', () => {
          const questId = btn.dataset.questComplete
          store.completeQuest(questId)
          this.navigate() // Re-render
        })
      })
    }
    
    if (page === 'runs') {
      // Run control buttons
      const startBtn = document.getElementById('startRunBtn')
      const tickBtn = document.getElementById('tickBtn')
      
      if (startBtn) {
        startBtn.addEventListener('click', () => {
          store.startRun()
          this.navigate()
        })
      }
      
      if (tickBtn) {
        tickBtn.addEventListener('click', () => {
          store.tick()
          this.navigate()
        })
      }
    }
  }
  
  /**
   * Check system health
   */
  async checkSystemStatus() {
    try {
      const res = await fetch('http://localhost:3337/health')
      const data = await res.json()
      
      const badge = document.getElementById('systemStatus')
      if (badge) {
        badge.innerHTML = `
          <span class="status-dot"></span>
          <span>System OK · ${data.tools || 0} Tools</span>
        `
      }
    } catch (err) {
      const badge = document.getElementById('systemStatus')
      if (badge) {
        badge.innerHTML = `
          <span class="status-dot" style="background: var(--danger)"></span>
          <span>Bridge Offline</span>
        `
      }
    }
  }
}

// ========================================
// Page Renderers
// ========================================

/**
 * Render stat bar component
 * @param {EchoKey} stat
 * @param {number} value
 * @returns {string}
 */
function renderStatBar(stat, value) {
  const labels = {
    qualitaet: 'Qualität',
    dauer: 'Dauer',
    freude: 'Freude',
    sinn: 'Sinn',
    kraft: 'Kraft',
    klang: 'Klang',
    wandel: 'Wandel',
    klarheit: 'Klarheit'
  }
  
  const percent = (value / 10) * 100
  
  return `
    <div class="stat-bar" data-stat="${stat}">
      <div class="stat-bar-header">
        <span class="stat-bar-label">${labels[stat]}</span>
        <span class="stat-bar-value">${value.toFixed(1)}</span>
      </div>
      <div class="stat-bar-track">
        <div class="stat-bar-fill" style="width: ${percent}%"></div>
      </div>
    </div>
  `
}

/**
 * Dashboard page
 */
function renderDashboard() {
  const stats = store.getStats()
  const run = store.getCurrentRun()
  const quests = store.save.quests.slice(0, 3)
  
  return `
    <div class="grid grid-3">
      
      <!-- ECHO-REALM Stats Card -->
      <div class="card" style="grid-column: span 2">
        <div class="card-header">
          <h3 class="card-title">⚡ ECHO-REALM</h3>
          <span class="badge">8 Kräfte</span>
        </div>
        <div class="card-body">
          ${Object.entries(stats).map(([key, val]) => 
            renderStatBar(key, val)
          ).join('')}
        </div>
      </div>
      
      <!-- Quests heute -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">⚔️ Quests Heute</h3>
        </div>
        <div class="card-body">
          ${quests.map(q => `
            <div class="flex justify-between items-center mb-1">
              <span style="color: var(--text-secondary); font-size: 0.9rem">
                ${q.done ? '✅' : '⬜'} ${q.title}
              </span>
              <span class="badge badge-info">${q.xp} XP</span>
            </div>
          `).join('')}
        </div>
        <div class="card-footer">
          <a href="#/quests" class="btn btn-sm btn-primary">Alle Quests</a>
        </div>
      </div>
      
      <!-- Current Run -->
      ${run ? `
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">🎮 Aktueller Run</h3>
            <span class="badge badge-success">Tag ${run.day}</span>
          </div>
          <div class="card-body">
            <p style="color: var(--text-secondary); font-size: 0.9rem">
              Seed: <code>${run.seed.substring(0, 8)}</code>
            </p>
            <p style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.85rem">
              ${run.log[run.log.length - 1]}
            </p>
          </div>
          <div class="card-footer">
            <a href="#/runs" class="btn btn-sm btn-primary">Fortsetzen</a>
          </div>
        </div>
      ` : `
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">🎮 Kein Run aktiv</h3>
          </div>
          <div class="card-body">
            <p style="color: var(--text-secondary)">
              Starte einen neuen Run um deine Reise zu beginnen.
            </p>
          </div>
          <div class="card-footer">
            <a href="#/runs" class="btn btn-sm btn-primary">Neuer Run</a>
          </div>
        </div>
      `}
      
      <!-- Story Status Widget -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">📖 Story</h3>
        </div>
        <div class="card-body">
          <div class="flex justify-between mb-1">
            <span style="color: var(--text-secondary); font-size: 0.9rem">Arc</span>
            <span class="badge badge-info">foundations</span>
          </div>
          <div class="flex justify-between mb-1">
            <span style="color: var(--text-secondary); font-size: 0.9rem">Level</span>
            <span class="badge badge-success">1</span>
          </div>
          <div class="flex justify-between">
            <span style="color: var(--text-secondary); font-size: 0.9rem">XP</span>
            <span class="badge">0</span>
          </div>
        </div>
        <div class="card-footer">
          <a href="#/story" class="btn btn-sm btn-primary">Story Engine</a>
        </div>
      </div>
      
      <!-- System Status -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">⚙️ System</h3>
        </div>
        <div class="card-body">
          <div class="flex justify-between mb-1">
            <span style="color: var(--text-secondary); font-size: 0.9rem">Version</span>
            <span class="badge">v0.1.0</span>
          </div>
          <div class="flex justify-between mb-1">
            <span style="color: var(--text-secondary); font-size: 0.9rem">Bridge</span>
            <span class="badge badge-success">Online</span>
          </div>
          <div class="flex justify-between">
            <span style="color: var(--text-secondary); font-size: 0.9rem">Runs</span>
            <span class="badge">${store.save.runs.length}</span>
          </div>
        </div>
      </div>
      
    </div>
  `
}

/**
 * Runs page
 */
function renderRuns() {
  const run = store.getCurrentRun()
  
  if (!run) {
    return `
      <div class="card text-center" style="max-width: 600px; margin: 2rem auto">
        <div class="card-body">
          <h2 style="font-size: 2rem; margin-bottom: 1rem">🎮</h2>
          <h3 class="card-title">Kein aktiver Run</h3>
          <p style="color: var(--text-secondary); margin: 1rem 0">
            Starte einen neuen Run um deine endlose Reise zu beginnen.
          </p>
          <button id="startRunBtn" class="btn btn-lg btn-primary">Run starten</button>
        </div>
      </div>
    `
  }
  
  return `
    <div class="grid grid-2">
      
      <!-- Run Control -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">🎮 Run Control</h3>
          <span class="badge badge-success">Tag ${run.day}</span>
        </div>
        <div class="card-body">
          <p style="color: var(--text-secondary); margin-bottom: 1rem">
            Seed: <code>${run.seed}</code>
          </p>
          <div class="flex gap-1">
            <button id="tickBtn" class="btn btn-primary">⏭️ Nächster Tick</button>
            <button class="btn">⏸️ Pause</button>
          </div>
        </div>
      </div>
      
      <!-- Run Stats -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">📊 Stats</h3>
        </div>
        <div class="card-body">
          ${Object.entries(run.stats).slice(0, 4).map(([key, val]) =>
            renderStatBar(key, val)
          ).join('')}
        </div>
      </div>
      
      <!-- Event Log -->
      <div class="card" style="grid-column: span 2">
        <div class="card-header">
          <h3 class="card-title">📜 Event Log</h3>
        </div>
        <div class="card-body">
          ${run.log.slice(-10).reverse().map(entry => `
            <div style="padding: 0.5rem 0; border-bottom: 1px solid var(--border); color: var(--text-secondary); font-size: 0.9rem">
              ${entry}
            </div>
          `).join('')}
        </div>
      </div>
      
    </div>
  `
}

/**
 * Quests page
 */
function renderQuests() {
  const quests = store.save.quests
  
  return `
    <div class="grid grid-3">
      ${quests.map(q => `
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">${q.done ? '✅' : '⚔️'} ${q.title}</h3>
            <span class="badge badge-${q.kind === 'fokus' ? 'info' : q.kind === 'pflege' ? 'success' : 'warning'}">
              ${q.kind}
            </span>
          </div>
          <div class="card-body">
            <div class="flex justify-between items-center">
              <span style="color: var(--text-secondary)">Belohnung</span>
              <span class="badge">${q.xp} XP</span>
            </div>
          </div>
          ${!q.done ? `
            <div class="card-footer">
              <button data-quest-complete="${q.id}" class="btn btn-sm btn-success">Abschließen</button>
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `
}

/**
 * Story page
 */
async function renderStory() {
  // Fetch story state from bridge
  let storyState = null
  let storyStats = null
  let storyEvents = []
  
  try {
    // Fetch stats
    const statsRes = await fetch('http://localhost:3337/stats')
    const stats = await statsRes.json()
    storyStats = stats.story
    
    // Fetch story state
    const stateRes = await fetch('http://localhost:3337/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'story_state',
          arguments: {}
        },
        id: 1
      })
    })
    const stateData = await stateRes.json()
    if (stateData.result?.content?.[0]?.text) {
      storyState = JSON.parse(stateData.result.content[0].text)
    }
    
    // Fetch story events
    const eventsRes = await fetch('http://localhost:3337/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'story_events',
          arguments: { limit: 10 }
        },
        id: 2
      })
    })
    const eventsData = await eventsRes.json()
    if (eventsData.result?.content?.[0]?.text) {
      const parsed = JSON.parse(eventsData.result.content[0].text)
      storyEvents = parsed.events || []
    }
  } catch (err) {
    console.error('Failed to load story:', err)
  }
  
  if (!storyState) {
    return `
      <div class="card text-center" style="max-width: 600px; margin: 2rem auto">
        <div class="card-body">
          <h2 style="font-size: 3rem; margin-bottom: 1rem">📖</h2>
          <h3 class="card-title">Story Engine Offline</h3>
          <p style="color: var(--text-secondary); margin-top: 1rem">
            Bridge Service nicht erreichbar.
          </p>
        </div>
      </div>
    `
  }
  
  // Calculate XP progress
  const xpForNextLevel = (storyState.resources?.level || 1) * 100
  const currentXP = storyState.resources?.erfahrung || 0
  const xpPercent = (currentXP / xpForNextLevel) * 100
  
  return `
    <div class="grid grid-3">
      
      <!-- Story Status with XP Progress -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">📖 Story Progress</h3>
          <button class="btn btn-sm" onclick="window.location.reload()" title="Refresh">🔄</button>
        </div>
        <div class="card-body">
          <div class="flex justify-between mb-1">
            <span style="color: var(--text-secondary)">Epoch</span>
            <span class="badge">${storyStats?.epoch || 0}</span>
          </div>
          <div class="flex justify-between mb-1">
            <span style="color: var(--text-secondary)">Arc</span>
            <span class="badge badge-info">${storyStats?.arc || 'foundations'}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span style="color: var(--text-secondary)">Level</span>
            <span class="badge badge-success">${storyState.resources?.level || 1}</span>
          </div>
          
          <!-- XP Progress Bar -->
          <div style="margin-top: 1rem">
            <div class="flex justify-between mb-0-5">
              <span style="color: var(--text-secondary); font-size: 0.85rem">XP bis Level ${(storyState.resources?.level || 1) + 1}</span>
              <span style="color: var(--text-secondary); font-size: 0.85rem">${currentXP.toFixed(0)} / ${xpForNextLevel}</span>
            </div>
            <div style="background: var(--bg-secondary); border-radius: 8px; height: 8px; overflow: hidden">
              <div style="background: linear-gradient(90deg, var(--primary), var(--success)); height: 100%; width: ${xpPercent}%; transition: width 0.5s ease"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Resources with Progress Bars -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">💎 Resources</h3>
        </div>
        <div class="card-body">
          ${Object.entries(storyState.resources || {})
            .filter(([key]) => !['level', 'erfahrung'].includes(key))
            .slice(0, 5)
            .map(([key, val]) => {
              const numVal = typeof val === 'number' ? val : 0
              const maxVal = 100
              const percent = Math.min(100, (numVal / maxVal) * 100)
              const color = percent > 66 ? 'var(--success)' : percent > 33 ? 'var(--warning)' : 'var(--danger)'
              
              return `
                <div style="margin-bottom: 1rem">
                  <div class="flex justify-between mb-0-5">
                    <span style="color: var(--text-secondary); font-size: 0.85rem; text-transform: capitalize">${key}</span>
                    <span style="color: ${color}; font-weight: 600; font-size: 0.85rem">${numVal.toFixed(0)}</span>
                  </div>
                  <div style="background: var(--bg-secondary); border-radius: 4px; height: 4px; overflow: hidden">
                    <div style="background: ${color}; height: 100%; width: ${percent}%; transition: width 0.3s ease"></div>
                  </div>
                </div>
              `
            }).join('')}
        </div>
      </div>
      
      <!-- Companions & Buffs -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">👥 Begleiter & Buffs</h3>
        </div>
        <div class="card-body">
          ${(storyState.companions || []).length > 0 ? `
            <div style="margin-bottom: 1rem">
              <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.5rem">Companions:</p>
              ${storyState.companions.map(comp => `
                <span class="badge badge-info" style="margin-right: 0.25rem">${comp.name || comp}</span>
              `).join('')}
            </div>
          ` : '<p style="color: var(--text-tertiary); font-size: 0.85rem">Keine Begleiter</p>'}
          
          ${(storyState.buffs || []).length > 0 ? `
            <div style="margin-top: 1rem">
              <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.5rem">Aktive Buffs:</p>
              ${storyState.buffs.map(buff => `
                <div style="background: var(--bg-secondary); padding: 0.5rem; border-radius: 4px; margin-bottom: 0.25rem; font-size: 0.85rem">
                  <span style="color: var(--success)">✨ ${buff.name || buff}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${(storyState.skills || []).length > 0 ? `
            <div style="margin-top: 1rem">
              <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.5rem">Skills:</p>
              ${storyState.skills.slice(0, 3).map(skill => `
                <span class="badge badge-warning" style="margin-right: 0.25rem">${skill.name || skill}</span>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
      
      <!-- Story Options -->
      ${(storyState.options || []).length > 0 ? `
        <div class="card" style="grid-column: span 3">
          <div class="card-header">
            <h3 class="card-title">🎯 Nächste Schritte</h3>
            <span class="badge">${storyState.options.length} Options</span>
          </div>
          <div class="card-body">
            <div class="grid grid-3">
              ${storyState.options.map(opt => `
                <div class="card" style="cursor: pointer; transition: transform 0.2s" 
                     onmouseover="this.style.transform='translateY(-4px)'" 
                     onmouseout="this.style.transform='translateY(0)'"
                     onclick="chooseStoryOption('${opt.id}')">
                  <div class="card-header">
                    <h4 style="font-size: 1rem">${opt.label || opt.title || 'Option'}</h4>
                  </div>
                  <div class="card-body">
                    <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.75rem">
                      ${opt.rationale || opt.description || 'Wähle diese Option'}
                    </p>
                    ${opt.expected ? `
                      <div style="font-size: 0.75rem; color: var(--text-tertiary)">
                        ${Object.entries(opt.expected).map(([k, v]) => 
                          `<span class="badge">${k}: ${v > 0 ? '+' : ''}${v}</span>`
                        ).join(' ')}
                      </div>
                    ` : opt.effects ? `
                      <div style="font-size: 0.75rem; color: var(--text-tertiary)">
                        ${Object.entries(opt.effects).map(([k, v]) => 
                          `<span class="badge">${k}: ${v > 0 ? '+' : ''}${v}</span>`
                        ).join(' ')}
                      </div>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` : `
        <div class="card" style="grid-column: span 3">
          <div class="card-body text-center">
            <p style="color: var(--text-secondary)">
              Keine aktiven Story-Optionen. 
              <button class="btn btn-sm btn-primary" onclick="refreshStoryOptions()">
                Optionen generieren
              </button>
            </p>
          </div>
        </div>
      `}
      
      <!-- Events Timeline -->
      ${storyEvents.length > 0 ? `
        <div class="card" style="grid-column: span 3">
          <div class="card-header">
            <h3 class="card-title">📜 Event Timeline</h3>
            <span class="badge">${storyEvents.length} Events</span>
          </div>
          <div class="card-body">
            <div style="position: relative; padding-left: 2rem">
              <!-- Timeline Line -->
              <div style="position: absolute; left: 0.5rem; top: 0; bottom: 0; width: 2px; background: var(--border)"></div>
              
              ${storyEvents.map((evt, idx) => {
                const timeAgo = evt.timestamp ? new Date(evt.timestamp).toLocaleString('de-DE') : 'Vor kurzem'
                const icon = evt.type === 'choice' ? '🎯' : evt.type === 'level_up' ? '⭐' : evt.type === 'resource' ? '💎' : '📝'
                const color = evt.type === 'choice' ? 'var(--primary)' : evt.type === 'level_up' ? 'var(--success)' : 'var(--info)'
                
                return `
                  <div style="position: relative; padding-bottom: ${idx < storyEvents.length - 1 ? '1.5rem' : '0'}">
                    <!-- Timeline Dot -->
                    <div style="position: absolute; left: -1.5rem; top: 0.25rem; width: 1rem; height: 1rem; border-radius: 50%; background: ${color}; border: 2px solid var(--bg-primary); z-index: 1"></div>
                    
                    <!-- Event Card -->
                    <div style="background: var(--bg-secondary); border-radius: 8px; padding: 0.75rem 1rem; border-left: 3px solid ${color}">
                      <div class="flex justify-between items-center mb-0-5">
                        <div class="flex items-center gap-0-5">
                          <span style="font-size: 1.2rem">${icon}</span>
                          <span style="font-weight: 600; color: var(--text-primary)">${evt.description || evt.label || 'Event'}</span>
                        </div>
                        <span style="font-size: 0.75rem; color: var(--text-tertiary)">${timeAgo}</span>
                      </div>
                      ${evt.effects ? `
                        <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem">
                          ${Object.entries(evt.effects).map(([k, v]) => {
                            const sign = v > 0 ? '+' : ''
                            const effColor = v > 0 ? 'var(--success)' : v < 0 ? 'var(--danger)' : 'var(--text-secondary)'
                            return `<span style="color: ${effColor}; margin-right: 0.5rem">${k}: ${sign}${v}</span>`
                          }).join('')}
                        </div>
                      ` : ''}
                    </div>
                  </div>
                `
              }).join('')}
            </div>
          </div>
        </div>
      ` : ''}
      
    </div>
  `
}

/**
 * Placeholder pages
 */
function renderPlaceholder(title, icon) {
  return `
    <div class="card text-center" style="max-width: 600px; margin: 2rem auto">
      <div class="card-body">
        <h2 style="font-size: 3rem; margin-bottom: 1rem">${icon}</h2>
        <h3 class="card-title">${title}</h3>
        <p style="color: var(--text-secondary); margin-top: 1rem">
          Dieser Bereich ist noch in Entwicklung.
        </p>
      </div>
    </div>
  `
}

// ========================================
// App Initialization
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const router = new Router()
  
  // Register routes
  router.route('/', renderDashboard)
  router.route('#/', renderDashboard)
  router.route('#/runs', renderRuns)
  router.route('#/quests', renderQuests)
  router.route('#/story', renderStory)
  router.route('#/skills', () => renderPlaceholder('Skills', '🌟'))
  router.route('#/items', () => renderPlaceholder('Items', '🎒'))
  router.route('#/allies', () => renderPlaceholder('Allies', '👥'))
  router.route('#/archive', () => renderPlaceholder('Archive', '📦'))
  router.route('#/settings', () => renderPlaceholder('Settings', '⚙️'))
  
  // Theme toggle
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const html = document.documentElement
    const current = html.dataset.theme
    const next = current === 'dark' ? 'light' : 'dark'
    html.dataset.theme = next
    document.getElementById('themeToggle').textContent = next === 'dark' ? '🌙' : '☀️'
  })
  
  // Quick action button
  document.getElementById('quickAction')?.addEventListener('click', () => {
    if (store.getCurrentRun()) {
      window.location.hash = '#/runs'
    } else {
      store.startRun()
      window.location.hash = '#/runs'
    }
  })
  
  // Subscribe to store changes
  store.subscribe(() => {
    // Re-render current page on state change
    router.navigate()
  })
  
  // Initial navigation
  router.navigate()
})

// Story interaction functions (global)
window.chooseStoryOption = async function(optionId) {
  try {
    const res = await fetch('http://localhost:3337/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'story_choose',
          arguments: { option_id: optionId }
        },
        id: 2
      })
    })
    const data = await res.json()
    if (data.result?.content?.[0]?.text) {
      const result = JSON.parse(data.result.content[0].text)
      alert(`✨ ${result.message || 'Auswahl getroffen!'}`)
      window.location.reload() // Refresh to show new state
    }
  } catch (err) {
    console.error('Story choice failed:', err)
    alert('❌ Fehler beim Speichern der Auswahl')
  }
}

window.refreshStoryOptions = async function() {
  try {
    const res = await fetch('http://localhost:3337/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'story_refresh',
          arguments: { force: true }
        },
        id: 3
      })
    })
    const data = await res.json()
    if (data.result?.content?.[0]?.text) {
      const result = JSON.parse(data.result.content[0].text)
      alert(`✨ ${result.generated || 0} neue Optionen generiert!`)
      window.location.reload()
    }
  } catch (err) {
    console.error('Story refresh failed:', err)
    alert('❌ Fehler beim Generieren von Optionen')
  }
}
