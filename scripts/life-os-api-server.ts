#!/usr/bin/env bun
/**
 * Life OS API Server
 * Unified API for Desktop App - Work, Health, Finance Modules
 */

import { createDatabase } from '../packages/core/src/db/index.js';
import { WorkService } from '../packages/core/src/services/work-service.js';
import { HealthService } from '../packages/core/src/services/health-service.js';
import { FinanceService } from '../packages/core/src/services/finance-service.js';

const PORT = 3002;
const db = createDatabase();

// Initialize services
const workService = new WorkService(db);
const healthService = new HealthService(db);
const financeService = new FinanceService(db);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

/**
 * Handle CORS preflight
 */
function handleOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

/**
 * Success response
 */
function success(data: any) {
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: corsHeaders,
  });
}

/**
 * Error response
 */
function error(message: string, status = 400) {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: corsHeaders,
  });
}

/**
 * Main HTTP server
 */
const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    console.log(`${method} ${path}`);

    // CORS preflight
    if (method === 'OPTIONS') {
      return handleOptions();
    }

    try {
      // ========== HEALTH CHECK ==========
      if (path === '/health') {
        return success({ status: 'ok', timestamp: Date.now() });
      }

      // ========== STATS ==========
      if (path === '/stats') {
        const [workStats, healthStats, financeStats] = await Promise.all([
          workService.getStats(),
          healthService.getStats(),
          financeService.getStats(),
        ]);

        return success({
          work: workStats,
          health: healthStats,
          finance: financeStats,
        });
      }

      // ========== WORK MODULE ==========

      // Tasks
      if (path === '/api/work/tasks' && method === 'GET') {
        const status = url.searchParams.get('status') || undefined;
        const priority = url.searchParams.get('priority') || undefined;
        const project_id = url.searchParams.get('project_id') || undefined;
        const tasks = await workService.getTasks({ status, priority, project_id });
        return success(tasks);
      }

      if (path === '/api/work/tasks' && method === 'POST') {
        const body = await req.json();
        const task = await workService.createTask(body);
        return success(task);
      }

      if (path.startsWith('/api/work/tasks/') && method === 'GET') {
        const id = path.split('/').pop()!;
        const task = await workService.getTask(id);
        if (!task) return error('Task not found', 404);
        return success(task);
      }

      if (path.startsWith('/api/work/tasks/') && path.endsWith('/complete') && method === 'POST') {
        const id = path.split('/')[4];
        const task = await workService.completeTask(id);
        return success(task);
      }

      if (path.startsWith('/api/work/tasks/') && method === 'PUT') {
        const id = path.split('/').pop()!;
        const body = await req.json();
        const task = await workService.updateTask(id, body);
        return success(task);
      }

      if (path.startsWith('/api/work/tasks/') && method === 'DELETE') {
        const id = path.split('/').pop()!;
        await workService.deleteTask(id);
        return success({ deleted: true });
      }

      if (path === '/api/work/tasks/today' && method === 'GET') {
        const tasks = await workService.getTodayTasks();
        return success(tasks);
      }

      // Projects
      if (path === '/api/work/projects' && method === 'GET') {
        const status = url.searchParams.get('status') || undefined;
        const projects = await workService.getProjects({ status });
        return success(projects);
      }

      if (path === '/api/work/projects' && method === 'POST') {
        const body = await req.json();
        const project = await workService.createProject(body);
        return success(project);
      }

      if (path.startsWith('/api/work/projects/') && method === 'GET') {
        const id = path.split('/').pop()!;
        const project = await workService.getProjectWithTasks(id);
        if (!project) return error('Project not found', 404);
        return success(project);
      }

      if (path.startsWith('/api/work/projects/') && method === 'PUT') {
        const id = path.split('/').pop()!;
        const body = await req.json();
        const project = await workService.updateProject(id, body);
        return success(project);
      }

      if (path.startsWith('/api/work/projects/') && method === 'DELETE') {
        const id = path.split('/').pop()!;
        await workService.deleteProject(id);
        return success({ deleted: true });
      }

      // Goals
      if (path === '/api/work/goals' && method === 'GET') {
        const category = url.searchParams.get('category') || undefined;
        const status = url.searchParams.get('status') || undefined;
        const goals = await workService.getGoals({ category, status });
        return success(goals);
      }

      if (path === '/api/work/goals' && method === 'POST') {
        const body = await req.json();
        const goal = await workService.createGoal(body);
        return success(goal);
      }

      if (path.startsWith('/api/work/goals/') && path.endsWith('/progress') && method === 'PUT') {
        const id = path.split('/')[4];
        const body = await req.json();
        const goal = await workService.updateGoalProgress(id, body.progress);
        return success(goal);
      }

      if (path.startsWith('/api/work/goals/') && method === 'PUT') {
        const id = path.split('/').pop()!;
        const body = await req.json();
        const goal = await workService.updateGoal(id, body);
        return success(goal);
      }

      if (path.startsWith('/api/work/goals/') && method === 'DELETE') {
        const id = path.split('/').pop()!;
        await workService.deleteGoal(id);
        return success({ deleted: true });
      }

      // ========== HEALTH MODULE ==========

      // Energy
      if (path === '/api/health/energy' && method === 'POST') {
        const body = await req.json();
        const log = await healthService.logEnergy(body);
        return success(log);
      }

      if (path === '/api/health/energy' && method === 'GET') {
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;
        const logs = await healthService.getEnergyLogs({ limit });
        return success(logs);
      }

      if (path === '/api/health/energy/current' && method === 'GET') {
        const current = await healthService.getCurrentEnergy();
        return success(current);
      }

      // Sleep
      if (path === '/api/health/sleep' && method === 'POST') {
        const body = await req.json();
        const log = await healthService.logSleep(body);
        return success(log);
      }

      if (path === '/api/health/sleep' && method === 'GET') {
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;
        const logs = await healthService.getSleepLogs({ limit });
        return success(logs);
      }

      if (path === '/api/health/sleep/latest' && method === 'GET') {
        const latest = await healthService.getLatestSleep();
        return success(latest);
      }

      if (path === '/api/health/sleep/average' && method === 'GET') {
        const days = url.searchParams.get('days') ? parseInt(url.searchParams.get('days')!) : 7;
        const avg = await healthService.getAverageSleep(days);
        return success({ average: avg });
      }

      // Flow Sessions
      if (path === '/api/health/flow/start' && method === 'POST') {
        const body = await req.json();
        const session = await healthService.startFlowSession(body);
        return success(session);
      }

      if (path === '/api/health/flow/active' && method === 'GET') {
        const session = await healthService.getActiveFlowSession();
        return success(session);
      }

      if (path.startsWith('/api/health/flow/') && path.endsWith('/end') && method === 'POST') {
        const id = path.split('/')[4];
        const body = await req.json();
        const session = await healthService.endFlowSession(id, body);
        return success(session);
      }

      if (path === '/api/health/flow' && method === 'GET') {
        const type = url.searchParams.get('type') || undefined;
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;
        const sessions = await healthService.getFlowSessions({ type, limit });
        return success(sessions);
      }

      // Meditation
      if (path === '/api/health/meditation' && method === 'POST') {
        const body = await req.json();
        const session = await healthService.logMeditation(body);
        return success(session);
      }

      if (path === '/api/health/meditation' && method === 'GET') {
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;
        const sessions = await healthService.getMeditationSessions({ limit });
        return success(sessions);
      }

      if (path === '/api/health/meditation/streak' && method === 'GET') {
        const streak = await healthService.getMeditationStreak();
        return success({ streak });
      }

      // ========== FINANCE MODULE ==========

      // Transactions
      if (path === '/api/finance/transactions' && method === 'POST') {
        const body = await req.json();
        const transaction = await financeService.createTransaction(body);
        return success(transaction);
      }

      if (path === '/api/finance/transactions' && method === 'GET') {
        const type = url.searchParams.get('type') || undefined;
        const category = url.searchParams.get('category') || undefined;
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;
        const transactions = await financeService.getTransactions({ type, category, limit });
        return success(transactions);
      }

      if (path.startsWith('/api/finance/transactions/') && method === 'PUT') {
        const id = path.split('/').pop()!;
        const body = await req.json();
        const transaction = await financeService.updateTransaction(id, body);
        return success(transaction);
      }

      if (path.startsWith('/api/finance/transactions/') && method === 'DELETE') {
        const id = path.split('/').pop()!;
        await financeService.deleteTransaction(id);
        return success({ deleted: true });
      }

      if (path === '/api/finance/balance' && method === 'GET') {
        const balance = await financeService.getBalance();
        return success({ balance });
      }

      if (path === '/api/finance/income' && method === 'GET') {
        const income = await financeService.getTotalIncome();
        return success({ income });
      }

      if (path === '/api/finance/expenses' && method === 'GET') {
        const expenses = await financeService.getTotalExpenses();
        return success({ expenses });
      }

      if (path === '/api/finance/expenses/by-category' && method === 'GET') {
        const byCategory = await financeService.getExpensesByCategory();
        return success(byCategory);
      }

      // Budgets
      if (path === '/api/finance/budgets' && method === 'POST') {
        const body = await req.json();
        const budget = await financeService.createBudget(body);
        return success(budget);
      }

      if (path === '/api/finance/budgets' && method === 'GET') {
        const budgets = await financeService.getBudgets();
        return success(budgets);
      }

      if (path.startsWith('/api/finance/budgets/') && method === 'PUT') {
        const id = path.split('/').pop()!;
        const body = await req.json();
        const budget = await financeService.updateBudget(id, body);
        return success(budget);
      }

      if (path.startsWith('/api/finance/budgets/') && method === 'DELETE') {
        const id = path.split('/').pop()!;
        await financeService.deleteBudget(id);
        return success({ deleted: true });
      }

      // Financial Goals
      if (path === '/api/finance/goals' && method === 'POST') {
        const body = await req.json();
        const goal = await financeService.createFinancialGoal(body);
        return success(goal);
      }

      if (path === '/api/finance/goals' && method === 'GET') {
        const type = url.searchParams.get('type') || undefined;
        const status = url.searchParams.get('status') || undefined;
        const goals = await financeService.getFinancialGoals({ type, status });
        return success(goals);
      }

      if (path.startsWith('/api/finance/goals/') && path.endsWith('/progress') && method === 'PUT') {
        const id = path.split('/')[4];
        const body = await req.json();
        const goal = await financeService.updateGoalProgress(id, body.currentAmount);
        return success(goal);
      }

      if (path.startsWith('/api/finance/goals/') && method === 'PUT') {
        const id = path.split('/').pop()!;
        const body = await req.json();
        const goal = await financeService.updateFinancialGoal(id, body);
        return success(goal);
      }

      if (path.startsWith('/api/finance/goals/') && method === 'DELETE') {
        const id = path.split('/').pop()!;
        await financeService.deleteFinancialGoal(id);
        return success({ deleted: true });
      }

      // 404
      return error('Endpoint not found', 404);
    } catch (err: any) {
      console.error('Error:', err);
      return error(err.message || 'Internal server error', 500);
    }
  },
});

