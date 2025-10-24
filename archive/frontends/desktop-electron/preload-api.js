/**
 * Preload API Helper
 * Makes API calls easier from renderer process
 */

const API_BASE = 'http://localhost:3002';

window.api = {
  // ========== GENERIC ==========
  async get(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async post(endpoint, body) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async put(endpoint, body) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async delete(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  // ========== STATS ==========
  async getStats() {
    return this.get('/stats');
  },

  // ========== WORK ==========
  work: {
    async getTasks(filters = {}) {
      const params = new URLSearchParams(filters).toString();
      return window.api.get(`/api/work/tasks${params ? '?' + params : ''}`);
    },
    async getTodayTasks() {
      return window.api.get('/api/work/tasks/today');
    },
    async createTask(task) {
      return window.api.post('/api/work/tasks', task);
    },
    async completeTask(id) {
      return window.api.post(`/api/work/tasks/${id}/complete`, {});
    },
    async deleteTask(id) {
      return window.api.delete(`/api/work/tasks/${id}`);
    },
    async getProjects() {
      return window.api.get('/api/work/projects');
    },
    async createProject(project) {
      return window.api.post('/api/work/projects', project);
    },
    async getGoals() {
      return window.api.get('/api/work/goals');
    },
    async createGoal(goal) {
      return window.api.post('/api/work/goals', goal);
    },
  },

  // ========== HEALTH ==========
  health: {
    async logEnergy(level, mood, notes) {
      return window.api.post('/api/health/energy', {
        level,
        mood,
        notes,
        timestamp: new Date(),
      });
    },
    async getCurrentEnergy() {
      return window.api.get('/api/health/energy/current');
    },
    async logSleep(data) {
      return window.api.post('/api/health/sleep', data);
    },
    async getLatestSleep() {
      return window.api.get('/api/health/sleep/latest');
    },
    async startFlowSession(type, activity) {
      return window.api.post('/api/health/flow/start', { type, activity });
    },
    async getActiveFlowSession() {
      return window.api.get('/api/health/flow/active');
    },
    async endFlowSession(id, data) {
      return window.api.post(`/api/health/flow/${id}/end`, data);
    },
    async logMeditation(duration, type, quality, notes) {
      return window.api.post('/api/health/meditation', {
        duration_minutes: duration,
        type,
        quality,
        notes,
        timestamp: new Date(),
      });
    },
    async getMeditationStreak() {
      return window.api.get('/api/health/meditation/streak');
    },
  },

  // ========== FINANCE ==========
  finance: {
    async createTransaction(data) {
      return window.api.post('/api/finance/transactions', data);
    },
    async getTransactions(filters = {}) {
      const params = new URLSearchParams(filters).toString();
      return window.api.get(`/api/finance/transactions${params ? '?' + params : ''}`);
    },
    async getBalance() {
      return window.api.get('/api/finance/balance');
    },
    async getBudgets() {
      return window.api.get('/api/finance/budgets');
    },
    async createBudget(budget) {
      return window.api.post('/api/finance/budgets', budget);
    },
    async getGoals() {
      return window.api.get('/api/finance/goals');
    },
    async createGoal(goal) {
      return window.api.post('/api/finance/goals', goal);
    },
  },
};

console.log('✅ API Helper loaded!');
