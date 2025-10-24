/**
 * 🎮 Life Game HUD - Game Overlay für Chat
 *
 * Zeigt Level, XP, Stats und handhabt Reward-Animationen
 */

class LifeGameHUD {
  constructor(playerId, apiUrl = 'http://localhost:3350') {
    this.playerId = playerId
    this.apiUrl = apiUrl
    this.state = null
    this.animationQueue = []

    this.init()
  }

  async init() {
    this.createHUD()
    this.addStyles()
    this.addKeyboardShortcuts()
    await this.loadState()

    // Update state every 30 seconds
    setInterval(() => this.loadState(), 30000)
  }

  /**
   * Create HUD DOM elements
   */
  createHUD() {
    const hud = document.createElement('div')
    hud.id = 'life-game-hud'
    hud.innerHTML = `
      <div class="hud-container">
        <!-- Level & XP -->
        <div class="hud-level">
          <div class="level-badge">
            <span class="level-label">Lv.</span>
            <span class="level-number" id="hud-level">1</span>
          </div>
          <div class="xp-bar-container">
            <div class="xp-bar">
              <div class="xp-fill" id="hud-xp-fill" style="width: 0%"></div>
            </div>
            <div class="xp-text" id="hud-xp-text">0 / 100</div>
          </div>
        </div>

        <!-- Stats -->
        <div class="hud-stats">
          <div class="stat stat-energy" title="Energy - Deine körperliche und geistige Energie">
            <span class="stat-icon">⚡</span>
            <span class="stat-value" id="hud-stat-energy">50</span>
          </div>
          <div class="stat stat-love" title="Love - Deine Fähigkeit zu lieben und zu verbinden">
            <span class="stat-icon">💝</span>
            <span class="stat-value" id="hud-stat-love">50</span>
          </div>
          <div class="stat stat-wisdom" title="Wisdom - Dein Verständnis und deine Einsicht">
            <span class="stat-icon">📚</span>
            <span class="stat-value" id="hud-stat-wisdom">50</span>
          </div>
          <div class="stat stat-creativity" title="Creativity - Deine kreative Kraft">
            <span class="stat-icon">🎨</span>
            <span class="stat-value" id="hud-stat-creativity">50</span>
          </div>
          <div class="stat stat-focus" title="Focus - Deine Konzentrationsfähigkeit">
            <span class="stat-icon">🎯</span>
            <span class="stat-value" id="hud-stat-focus">50</span>
          </div>
        </div>

        <!-- Menu Button -->
        <div class="hud-menu">
          <button class="menu-btn" onclick="window.lifeGameHUD.openMenu()" title="Menu (M)">
            ☰
          </button>
        </div>
      </div>
    `

    document.body.appendChild(hud)
  }

