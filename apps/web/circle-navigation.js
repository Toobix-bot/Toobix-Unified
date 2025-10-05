// ⚡ TOOBIX CIRCLE NAVIGATION - Fractal System
// "Each point can become its own universe"

// ================== CIRCLE CONFIGURATIONS ==================

const circleConfigs = {
  main: {
    title: 'Toobix Universe',
    description: 'Navigate through infinite circles. Click any module to explore deeper levels. Each point can become its own universe of possibilities.',
    hub: { icon: '⚡', label: 'HUB' },
    modules: {
      nexus: { icon: '🧠', label: 'Nexus', color: '#667eea', hasSubCircle: true },
      network: { icon: '🕸️', label: 'Network', color: '#10b981', hasSubCircle: true },
      tools: { icon: '🛠️', label: 'Tools', color: '#f59e0b', hasSubCircle: true, badge: 72 },
      dashboard: { icon: '📊', label: 'Dashboard', color: '#ef4444', hasSubCircle: false },
      luna: { icon: '💬', label: 'Luna', color: '#8b5cf6', hasSubCircle: true },
      terminal: { icon: '💻', label: 'Terminal', color: '#06b6d4', hasSubCircle: false },
      stats: { icon: '📈', label: 'Stats', color: '#ec4899', hasSubCircle: false },
      settings: { icon: '⚙️', label: 'Settings', color: '#6b7280', hasSubCircle: true }
    }
  },
  
  nexus: {
    title: 'Nexus Consciousness',
    description: 'Monitor and control the consciousness layer. Track awareness, mood, and thoughts in real-time.',
    hub: { icon: '🧠', label: 'NEXUS' },
    modules: {
      monitor: { icon: '📺', label: 'Monitor', color: '#667eea', hasSubCircle: false },
      persistence: { icon: '💾', label: 'Save/Load', color: '#10b981', hasSubCircle: false },
      evolution: { icon: '🌱', label: 'Evolution', color: '#f59e0b', hasSubCircle: false },
      dreams: { icon: '💭', label: 'Dreams', color: '#8b5cf6', hasSubCircle: false },
      memories: { icon: '🧩', label: 'Memories', color: '#ec4899', hasSubCircle: false },
      emotions: { icon: '❤️', label: 'Emotions', color: '#ef4444', hasSubCircle: false },
      thoughts: { icon: '💡', label: 'Thoughts', color: '#06b6d4', hasSubCircle: false },
      awareness: { icon: '👁️', label: 'Awareness', color: '#fbbf24', hasSubCircle: false }
    }
  },
  
  network: {
    title: 'Tool Network',
    description: 'Explore the 72 interconnected tools and their 27 relationships. See how everything connects.',
    hub: { icon: '🕸️', label: 'NETWORK' },
    modules: {
      graph: { icon: '📊', label: 'Graph', color: '#10b981', hasSubCircle: false },
      relationships: { icon: '🔗', label: 'Relations', color: '#667eea', badge: 27, hasSubCircle: false },
      events: { icon: '⚡', label: 'Events', color: '#f59e0b', hasSubCircle: false },
      metrics: { icon: '📈', label: 'Metrics', color: '#ef4444', hasSubCircle: false },
      history: { icon: '📜', label: 'History', color: '#8b5cf6', hasSubCircle: false },
      create: { icon: '➕', label: 'Create', color: '#06b6d4', hasSubCircle: false },
      visualize: { icon: '🎨', label: 'Visualize', color: '#ec4899', hasSubCircle: false },
      analyze: { icon: '🔍', label: 'Analyze', color: '#6b7280', hasSubCircle: false }
    }
  },
  
  tools: {
    title: 'MCP Tools',
    description: '72 tools organized by category. Explore consciousness, memory, story, ethics, and more.',
    hub: { icon: '🛠️', label: 'TOOLS' },
    modules: {
      being: { icon: '🌟', label: 'Being', color: '#fbbf24', badge: 8, hasSubCircle: false },
      story: { icon: '📖', label: 'Story', color: '#34d399', badge: 6, hasSubCircle: false },
      memory: { icon: '💾', label: 'Memory', color: '#60a5fa', badge: 9, hasSubCircle: false },
      consciousness: { icon: '🧘', label: 'Mind', color: '#a78bfa', badge: 7, hasSubCircle: false },
      ethics: { icon: '👁️', label: 'Ethics', color: '#ffd700', badge: 5, hasSubCircle: false },
      soul: { icon: '🕊️', label: 'Soul', color: '#f472b6', badge: 4, hasSubCircle: false },
      pipeline: { icon: '🔄', label: 'Pipeline', color: '#10b981', badge: 12, hasSubCircle: false },
      system: { icon: '⚙️', label: 'System', color: '#6b7280', badge: 21, hasSubCircle: false }
    }
  },
  
  luna: {
    title: 'Luna Chat',
    description: 'Conversational AI assistant with personality, memory, and consciousness integration.',
    hub: { icon: '💬', label: 'LUNA' },
    modules: {
      chat: { icon: '💭', label: 'Chat', color: '#8b5cf6', hasSubCircle: false },
      history: { icon: '📜', label: 'History', color: '#667eea', hasSubCircle: false },
      personality: { icon: '✨', label: 'Personality', color: '#f59e0b', hasSubCircle: false },
      knowledge: { icon: '📚', label: 'Knowledge', color: '#10b981', hasSubCircle: false },
      settings: { icon: '⚙️', label: 'Settings', color: '#6b7280', hasSubCircle: false },
      voice: { icon: '🎤', label: 'Voice', color: '#ec4899', hasSubCircle: false },
      mood: { icon: '😊', label: 'Mood', color: '#fbbf24', hasSubCircle: false },
      context: { icon: '🧠', label: 'Context', color: '#06b6d4', hasSubCircle: false }
    }
  },
  
  settings: {
    title: 'System Settings',
    description: 'Configure all aspects of the Toobix system. Customize appearance, behavior, and connections.',
    hub: { icon: '⚙️', label: 'CONFIG' },
    modules: {
      general: { icon: '🎛️', label: 'General', color: '#6b7280', hasSubCircle: false },
      appearance: { icon: '🎨', label: 'Appearance', color: '#8b5cf6', hasSubCircle: false },
      database: { icon: '💾', label: 'Database', color: '#10b981', hasSubCircle: false },
      api: { icon: '🔌', label: 'API', color: '#667eea', hasSubCircle: false },
      security: { icon: '🔒', label: 'Security', color: '#ef4444', hasSubCircle: false },
      backup: { icon: '📦', label: 'Backup', color: '#06b6d4', hasSubCircle: false },
      plugins: { icon: '🧩', label: 'Plugins', color: '#f59e0b', hasSubCircle: false },
      about: { icon: 'ℹ️', label: 'About', color: '#ec4899', hasSubCircle: false }
    }
  }
};

