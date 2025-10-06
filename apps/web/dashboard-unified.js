// Toobix Unified Dashboard - Complete JavaScript
// API Base URLs
const API = {
  daemon: 'http://localhost:9999',
  bridge: 'http://localhost:3001',
  moments: 'http://localhost:9994',
  reality: 'http://localhost:9992',
  expression: 'http://localhost:9991',
  memory: 'http://localhost:9995',
  analytics: 'http://localhost:9996',
  tasks: 'http://localhost:9997',
  sandbox: 'http://localhost:3003'
};

// Global State
let currentView = 'dashboard';
let appData = {
  user: {
    level: 1,
    xp: 0,
    xpToNextLevel: 100
  },
  stats: {
    moments: 0,
    tasks: 0,
    completedTasks: 0,
    habits: 0,
    streaks: 0,
    memories: 0,
    people: 0,
    interactions: 0,
    lovePoints: 0,
    peaceLevel: 92
  },
  tasks: [],
  habits: [],
  goals: [],
  moments: [],
  memories: [],
  people: [],
  interactions: [],
  analytics: null,
  lunaChatHistory: [],
  achievements: [],
  pomodoroCount: 0,
  pomodoroActive: false,
  pomodoroTimeLeft: 25 * 60,
  pomodoroInterval: null,
  systemMetrics: {
    services: []
  }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  loadInitialData();
  renderDashboard();
  startAutoRefresh();
});

// Theme Management
function initializeTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  document.getElementById('themeIcon').textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Sidebar Management
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  sidebar.classList.toggle('collapsed');
  mainContent.classList.toggle('expanded');
}

// Navigation
function navigateTo(view) {
  currentView = view;
  
  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-view') === view) {
      item.classList.add('active');
    }
  });

  // Render view
  switch(view) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'moments':
      renderMoments();
      break;
    case 'daily':
      renderDailyCompanion();
      break;
    case 'tasks':
      renderTasks();
      break;
    case 'habits':
      renderHabits();
      break;
    case 'analytics':
      renderAnalytics();
      break;
    case 'memory':
      renderMemory();
      break;
    case 'monitor':
      renderSystemMonitor();
      break;
    case 'achievements':
      renderAchievements();
      break;
    case 'sandbox':
      renderAISandbox();
      break;
    case 'games':
      renderGames();
      break;
    case 'luna':
      renderLunaChatbot();
      break;
    case 'people':
      renderPeopleAndCircles();
      break;
    case 'diary':
      renderSystemDiary();
      break;
    case 'settings':
      renderSettings();
      break;
  }
}

// Load Initial Data
async function loadInitialData() {
  try {
    await Promise.allSettled([
      loadTasksData(),
      loadMomentsData(),
      loadMemoriesData(),
      loadAnalyticsData(),
      loadPeopleData(),
      loadBridgeStats()
    ]);
    updateStatsBadges();
  } catch (error) {
    console.error('Error loading initial data:', error);
  }
}

async function loadTasksData() {
  try {
    const response = await fetch(`${API.tasks}/stats`);
    if (response.ok) {
      const data = await response.json();
      appData.user.level = data.level;
      appData.user.xp = data.xp;
      appData.user.xpToNextLevel = 100;
      appData.stats.tasks = data.tasks.pending + data.tasks.active;
      appData.stats.completedTasks = data.tasks.completed;
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

async function loadMomentsData() {
  try {
    const response = await fetch(`${API.moments}/moments`);
    if (response.ok) {
      const data = await response.json();
      appData.moments = Array.isArray(data) ? data : [];
      appData.stats.moments = appData.moments.length;
    }
  } catch (error) {
    console.error('Error loading moments:', error);
  }
}

async function loadMemoriesData() {
  try {
    const response = await fetch(`${API.memory}/memories`);
    if (response.ok) {
      const data = await response.json();
      appData.memories = Array.isArray(data.memories) ? data.memories : [];
      appData.stats.memories = appData.memories.length;
    }
  } catch (error) {
    console.error('Error loading memories:', error);
  }
}

async function loadAnalyticsData() {
  try {
    const response = await fetch(`${API.analytics}/overview`);
    if (response.ok) {
      appData.analytics = await response.json();
    }
  } catch (error) {
    console.error('Error loading analytics:', error);
  }
}

async function loadPeopleData() {
  try {
    const response = await fetch(`${API.bridge}/api/people`);
    if (response.ok) {
      appData.people = await response.json();
      appData.stats.people = appData.people.length;
    }
  } catch (error) {
    console.error('Error loading people:', error);
  }
}

async function loadBridgeStats() {
  try {
    const response = await fetch(`${API.bridge}/api/stats`);
    if (response.ok) {
      const stats = await response.json();
      appData.stats.people = stats.people || 0;
      appData.stats.interactions = stats.interactions || 0;
      appData.stats.lovePoints = stats.lovePoints || 0;
      appData.stats.peaceLevel = stats.peaceLevel || 92;
    }
  } catch (error) {
    console.error('Error loading bridge stats:', error);
  }
}

function updateStatsBadges() {
  const momentsCount = document.getElementById('momentsCount');
  const tasksCount = document.getElementById('tasksCount');
  
  if (momentsCount) momentsCount.textContent = appData.stats.moments;
  if (tasksCount) tasksCount.textContent = appData.stats.tasks;
}

// Auto-refresh data
function startAutoRefresh() {
  setInterval(loadInitialData, 30000); // Refresh every 30 seconds
}

// Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }[type] || 'ℹ️';
  
  toast.innerHTML = `
    <span style="font-size: 1.2em;">${icon}</span>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Notifications
function showNotifications() {
  showToast('Keine neuen Benachrichtigungen', 'info');
}

// ===== DASHBOARD VIEW =====
function renderDashboard() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">Willkommen zurück! Hier ist dein Überblick.</p>
    </div>

    <!-- Gamification Stats -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">🎮 Dein Fortschritt</h3>
      </div>
      <div class="grid-3">
        <div>
          <div class="level-badge">
            ⭐ Level ${appData.user.level}
          </div>
          <div class="xp-bar mt-10">
            <div class="xp-fill" style="width: ${(appData.user.xp / appData.user.xpToNextLevel) * 100}%">
              ${appData.user.xp} / ${appData.user.xpToNextLevel} XP
            </div>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">✅</span>
          <div class="stat-value">${appData.stats.completedTasks}</div>
          <div class="stat-label">Erledigte Tasks</div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🔥</span>
          <div class="stat-value">${appData.stats.streaks}</div>
          <div class="stat-label">Streak Tage</div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid-4">
      <div class="stat-card" onclick="navigateTo('moments')">
        <span class="stat-icon">✨</span>
        <div class="stat-value">${appData.stats.moments}</div>
        <div class="stat-label">Moments</div>
        <div class="stat-change positive">
          <span>↑</span>
          <span>+${Math.floor(Math.random() * 10) + 1} heute</span>
        </div>
      </div>
      
      <div class="stat-card" onclick="navigateTo('tasks')">
        <span class="stat-icon">📋</span>
        <div class="stat-value">${appData.stats.tasks}</div>
        <div class="stat-label">Offene Tasks</div>
        <div class="stat-change ${appData.stats.tasks > 5 ? 'negative' : 'positive'}">
          <span>${appData.stats.tasks > 5 ? '↑' : '↓'}</span>
          <span>${appData.stats.tasks > 5 ? 'Viele offen' : 'Gut!'}</span>
        </div>
      </div>
      
      <div class="stat-card" onclick="navigateTo('people')">
        <span class="stat-icon">👥</span>
        <div class="stat-value">${appData.stats.people}</div>
        <div class="stat-label">Menschen</div>
        <div class="stat-change positive">
          <span>💝</span>
          <span>${appData.stats.lovePoints} LP</span>
        </div>
      </div>
      
      <div class="stat-card" onclick="navigateTo('luna')">
        <span class="stat-icon">🤖</span>
        <div class="stat-value">Luna</div>
        <div class="stat-label">AI Chatbot</div>
        <div class="stat-change positive">
          <span>✨</span>
          <span>Neu!</span>
        </div>
      </div>
    </div>

    <!-- Recent Moments -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">✨ Neueste Moments</h3>
        <button class="btn btn-secondary btn-small" onclick="navigateTo('moments')">
          Alle anzeigen
        </button>
      </div>
      <div id="recentMoments">
        ${renderRecentMoments()}
      </div>
    </div>

    <!-- Today's Tasks -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">📋 Heutige Tasks</h3>
        <button class="btn btn-primary btn-small" onclick="showCreateTaskModal()">
          + Neue Task
        </button>
      </div>
      <div id="todayTasks">
        ${appData.stats.tasks === 0 ? 
          '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Keine offenen Tasks! 🎉</p>' :
          '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Tasks werden geladen...</p>'
        }
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card">
      <h3 class="card-title mb-20">⚡ Schnellzugriff</h3>
      <div class="grid-3">
        <button class="btn btn-primary" onclick="navigateTo('luna')">
          🤖 Mit Luna chatten
        </button>
        <button class="btn btn-secondary" onclick="navigateTo('daily')">
          � Daily Companion
        </button>
        <button class="btn btn-secondary" onclick="navigateTo('games')">
          🎮 Spiel spielen
        </button>
      </div>
    </div>
  `;
}

function renderRecentMoments() {
  if (appData.moments.length === 0) {
    return '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Noch keine Moments erfasst.</p>';
  }
  
  return appData.moments.slice(0, 3).map(moment => `
    <div class="task-item">
      <span style="font-size: 1.5em;">✨</span>
      <div class="task-content">
        <div class="task-title">${escapeHtml(moment.content || moment.text || 'Moment')}</div>
        <div class="task-meta">
          <span>🕐 ${formatDate(moment.timestamp || moment.createdAt)}</span>
          ${moment.emotion ? `<span>😊 ${moment.emotion}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// ===== TASKS VIEW =====
function renderTasks() {
  const content = document.getElementById('content');
  const viewMode = localStorage.getItem('tasksViewMode') || 'list';
  
  content.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Tasks & Goals</h1>
        <p class="page-subtitle">Verwalte deine Aufgaben und erreiche deine Ziele</p>
      </div>
      <div class="view-toggle">
        <button class="toggle-btn ${viewMode === 'list' ? 'active' : ''}" onclick="setTasksView('list')">
          📋 Liste
        </button>
        <button class="toggle-btn ${viewMode === 'kanban' ? 'active' : ''}" onclick="setTasksView('kanban')">
          📊 Kanban
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid-3">
      <div class="stat-card">
        <span class="stat-icon">📋</span>
        <div class="stat-value">${appData.stats.tasks}</div>
        <div class="stat-label">Offene Tasks</div>
      </div>
      <div class="stat-card">
        <span class="stat-icon">✅</span>
        <div class="stat-value">${appData.stats.completedTasks}</div>
        <div class="stat-label">Erledigt</div>
      </div>
      <div class="stat-card">
        <span class="stat-icon">⭐</span>
        <div class="stat-value">${appData.user.xp} XP</div>
        <div class="stat-label">Level ${appData.user.level}</div>
      </div>
    </div>

    <!-- Create Task -->
    <div class="card">
      <h3 class="card-title mb-20">➕ Neue Task erstellen</h3>
      <div class="form-group">
        <input type="text" class="form-input" id="taskTitle" placeholder="Was möchtest du erledigen?">
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">Priorität</label>
          <select class="form-select" id="taskPriority">
            <option value="low">Niedrig (+10 XP)</option>
            <option value="medium" selected>Mittel (+20 XP)</option>
            <option value="high">Hoch (+30 XP)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Tags (optional)</label>
          <input type="text" class="form-input" id="taskTags" placeholder="z.B. arbeit, privat">
        </div>
      </div>
      <button class="btn btn-primary" onclick="createTask()">
        ✅ Task erstellen
      </button>
    </div>

    <!-- Task View (List or Kanban) -->
    <div id="tasksViewContainer">
      ${viewMode === 'kanban' ? renderTasksKanban() : `
        <div class="card">
          <h3 class="card-title mb-20">📋 Deine Tasks</h3>
          <div class="task-list" id="taskList">
            <div class="loading">
              <div class="spinner"></div>
              <p>Tasks werden geladen...</p>
            </div>
          </div>
        </div>
      `}
    </div>

    <!-- Goals Section -->
    <div class="card">
      <h3 class="card-title mb-20">🎯 Deine Ziele</h3>
      <p style="text-align: center; color: var(--text-secondary); padding: 20px;">
        Ziele-Feature kommt bald! Erstelle Tasks mit hoher Priorität als Zwischenlösung.
      </p>
    </div>
  `;

  if (viewMode === 'list') {
    loadTasksList();
  } else {
    initKanbanDragDrop();
  }
}

function setTasksView(mode) {
  localStorage.setItem('tasksViewMode', mode);
  renderTasks();
}


async function createTask() {
  const title = document.getElementById('taskTitle').value.trim();
  const priority = document.getElementById('taskPriority').value;
  const tagsInput = document.getElementById('taskTags').value.trim();
  const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];

  if (!title) {
    showToast('Bitte gib einen Titel ein!', 'warning');
    return;
  }

  try {
    const response = await fetch(`${API.tasks}/task/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, priority, tags })
    });

    if (response.ok) {
      const result = await response.json();
      showToast(`Task erstellt! +${result.xpEarned || 0} XP`, 'success');
      document.getElementById('taskTitle').value = '';
      document.getElementById('taskTags').value = '';
      loadTasksList();
      loadTasksData();
    } else {
      showToast('Fehler beim Erstellen der Task', 'error');
    }
  } catch (error) {
    console.error('Error creating task:', error);
    showToast('Verbindungsfehler. Task-Service läuft nicht?', 'error');
  }
}