  /**
   * Add CSS styles
   */
  addStyles() {
    const style = document.createElement('style')
    style.textContent = `
      /* HUD Container */
      #life-game-hud {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        background: linear-gradient(180deg,
          rgba(20, 20, 40, 0.95) 0%,
          rgba(20, 20, 40, 0.85) 80%,
          rgba(20, 20, 40, 0) 100%
        );
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(138, 99, 210, 0.3);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        pointer-events: none;
      }

      .hud-container {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 12px 20px;
        max-width: 1400px;
        margin: 0 auto;
        pointer-events: auto;
      }

      /* Level Badge */
      .hud-level {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
      }

      .level-badge {
        display: flex;
        align-items: baseline;
        gap: 4px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 8px 16px;
        border-radius: 25px;
        font-weight: bold;
        font-size: 16px;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        transition: all 0.3s ease;
      }

      .level-badge:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
      }

      .level-label {
        font-size: 12px;
        opacity: 0.9;
      }

      .level-number {
        font-size: 20px;
      }

      /* XP Bar */
      .xp-bar-container {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 200px;
      }

      .xp-bar {
        position: relative;
        width: 100%;
        height: 12px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        overflow: hidden;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .xp-fill {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
        border-radius: 6px;
        transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 0 10px rgba(245, 87, 108, 0.5);
      }

      .xp-text {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.7);
        text-align: center;
        font-family: monospace;
      }

      /* Stats */
      .hud-stats {
        display: flex;
        gap: 15px;
        flex: 1;
      }

      .stat {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        cursor: help;
        transition: all 0.2s ease;
      }

      .stat:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }

      .stat-icon {
        font-size: 16px;
      }

      .stat-value {
        font-size: 14px;
        font-weight: bold;
        color: white;
        min-width: 25px;
        text-align: center;
      }

      /* Menu Button */
      .hud-menu {
        margin-left: auto;
      }

      .menu-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 8px 16px;
        border-radius: 12px;
        cursor: pointer;
        font-size: 18px;
        transition: all 0.2s ease;
      }

      .menu-btn:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
      }

      /* Animations */
      @keyframes xpGain {
        0% {
          transform: scale(0) translateY(0);
          opacity: 0;
        }
        50% {
          transform: scale(1.2) translateY(-10px);
          opacity: 1;
        }
        100% {
          transform: scale(1) translateY(-20px);
          opacity: 0;
        }
      }

      @keyframes levelUp {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* XP Popup */
      .xp-popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 20px 40px;
        border-radius: 15px;
        font-size: 28px;
        font-weight: bold;
        z-index: 10000;
        animation: xpGain 1.5s ease-out forwards;
        box-shadow: 0 10px 40px rgba(240, 147, 251, 0.6);
        pointer-events: none;
      }

      /* Level Up Modal */
      .level-up-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        animation: fadeIn 0.3s ease;
      }

      .level-up-content {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 60px 80px;
        border-radius: 25px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(102, 126, 234, 0.6);
        animation: levelUp 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        max-width: 500px;
      }

      .level-up-icon {
        font-size: 80px;
        margin-bottom: 20px;
        animation: pulse 1s infinite;
      }

      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
      }

      .level-up-title {
        font-size: 48px;
        font-weight: bold;
        color: white;
        margin-bottom: 10px;
        text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      }

      .level-up-subtitle {
        font-size: 24px;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 30px;
      }

      .level-up-rewards {
        background: rgba(0, 0, 0, 0.2);
        padding: 20px;
        border-radius: 15px;
        margin-top: 20px;
      }

      .level-up-reward {
        color: rgba(255, 255, 255, 0.9);
        font-size: 16px;
        margin: 8px 0;
      }

      .level-up-close {
        margin-top: 30px;
        padding: 12px 40px;
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.4);
        color: white;
        font-size: 18px;
        font-weight: bold;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .level-up-close:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
      }

      /* Item Drop Notification */
      .item-drop {
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(240, 147, 251, 0.6);
        z-index: 10000;
        animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
        display: flex;
        align-items: center;
        gap: 15px;
        min-width: 300px;
      }

      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }

      .item-drop-icon {
        font-size: 40px;
        animation: pulse 1s infinite;
      }

      .item-drop-content {
        flex: 1;
      }

      .item-drop-title {
        font-size: 12px;
        opacity: 0.8;
        margin-bottom: 4px;
      }

      .item-drop-name {
        font-size: 18px;
        font-weight: bold;
      }

      .item-drop-rarity {
        font-size: 12px;
        opacity: 0.9;
        margin-top: 2px;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .hud-container {
          gap: 10px;
          padding: 10px 15px;
        }

        .hud-stats {
          gap: 8px;
        }

        .stat {
          padding: 4px 8px;
        }

        .stat-value {
          font-size: 12px;
        }

        .xp-bar-container {
          min-width: 150px;
        }
      }
    `
    document.head.appendChild(style)
  }