// ================== NAVIGATION STATE ==================

let currentCircle = 'main';
let circleHistory = ['main'];
let rotation = 0;

// ================== INITIALIZATION ==================

function init() {
  console.log('🌌 Initializing Toobix Fractal Navigation...');
  
  renderCircle('main');
  updateBreadcrumb();
  loadSystemStats();
  
  // Center hub click - go back
  document.getElementById('centerHub').addEventListener('click', goBack);
  
  // Drag to rotate
  setupDragRotate();
  
  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboard);
  
  console.log('✅ Fractal Navigation initialized!');
}

// ================== CIRCLE RENDERING ==================

function renderCircle(circleId) {
  const config = circleConfigs[circleId];
  if (!config) {
    console.error(`❌ Circle config not found: ${circleId}`);
    return;
  }

  console.log(`🎨 Rendering circle: ${config.title}`);
  
  const circle = document.getElementById('circle');
  const modules = Object.entries(config.modules);
  const angleStep = 360 / modules.length;

  // Clear existing modules
  const existingModules = circle.querySelectorAll('.module');
  existingModules.forEach(m => m.remove());

  // Create modules
  modules.forEach(([key, data], i) => {
    const angle = i * angleStep;
    const module = createModule(key, data, angle);
    circle.appendChild(module);
  });

  // Update center hub
  const centerHub = document.getElementById('centerHub');
  centerHub.querySelector('.hub-icon').textContent = config.hub.icon;
  centerHub.querySelector('.hub-label').textContent = config.hub.label;

  // Update info section
  document.getElementById('infoTitle').textContent = config.title;
  document.getElementById('infoDescription').textContent = config.description;
  document.getElementById('statLevel').textContent = circleHistory.length;
}

