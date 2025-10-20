import { eq, and, desc, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { Database } from '../db/index.js';
import { tasks, projects, goals } from '../db/schema.js';
import type { NewTask, Task, NewProject, Project, NewGoal, Goal } from '../db/schema.js';

/**
 * Work Service - Tasks, Projects, Goals Management
 */
export class WorkService {
  constructor(private db: Database) {}

  // ========== TASKS ==========

  /**
   * Create a new task
   */
  async createTask(data: Omit<NewTask, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const task: NewTask = {
      id: nanoid(),
      ...data,
    };

    await this.db.insert(tasks).values(task);

    // Update project task count if task has project
    if (data.project_id) {
      await this.updateProjectTaskCount(data.project_id);
    }

    return (await this.db.select().from(tasks).where(eq(tasks.id, task.id)))[0];
  }

  /**
   * Get all tasks
   */
  async getTasks(filters?: {
    status?: string;
    priority?: string;
    project_id?: string;
  }): Promise<Task[]> {
    let query = this.db.select().from(tasks);

    const conditions = [];
    if (filters?.status) conditions.push(eq(tasks.status, filters.status));
    if (filters?.priority) conditions.push(eq(tasks.priority, filters.priority));
    if (filters?.project_id) conditions.push(eq(tasks.project_id, filters.project_id));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const result = await query.orderBy(desc(tasks.created_at));
    return result;
  }

  /**
   * Get task by ID
   */
  async getTask(id: string): Promise<Task | null> {
    const result = await this.db.select().from(tasks).where(eq(tasks.id, id));
    return result[0] || null;
  }

  /**
   * Update task
   */
  async updateTask(id: string, data: Partial<NewTask>): Promise<Task> {
    await this.db
      .update(tasks)
      .set({ ...data, updated_at: new Date() })
      .where(eq(tasks.id, id));

    return (await this.db.select().from(tasks).where(eq(tasks.id, id)))[0];
  }

  /**
   * Complete task
   */
  async completeTask(id: string): Promise<Task> {
    const task = await this.getTask(id);
    if (!task) throw new Error('Task not found');

    await this.db
      .update(tasks)
      .set({
        status: 'completed',
        completed_at: new Date(),
        updated_at: new Date(),
      })
      .where(eq(tasks.id, id));

    // Update project completed count
    if (task.project_id) {
      await this.updateProjectTaskCount(task.project_id);
    }

    return (await this.db.select().from(tasks).where(eq(tasks.id, id)))[0];
  }

  /**
   * Delete task
   */
  async deleteTask(id: string): Promise<void> {
    const task = await this.getTask(id);
    await this.db.delete(tasks).where(eq(tasks.id, id));

    // Update project task count
    if (task?.project_id) {
      await this.updateProjectTaskCount(task.project_id);
    }
  }

  /**
   * Get today's tasks
   */
  async getTodayTasks(): Promise<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.status, 'todo'),
          sql`${tasks.due_date} >= ${today.getTime()} AND ${tasks.due_date} < ${tomorrow.getTime()}`
        )
      );

    return result;
  }

  // ========== PROJECTS ==========

  /**
   * Create a new project
   */
  async createProject(data: Omit<NewProject, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const project: NewProject = {
      id: nanoid(),
      ...data,
    };

    await this.db.insert(projects).values(project);
    return (await this.db.select().from(projects).where(eq(projects.id, project.id)))[0];
  }

  /**
   * Get all projects
   */
  async getProjects(filters?: { status?: string }): Promise<Project[]> {
    let query = this.db.select().from(projects);

    if (filters?.status) {
      query = query.where(eq(projects.status, filters.status)) as any;
    }

    const result = await query.orderBy(desc(projects.created_at));
    return result;
  }

  /**
   * Get project by ID
   */
  async getProject(id: string): Promise<Project | null> {
    const result = await this.db.select().from(projects).where(eq(projects.id, id));
    return result[0] || null;
  }

  /**
   * Update project
   */
  async updateProject(id: string, data: Partial<NewProject>): Promise<Project> {
    await this.db
      .update(projects)
      .set({ ...data, updated_at: new Date() })
      .where(eq(projects.id, id));

    return (await this.db.select().from(projects).where(eq(projects.id, id)))[0];
  }

  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<void> {
    // Delete all tasks in project
    await this.db.delete(tasks).where(eq(tasks.project_id, id));
    // Delete project
    await this.db.delete(projects).where(eq(projects.id, id));
  }

  /**
   * Update project task count and progress
   */
  private async updateProjectTaskCount(projectId: string): Promise<void> {
    const projectTasks = await this.getTasks({ project_id: projectId });
    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    await this.db
      .update(projects)
      .set({
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        progress,
        updated_at: new Date(),
      })
      .where(eq(projects.id, projectId));
  }

  /**
   * Get project with tasks
   */
  async getProjectWithTasks(id: string): Promise<{ project: Project; tasks: Task[] } | null> {
    const project = await this.getProject(id);
    if (!project) return null;

    const projectTasks = await this.getTasks({ project_id: id });

    return {
      project,
      tasks: projectTasks,
    };
  }

  // ========== GOALS ==========

  /**
   * Create a new goal
   */
  async createGoal(data: Omit<NewGoal, 'id' | 'created_at' | 'updated_at'>): Promise<Goal> {
    const goal: NewGoal = {
      id: nanoid(),
      ...data,
    };

    await this.db.insert(goals).values(goal);
    return (await this.db.select().from(goals).where(eq(goals.id, goal.id)))[0];
  }

  /**
   * Get all goals
   */
  async getGoals(filters?: { category?: string; status?: string }): Promise<Goal[]> {
    let query = this.db.select().from(goals);

    const conditions = [];
    if (filters?.category) conditions.push(eq(goals.category, filters.category));
    if (filters?.status) conditions.push(eq(goals.status, filters.status));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const result = await query.orderBy(desc(goals.created_at));
    return result;
  }

  /**
   * Get goal by ID
   */
  async getGoal(id: string): Promise<Goal | null> {
    const result = await this.db.select().from(goals).where(eq(goals.id, id));
    return result[0] || null;
  }

  /**
   * Update goal
   */
  async updateGoal(id: string, data: Partial<NewGoal>): Promise<Goal> {
    await this.db
      .update(goals)
      .set({ ...data, updated_at: new Date() })
      .where(eq(goals.id, id));

    return (await this.db.select().from(goals).where(eq(goals.id, id)))[0];
  }

  /**
   * Update goal progress
   */
  async updateGoalProgress(id: string, progress: number): Promise<Goal> {
    const completedAt = progress >= 100 ? new Date() : null;

    await this.db
      .update(goals)
      .set({
        progress,
        ...(completedAt && { completed_at: completedAt, status: 'completed' }),
        updated_at: new Date(),
      })
      .where(eq(goals.id, id));

    return (await this.db.select().from(goals).where(eq(goals.id, id)))[0];
  }

  /**
   * Delete goal
   */
  async deleteGoal(id: string): Promise<void> {
    await this.db.delete(goals).where(eq(goals.id, id));
  }

  // ========== STATS ==========

  /**
   * Get work stats
   */
  async getStats(): Promise<{
    totalTasks: number;
    completedTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    totalProjects: number;
    activeProjects: number;
    totalGoals: number;
    completedGoals: number;
  }> {
    const allTasks = await this.getTasks();
    const allProjects = await this.getProjects();
    const allGoals = await this.getGoals();

    return {
      totalTasks: allTasks.length,
      completedTasks: allTasks.filter(t => t.status === 'completed').length,
      todoTasks: allTasks.filter(t => t.status === 'todo').length,
      inProgressTasks: allTasks.filter(t => t.status === 'in_progress').length,
      totalProjects: allProjects.length,
      activeProjects: allProjects.filter(p => p.status === 'active').length,
      totalGoals: allGoals.length,
      completedGoals: allGoals.filter(g => g.status === 'completed').length,
    };
  }
}