  /**
   * Add keyboard shortcuts
   */
  addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // M key = open menu
      if (e.key === 'm' || e.key === 'M') {
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          // Only if not in an input field
          if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            this.openMenu()
          }
        }
      }
    })
  }

  /**
   * Load player state from API
   */
  async loadState() {
    try {
      const response = await fetch(`${this.apiUrl}/state?playerId=${this.playerId}`)
      if (!response.ok) {
        // Player doesn't exist yet - will be created on first message
        console.log('Player not found - will be created on first message')
        return
      }

      this.state = await response.json()
      this.updateHUD()
    } catch (error) {
      console.error('Failed to load state:', error)
    }
  }

  /**
   * Update HUD display
   */
  updateHUD() {
    if (!this.state || !this.state.player) return

    const player = this.state.player

    // Update level
    document.getElementById('hud-level').textContent = player.level

    // Update XP bar
    const xpPercent = player.progressPercent || 0
    document.getElementById('hud-xp-fill').style.width = `${xpPercent}%`
    document.getElementById('hud-xp-text').textContent =
      `${player.xp} / ${player.xpForNextLevel}`

    // Update stats
    document.getElementById('hud-stat-energy').textContent = player.energy
    document.getElementById('hud-stat-love').textContent = player.love
    document.getElementById('hud-stat-wisdom').textContent = player.wisdom
    document.getElementById('hud-stat-creativity').textContent = player.creativity
    document.getElementById('hud-stat-focus').textContent = player.focus
  }

  /**
   * Show XP gain animation
   */
  showXPGain(amount) {
    const popup = document.createElement('div')
    popup.className = 'xp-popup'
    popup.textContent = `+${amount} XP`
    document.body.appendChild(popup)

    setTimeout(() => popup.remove(), 1500)
  }

  /**
   * Show level up celebration
   */
  showLevelUp(newLevel, rewards) {
    const modal = document.createElement('div')
    modal.className = 'level-up-modal'
    modal.innerHTML = `
      <div class="level-up-content">
        <div class="level-up-icon">🎉</div>
        <div class="level-up-title">LEVEL UP!</div>
        <div class="level-up-subtitle">You reached Level ${newLevel}</div>
        ${rewards ? `
          <div class="level-up-rewards">
            <div class="level-up-reward">+${rewards.statBonus.creativity || 0} Creativity</div>
            <div class="level-up-reward">+${rewards.statBonus.wisdom || 0} Wisdom</div>
            <div class="level-up-reward">+${rewards.statBonus.love || 0} Love</div>
            <div class="level-up-reward">+${rewards.statBonus.energy || 0} Energy</div>
            <div class="level-up-reward">+${rewards.statBonus.focus || 0} Focus</div>
            ${rewards.unlocks.length > 0 ? `
              <div class="level-up-reward" style="margin-top: 15px; font-weight: bold;">
                🔓 ${rewards.unlocks.join(', ')}
              </div>
            ` : ''}
          </div>
        ` : ''}
        <button class="level-up-close" onclick="this.parentElement.parentElement.remove()">
          Continue
        </button>
      </div>
    `
    document.body.appendChild(modal)

    // Auto-close after 5 seconds
    setTimeout(() => {
      if (modal.parentElement) modal.remove()
    }, 5000)
  }

  /**
   * Show item drop notification
   */
  showItemDrop(item) {
    const notification = document.createElement('div')
    notification.className = 'item-drop'
    notification.innerHTML = `
      <div class="item-drop-icon">${item.icon}</div>
      <div class="item-drop-content">
        <div class="item-drop-title">ITEM DROP!</div>
        <div class="item-drop-name">${item.name}</div>
        <div class="item-drop-rarity">${item.rarity.toUpperCase()}</div>
      </div>
    `
    document.body.appendChild(notification)

    setTimeout(() => notification.remove(), 3000)
  }

  /**
   * Process game state update (called after sending message)
   */
  processGameState(gameState) {
    // Show XP gain
    if (gameState.xpGained > 0) {
      this.showXPGain(gameState.xpGained)
    }

    // Show level up
    if (gameState.leveledUp && gameState.levelUpRewards) {
      setTimeout(() => {
        this.showLevelUp(gameState.newLevel, gameState.levelUpRewards)
      }, 800)
    }

    // Show item drop
    if (gameState.itemDrop) {
      setTimeout(() => {
        this.showItemDrop(gameState.itemDrop)
      }, 1200)
    }

    // Update state immediately
    this.loadState()
  }

  /**
   * Open game menu (TODO: implement full menu)
   */
  openMenu() {
    alert('Game Menu coming soon! 🎮\n\nHere you will see:\n- Full character stats\n- Inventory\n- Achievements\n- Quest log\n- Companions')
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLifeGameHUD)
} else {
  initLifeGameHUD()
}

function initLifeGameHUD() {
  // Get player ID from localStorage or create one
  let playerId = localStorage.getItem('lifeGamePlayerId')
  if (!playerId) {
    playerId = 'player-' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('lifeGamePlayerId', playerId)
  }

  // Initialize HUD
  window.lifeGameHUD = new LifeGameHUD(playerId)
  console.log('🎮 Life Game HUD initialized for player:', playerId)
}