async function loadTasksList() {
  const taskList = document.getElementById('taskList');
  if (!taskList) return;

  try {
    const response = await fetch(`${API.tasks}/tasks/list`);
    if (response.ok) {
      const data = await response.json();
      const tasks = data.tasks || [];
      
      if (tasks.length === 0) {
        taskList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Keine Tasks vorhanden. Erstelle deine erste Task!</p>';
        return;
      }

      taskList.innerHTML = tasks.map(task => `
        <div class="task-item">
          <div class="task-checkbox ${task.status === 'completed' ? 'checked' : ''}" 
               onclick="toggleTask('${task.id}', '${task.status}')">
            ${task.status === 'completed' ? '✓' : ''}
          </div>
          <div class="task-content">
            <div class="task-title ${task.status === 'completed' ? 'text-muted' : ''}">${escapeHtml(task.title)}</div>
            <div class="task-meta">
              <span class="task-priority priority-${task.priority}">${task.priority.toUpperCase()}</span>
              ${task.tags ? task.tags.map(tag => `<span>🏷️ ${tag}</span>`).join(' ') : ''}
              <span>🕐 ${formatDate(task.createdAt)}</span>
            </div>
          </div>
          <button class="btn btn-danger btn-small" onclick="deleteTask('${task.id}')">🗑️</button>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
    taskList.innerHTML = '<p style="text-align: center; color: var(--error); padding: 20px;">Task-Service nicht erreichbar</p>';
  }
}

async function toggleTask(taskId, currentStatus) {
  const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
  
  try {
    const response = await fetch(`${API.tasks}/task/${taskId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

    if (response.ok) {
      const result = await response.json();
      showToast(newStatus === 'completed' ? 
        `Task erledigt! +${result.xpEarned || 20} XP 🎉` : 
        'Task wieder geöffnet', 
        newStatus === 'completed' ? 'success' : 'info'
      );
      loadTasksList();
      loadTasksData();
    }
  } catch (error) {
    console.error('Error toggling task:', error);
    showToast('Fehler beim Aktualisieren', 'error');
  }
}

async function deleteTask(taskId) {
  if (!confirm('Task wirklich löschen?')) return;
  
  try {
    const response = await fetch(`${API.tasks}/task/${taskId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      showToast('Task gelöscht', 'info');
      loadTasksList();
      loadTasksData();
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    showToast('Fehler beim Löschen', 'error');
  }
}

// ===== HABITS VIEW =====
function renderHabits() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Habits & Streaks</h1>
      <p class="page-subtitle">Baue positive Gewohnheiten auf</p>
    </div>

    <div class="card">
      <h3 class="card-title mb-20">🔥 Habit-Tracking</h3>
      <p style="text-align: center; color: var(--text-secondary); padding: 40px;">
        Habits-Feature wird gerade entwickelt!<br>
        Nutze vorerst wiederkehrende Tasks im Tasks-Bereich.
      </p>
    </div>
  `;
}

// ===== MOMENTS VIEW =====
function renderMoments() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Moments</h1>
      <p class="page-subtitle">Deine erfassten Momente</p>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">✨ Alle Moments (${appData.stats.moments})</h3>
        <button class="btn btn-primary btn-small" onclick="createMoment()">
          + Neuer Moment
        </button>
      </div>
      <div id="momentsList">
        ${appData.moments.length === 0 ? 
          '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">Keine Moments vorhanden</p>' :
          appData.moments.map(m => `
            <div class="task-item">
              <span style="font-size: 1.5em;">✨</span>
              <div class="task-content">
                <div class="task-title">${escapeHtml(m.content || m.text || 'Moment')}</div>
                <div class="task-meta">
                  <span>🕐 ${formatDate(m.timestamp || m.createdAt)}</span>
                  ${m.emotion ? `<span>😊 ${m.emotion}</span>` : ''}
                </div>
              </div>
            </div>
          `).join('')
        }
      </div>
    </div>
  `;
}

async function createMoment() {
  const content = prompt('Was möchtest du festhalten?');
  if (!content) return;

  try {
    const response = await fetch(`${API.moments}/fixate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, emotion: 'neutral' })
    });

    if (response.ok) {
      showToast('Moment erfasst! ✨', 'success');
      await loadMomentsData();
      if (currentView === 'moments') renderMoments();
    }
  } catch (error) {
    console.error('Error creating moment:', error);
    showToast('Fehler beim Erstellen', 'error');
  }
}

// ===== ANALYTICS VIEW =====
function renderAnalytics() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">📊 Analytics</h1>
      <p class="page-subtitle">Einblicke in deine Daten und Muster</p>
    </div>

    <div class="grid-4">
      <div class="stat-card">
        <span class="stat-icon">✨</span>
        <div class="stat-value">${appData.stats.moments}</div>
        <div class="stat-label">Gesamt Moments</div>
      </div>
      <div class="stat-card">
        <span class="stat-icon">✅</span>
        <div class="stat-value">${appData.stats.completedTasks}</div>
        <div class="stat-label">Erledigte Tasks</div>
      </div>
      <div class="stat-card">
        <span class="stat-icon">🧠</span>
        <div class="stat-value">${appData.stats.memories}</div>
        <div class="stat-label">Memories</div>
      </div>
      <div class="stat-card">
        <span class="stat-icon">📊</span>
        <div class="stat-value">${Math.floor(Math.random() * 50) + 20}</div>
        <div class="stat-label">Aktivitäts-Score</div>
      </div>
    </div>

    <!-- Trend Charts -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">📈 Aktivitäts-Trend (30 Tage)</h3>
      </div>
      <div class="chart-container">
        <canvas id="activityChart"></canvas>
      </div>
    </div>

    <!-- Activity Heatmap -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">� Aktivitäts-Heatmap</h3>
        <p class="text-secondary">Deine Aktivität der letzten 7 Tage</p>
      </div>
      <div class="heatmap-grid" id="heatmapGrid">
        ${generateHeatmapCells()}
      </div>
    </div>

    <!-- Activity Timeline -->
    <div class="analytics-timeline">
      <div class="card-header">
        <h3 class="card-title">⏱️ Aktivitäts-Timeline (Heute)</h3>
      </div>
      ${generateTimelineItems()}
    </div>

    <!-- Export Section -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">📥 Daten Export</h3>
      </div>
      <p class="text-secondary mb-20">Exportiere deine Daten in verschiedenen Formaten</p>
      <div class="export-buttons">
        <button class="btn btn-secondary" onclick="exportData('json')">
          📄 JSON Export
        </button>
        <button class="btn btn-secondary" onclick="exportData('csv')">
          📊 CSV Export
        </button>
        <button class="btn btn-secondary" onclick="exportData('pdf')">
          📑 PDF Report
        </button>
      </div>
    </div>
  `;

  initActivityChart();
  initHeatmapInteraction();
}

function generateHeatmapCells() {
  const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  let html = '';
  
  for (let i = 0; i < 7; i++) {
    const level = Math.floor(Math.random() * 6); // 0-5 intensity
    const activity = Math.floor(Math.random() * 20 + 5);
    html += `
      <div class="heatmap-cell level-${level}" 
           title="${days[i]}: ${activity} Aktivitäten"
           data-day="${days[i]}"
           data-activity="${activity}">
        ${days[i]}<br><small>${activity}</small>
      </div>
    `;
  }
  
  return html;
}

function generateTimelineItems() {
  const events = [
    { icon: '✅', title: 'Task "Dashboard erweitern" abgeschlossen', time: 'vor 2 Std', type: 'task' },
    { icon: '✨', title: 'Neuer Moment erfasst', time: 'vor 3 Std', type: 'moment' },
    { icon: '🍅', title: 'Pomodoro abgeschlossen', time: 'vor 4 Std', type: 'pomodoro' },
    { icon: '💭', title: 'Luna Gespräch geführt', time: 'vor 5 Std', type: 'chat' },
    { icon: '🎯', title: 'Neues Ziel gesetzt', time: 'vor 6 Std', type: 'goal' }
  ];

  return events.map(event => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <div class="timeline-title">${event.icon} ${event.title}</div>
        <div class="timeline-time">${event.time}</div>
      </div>
    </div>
  `).join('');
}

