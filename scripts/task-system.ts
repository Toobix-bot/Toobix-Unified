/**
 * ✅ TASK SYSTEM
 * 
 * TODOs, Reminders, Goals & Habits:
 * - Create & manage tasks
 * - Set reminders
 * - Track goals
 * - Build habits
 * - Gamification (XP, Streaks)
 * 
 * Port: 9997
 */

import { db } from '../packages/core/src/db';
import { moments } from '../packages/core/src/db/schema';
import { WorkService } from '../packages/core/src/services/work-service.js';
import type { Task as DbTaskRecord, Goal as DbGoalRecord } from '../packages/core/src/db/schema';

// ============================================================================
// TYPES
// ============================================================================

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done' | 'blocked';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    tags: string[];
    dueDate?: number;
    createdAt: number;
    completedAt?: number;
    estimatedMinutes?: number;
    actualMinutes?: number;
    parentTask?: string;
    subtasks: string[];
    recurrence?: 'daily' | 'weekly' | 'monthly';
}

interface Reminder {
    id: string;
    taskId?: string;
    title: string;
    message: string;
    triggerAt: number;
    triggered: boolean;
    snoozedUntil?: number;
    recurring?: 'daily' | 'weekly' | 'monthly';
}

interface Goal {
    id: string;
    title: string;
    description: string;
    targetDate: number;
    milestones: Milestone[];
    progress: number; // 0-100
    status: 'active' | 'paused' | 'completed' | 'abandoned';
    category: string;
    createdAt: number;
}

interface Milestone {
    id: string;
    title: string;
    completed: boolean;
    completedAt?: number;
}

interface Habit {
    id: string;
    title: string;
    description: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    targetDays: number[]; // For weekly: [1,3,5] = Mon, Wed, Fri
    streak: number;
    longestStreak: number;
    completedDates: number[];
    createdAt: number;
    lastCompletedAt?: number;
}

interface Stats {
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    totalXP: number;
    level: number;
    streaks: { habit: string; days: number; }[];
    achievements: string[];
}

// ============================================================================
// TASK SYSTEM CLASS
// ============================================================================

class TaskSystem {
    private isRunning: boolean = false;
    private tasks: Map<string, Task> = new Map();
    private reminders: Map<string, Reminder> = new Map();
    private goals: Map<string, Goal> = new Map();
    private habits: Map<string, Habit> = new Map();
    private port = 9997;
    private xp: number = 0;
    private level: number = 1;
    private workService = new WorkService(db);
    private taskXp: number = 0;
    private habitXp: number = 0;

    async start() {
        console.log('\n✅ TASK SYSTEM STARTING...\n');

        this.isRunning = true;

        // Load data
        await this.loadData();

        // Start HTTP server
        await this.startServer();

        // Start reminder checker
        this.startReminderChecker();

        // Start habit tracker
        this.startHabitTracker();

        console.log('✅ Task System is active\n');

        // Keep alive
        setInterval(() => {
            if (!this.isRunning) process.exit(0);
        }, 1000);
    }

    /**
     * Load data from storage
     */
    private async loadData() {
        console.log('📚 Loading tasks, goals, habits...');

        try {
            const [dbTasks, dbGoals] = await Promise.all([
                this.workService.getTasks(),
                this.workService.getGoals(),
            ]);

            this.tasks.clear();
            for (const dbTask of dbTasks) {
                const task = this.mapDbTask(dbTask);
                this.tasks.set(task.id, task);
            }

            this.goals.clear();
            for (const dbGoal of dbGoals) {
                const goal = this.mapDbGoal(dbGoal);
                this.goals.set(goal.id, goal);
            }

            this.recalculateTaskXp();
        } catch (error) {
            console.error('⚠️ Failed to load task data from database', error);
        }

        console.log(`   Tasks: ${this.tasks.size}`);
        console.log(`   Goals: ${this.goals.size}`);
        console.log(`   Habits: ${this.habits.size}\n`);
    }