console.log(`
🚀 Life OS API Server running!

📊 Endpoints:
  - GET  /health               Health check
  - GET  /stats                All stats (work, health, finance)

  💼 Work Module:
  - GET  /api/work/tasks        Get all tasks
  - POST /api/work/tasks        Create task
  - GET  /api/work/tasks/today  Today's tasks
  - GET  /api/work/projects     Get all projects
  - POST /api/work/projects     Create project
  - GET  /api/work/goals        Get all goals
  - POST /api/work/goals        Create goal

  💪 Health Module:
  - POST /api/health/energy     Log energy
  - GET  /api/health/energy/current  Current energy
  - POST /api/health/sleep      Log sleep
  - GET  /api/health/sleep/latest    Latest sleep
  - POST /api/health/flow/start      Start flow session
  - GET  /api/health/flow/active     Active session
  - POST /api/health/meditation      Log meditation

  💰 Finance Module:
  - POST /api/finance/transactions   Create transaction
  - GET  /api/finance/transactions   Get transactions
  - GET  /api/finance/balance        Current balance
  - POST /api/finance/budgets        Create budget
  - GET  /api/finance/budgets        Get budgets
  - POST /api/finance/goals          Create financial goal
  - GET  /api/finance/goals          Get financial goals

🌐 Server: http://localhost:${PORT}
`);