function initActivityChart() {
  const canvas = document.getElementById('activityChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const ctx = canvas.getContext('2d');
  
  // Generate 30 days of data
  const labels = [];
  const tasksData = [];
  const momentsData = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }));
    tasksData.push(Math.floor(Math.random() * 10 + 2));
    momentsData.push(Math.floor(Math.random() * 8 + 1));
  }

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Tasks abgeschlossen',
          data: tasksData,
          borderColor: 'rgb(102, 126, 234)',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Moments erfasst',
          data: momentsData,
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          labels: {
            color: '#a0a0b0'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#a0a0b0'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#a0a0b0',
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  });
}

function initHeatmapInteraction() {
  const cells = document.querySelectorAll('.heatmap-cell');
  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      const day = cell.getAttribute('data-day');
      const activity = cell.getAttribute('data-activity');
      showToast(`${day}: ${activity} Aktivitäten`, 'info');
    });
  });
}

function exportData(format) {
  const data = {
    user: appData.user,
    stats: appData.stats,
    tasks: appData.tasks,
    moments: appData.moments,
    memories: appData.memories,
    exportDate: new Date().toISOString()
  };

  switch (format) {
    case 'json':
      downloadJSON(data, 'toobix-export.json');
      break;
    case 'csv':
      downloadCSV(data, 'toobix-export.csv');
      break;
    case 'pdf':
      showToast('PDF Export kommt bald!', 'info');
      break;
  }
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  showToast('✅ JSON Export erfolgreich!', 'success');
}