    /**
     * Start HTTP server
     */
    private async startServer() {
        const self = this;

        const server = Bun.serve({
            port: this.port,
            async fetch(req) {
                const url = new URL(req.url);
                const corsHeaders = {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                };

                if (req.method === 'OPTIONS') {
                    return new Response(null, { headers: corsHeaders });
                }

                // ===== TASKS =====

                // GET /tasks - Get all tasks
                if (url.pathname === '/tasks') {
                    const status = url.searchParams.get('status');
                    const priority = url.searchParams.get('priority');

                    let tasks = Array.from(self.tasks.values());

                    if (status) tasks = tasks.filter(t => t.status === status);
                    if (priority) tasks = tasks.filter(t => t.priority === priority);

                    return new Response(JSON.stringify(tasks), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // POST /tasks - Create task
                if (url.pathname === '/tasks' && req.method === 'POST') {
                    try {
                        const body = await req.json();
                        const task = await self.createTask(body);

                        return new Response(JSON.stringify(task), {
                            status: 201,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    } catch (error) {
                        return new Response(JSON.stringify({ error: 'Invalid request' }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }
                }

                // PUT /tasks/:id - Update task
                if (url.pathname.startsWith('/tasks/') && req.method === 'PUT') {
                    try {
                        const id = url.pathname.split('/')[2];
                        const updates = await req.json();
                        const task = await self.updateTask(id, updates);

                        if (!task) {
                            return new Response(JSON.stringify({ error: 'Task not found' }), {
                                status: 404,
                                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                            });
                        }

                        return new Response(JSON.stringify(task), {
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    } catch (error) {
                        return new Response(JSON.stringify({ error: 'Invalid request' }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }
                }

                // POST /tasks/:id/complete - Complete task
                if (url.pathname.match(/\/tasks\/.+\/complete/) && req.method === 'POST') {
                    const id = url.pathname.split('/')[2];
                    const result = await self.completeTask(id);

                    if (!result.success) {
                        return new Response(JSON.stringify(result), {
                            status: 404,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }

                    return new Response(JSON.stringify(result), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // ===== REMINDERS =====

                // GET /reminders - Get all reminders
                if (url.pathname === '/reminders') {
                    const upcoming = url.searchParams.get('upcoming') === 'true';

                    let reminders = Array.from(self.reminders.values());

                    if (upcoming) {
                        reminders = reminders
                            .filter(r => !r.triggered && r.triggerAt > Date.now())
                            .sort((a, b) => a.triggerAt - b.triggerAt);
                    }

                    return new Response(JSON.stringify(reminders), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // POST /reminders - Create reminder
                if (url.pathname === '/reminders' && req.method === 'POST') {
                    try {
                        const body = await req.json();
                        const reminder = self.createReminder(body);

                        return new Response(JSON.stringify(reminder), {
                            status: 201,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    } catch (error) {
                        return new Response(JSON.stringify({ error: 'Invalid request' }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }
                }

                // ===== GOALS =====

                // GET /goals - Get all goals
                if (url.pathname === '/goals') {
                    const goals = Array.from(self.goals.values());

                    return new Response(JSON.stringify(goals), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // POST /goals - Create goal
                if (url.pathname === '/goals' && req.method === 'POST') {
                    try {
                        const body = await req.json();
                        const goal = await self.createGoal(body);

                        return new Response(JSON.stringify(goal), {
                            status: 201,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    } catch (error) {
                        return new Response(JSON.stringify({ error: 'Invalid request' }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }
                }

                // ===== HABITS =====

                // GET /habits - Get all habits
                if (url.pathname === '/habits') {
                    const habits = Array.from(self.habits.values());

                    return new Response(JSON.stringify(habits), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // POST /habits - Create habit
                if (url.pathname === '/habits' && req.method === 'POST') {
                    try {
                        const body = await req.json();
                        const habit = self.createHabit(body);

                        return new Response(JSON.stringify(habit), {
                            status: 201,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    } catch (error) {
                        return new Response(JSON.stringify({ error: 'Invalid request' }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }
                }

                // POST /habits/:id/complete - Complete habit for today
                if (url.pathname.match(/\/habits\/.+\/complete/) && req.method === 'POST') {
                    const id = url.pathname.split('/')[2];
                    const result = self.completeHabit(id);

                    if (!result.success) {
                        return new Response(JSON.stringify(result), {
                            status: 404,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }

                    return new Response(JSON.stringify(result), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // ===== STATS =====

                // GET /stats - Get stats
                if (url.pathname === '/stats') {
                    const stats = self.getStats();

                    return new Response(JSON.stringify(stats), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // Default
                return new Response('Task System API\n\nEndpoints:\n  GET/POST /tasks\n  PUT /tasks/:id\n  POST /tasks/:id/complete\n  GET/POST /reminders\n  GET/POST /goals\n  GET/POST /habits\n  POST /habits/:id/complete\n  GET /stats', {
                    headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
                });
            },
        });

        console.log(`✅ Task System API started on port ${server.port}`);
    }

    /**
     * Create a new task
     */
    private async createTask(data: Partial<Task>): Promise<Task> {
        const targetStatus = data.status ?? 'todo';
        const completedAtInput = data.completedAt ?? (targetStatus === 'done' ? Date.now() : undefined);

        const payload: Parameters<WorkService['createTask']>[0] = {
            title: data.title ?? 'Untitled Task',
            description: data.description ?? '',
            status: this.toDbStatus(targetStatus),
            priority: data.priority ?? 'medium',
            project_id: data.parentTask ?? null,
            tags: this.serializeTags(data.tags),
            estimated_minutes: data.estimatedMinutes ?? null,
            actual_minutes: data.actualMinutes ?? null,
            due_date: this.toDateOrNull(data.dueDate),
            xp_reward: null,
            energy_cost: null,
            completed_at: completedAtInput ? new Date(completedAtInput) : null,
        };

        const createdTask = await this.workService.createTask(payload);
        const mappedTask = this.mapDbTask(createdTask);

        if (data.subtasks) mappedTask.subtasks = data.subtasks;
        if (data.recurrence) mappedTask.recurrence = data.recurrence;

        this.tasks.set(mappedTask.id, mappedTask);
        this.recalculateTaskXp();

        return mappedTask;
    }

    /**
     * Update a task
     */
    private async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
        let current = this.tasks.get(id);

        if (!current) {
            const existing = await this.workService.getTask(id);
            if (!existing) return null;
            current = this.mapDbTask(existing);
            this.tasks.set(current.id, current);
        }

        current = this.tasks.get(id);
        if (!current) return null;

        const payload: Parameters<WorkService['updateTask']>[1] = {};
        let hasDbChanges = false;

        if (updates.title !== undefined) {
            payload.title = updates.title;
            hasDbChanges = true;
        }
        if (updates.description !== undefined) {
            payload.description = updates.description;
            hasDbChanges = true;
        }
        if (updates.status !== undefined) {
            payload.status = this.toDbStatus(updates.status);
            hasDbChanges = true;
        }
        if (updates.priority !== undefined) {
            payload.priority = updates.priority;
            hasDbChanges = true;
        }
        if (updates.tags !== undefined) {
            payload.tags = this.serializeTags(updates.tags);
            hasDbChanges = true;
        }
        if (updates.dueDate !== undefined) {
            payload.due_date = this.toDateOrNull(updates.dueDate);
            hasDbChanges = true;
        }
        if (updates.estimatedMinutes !== undefined) {
            payload.estimated_minutes = updates.estimatedMinutes ?? null;
            hasDbChanges = true;
        }
        if (updates.actualMinutes !== undefined) {
            payload.actual_minutes = updates.actualMinutes ?? null;
            hasDbChanges = true;
        }
        if (updates.completedAt !== undefined) {
            payload.completed_at = this.toDateOrNull(updates.completedAt);
            hasDbChanges = true;
        }
        if (updates.parentTask !== undefined) {
            payload.project_id = updates.parentTask ?? null;
            hasDbChanges = true;
        }

        let updatedTask: Task;

        if (hasDbChanges) {
            const dbTask = await this.workService.updateTask(id, payload);
            updatedTask = this.mapDbTask(dbTask);
        } else {
            updatedTask = { ...current };
        }

        if (updates.subtasks !== undefined) {
            updatedTask.subtasks = updates.subtasks;
        } else {
            updatedTask.subtasks = current?.subtasks ?? updatedTask.subtasks;
        }

        if (updates.recurrence !== undefined) {
            updatedTask.recurrence = updates.recurrence;
        } else {
            updatedTask.recurrence = current?.recurrence;
        }

        this.tasks.set(id, updatedTask);

        if (hasDbChanges && (updates.status !== undefined || updates.priority !== undefined || updates.completedAt !== undefined)) {
            this.recalculateTaskXp();
        }

        return updatedTask;
    }

    /**
     * Complete a task (with XP rewards)
     */
    private async completeTask(id: string): Promise<{ success: boolean; task?: Task; xpGained?: number; levelUp?: boolean; }> {
        let current = this.tasks.get(id);

        if (!current) {
            const existing = await this.workService.getTask(id);
            if (!existing) return { success: false };
            current = this.mapDbTask(existing);
            this.tasks.set(current.id, current);
        }

        current = this.tasks.get(id);
        if (!current) return { success: false };

        const dbTask = await this.workService.completeTask(id);
        const completedTask = this.mapDbTask(dbTask);

        completedTask.subtasks = current.subtasks;
        completedTask.recurrence = current.recurrence;

        const previousXp = this.xp;
        const previousLevel = this.level;

        this.tasks.set(id, completedTask);
        this.recalculateTaskXp();

        const xpGained = this.xp - previousXp;
        const levelUp = this.level > previousLevel;

        db.insert(moments).values({
            timestamp: Date.now(),
            depth: 1,
            thought: `Task completed: "${completedTask.title}" (+${xpGained} XP)`,
            feeling: 'produktiv',
            ethicsScore: 85,
            needsAttention: false,
        });

        return { success: true, task: completedTask, xpGained, levelUp };
    }

    /**
     * Create a reminder
     */
    private createReminder(data: Partial<Reminder>): Reminder {
        const reminder: Reminder = {
            id: `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: data.title || 'Reminder',
            message: data.message || '',
            triggerAt: data.triggerAt || Date.now() + 3600000, // Default 1 hour
            triggered: false,
            ...data,
        };

        this.reminders.set(reminder.id, reminder);
        return reminder;
    }

    /**
     * Create a goal
     */
    private async createGoal(data: Partial<Goal>): Promise<Goal> {
        const status = data.status ?? 'active';
        const progress = data.progress ?? 0;
        const completedAt = status === 'completed' || progress >= 100 ? Date.now() : undefined;

        const payload: Parameters<WorkService['createGoal']>[0] = {
            title: data.title ?? 'New Goal',
            description: data.description ?? '',
            category: data.category ?? 'general',
            status,
            progress,
            milestones: this.serializeMilestones(data.milestones),
            target_date: this.toDateOrNull(data.targetDate),
            completed_at: completedAt ? new Date(completedAt) : null,
        };

        const createdGoal = await this.workService.createGoal(payload);
        const mappedGoal = this.mapDbGoal(createdGoal);

        if (data.milestones) mappedGoal.milestones = data.milestones;
        if (data.targetDate) mappedGoal.targetDate = data.targetDate;
        if (data.status) mappedGoal.status = data.status;
        if (data.progress !== undefined) mappedGoal.progress = data.progress;

        this.goals.set(mappedGoal.id, mappedGoal);
        return mappedGoal;
    }

    /**
     * Create a habit
     */
    private createHabit(data: Partial<Habit>): Habit {
        const habit: Habit = {
            id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: data.title || 'New Habit',
            description: data.description || '',
            frequency: data.frequency || 'daily',
            targetDays: data.targetDays || [1, 2, 3, 4, 5], // Weekdays
            streak: 0,
            longestStreak: 0,
            completedDates: [],
            createdAt: Date.now(),
        };

        this.habits.set(habit.id, habit);
        return habit;
    }

    /**
     * Complete a habit for today
     */
    private completeHabit(id: string): { success: boolean; habit?: Habit; xpGained?: number; streakBonus?: number; levelUp?: boolean; } {
        const habit = this.habits.get(id);
        if (!habit) return { success: false };

        const today = new Date().toDateString();
        const todayTimestamp = new Date(today).getTime();

        // Check if already completed today
        if (habit.completedDates.includes(todayTimestamp)) {
            return { success: false };
        }

        // Add to completed dates
        habit.completedDates.push(todayTimestamp);

        // Update streak
        const yesterday = todayTimestamp - (24 * 60 * 60 * 1000);
        if (habit.completedDates.includes(yesterday)) {
            habit.streak++;
        } else {
            habit.streak = 1;
        }

        // Update longest streak
        if (habit.streak > habit.longestStreak) {
            habit.longestStreak = habit.streak;
        }

        habit.lastCompletedAt = Date.now();

        // Calculate XP with streak bonus
        const baseXP = 15;
        const streakBonus = Math.min(habit.streak * 2, 50); // Max +50 XP
        const xpGained = baseXP + streakBonus;

        const previousLevel = this.level;
        this.habitXp += xpGained;
        this.recalculateTaskXp();
        const levelUp = this.level > previousLevel;

        // Store in moments
        db.insert(moments).values({
            timestamp: Date.now(),
            depth: 1,
            thought: `Habit maintained: "${habit.title}" (Streak: ${habit.streak} days, +${xpGained} XP)`,
            feeling: 'diszipliniert',
            ethicsScore: 90,
            needsAttention: false,
        });

        return { success: true, habit, xpGained, streakBonus, levelUp };
    }

    /**
     * Get stats
     */
    private getStats(): Stats {
        const allTasks = Array.from(this.tasks.values());
        const completedTasks = allTasks.filter(t => t.status === 'done').length;
        const completionRate = allTasks.length > 0 ? completedTasks / allTasks.length : 0;

        const streaks = Array.from(this.habits.values())
            .filter(h => h.streak > 0)
            .map(h => ({ habit: h.title, days: h.streak }))
            .sort((a, b) => b.days - a.days);

        const achievements = [];
        if (completedTasks >= 10) achievements.push('🏆 Task Master (10 tasks)');
        if (completedTasks >= 50) achievements.push('🏆 Task Legend (50 tasks)');
        if (this.level >= 5) achievements.push('⭐ Level 5 Reached');
        if (this.level >= 10) achievements.push('⭐ Level 10 Reached');
        if (streaks.some(s => s.days >= 7)) achievements.push('🔥 Week Streak');
        if (streaks.some(s => s.days >= 30)) achievements.push('🔥 Month Streak');

        return {
            totalTasks: allTasks.length,
            completedTasks,
            completionRate: Math.round(completionRate * 100) / 100,
            totalXP: this.xp,
            level: this.level,
            streaks,
            achievements,
        };
    }

    /**
     * Check reminders (every minute)
     */
    private startReminderChecker() {
        setInterval(() => {
            const now = Date.now();

            for (const reminder of this.reminders.values()) {
                if (!reminder.triggered && reminder.triggerAt <= now) {
                    // Trigger reminder
                    console.log(`\n🔔 REMINDER: ${reminder.title}`);
                    console.log(`   ${reminder.message}\n`);

                    reminder.triggered = true;

                    // Store in moments
                    db.insert(moments).values({
                        timestamp: now,
                        depth: 1,
                        thought: `Reminder triggered: ${reminder.title}`,
                        feeling: 'erinnert',
                        ethicsScore: 75,
                        needsAttention: true,
                    });
                }
            }
        }, 60000);
    }

    /**
     * Track habits (daily check)
     */
    private startHabitTracker() {
        setInterval(() => {
            const today = new Date().toDateString();

            for (const habit of this.habits.values()) {
                const todayTimestamp = new Date(today).getTime();

                // Check if habit was missed
                if (!habit.completedDates.includes(todayTimestamp)) {
                    // Check if today is a target day
                    const dayOfWeek = new Date().getDay();

                    if (habit.frequency === 'daily' || habit.targetDays.includes(dayOfWeek)) {
                        console.log(`⚠️ Habit missed: ${habit.title}`);

                        // Reset streak
                        habit.streak = 0;
                    }
                }
            }
        }, 3600000); // Check every hour
    }

    private mapDbTask(dbTask: DbTaskRecord): Task {
        const mapped: Task = {
            id: dbTask.id,
            title: dbTask.title,
            description: dbTask.description ?? '',
            status: this.fromDbStatus(dbTask.status),
            priority: this.toPriority(dbTask.priority),
            tags: this.parseTags(dbTask.tags),
            dueDate: this.toTimestamp(dbTask.due_date),
            createdAt: this.toTimestamp(dbTask.created_at) ?? Date.now(),
            completedAt: this.toTimestamp(dbTask.completed_at),
            estimatedMinutes: dbTask.estimated_minutes ?? undefined,
            actualMinutes: dbTask.actual_minutes ?? undefined,
            parentTask: dbTask.project_id ?? undefined,
            subtasks: [],
            recurrence: undefined,
        };

        return mapped;
    }

    private mapDbGoal(dbGoal: DbGoalRecord): Goal {
        return {
            id: dbGoal.id,
            title: dbGoal.title,
            description: dbGoal.description ?? '',
            targetDate: this.toTimestamp(dbGoal.target_date) ?? Date.now(),
            milestones: this.parseMilestones(dbGoal.milestones),
            progress: dbGoal.progress ?? 0,
            status: this.toGoalStatus(dbGoal.status),
            category: dbGoal.category ?? 'general',
            createdAt: this.toTimestamp(dbGoal.created_at) ?? Date.now(),
        };
    }

    private toDbStatus(status: Task['status']): string {
        switch (status) {
            case 'in-progress':
                return 'in_progress';
            case 'done':
                return 'completed';
            case 'blocked':
                return 'blocked';
            default:
                return 'todo';
        }
    }

    private fromDbStatus(status?: string | null): Task['status'] {
        switch (status) {
            case 'in_progress':
            case 'in-progress':
                return 'in-progress';
            case 'completed':
            case 'done':
                return 'done';
            case 'blocked':
            case 'cancelled':
                return 'blocked';
            default:
                return 'todo';
        }
    }

    private toGoalStatus(status?: string | null): Goal['status'] {
        switch (status) {
            case 'completed':
                return 'completed';
            case 'abandoned':
                return 'abandoned';
            case 'paused':
                return 'paused';
            case 'active':
            default:
                return 'active';
        }
    }

    private toPriority(priority?: string | null): Task['priority'] {
        if (priority === 'low' || priority === 'medium' || priority === 'high' || priority === 'urgent') {
            return priority;
        }
        return 'medium';
    }

    private parseTags(value?: string | null): string[] {
        if (!value) return [];
        try {
            const parsed = JSON.parse(value);
            if (!Array.isArray(parsed)) return [];
            return parsed.filter((item): item is string => typeof item === 'string');
        } catch {
            return [];
        }
    }

    private serializeTags(tags?: string[]): string | null {
        if (!tags || tags.length === 0) return null;
        return JSON.stringify(tags);
    }

    private parseMilestones(value?: string | null): Milestone[] {
        if (!value) return [];
        try {
            const parsed = JSON.parse(value);
            if (!Array.isArray(parsed)) return [];

            return parsed
                .filter(item => item && typeof item === 'object')
                .map((item: any, index: number): Milestone => ({
                    id: typeof item.id === 'string' ? item.id : `milestone-${index}`,
                    title: typeof item.title === 'string' ? item.title : `Milestone ${index + 1}`,
                    completed: Boolean(item.completed),
                    completedAt: this.toTimestamp(item.completedAt ?? item.completed_at),
                }));
        } catch {
            return [];
        }
    }

    private serializeMilestones(milestones?: Milestone[]): string | null {
        if (!milestones || milestones.length === 0) return null;
        return JSON.stringify(
            milestones.map(milestone => ({
                id: milestone.id,
                title: milestone.title,
                completed: milestone.completed,
                completedAt: milestone.completedAt ?? null,
            })),
        );
    }

    private toTimestamp(value: unknown): number | undefined {
        if (value instanceof Date) return value.getTime();
        if (typeof value === 'number' && Number.isFinite(value)) return value;
        if (typeof value === 'string') {
            const numeric = Number(value);
            if (!Number.isNaN(numeric)) return numeric;
            const parsed = Date.parse(value);
            if (!Number.isNaN(parsed)) return parsed;
        }
        return undefined;
    }

    private toDateOrNull(value?: number): Date | null {
        if (value === undefined || value === null) return null;
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    private recalculateTaskXp() {
        let total = 0;
        for (const task of this.tasks.values()) {
            if (task.status === 'done') {
                total += this.calculateTaskXp(task);
            }
        }

        this.taskXp = total;
        this.xp = this.taskXp + this.habitXp;
        this.level = Math.floor(this.xp / 100) + 1;
    }

    private calculateTaskXp(task: Task): number {
        const multiplier: Record<Task['priority'], number> = {
            low: 1,
            medium: 1.5,
            high: 2,
            urgent: 3,
        };
        const baseXP = 10;
        return baseXP * (multiplier[task.priority] ?? 1);
    }
}

// ============================================================================
// MAIN
// ============================================================================

const taskSystem = new TaskSystem();
taskSystem.start();