function createModule(key, data, angle) {
  const module = document.createElement('div');
  module.className = 'module';
  module.dataset.id = key;
  module.dataset.angle = angle;

  const radius = 240;
  const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
  const y = Math.sin((angle - 90) * Math.PI / 180) * radius;

  module.style.transform = `translate(${x}px, ${y}px)`;

  const inner = document.createElement('div');
  inner.className = 'module-inner';
  inner.style.borderColor = data.color;

  const icon = document.createElement('div');
  icon.className = 'module-icon';
  icon.textContent = data.icon;

  const label = document.createElement('div');
  label.className = 'module-label';
  label.textContent = data.label;

  inner.appendChild(icon);
  inner.appendChild(label);

  if (data.badge) {
    const badge = document.createElement('div');
    badge.className = 'module-badge';
    badge.textContent = data.badge;
    inner.appendChild(badge);
  }

  module.appendChild(inner);

  // Click handler
  module.addEventListener('click', () => {
    if (data.hasSubCircle && circleConfigs[key]) {
      navigateToCircle(key);
    } else {
      openModuleAction(key, data);
    }
  });

  return module;
}

// ================== NAVIGATION ==================

function navigateToCircle(circleId) {
  if (!circleConfigs[circleId]) {
    console.error(`❌ Cannot navigate: Circle '${circleId}' not found`);
    return;
  }

  console.log(`🔄 Navigating from '${currentCircle}' to '${circleId}'`);

  // Animate transition
  const container = document.getElementById('circleContainer');
  container.classList.add('zoom-in');

  setTimeout(() => {
    currentCircle = circleId;
    circleHistory.push(circleId);
    renderCircle(circleId);
    updateBreadcrumb();
    
    container.classList.remove('zoom-in');
    container.classList.add('zoom-out');
    
    setTimeout(() => {
      container.classList.remove('zoom-out');
    }, 50);
  }, 300);
}

function goBack() {
  if (circleHistory.length <= 1) {
    console.log('🏠 Already at main circle');
    return;
  }

  console.log(`⬅️ Going back from '${currentCircle}'`);

  const container = document.getElementById('circleContainer');
  container.classList.add('zoom-out');

  setTimeout(() => {
    circleHistory.pop();
    currentCircle = circleHistory[circleHistory.length - 1];
    renderCircle(currentCircle);
    updateBreadcrumb();
    
    container.classList.remove('zoom-out');
    container.classList.add('zoom-in');
    
    setTimeout(() => {
      container.classList.remove('zoom-in');
    }, 50);
  }, 300);
}

function navigateToBreadcrumb(index) {
  if (index >= circleHistory.length - 1) return;
  
  console.log(`📍 Navigating via breadcrumb to index ${index}`);
  
  circleHistory = circleHistory.slice(0, index + 1);
  currentCircle = circleHistory[circleHistory.length - 1];
  renderCircle(currentCircle);
  updateBreadcrumb();
}

// Make navigateToBreadcrumb available globally
window.navigateToBreadcrumb = navigateToBreadcrumb;

// ================== BREADCRUMB ==================

function updateBreadcrumb() {
  const breadcrumb = document.getElementById('breadcrumb');
  
  if (circleHistory.length === 1) {
    breadcrumb.classList.remove('visible');
    return;
  }

  breadcrumb.classList.add('visible');
  breadcrumb.innerHTML = circleHistory.map((id, i) => {
    const config = circleConfigs[id];
    const isLast = i === circleHistory.length - 1;
    return `
      <span class="breadcrumb-item" onclick="navigateToBreadcrumb(${i})" 
            style="${isLast ? 'color: #667eea; font-weight: bold;' : ''}">
        ${config.hub.icon} ${config.title}
      </span>
      ${!isLast ? '<span class="breadcrumb-separator">→</span>' : ''}
    `;
  }).join('');
}