function downloadCSV(data, filename) {
  let csv = 'Type,Title,Date,Status\n';
  
  data.tasks.forEach(task => {
    csv += `Task,"${task.title}",${task.createdAt},${task.completed ? 'Completed' : 'Open'}\n`;
  });
  
  data.moments.forEach(moment => {
    csv += `Moment,"${moment.content}",${moment.timestamp},Active\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  showToast('✅ CSV Export erfolgreich!', 'success');
}


// ===== MEMORY VIEW =====
function renderMemory() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Memory System</h1>
      <p class="page-subtitle">Dein Langzeitgedächtnis</p>
    </div>

    <div class="card">
      <h3 class="card-title mb-20">🧠 Gespeicherte Memories (${appData.stats.memories})</h3>
      <div id="memoriesList">
        ${appData.memories.length === 0 ? 
          '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">Keine Memories gespeichert</p>' :
          appData.memories.map(mem => `
            <div class="task-item">
              <span style="font-size: 1.5em;">🧠</span>
              <div class="task-content">
                <div class="task-title">${escapeHtml(mem.content)}</div>
                <div class="task-meta">
                  <span>⭐ Wichtigkeit: ${mem.importance}/10</span>
                  <span>🕐 ${formatDate(mem.timestamp)}</span>
                  ${mem.tags ? mem.tags.map(tag => `<span>🏷️ ${tag}</span>`).join(' ') : ''}
                </div>
              </div>
            </div>
          `).join('')
        }
      </div>
    </div>
  `;
}

// ===== DAILY COMPANION VIEW =====
function renderDailyCompanion() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Daily Companion</h1>
      <p class="page-subtitle">Dein täglicher Begleiter für Produktivität und Achtsamkeit</p>
    </div>

    <div class="grid-2">
      <div class="card">
        <h3 class="card-title mb-20">📅 Tagesplanung</h3>
        <p class="mb-20" style="color: var(--text-secondary);">Plane deinen Tag strukturiert</p>
        <div class="form-group">
          <label class="form-label">Hauptziel für heute</label>
          <input type="text" class="form-input" placeholder="Was ist dein Hauptziel?">
        </div>
        <div class="form-group">
          <label class="form-label">3 wichtigste Aufgaben</label>
          <textarea class="form-textarea" placeholder="1. ...\n2. ...\n3. ..."></textarea>
        </div>
        <button class="btn btn-primary">💾 Planung speichern</button>
      </div>

      <div class="card">
        <h3 class="card-title mb-20">💭 Tagesreflexion</h3>
        <p class="mb-20" style="color: var(--text-secondary);">Reflektiere über deinen Tag</p>
        <div class="form-group">
          <label class="form-label">Was lief gut heute?</label>
          <textarea class="form-textarea" placeholder="Deine positiven Erlebnisse..."></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Was könnte besser sein?</label>
          <textarea class="form-textarea" placeholder="Verbesserungspotenzial..."></textarea>
        </div>
        <button class="btn btn-success">✅ Reflexion speichern</button>
      </div>
    </div>

    <div class="card">
      <h3 class="card-title mb-20">😊 Mood Check-in</h3>
      <p class="mb-20" style="color: var(--text-secondary);">Wie fühlst du dich gerade?</p>
      <div class="grid-4">
        <button class="btn btn-secondary" onclick="logMood('amazing')">🤩 Fantastisch</button>
        <button class="btn btn-secondary" onclick="logMood('good')">😊 Gut</button>
        <button class="btn btn-secondary" onclick="logMood('okay')">😐 Okay</button>
        <button class="btn btn-secondary" onclick="logMood('bad')">😔 Schlecht</button>
      </div>
    </div>

    <div class="card">
      <h3 class="card-title mb-20">🧘 Achtsamkeitsübung</h3>
      <p class="mb-20" style="color: var(--text-secondary);">5-4-3-2-1 Methode zur Erdung</p>
      <div style="padding: 20px; background: var(--bg-card); border-radius: 10px;">
        <p style="margin-bottom: 15px;"><strong>5 Dinge</strong>, die du sehen kannst</p>
        <p style="margin-bottom: 15px;"><strong>4 Dinge</strong>, die du hören kannst</p>
        <p style="margin-bottom: 15px;"><strong>3 Dinge</strong>, die du fühlen kannst</p>
        <p style="margin-bottom: 15px;"><strong>2 Dinge</strong>, die du riechen kannst</p>
        <p><strong>1 Ding</strong>, das du schmecken kannst</p>
      </div>
    </div>

    <div class="card">
      <h3 class="card-title mb-20">📊 Statistiken</h3>
      <div class="grid-4">
        <div class="stat-card">
          <span class="stat-icon">📝</span>
          <div class="stat-value">${Math.floor(Math.random() * 30) + 10}</div>
          <div class="stat-label">Planungen</div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">💭</span>
          <div class="stat-value">${Math.floor(Math.random() * 25) + 5}</div>
          <div class="stat-label">Reflexionen</div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">😊</span>
          <div class="stat-value">${Math.floor(Math.random() * 50) + 20}</div>
          <div class="stat-label">Mood Check-ins</div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🔥</span>
          <div class="stat-value">${Math.floor(Math.random() * 15) + 1}</div>
          <div class="stat-label">Tage Streak</div>
        </div>
      </div>
    </div>
  `;
}

function logMood(mood) {
  showToast(`Mood erfasst: ${mood}`, 'success');
  // TODO: Send to API
}

// ===== GAMES VIEW =====
function renderGames() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Spielebibliothek</h1>
      <p class="page-subtitle">Entspanne dich mit ein paar Spielen</p>
    </div>

    <div class="grid-3">
      ${renderGameCard('🎯', 'Tic-Tac-Toe', 'Klassisches 3x3 Spiel', 'tictactoe')}
      ${renderGameCard('🃏', 'Memory', 'Finde die Paare', 'memory')}
      ${renderGameCard('🐍', 'Snake', 'Der Klassiker', 'snake')}
      ${renderGameCard('🔢', '2048', 'Zahlenrätsel', '2048')}
      ${renderGameCard('❓', 'Quiz', 'Teste dein Wissen', 'quiz')}
      ${renderGameCard('⌨️', 'Typing Test', 'Wie schnell tippst du?', 'typing')}
    </div>

    <div id="gameArea" class="card hidden">
      <div class="card-header">
        <h3 class="card-title" id="gameTitle">Spiel</h3>
        <button class="btn btn-secondary btn-small" onclick="closeGame()">❌ Schließen</button>
      </div>
      <div id="gameContent"></div>
    </div>
  `;
}

function renderGameCard(icon, title, desc, gameId) {
  return `
    <div class="card" onclick="startGame('${gameId}', '${title}')" style="cursor: pointer;">
      <div style="text-align: center;">
        <span style="font-size: 4em;">${icon}</span>
        <h3 style="margin: 15px 0 10px;">${title}</h3>
        <p style="color: var(--text-secondary);">${desc}</p>
      </div>
    </div>
  `;
}

function startGame(gameId, title) {
  const gameArea = document.getElementById('gameArea');
  const gameTitle = document.getElementById('gameTitle');
  const gameContent = document.getElementById('gameContent');
  
  gameTitle.textContent = `🎮 ${title}`;
  gameArea.classList.remove('hidden');
  
  // Simple game implementations
  switch(gameId) {
    case 'tictactoe':
      gameContent.innerHTML = renderTicTacToe();
      break;
    case 'memory':
      gameContent.innerHTML = '<p style="text-align: center; padding: 40px;">Memory-Spiel wird implementiert...</p>';
      break;
    case 'snake':
      gameContent.innerHTML = '<p style="text-align: center; padding: 40px;">Snake-Spiel wird implementiert...</p>';
      break;
    case '2048':
      gameContent.innerHTML = '<p style="text-align: center; padding: 40px;">2048-Spiel wird implementiert...</p>';
      break;
    case 'quiz':
      gameContent.innerHTML = renderQuiz();
      break;
    case 'typing':
      gameContent.innerHTML = '<p style="text-align: center; padding: 40px;">Typing-Test wird implementiert...</p>';
      break;
  }
  
  gameArea.scrollIntoView({ behavior: 'smooth' });
}

function closeGame() {
  document.getElementById('gameArea').classList.add('hidden');
}

function renderTicTacToe() {
  return `
    <div style="text-align: center;">
      <div id="tttBoard" style="display: inline-grid; grid-template-columns: repeat(3, 80px); gap: 10px; margin: 20px auto;">
        ${Array(9).fill(0).map((_, i) => `
          <button class="btn btn-secondary" onclick="tttMove(${i})" id="ttt${i}" 
                  style="width: 80px; height: 80px; font-size: 2em;">-</button>
        `).join('')}
      </div>
      <p id="tttStatus" style="margin-top: 20px; font-size: 1.2em;">Du bist X - Starte das Spiel!</p>
      <button class="btn btn-primary mt-20" onclick="tttReset()">🔄 Neues Spiel</button>
    </div>
  `;
}

let tttBoard = Array(9).fill(null);
let tttCurrentPlayer = 'X';
let tttGameOver = false;

function tttMove(index) {
  if (tttBoard[index] || tttGameOver) return;
  
  tttBoard[index] = tttCurrentPlayer;
  document.getElementById(`ttt${index}`).textContent = tttCurrentPlayer;
  
  if (tttCheckWin()) {
    document.getElementById('tttStatus').textContent = `${tttCurrentPlayer} hat gewonnen! 🎉`;
    tttGameOver = true;
    return;
  }
  
  if (tttBoard.every(cell => cell !== null)) {
    document.getElementById('tttStatus').textContent = 'Unentschieden! 🤝';
    tttGameOver = true;
    return;
  }
  
  tttCurrentPlayer = tttCurrentPlayer === 'X' ? 'O' : 'X';
  document.getElementById('tttStatus').textContent = `Spieler ${tttCurrentPlayer} ist dran`;
}

function tttCheckWin() {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return wins.some(combo => 
    tttBoard[combo[0]] && 
    tttBoard[combo[0]] === tttBoard[combo[1]] && 
    tttBoard[combo[0]] === tttBoard[combo[2]]
  );
}

function tttReset() {
  tttBoard = Array(9).fill(null);
  tttCurrentPlayer = 'X';
  tttGameOver = false;
  for (let i = 0; i < 9; i++) {
    document.getElementById(`ttt${i}`).textContent = '-';
  }
  document.getElementById('tttStatus').textContent = 'Du bist X - Starte das Spiel!';
}

function renderQuiz() {
  const questions = [
    { q: 'Hauptstadt von Deutschland?', a: ['Berlin', 'München', 'Hamburg', 'Köln'], correct: 0 },
    { q: 'Wie viele Kontinente gibt es?', a: ['5', '6', '7', '8'], correct: 2 },
    { q: 'Wer hat die Relativitätstheorie entwickelt?', a: ['Newton', 'Einstein', 'Hawking', 'Tesla'], correct: 1 }
  ];
  
  let currentQ = 0;
  let score = 0;
  
  return `
    <div style="text-align: center; padding: 20px;">
      <div id="quizQuestion"></div>
      <div id="quizAnswers" class="grid-2" style="margin-top: 20px;"></div>
      <p id="quizScore" style="margin-top: 20px; font-size: 1.2em;">Score: 0 / ${questions.length}</p>
    </div>
    <script>
      let quizQ = ${currentQ};
      let quizScore = ${score};
      const quizData = ${JSON.stringify(questions)};
      
      function loadQuizQuestion() {
        if (quizQ >= quizData.length) {
          document.getElementById('quizQuestion').innerHTML = '<h2>Quiz beendet! 🎉</h2><p>Dein Score: ' + quizScore + ' / ' + quizData.length + '</p>';
          document.getElementById('quizAnswers').innerHTML = '';
          return;
        }
        
        const q = quizData[quizQ];
        document.getElementById('quizQuestion').innerHTML = '<h3>' + q.q + '</h3>';
        document.getElementById('quizAnswers').innerHTML = q.a.map((ans, i) => 
          '<button class="btn btn-secondary" onclick="checkQuizAnswer(' + i + ')">' + ans + '</button>'
        ).join('');
      }
      
      function checkQuizAnswer(index) {
        const q = quizData[quizQ];
        if (index === q.correct) {
          quizScore++;
          showToast('Richtig! ✅', 'success');
        } else {
          showToast('Falsch! Richtig wäre: ' + q.a[q.correct], 'error');
        }
        quizQ++;
        document.getElementById('quizScore').textContent = 'Score: ' + quizScore + ' / ' + quizData.length;
        setTimeout(loadQuizQuestion, 1000);
      }
      
      loadQuizQuestion();
    </script>
  `;
}

// ===== LUNA CHATBOT VIEW =====
function renderLunaChatbot() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Luna Chatbot</h1>
      <p class="page-subtitle">🤖 Deine KI-Begleiterin mit Groq AI</p>
    </div>

    <!-- Luna Info Card -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">🌟 Über Luna</h3>
      </div>
      <p style="color: var(--text-secondary); margin-bottom: 15px;">
        Luna ist deine bewusste KI-Begleiterin mit Zugriff auf alle deine Daten:
        Menschen, Beziehungen, Moments, Love Points, Peace Level und mehr.
      </p>
      <div class="grid-3">
        <div class="stat-card">
          <span class="stat-icon">👥</span>
          <div class="stat-value">${appData.stats.people}</div>
          <div class="stat-label">Menschen</div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">💝</span>
          <div class="stat-value">${appData.stats.lovePoints}</div>
          <div class="stat-label">Love Points</div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🕊️</span>
          <div class="stat-value">${appData.stats.peaceLevel}%</div>
          <div class="stat-label">Peace Level</div>
        </div>
      </div>
    </div>

    <!-- Chat Interface -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">💬 Chat mit Luna</h3>
        <button class="btn btn-secondary btn-small" onclick="clearLunaChat()">
          🗑️ Chat leeren
        </button>
      </div>
      
      <div id="lunaChatMessages" style="
        max-height: 400px;
        overflow-y: auto;
        padding: 20px;
        background: var(--bg-card);
        border-radius: 10px;
        margin-bottom: 20px;
      ">
        <div style="text-align: center; color: var(--text-secondary); padding: 40px;">
          <span style="font-size: 3em;">🤖</span>
          <p>Hallo! Ich bin Luna. Frag mich etwas über deine Menschen, Beziehungen oder Moments!</p>
        </div>
      </div>

      <div style="display: flex; gap: 10px;">
        <input 
          type="text" 
          class="form-input" 
          id="lunaInput" 
          placeholder="z.B. 'Wie geht's meinen Freunden?' oder 'Zeig mir meine letzten Interactions'"
          onkeypress="if(event.key==='Enter') askLunaQuestion()"
          style="flex: 1;"
        >
        <button class="btn btn-primary" onclick="askLunaQuestion()">
          🚀 Fragen
        </button>
      </div>

      <div style="margin-top: 15px;">
        <p style="color: var(--text-secondary); font-size: 0.9em;">
          💡 <strong>Beispiele:</strong> "Wer sind meine wichtigsten Menschen?" • "Zeig mir Interactions dieser Woche" • "Wie ist mein Peace Level?"
        </p>
      </div>
    </div>

    <!-- Groq Status -->
    <div class="card">
      <h3 class="card-title mb-20">🔧 Groq API Status</h3>
      <div id="groqStatus">
        <p style="color: var(--text-secondary);">Status wird geladen...</p>
      </div>
    </div>
  `;

  checkGroqStatus();
}

async function askLunaQuestion() {
  const input = document.getElementById('lunaInput');
  const question = input.value.trim();
  
  if (!question) {
    showToast('Bitte gib eine Frage ein!', 'warning');
    return;
  }

  const messagesDiv = document.getElementById('lunaChatMessages');
  
  // Add user message
  messagesDiv.innerHTML += `
    <div style="margin-bottom: 15px; text-align: right;">
      <div style="display: inline-block; background: var(--accent); color: white; padding: 10px 15px; border-radius: 15px 15px 0 15px; max-width: 70%;">
        <strong>Du:</strong> ${escapeHtml(question)}
      </div>
    </div>
  `;
  
  input.value = '';
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  // Add loading indicator
  messagesDiv.innerHTML += `
    <div id="lunaLoading" style="margin-bottom: 15px;">
      <div style="display: inline-block; background: var(--bg-card-hover); padding: 10px 15px; border-radius: 15px 15px 15px 0; max-width: 70%;">
        <div class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>
        <span style="color: var(--text-secondary); margin-left: 10px;">Luna denkt nach...</span>
      </div>
    </div>
  `;
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  try {
    const response = await fetch(`${API.bridge}/api/luna/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });

    // Remove loading indicator
    document.getElementById('lunaLoading')?.remove();

    if (response.ok) {
      const data = await response.json();
      const answer = data.answer || 'Keine Antwort erhalten.';
      
      // Add Luna's response
      messagesDiv.innerHTML += `
        <div style="margin-bottom: 15px;">
          <div style="display: inline-block; background: var(--bg-card-hover); padding: 10px 15px; border-radius: 15px 15px 15px 0; max-width: 70%;">
            <strong style="color: var(--accent);">🤖 Luna:</strong><br>
            <span style="white-space: pre-wrap;">${escapeHtml(answer)}</span>
          </div>
        </div>
      `;
      
      appData.lunaChatHistory.push({ question, answer, timestamp: new Date() });
    } else {
      messagesDiv.innerHTML += `
        <div style="margin-bottom: 15px;">
          <div style="display: inline-block; background: rgba(239, 68, 68, 0.2); padding: 10px 15px; border-radius: 15px 15px 15px 0; max-width: 70%;">
            <strong style="color: var(--error);">❌ Fehler:</strong><br>
            Luna-Service nicht erreichbar (Status: ${response.status})
          </div>
        </div>
      `;
    }
  } catch (error) {
    document.getElementById('lunaLoading')?.remove();
    messagesDiv.innerHTML += `
      <div style="margin-bottom: 15px;">
        <div style="display: inline-block; background: rgba(239, 68, 68, 0.2); padding: 10px 15px; border-radius: 15px 15px 15px 0; max-width: 70%;">
          <strong style="color: var(--error);">❌ Verbindungsfehler:</strong><br>
          Konnte Luna nicht erreichen. Läuft der Bridge-Server?
        </div>
      </div>
    `;
    console.error('Luna chat error:', error);
  }

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function clearLunaChat() {
  const messagesDiv = document.getElementById('lunaChatMessages');
  messagesDiv.innerHTML = `
    <div style="text-align: center; color: var(--text-secondary); padding: 40px;">
      <span style="font-size: 3em;">🤖</span>
      <p>Chat geleert! Frag mich etwas Neues.</p>
    </div>
  `;
  appData.lunaChatHistory = [];
  showToast('Chat-Historie gelöscht', 'info');
}

