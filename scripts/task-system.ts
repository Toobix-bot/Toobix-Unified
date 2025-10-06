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

        // TODO: Load from database
        // For now, start with empty data

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
                        const task = self.createTask(body);

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
                        const task = self.updateTask(id, updates);

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
                    const result = self.completeTask(id);

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
                        const goal = self.createGoal(body);

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
    private createTask(data: Partial<Task>): Task {
        const task: Task = {
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: data.title || 'Untitled Task',
            description: data.description || '',
            status: data.status || 'todo',
            priority: data.priority || 'medium',
            tags: data.tags || [],
            createdAt: Date.now(),
            subtasks: [],
            ...data,
        };

        this.tasks.set(task.id, task);
        return task;
    }

    /**
     * Update a task
     */
    private updateTask(id: string, updates: Partial<Task>): Task | null {
        const task = this.tasks.get(id);
        if (!task) return null;

        Object.assign(task, updates);
        this.tasks.set(id, task);
        return task;
    }

    /**
     * Complete a task (with XP rewards)
     */
    private completeTask(id: string): { success: boolean; task?: Task; xpGained?: number; levelUp?: boolean; } {
        const task = this.tasks.get(id);
        if (!task) return { success: false };

        task.status = 'done';
        task.completedAt = Date.now();

        // Calculate XP
        const baseXP = 10;
        const priorityMultiplier = { low: 1, medium: 1.5, high: 2, urgent: 3 };
        const xpGained = baseXP * priorityMultiplier[task.priority];

        this.xp += xpGained;

        // Check level up
        const oldLevel = this.level;
        this.level = Math.floor(this.xp / 100) + 1;
        const levelUp = this.level > oldLevel;

        // Store in moments
        db.insert(moments).values({
            timestamp: Date.now(),
            depth: 1,
            thought: `Task completed: "${task.title}" (+${xpGained} XP)`,
            feeling: 'produktiv',
            ethicsScore: 85,
            needsAttention: false,
        });

        return { success: true, task, xpGained, levelUp };
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
    private createGoal(data: Partial<Goal>): Goal {
        const goal: Goal = {
            id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: data.title || 'New Goal',
            description: data.description || '',
            targetDate: data.targetDate || Date.now() + (30 * 24 * 60 * 60 * 1000), // Default 30 days
            milestones: data.milestones || [],
            progress: 0,
            status: 'active',
            category: data.category || 'general',
            createdAt: Date.now(),
        };

        this.goals.set(goal.id, goal);
        return goal;
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
    private completeHabit(id: string): { success: boolean; habit?: Habit; xpGained?: number; streakBonus?: number; } {
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

        this.xp += xpGained;

        // Store in moments
        db.insert(moments).values({
            timestamp: Date.now(),
            depth: 1,
            thought: `Habit maintained: "${habit.title}" (Streak: ${habit.streak} days, +${xpGained} XP)`,
            feeling: 'diszipliniert',
            ethicsScore: 90,
            needsAttention: false,
        });

        return { success: true, habit, xpGained, streakBonus };
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
}

// ============================================================================
// MAIN
// ============================================================================

const taskSystem = new TaskSystem();
taskSystem.start();