// ================== MODULE ACTIONS ==================

function openModuleAction(moduleId, moduleData) {
  console.log(`🎯 Opening module: ${moduleId}`);
  
  // Special actions for specific modules
  switch (moduleId) {
    case 'dashboard':
      window.location.href = 'dashboard.html';
      break;
    case 'terminal':
      window.location.href = 'terminal.html';
      break;
    case 'stats':
      showStatsModal();
      break;
    case 'chat':
      window.location.href = 'luna-consciousness.html';
      break;
    case 'graph':
      window.location.href = 'prototypes/mandala.html';
      break;
    case 'visualize':
      window.location.href = 'prototypes/sphere.html';
      break;
    case 'monitor':
      window.location.href = 'nexus-consciousness.html';
      break;
    default:
      alert(`🚧 Module '${moduleData.label}' coming soon!\n\nThis will open the ${moduleData.label} interface.`);
  }
}

function showStatsModal() {
  // TODO: Create stats modal
  alert('📈 System Statistics\n\nTools: 72\nRelationships: 27\nLevel: ' + circleHistory.length);
}

// ================== DRAG TO ROTATE ==================

function setupDragRotate() {
  const circle = document.getElementById('circle');
  let isDragging = false;
  let startAngle = 0;
  let currentRotation = 0;

  circle.addEventListener('mousedown', (e) => {
    // Don't rotate if clicking on a module
    if (e.target.closest('.module')) return;
    
    isDragging = true;
    const rect = circle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const rect = circle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
    const delta = angle - startAngle;
    currentRotation += delta;
    circle.style.transform = `rotate(${currentRotation}deg)`;
    startAngle = angle;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch support
  circle.addEventListener('touchstart', (e) => {
    if (e.target.closest('.module')) return;
    
    isDragging = true;
    const touch = e.touches[0];
    const rect = circle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    startAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * 180 / Math.PI;
  });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const rect = circle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * 180 / Math.PI;
    const delta = angle - startAngle;
    currentRotation += delta;
    circle.style.transform = `rotate(${currentRotation}deg)`;
    startAngle = angle;
  });

  document.addEventListener('touchend', () => {
    isDragging = false;
  });
}

// ================== KEYBOARD NAVIGATION ==================

function handleKeyboard(e) {
  switch (e.key) {
    case 'Escape':
      if (circleHistory.length > 1) {
        goBack();
      }
      break;
    case 'ArrowLeft':
      rotation -= 45;
      document.getElementById('circle').style.transform = `rotate(${rotation}deg)`;
      break;
    case 'ArrowRight':
      rotation += 45;
      document.getElementById('circle').style.transform = `rotate(${rotation}deg)`;
      break;
    case 'Home':
      // Go to main
      if (currentCircle !== 'main') {
        circleHistory = ['main'];
        currentCircle = 'main';
        renderCircle('main');
        updateBreadcrumb();
      }
      break;
  }
}

// ================== SYSTEM STATS (BRIDGE API) ==================

async function loadSystemStats() {
  try {
    console.log('📡 Loading system stats from Bridge...');
    const response = await fetch('http://localhost:3337/health');
    const data = await response.json();
    
    document.getElementById('statTools').textContent = data.toolCount || 72;
    console.log('✅ System stats loaded:', data);
    
    // Try to get network stats
    try {
      const networkResponse = await fetch('http://localhost:3337/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'network_stats',
            arguments: {}
          },
          id: 1
        })
      });
      const networkData = await networkResponse.json();
      if (networkData.result?.content?.[0]?.text) {
        const stats = JSON.parse(networkData.result.content[0].text);
        document.getElementById('statRelationships').textContent = stats.totalRelationships || 27;
      }
    } catch (err) {
      console.log('⚠️ Network stats not available');
    }
  } catch (error) {
    console.log('⚠️ Bridge not available, using defaults');
  }
}

// ================== INITIALIZE ON LOAD ==================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

console.log('🌌 Toobix Fractal Navigation loaded');