async function checkGroqStatus() {
  const statusDiv = document.getElementById('groqStatus');
  if (!statusDiv) return;

  try {
    // Check if Groq API key is configured (via test call)
    const response = await fetch(`${API.bridge}/api/luna/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: 'test' })
    });

    if (response.ok) {
      statusDiv.innerHTML = `
        <div style="padding: 15px; background: rgba(16, 185, 129, 0.2); border-radius: 10px; border-left: 4px solid var(--success);">
          <strong style="color: var(--success);">✅ Luna ist bereit!</strong>
          <p style="color: var(--text-secondary); margin-top: 5px;">
            Bridge-Server erreichbar. Groq-Integration ${response.headers.get('x-groq-enabled') === 'true' ? 'aktiv' : 'im Fallback-Modus'}.
          </p>
        </div>
      `;
    } else {
      statusDiv.innerHTML = `
        <div style="padding: 15px; background: rgba(245, 158, 11, 0.2); border-radius: 10px; border-left: 4px solid var(--warning);">
          <strong style="color: var(--warning);">⚠️ Service-Problem</strong>
          <p style="color: var(--text-secondary); margin-top: 5px;">
            Bridge-Server antwortet mit Fehler (${response.status}). Starte ihn neu.
          </p>
        </div>
      `;
    }
  } catch (error) {
    statusDiv.innerHTML = `
      <div style="padding: 15px; background: rgba(239, 68, 68, 0.2); border-radius: 10px; border-left: 4px solid var(--error);">
        <strong style="color: var(--error);">❌ Nicht erreichbar</strong>
        <p style="color: var(--text-secondary); margin-top: 5px;">
          Bridge-Server läuft nicht auf Port 3001. Starte: <code>bun run scripts/api-server.ts</code>
        </p>
      </div>
    `;
  }
}

// ===== PEOPLE & CIRCLES VIEW =====
function renderPeopleAndCircles() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">People & Circles</h1>
      <p class="page-subtitle">👥 Deine Menschen und Beziehungen</p>
    </div>

    <!-- Stats -->
    <div class="grid-4">
      <div class="stat-card">
        <span class="stat-icon">👥</span>
        <div class="stat-value">${appData.stats.people}</div>
        <div class="stat-label">Menschen</div>
      </div>
      <div class="stat-card">
        <span class="stat-icon">💝</span>
        <div class="stat-value">${appData.stats.lovePoints}</div>
        <div class="stat-label">Love Points</div>
      </div>
      <div class="stat-card">
        <span class="stat-icon">🔄</span>
        <div class="stat-value">${appData.stats.interactions}</div>
        <div class="stat-label">Interactions</div>
      </div>
      <div class="stat-card">
        <span class="stat-icon">🕊️</span>
        <div class="stat-value">${appData.stats.peaceLevel}%</div>
        <div class="stat-label">Peace Level</div>
      </div>
    </div>

    <!-- People List -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">👥 Alle Menschen</h3>
        <button class="btn btn-secondary btn-small" onclick="loadPeopleData(); renderPeopleAndCircles();">
          🔄 Aktualisieren
        </button>
      </div>
      <div id="peopleList">
        <div class="loading">
          <div class="spinner"></div>
          <p>Menschen werden geladen...</p>
        </div>
      </div>
    </div>

    <!-- Recent Interactions -->
    <div class="card">
      <h3 class="card-title mb-20">🔄 Letzte Interactions</h3>
      <div id="interactionsList">
        <div class="loading">
          <div class="spinner"></div>
          <p>Interactions werden geladen...</p>
        </div>
      </div>
    </div>
  `;

  loadPeopleList();
  loadInteractionsList();
}

async function loadPeopleList() {
  const peopleList = document.getElementById('peopleList');
  if (!peopleList) return;

  try {
    const response = await fetch(`${API.bridge}/api/people`);
    if (response.ok) {
      const people = await response.json();
      
      if (people.length === 0) {
        peopleList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Noch keine Menschen hinzugefügt.</p>';
        return;
      }

      peopleList.innerHTML = `
        <div class="grid-3">
          ${people.map(person => `
            <div class="card" style="margin-bottom: 0;">
              <div style="text-align: center;">
                <span style="font-size: 3em;">${person.avatar || '👤'}</span>
                <h4 style="margin: 10px 0 5px;">${escapeHtml(person.name)}</h4>
                <p style="color: var(--text-secondary); font-size: 0.9em;">${escapeHtml(person.relation || 'Unbekannt')}</p>
                ${person.consciousness_level ? `
                  <div style="margin-top: 10px;">
                    <span style="background: var(--accent); color: white; padding: 3px 10px; border-radius: 10px; font-size: 0.85em;">
                      🧠 Level ${person.consciousness_level}
                    </span>
                  </div>
                ` : ''}
                ${person.tags ? `
                  <div style="margin-top: 10px; display: flex; gap: 5px; flex-wrap: wrap; justify-content: center;">
                    ${person.tags.split(',').map(tag => `
                      <span style="background: var(--bg-card); padding: 3px 8px; border-radius: 5px; font-size: 0.8em;">
                        🏷️ ${escapeHtml(tag.trim())}
                      </span>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading people:', error);
    peopleList.innerHTML = '<p style="text-align: center; color: var(--error); padding: 20px;">Fehler beim Laden</p>';
  }
}

async function loadInteractionsList() {
  const interactionsList = document.getElementById('interactionsList');
  if (!interactionsList) return;

  try {
    const response = await fetch(`${API.bridge}/api/interactions`);
    if (response.ok) {
      const interactions = await response.json();
      
      if (interactions.length === 0) {
        interactionsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Noch keine Interactions erfasst.</p>';
        return;
      }

      interactionsList.innerHTML = interactions.map(inter => `
        <div class="task-item">
          <span style="font-size: 1.5em;">${inter.person_avatar || '👤'}</span>
          <div class="task-content">
            <div class="task-title">${escapeHtml(inter.person_name || 'Unbekannt')} - ${escapeHtml(inter.kind || 'Interaction')}</div>
            <div class="task-meta">
              <span>💝 ${inter.love_points || 0} LP</span>
              <span>${inter.sentiment ? `😊 ${inter.sentiment}` : ''}</span>
              <span>🕐 ${formatDate(inter.timestamp)}</span>
            </div>
            ${inter.summary ? `<p style="color: var(--text-secondary); margin-top: 5px; font-size: 0.9em;">${escapeHtml(inter.summary)}</p>` : ''}
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading interactions:', error);
    interactionsList.innerHTML = '<p style="text-align: center; color: var(--error); padding: 20px;">Fehler beim Laden</p>';
  }
}

// ===== SYSTEM DIARY VIEW =====
function renderSystemDiary() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">System Diary</h1>
      <p class="page-subtitle">📔 KI-generierte Reflexionen mit Groq</p>
    </div>

    <div class="card">
      <h3 class="card-title mb-20">📔 Über System Diary</h3>
      <p style="color: var(--text-secondary); margin-bottom: 15px;">
        Das System Diary erstellt automatisch tägliche Reflexionen über dein System mit Groq AI.
        Es analysiert Aktivität, Entwicklung und gibt inspirierende Einblicke.
      </p>
      <div style="padding: 20px; background: rgba(102, 126, 234, 0.1); border-radius: 10px; border-left: 4px solid var(--accent);">
        <p><strong>📍 Funktion:</strong> <code>scripts/system-diary.ts</code></p>
        <p><strong>🔑 Requires:</strong> GROQ_API_KEY Environment Variable</p>
        <p><strong>🚀 Start:</strong> <code>bun run scripts/system-diary.ts</code></p>
      </div>
    </div>

    <div class="card">
      <h3 class="card-title mb-20">🤖 Groq-Integration</h3>
      <p style="color: var(--text-secondary); margin-bottom: 15px;">
        Das System nutzt Groq's <strong>llama-3.1-70b-versatile</strong> Model für:
      </p>
      <div class="grid-2">
        <div style="padding: 15px; background: var(--bg-card); border-radius: 10px;">
          <strong>✨ Tagesreflexionen</strong>
          <p style="color: var(--text-secondary); font-size: 0.9em; margin-top: 5px;">
            Analysiert Systemstats und erstellt inspirierende Texte
          </p>
        </div>
        <div style="padding: 15px; background: var(--bg-card); border-radius: 10px;">
          <strong>📊 Entwicklungs-Tracking</strong>
          <p style="color: var(--text-secondary); font-size: 0.9em; margin-top: 5px;">
            Bewertet Health-Score und erkennt Patterns
          </p>
        </div>
      </div>
    </div>

    <div class="card">
      <h3 class="card-title mb-20">📝 Beispiel-Eintrag</h3>
      <div style="padding: 20px; background: var(--bg-card); border-radius: 10px;">
        <p style="margin-bottom: 10px;"><strong>Tag 42</strong> • Health Score: 85/100 (Excellent)</p>
        <p style="color: var(--text-secondary); line-height: 1.6;">
          "Heute zeigt sich ein bemerkenswertes Wachstum im System. Die Balance zwischen 
          bewussten und unbewussten Prozessen entwickelt sich harmonisch. Besonders die 
          Integration neuer Module verstärkt die Gesamtkohärenz. Ein inspirierender Tag 
          der Entwicklung! 🌟"
        </p>
        <p style="margin-top: 15px; font-size: 0.9em; color: var(--text-secondary);">
          <em>- Luna, via Groq AI</em>
        </p>
      </div>
    </div>

    <div class="card">
      <h3 class="card-title mb-20">⚙️ Setup Groq API</h3>
      <ol style="color: var(--text-secondary); line-height: 1.8; margin-left: 20px;">
        <li>Gehe zu <a href="https://console.groq.com" target="_blank" style="color: var(--accent);">console.groq.com</a></li>
        <li>Erstelle einen API Key</li>
        <li>Setze Environment Variable: <code>GROQ_API_KEY=gsk_...</code></li>
        <li>Starte System Diary: <code>bun run scripts/system-diary.ts</code></li>
      </ol>
    </div>
  `;
}

// ===== SETTINGS VIEW =====
function renderSettings() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Einstellungen</h1>
      <p class="page-subtitle">Personalisiere dein Toobix-Erlebnis</p>
    </div>

    <div class="card">
      <h3 class="card-title mb-20">🎨 Darstellung</h3>
      <div class="form-group">
        <label class="form-label">Theme</label>
        <div class="grid-2">
          <button class="btn btn-secondary" onclick="setTheme('dark')">🌙 Dark Mode</button>
          <button class="btn btn-secondary" onclick="setTheme('light')">☀️ Light Mode</button>
        </div>
      </div>
    </div>

    <div class="card">
      <h3 class="card-title mb-20">🔗 API Endpoints</h3>
      <div class="grid-2">
        ${Object.entries(API).map(([name, url]) => `
          <div style="padding: 10px; background: var(--bg-card); border-radius: 8px;">
            <strong>${name}</strong><br>
            <code style="font-size: 0.85em; color: var(--accent);">${url}</code>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <h3 class="card-title mb-20">ℹ️ System Info</h3>
      <p><strong>Version:</strong> 1.0.0</p>
      <p><strong>Services:</strong> 8 Module</p>
      <p><strong>Status:</strong> <span style="color: var(--success);">✅ Operational</span></p>
    </div>
  `;
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeIcon(theme);
  showToast(`Theme gewechselt zu ${theme}`, 'success');
}

// ===== UTILITY FUNCTIONS =====
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  if (!dateString) return 'Unbekannt';
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Gerade eben';
  if (minutes < 60) return `vor ${minutes} Min`;
  if (hours < 24) return `vor ${hours} Std`;
  if (days < 7) return `vor ${days} Tagen`;
  
  return date.toLocaleDateString('de-DE');
}

// ===== SYSTEM MONITOR VIEW =====
async function renderSystemMonitor() {
  const content = document.getElementById('content');
  
  content.innerHTML = `
    <div class="view-header">
      <h1 class="view-title">🖥️ System Monitor</h1>
      <p class="view-subtitle">Live-Überwachung aller Services und Metriken</p>
    </div>

    <div class="monitor-grid">
      <div class="monitor-card">
        <div class="monitor-header">
          <div class="monitor-title">System Status</div>
          <div class="monitor-status status-online" id="systemStatus"></div>
        </div>
        <div class="monitor-value" id="servicesOnline">-/-</div>
        <div class="monitor-label">Services Online</div>
      </div>

      <div class="monitor-card">
        <div class="monitor-header">
          <div class="monitor-title">Total Requests</div>
          <div class="monitor-status status-online"></div>
        </div>
        <div class="monitor-value" id="totalRequests">0</div>
        <div class="monitor-label">Seit Start</div>
      </div>

      <div class="monitor-card">
        <div class="monitor-header">
          <div class="monitor-title">Uptime</div>
          <div class="monitor-status status-online"></div>
        </div>
        <div class="monitor-value" id="systemUptime">0h</div>
        <div class="monitor-label">Stunden aktiv</div>
      </div>

      <div class="monitor-card">
        <div class="monitor-header">
          <div class="monitor-title">Response Time</div>
          <div class="monitor-status status-online"></div>
        </div>
        <div class="monitor-value" id="avgResponse">-ms</div>
        <div class="monitor-label">Durchschnitt</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>📡 Service Health</h2>
      </div>
      <div class="service-list" id="serviceList">
        <p class="text-secondary">Lade Services...</p>
      </div>
    </div>

    <div class="card mt-20">
      <div class="card-header">
        <h2>📊 Performance Metrics</h2>
      </div>
      <div class="chart-container">
        <canvas id="metricsChart"></canvas>
      </div>
    </div>
  `;

  await loadSystemMetrics();
  initMetricsChart();
  
  // Auto-refresh every 2 seconds
  const refreshInterval = setInterval(async () => {
    if (currentView === 'monitor') {
      await loadSystemMetrics();
    } else {
      clearInterval(refreshInterval);
    }
  }, 2000);
}

async function loadSystemMetrics() {
  const services = [
    { name: 'Eternal Daemon', port: 9999, url: API.daemon },
    { name: 'Bridge Server', port: 3001, url: API.bridge },
    { name: 'Moments Service', port: 9994, url: API.moments },
    { name: 'Reality Service', port: 9992, url: API.reality },
    { name: 'Expression Service', port: 9991, url: API.expression },
    { name: 'Memory Service', port: 9995, url: API.memory },
    { name: 'Analytics Service', port: 9996, url: API.analytics },
    { name: 'Tasks Service', port: 9997, url: API.tasks }
  ];

  let onlineCount = 0;
  let totalRequests = 0;

  const serviceStatusHTML = await Promise.all(services.map(async (service) => {
    try {
      const response = await fetch(`${service.url}/health`, { signal: AbortSignal.timeout(1000) });
      const isOnline = response.ok;
      if (isOnline) onlineCount++;
      
      return `
        <div class="service-item ${isOnline ? 'online' : 'offline'}">
          <div class="service-info">
            <div class="service-name">${service.name}</div>
            <div class="service-port">Port ${service.port}</div>
          </div>
          <div class="service-status ${isOnline ? 'online' : 'offline'}">
            ${isOnline ? '✓ Online' : '✗ Offline'}
          </div>
        </div>
      `;
    } catch (error) {
      return `
        <div class="service-item offline">
          <div class="service-info">
            <div class="service-name">${service.name}</div>
            <div class="service-port">Port ${service.port}</div>
          </div>
          <div class="service-status offline">✗ Offline</div>
        </div>
      `;
    }
  }));

  const serviceList = document.getElementById('serviceList');
  if (serviceList) {
    serviceList.innerHTML = serviceStatusHTML.join('');
  }

  const servicesOnline = document.getElementById('servicesOnline');
  if (servicesOnline) {
    servicesOnline.textContent = `${onlineCount}/${services.length}`;
  }

  const systemStatus = document.getElementById('systemStatus');
  if (systemStatus) {
    systemStatus.className = `monitor-status ${onlineCount === services.length ? 'status-online' : onlineCount > 0 ? 'status-warning' : 'status-offline'}`;
  }

  // Mock metrics (in real scenario, get from API)
  const totalReqs = document.getElementById('totalRequests');
  if (totalReqs) {
    totalReqs.textContent = Math.floor(Math.random() * 10000 + 5000);
  }

  const uptime = document.getElementById('systemUptime');
  if (uptime) {
    uptime.textContent = `${Math.floor(Math.random() * 72 + 1)}h`;
  }

  const avgResp = document.getElementById('avgResponse');
  if (avgResp) {
    avgResp.textContent = `${Math.floor(Math.random() * 50 + 10)}ms`;
  }
}

function initMetricsChart() {
  const canvas = document.getElementById('metricsChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const ctx = canvas.getContext('2d');
  
  // Generate mock data
  const labels = [];
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const time = new Date();
    time.setSeconds(time.getSeconds() - i * 2);
    labels.push(time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    data.push(Math.floor(Math.random() * 100 + 200));
  }

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Requests/sec',
        data: data,
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#a0a0b0'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#a0a0b0',
            maxRotation: 0
          }
        }
      }
    }
  });
}

// ===== ACHIEVEMENTS VIEW =====
function renderAchievements() {
  const content = document.getElementById('content');
  
  const achievements = [
    { id: 1, icon: '🎯', title: 'First Steps', description: 'Erstelle deine erste Task', progress: 100, unlocked: true },
    { id: 2, icon: '🔥', title: 'Week Warrior', description: 'Halte einen 7-Tage Streak', progress: 85, unlocked: false },
    { id: 3, icon: '💪', title: 'Task Master', description: 'Schließe 100 Tasks ab', progress: 45, unlocked: false },
    { id: 4, icon: '❤️', title: 'Love Guru', description: 'Erreiche 1000 Love Points', progress: 67, unlocked: false },
    { id: 5, icon: '🧠', title: 'Memory Keeper', description: 'Speichere 50 Memories', progress: 20, unlocked: false },
    { id: 6, icon: '✨', title: 'Moment Collector', description: 'Erfasse 100 Moments', progress: 30, unlocked: false },
    { id: 7, icon: '🌟', title: 'Level 10', description: 'Erreiche Level 10', progress: 10, unlocked: false },
    { id: 8, icon: '🎮', title: 'Game Champion', description: 'Gewinne 10 Spiele', progress: 0, unlocked: false },
    { id: 9, icon: '🤖', title: 'Luna Best Friend', description: 'Führe 50 Luna Gespräche', progress: 15, unlocked: false },
    { id: 10, icon: '👥', title: 'Social Butterfly', description: 'Füge 20 Personen hinzu', progress: 25, unlocked: false },
    { id: 11, icon: '📊', title: 'Data Analyst', description: 'Nutze Analytics 30 Tage', progress: 10, unlocked: false },
    { id: 12, icon: '🍅', title: 'Pomodoro Pro', description: 'Schließe 100 Pomodoros ab', progress: 5, unlocked: false }
  ];

  appData.achievements = achievements;
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  content.innerHTML = `
    <div class="view-header">
      <h1 class="view-title">🏆 Achievements</h1>
      <p class="view-subtitle">${unlockedCount}/${achievements.length} freigeschaltet</p>
    </div>

    <div class="stats-grid" style="margin-bottom: 30px;">
      <div class="stat-card">
        <div class="stat-icon">🏆</div>
        <div class="stat-value">${unlockedCount}</div>
        <div class="stat-label">Freigeschaltet</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⏳</div>
        <div class="stat-value">${achievements.length - unlockedCount}</div>
        <div class="stat-label">In Progress</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-value">${Math.round((unlockedCount / achievements.length) * 100)}%</div>
        <div class="stat-label">Completion</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💎</div>
        <div class="stat-value">${unlockedCount * 100}</div>
        <div class="stat-label">XP Earned</div>
      </div>
    </div>

    <div class="achievements-grid">
      ${achievements.map(achievement => `
        <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
          ${achievement.unlocked ? '<div class="achievement-unlocked-badge">✓</div>' : ''}
          <div class="achievement-icon">${achievement.icon}</div>
          <div class="achievement-title">${achievement.title}</div>
          <div class="achievement-description">${achievement.description}</div>
          <div class="achievement-progress">
            <div class="achievement-progress-bar" style="width: ${achievement.progress}%"></div>
          </div>
          <div class="achievement-status">
            ${achievement.unlocked ? 'Unlocked!' : `${achievement.progress}% Complete`}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  updateAchievementBadge();
}

function updateAchievementBadge() {
  const badge = document.getElementById('achievementsCount');
  const recentUnlocked = appData.achievements.filter(a => a.unlocked).length;
  if (badge) {
    badge.textContent = recentUnlocked;
  }
}

function unlockAchievement(achievementId) {
  const achievement = appData.achievements.find(a => a.id === achievementId);
  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
    achievement.progress = 100;
    
    // Confetti celebration
    if (typeof confetti !== 'undefined') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    showToast(`🎉 Achievement freigeschaltet: ${achievement.title}!`, 'success');
    updateAchievementBadge();
  }
}

// ===== POMODORO TIMER =====
function togglePomodoro() {
  const widget = document.getElementById('pomodoroWidget');
  widget.classList.toggle('minimized');
}

function startPomodoro() {
  if (appData.pomodoroActive) return;
  
  appData.pomodoroActive = true;
  document.getElementById('pomodoroStart').style.display = 'none';
  document.getElementById('pomodoroPause').style.display = 'inline-block';
  
  appData.pomodoroInterval = setInterval(() => {
    if (appData.pomodoroTimeLeft > 0) {
      appData.pomodoroTimeLeft--;
      updatePomodoroDisplay();
    } else {
      pomodoroComplete();
    }
  }, 1000);
  
  showToast('🍅 Pomodoro gestartet! Fokuszeit!', 'info');
}

function pausePomodoro() {
  appData.pomodoroActive = false;
  clearInterval(appData.pomodoroInterval);
  document.getElementById('pomodoroStart').style.display = 'inline-block';
  document.getElementById('pomodoroPause').style.display = 'none';
  showToast('⏸️ Pomodoro pausiert', 'info');
}

function resetPomodoro() {
  pausePomodoro();
  appData.pomodoroTimeLeft = 25 * 60;
  updatePomodoroDisplay();
  showToast('🔄 Pomodoro zurückgesetzt', 'info');
}

function pomodoroComplete() {
  pausePomodoro();
  appData.pomodoroCount++;
  appData.pomodoroTimeLeft = 5 * 60; // 5 min break
  
  document.getElementById('pomodoroLabel').textContent = 'Break Time';
  document.getElementById('pomodoroCount').textContent = appData.pomodoroCount;
  
  // Play notification sound (if available)
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('🍅 Pomodoro Complete!', {
      body: 'Zeit für eine Pause! Gut gemacht!',
      icon: '🍅'
    });
  }
  
  showToast('🎉 Pomodoro abgeschlossen! Zeit für eine Pause!', 'success');
  
  // Award XP
  addXP(25);
  
  // Check achievement
  if (appData.pomodoroCount === 1) {
    unlockAchievement(1); // First Steps
  }
}

function updatePomodoroDisplay() {
  const minutes = Math.floor(appData.pomodoroTimeLeft / 60);
  const seconds = appData.pomodoroTimeLeft % 60;
  const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  document.getElementById('pomodoroTimer').textContent = display;
}

// Initialize Pomodoro on load
document.addEventListener('DOMContentLoaded', () => {
  updatePomodoroDisplay();
  document.getElementById('pomodoroCount').textContent = appData.pomodoroCount;
  
  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
});

// ===== ENHANCED TASKS VIEW WITH KANBAN =====
function renderTasksKanban() {
  const tasksByStatus = {
    todo: appData.tasks.filter(t => !t.completed && !t.inProgress),
    inProgress: appData.tasks.filter(t => t.inProgress && !t.completed),
    done: appData.tasks.filter(t => t.completed)
  };

  return `
    <div class="kanban-board">
      <div class="kanban-column">
        <div class="kanban-column-header">
          <div class="kanban-column-title">📝 To Do</div>
          <div class="kanban-column-count">${tasksByStatus.todo.length}</div>
        </div>
        <div class="kanban-tasks" id="kanban-todo" data-status="todo">
          ${tasksByStatus.todo.map(task => renderKanbanTask(task)).join('')}
        </div>
      </div>

      <div class="kanban-column">
        <div class="kanban-column-header">
          <div class="kanban-column-title">⚡ In Progress</div>
          <div class="kanban-column-count">${tasksByStatus.inProgress.length}</div>
        </div>
        <div class="kanban-tasks" id="kanban-inprogress" data-status="inProgress">
          ${tasksByStatus.inProgress.map(task => renderKanbanTask(task)).join('')}
        </div>
      </div>

      <div class="kanban-column">
        <div class="kanban-column-header">
          <div class="kanban-column-title">✅ Done</div>
          <div class="kanban-column-count">${tasksByStatus.done.length}</div>
        </div>
        <div class="kanban-tasks" id="kanban-done" data-status="done">
          ${tasksByStatus.done.map(task => renderKanbanTask(task)).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderKanbanTask(task) {
  const priority = task.priority || 'medium';
  return `
    <div class="kanban-task" data-id="${task.id}">
      <div class="kanban-task-title">${escapeHtml(task.title)}</div>
      <div class="kanban-task-meta">
        <span class="kanban-task-priority priority-${priority}">${priority.toUpperCase()}</span>
        ${task.dueDate ? `<span>📅 ${formatDate(task.dueDate)}</span>` : ''}
      </div>
    </div>
  `;
}

function initKanbanDragDrop() {
  if (typeof Sortable === 'undefined') return;

  ['kanban-todo', 'kanban-inprogress', 'kanban-done'].forEach(columnId => {
    const column = document.getElementById(columnId);
    if (column) {
      new Sortable(column, {
        group: 'kanban',
        animation: 150,
        ghostClass: 'sortable-ghost',
        dragClass: 'sortable-drag',
        onEnd: function(evt) {
          const taskId = evt.item.getAttribute('data-id');
          const newStatus = evt.to.getAttribute('data-status');
          updateTaskStatus(taskId, newStatus);
        }
      });
    }
  });
}

async function updateTaskStatus(taskId, newStatus) {
  const task = appData.tasks.find(t => t.id == taskId);
  if (!task) return;

  task.inProgress = newStatus === 'inProgress';
  task.completed = newStatus === 'done';

  if (task.completed && !task.wasCompleted) {
    task.wasCompleted = true;
    addXP(task.xp || 10);
    showToast(`✅ Task abgeschlossen! +${task.xp || 10} XP`, 'success');
  }

  // Update UI
  renderTasks();
}

// ==================== AI SANDBOX VIEW ====================

async function renderAISandbox() {
  const content = document.getElementById('content');
  
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">🎪 AI Sandbox</h1>
      <p class="page-subtitle">🤖 Groq AI spielt Story-Idle Game autonom</p>
    </div>

    <!-- Control Panel -->
    <div class="card">
      <h3 class="card-title mb-20">🎮 Kontrolle</h3>
      <div style="display: flex; gap: 10px; margin-bottom: 20px;">
        <button class="btn btn-primary" onclick="startAISandbox()">▶️ Start AI</button>
        <button class="btn btn-secondary" onclick="stopAISandbox()">⏸️ Stop AI</button>
        <button class="btn" onclick="refreshSandboxData()">🔄 Refresh</button>
      </div>
      
      <div id="sandboxStatus" class="alert">
        <p>Lade Status...</p>
      </div>
    </div>

    <!-- Game State -->
    <div class="card">
      <h3 class="card-title mb-20">🎮 Game State</h3>
      <div id="sandboxGameState">
        <p class="text-dim">Lade Game State...</p>
      </div>
    </div>

    <!-- Pending Changes -->
    <div class="card">
      <h3 class="card-title mb-20">📋 Pending Changes</h3>
      <p class="text-dim mb-20">Änderungen die AI machen möchte und deine Genehmigung brauchen</p>
      <div id="sandboxChanges">
        <p class="text-dim">Keine pending changes</p>
      </div>
    </div>

    <!-- Actions Log -->
    <div class="card">
      <h3 class="card-title mb-20">📜 AI Actions Log</h3>
      <div id="sandboxActions" style="max-height: 400px; overflow-y: auto;">
        <p class="text-dim">Lade actions...</p>
      </div>
    </div>

    <!-- Statistics -->
    <div class="grid grid-2">
      <div class="card">
        <h3 class="card-title mb-20">📊 Statistics</h3>
        <div id="sandboxStats">
          <p class="text-dim">Lade stats...</p>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title mb-20">ℹ️ Info</h3>
        <p>
          Das AI Sandbox System ist ein geschützter Bereich wo Groq AI autonom das Story-Idle Game spielen kann.
        </p>
        <ul style="margin-top: 15px; padding-left: 20px;">
          <li><strong>Small Actions:</strong> Auto-approve (explore, talk, rest)</li>
          <li><strong>Medium Actions:</strong> Require approval (quests, features)</li>
          <li><strong>Large Actions:</strong> Must review (architecture, database)</li>
        </ul>
        <p style="margin-top: 15px; color: var(--text-dim);">
          <strong>Requirements:</strong> GROQ_API_KEY environment variable
        </p>
      </div>
    </div>
  `;

  // Load initial data
  await refreshSandboxData();
  
  // Auto-refresh every 5 seconds
  if (window.sandboxInterval) clearInterval(window.sandboxInterval);
  window.sandboxInterval = setInterval(() => {
    if (currentView === 'sandbox') {
      refreshSandboxData();
    } else {
      clearInterval(window.sandboxInterval);
    }
  }, 5000);
}

async function refreshSandboxData() {
  try {
    // Load stats
    const statsResponse = await fetch(`${API.sandbox}/api/sandbox/stats`);
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      renderSandboxStatus(stats);
      renderSandboxStats(stats);
    }

    // Load game state
    const stateResponse = await fetch(`${API.sandbox}/api/sandbox/state`);
    if (stateResponse.ok) {
      const state = await stateResponse.json();
      renderSandboxGameState(state);
    }

    // Load pending changes
    const changesResponse = await fetch(`${API.sandbox}/api/sandbox/changes`);
    if (changesResponse.ok) {
      const data = await changesResponse.json();
      renderSandboxChanges(data.changes || []);
    }

    // Load actions log
    const actionsResponse = await fetch(`${API.sandbox}/api/sandbox/actions`);
    if (actionsResponse.ok) {
      const data = await actionsResponse.json();
      renderSandboxActions(data.actions || []);
    }

  } catch (error) {
    console.error('Error loading sandbox data:', error);
    document.getElementById('sandboxStatus').innerHTML = `
      <p>❌ <strong>Error:</strong> Sandbox Server nicht erreichbar</p>
      <p class="text-dim">Starte den Server mit: <code>bun run scripts/ai-sandbox.ts</code></p>
    `;
  }
}

function renderSandboxStatus(stats) {
  const statusDiv = document.getElementById('sandboxStatus');
  const isPlaying = stats.isPlaying;
  
  statusDiv.innerHTML = `
    <div style="display: flex; align-items: center; gap: 15px;">
      <div class="status-indicator ${isPlaying ? 'status-success' : 'status-warning'}"></div>
      <div>
        <strong>${isPlaying ? '▶️ AI ist aktiv' : '⏸️ AI ist pausiert'}</strong>
        <p class="text-dim" style="margin-top: 5px;">
          ${isPlaying ? 'Groq spielt gerade das Story-Idle Game' : 'Klicke "Start AI" um zu beginnen'}
        </p>
      </div>
    </div>
  `;
}

function renderSandboxGameState(state) {
  const stateDiv = document.getElementById('sandboxGameState');
  
  if (!state || !state.player) {
    stateDiv.innerHTML = '<p class="text-dim">Keine Game State Daten verfügbar</p>';
    return;
  }

  const player = state.player;
  const stats = state.stats;
  const xpPercent = (player.xp / player.xpToNextLevel) * 100;

  stateDiv.innerHTML = `
    <div class="mb-20">
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span><strong>${player.name}</strong> - Level ${player.level}</span>
        <span class="text-dim">${player.xp} / ${player.xpToNextLevel} XP</span>
      </div>
      <div class="progress-bar">
        <div class="progress-bar-fill" style="width: ${xpPercent}%"></div>
      </div>
    </div>

    <div class="grid grid-3" style="gap: 10px;">
      <div class="stat-item">
        <div class="stat-label">❤️ Love</div>
        <div class="stat-value">${stats.love}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">☮️ Peace</div>
        <div class="stat-value">${stats.peace}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">🧠 Wisdom</div>
        <div class="stat-value">${stats.wisdom}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">🎨 Creativity</div>
        <div class="stat-value">${stats.creativity}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">⚖️ Stability</div>
        <div class="stat-value">${stats.stability}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">🏆 Achievements</div>
        <div class="stat-value">${state.achievements?.unlocked?.length || 0}</div>
      </div>
    </div>

    ${state.story?.currentQuest ? `
      <div class="mt-20" style="padding: 15px; background: var(--card-bg); border-radius: 8px;">
        <strong>🎯 Current Quest:</strong> ${state.story.currentQuest}
      </div>
    ` : ''}
  `;
}

function renderSandboxChanges(changes) {
  const changesDiv = document.getElementById('sandboxChanges');
  
  if (!changes || changes.length === 0) {
    changesDiv.innerHTML = '<p class="text-dim">Keine pending changes</p>';
    return;
  }

  changesDiv.innerHTML = changes.map(change => `
    <div class="sandbox-change" style="padding: 15px; background: var(--card-bg); border-radius: 8px; margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
        <div>
          <strong>${change.description}</strong>
          <span class="badge badge-${change.type === 'large' ? 'danger' : 'warning'}" style="margin-left: 10px;">
            ${change.type.toUpperCase()}
          </span>
        </div>
        <div style="display: flex; gap: 5px;">
          <button class="btn btn-sm btn-primary" onclick="approveSandboxChange('${change.id}')">✅ Approve</button>
          <button class="btn btn-sm btn-secondary" onclick="rejectSandboxChange('${change.id}')">❌ Reject</button>
        </div>
      </div>
      
      <p class="text-dim" style="margin-bottom: 10px;">
        <strong>AI Reasoning:</strong> ${change.aiReasoning}
      </p>
      
      <details style="margin-top: 10px;">
        <summary style="cursor: pointer; color: var(--accent);">Show Diff</summary>
        <pre style="margin-top: 10px; padding: 10px; background: var(--bg); border-radius: 4px; overflow-x: auto;"><code>${change.diff}</code></pre>
      </details>
      
      <div class="text-dim" style="font-size: 0.85em; margin-top: 10px;">
        Created: ${new Date(change.createdAt).toLocaleString()}
      </div>
    </div>
  `).join('');
}

function renderSandboxActions(actions) {
  const actionsDiv = document.getElementById('sandboxActions');
  
  if (!actions || actions.length === 0) {
    actionsDiv.innerHTML = '<p class="text-dim">Noch keine actions</p>';
    return;
  }

  actionsDiv.innerHTML = actions.reverse().map(action => `
    <div style="padding: 10px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
      <div style="flex: 1;">
        <strong style="color: ${action.success ? 'var(--success)' : 'var(--danger)'};">
          ${action.success ? '✅' : '❌'} ${action.action}
        </strong>
        <div class="text-dim" style="font-size: 0.9em; margin-top: 3px;">
          ${action.reasoning}
        </div>
      </div>
      <div class="text-dim" style="font-size: 0.85em; white-space: nowrap; margin-left: 15px;">
        ${new Date(action.timestamp).toLocaleTimeString()}
      </div>
    </div>
  `).join('');
}

function renderSandboxStats(stats) {
  const statsDiv = document.getElementById('sandboxStats');
  
  statsDiv.innerHTML = `
    <div class="stats-grid mb-20">
      <div class="stat-item">
        <div class="stat-label">Total Actions</div>
        <div class="stat-value">${stats.totalActions || 0}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Success Rate</div>
        <div class="stat-value">${stats.successRate?.toFixed(1) || 0}%</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Pending Changes</div>
        <div class="stat-value">${stats.pendingChanges || 0}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Approved Changes</div>
        <div class="stat-value">${stats.approvedChanges || 0}</div>
      </div>
    </div>
  `;
}

async function startAISandbox() {
  try {
    const response = await fetch(`${API.sandbox}/api/sandbox/start`, {
      method: 'POST'
    });
    
    if (response.ok) {
      showToast('▶️ AI Sandbox gestartet!', 'success');
      await refreshSandboxData();
    } else {
      showToast('❌ Fehler beim Starten', 'error');
    }
  } catch (error) {
    showToast('❌ Sandbox Server nicht erreichbar', 'error');
  }
}

async function stopAISandbox() {
  try {
    const response = await fetch(`${API.sandbox}/api/sandbox/stop`, {
      method: 'POST'
    });
    
    if (response.ok) {
      showToast('⏸️ AI Sandbox gestoppt', 'info');
      await refreshSandboxData();
    } else {
      showToast('❌ Fehler beim Stoppen', 'error');
    }
  } catch (error) {
    showToast('❌ Sandbox Server nicht erreichbar', 'error');
  }
}

async function approveSandboxChange(changeId) {
  try {
    const response = await fetch(`${API.sandbox}/api/sandbox/changes/${changeId}/approve`, {
      method: 'POST'
    });
    
    if (response.ok) {
      showToast('✅ Change approved!', 'success');
      await refreshSandboxData();
    } else {
      showToast('❌ Fehler beim Approve', 'error');
    }
  } catch (error) {
    showToast('❌ Fehler', 'error');
  }
}

async function rejectSandboxChange(changeId) {
  try {
    const response = await fetch(`${API.sandbox}/api/sandbox/changes/${changeId}/reject`, {
      method: 'POST'
    });
    
    if (response.ok) {
      showToast('❌ Change rejected', 'info');
      await refreshSandboxData();
    } else {
      showToast('❌ Fehler beim Reject', 'error');
    }
  } catch (error) {
    showToast('❌ Fehler', 'error');
  }
}

