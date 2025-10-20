import { eq, and, desc, gte, lte, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { Database } from '../db/index.js';
import { energyLogs, sleepLogs, flowSessions, meditationSessions } from '../db/schema.js';
import type {
  NewEnergyLog,
  EnergyLog,
  NewSleepLog,
  SleepLog,
  NewFlowSession,
  FlowSession,
  NewMeditationSession,
  MeditationSession,
} from '../db/schema.js';

/**
 * Health Service - Energy, Sleep, Flow, Meditation
 */
export class HealthService {
  constructor(private db: Database) {}

  // ========== ENERGY LOGS ==========

  /**
   * Log energy level
   */
  async logEnergy(data: Omit<NewEnergyLog, 'id' | 'created_at'>): Promise<EnergyLog> {
    const log: NewEnergyLog = {
      id: nanoid(),
      timestamp: data.timestamp || new Date(),
      ...data,
    };

    await this.db.insert(energyLogs).values(log);
    return (await this.db.select().from(energyLogs).where(eq(energyLogs.id, log.id)))[0];
  }

  /**
   * Get energy logs
   */
  async getEnergyLogs(filters?: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<EnergyLog[]> {
    let query = this.db.select().from(energyLogs);

    const conditions = [];
    if (filters?.startDate) {
      conditions.push(gte(energyLogs.timestamp, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(energyLogs.timestamp, filters.endDate));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    let result = await query.orderBy(desc(energyLogs.timestamp));

    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }

    return result;
  }

  /**
   * Get current energy level (latest log)
   */
  async getCurrentEnergy(): Promise<EnergyLog | null> {
    const result = await this.db
      .select()
      .from(energyLogs)
      .orderBy(desc(energyLogs.timestamp))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Get average energy for period
   */
  async getAverageEnergy(startDate: Date, endDate: Date): Promise<number> {
    const logs = await this.getEnergyLogs({ startDate, endDate });
    if (logs.length === 0) return 0;

    const sum = logs.reduce((acc, log) => acc + log.level, 0);
    return Math.round(sum / logs.length);
  }

  // ========== SLEEP LOGS ==========

  /**
   * Log sleep
   */
  async logSleep(data: Omit<NewSleepLog, 'id' | 'created_at'>): Promise<SleepLog> {
    const log: NewSleepLog = {
      id: nanoid(),
      ...data,
    };

    await this.db.insert(sleepLogs).values(log);
    return (await this.db.select().from(sleepLogs).where(eq(sleepLogs.id, log.id)))[0];
  }

  /**
   * Get sleep logs
   */
  async getSleepLogs(filters?: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<SleepLog[]> {
    let query = this.db.select().from(sleepLogs);

    const conditions = [];
    if (filters?.startDate) {
      conditions.push(gte(sleepLogs.date, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(sleepLogs.date, filters.endDate));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    let result = await query.orderBy(desc(sleepLogs.date));

    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }

    return result;
  }

  /**
   * Get latest sleep
   */
  async getLatestSleep(): Promise<SleepLog | null> {
    const result = await this.db
      .select()
      .from(sleepLogs)
      .orderBy(desc(sleepLogs.date))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Get average sleep duration
   */
  async getAverageSleep(days: number = 7): Promise<number> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.getSleepLogs({ startDate, endDate });
    if (logs.length === 0) return 0;

    const sum = logs.reduce((acc, log) => acc + (log.duration_hours || 0), 0);
    return Math.round((sum / logs.length) * 10) / 10; // Round to 1 decimal
  }

  /**
   * Update sleep log
   */
  async updateSleep(id: string, data: Partial<NewSleepLog>): Promise<SleepLog> {
    await this.db.update(sleepLogs).set(data).where(eq(sleepLogs.id, id));
    return (await this.db.select().from(sleepLogs).where(eq(sleepLogs.id, id)))[0];
  }

  // ========== FLOW SESSIONS ==========

  /**
   * Start flow session
   */
  async startFlowSession(data: Omit<NewFlowSession, 'id' | 'created_at' | 'start_time'>): Promise<FlowSession> {
    const session: NewFlowSession = {
      id: nanoid(),
      start_time: new Date(),
      type: data.type,
      activity: data.activity,
      task_id: data.task_id,
      project_id: data.project_id,
    };

    await this.db.insert(flowSessions).values(session);
    return (await this.db.select().from(flowSessions).where(eq(flowSessions.id, session.id)))[0];
  }

  /**
   * End flow session
   */
  async endFlowSession(
    id: string,
    data: {
      quality_score?: number;
      interruptions?: number;
      achievements?: string;
      notes?: string;
    }
  ): Promise<FlowSession> {
    const session = await this.getFlowSession(id);
    if (!session) throw new Error('Session not found');

    const endTime = new Date();
    const durationMinutes = Math.round((endTime.getTime() - session.start_time.getTime()) / 1000 / 60);

    await this.db
      .update(flowSessions)
      .set({
        end_time: endTime,
        duration_minutes: durationMinutes,
        ...data,
      })
      .where(eq(flowSessions.id, id));

    return (await this.db.select().from(flowSessions).where(eq(flowSessions.id, id)))[0];
  }

  /**
   * Get flow session
   */
  async getFlowSession(id: string): Promise<FlowSession | null> {
    const result = await this.db.select().from(flowSessions).where(eq(flowSessions.id, id));
    return result[0] || null;
  }

  /**
   * Get flow sessions
   */
  async getFlowSessions(filters?: {
    type?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<FlowSession[]> {
    let query = this.db.select().from(flowSessions);

    const conditions = [];
    if (filters?.type) {
      conditions.push(eq(flowSessions.type, filters.type));
    }
    if (filters?.startDate) {
      conditions.push(gte(flowSessions.start_time, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(flowSessions.start_time, filters.endDate));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    let result = await query.orderBy(desc(flowSessions.start_time));

    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }

    return result;
  }

  /**
   * Get active flow session
   */
  async getActiveFlowSession(): Promise<FlowSession | null> {
    const result = await this.db
      .select()
      .from(flowSessions)
      .where(sql`${flowSessions.end_time} IS NULL`)
      .orderBy(desc(flowSessions.start_time))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Get total flow time (minutes)
   */
  async getTotalFlowTime(startDate: Date, endDate: Date): Promise<number> {
    const sessions = await this.getFlowSessions({ startDate, endDate });
    return sessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0);
  }

  // ========== MEDITATION ==========

  /**
   * Log meditation session
   */
  async logMeditation(data: Omit<NewMeditationSession, 'id' | 'created_at'>): Promise<MeditationSession> {
    const session: NewMeditationSession = {
      id: nanoid(),
      timestamp: data.timestamp || new Date(),
      ...data,
    };

    await this.db.insert(meditationSessions).values(session);
    return (await this.db.select().from(meditationSessions).where(eq(meditationSessions.id, session.id)))[0];
  }

  /**
   * Get meditation sessions
   */
  async getMeditationSessions(filters?: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<MeditationSession[]> {
    let query = this.db.select().from(meditationSessions);

    const conditions = [];
    if (filters?.startDate) {
      conditions.push(gte(meditationSessions.timestamp, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(meditationSessions.timestamp, filters.endDate));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    let result = await query.orderBy(desc(meditationSessions.timestamp));

    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }

    return result;
  }

  /**
   * Get meditation streak (consecutive days)
   */
  async getMeditationStreak(): Promise<number> {
    const sessions = await this.getMeditationSessions({ limit: 100 });
    if (sessions.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sessions) {
      const sessionDate = new Date(session.timestamp);
      sessionDate.setHours(0, 0, 0, 0);

      if (sessionDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  // ========== STATS ==========

  /**
   * Get health stats
   */
  async getStats(): Promise<{
    currentEnergy: number;
    averageEnergy: number;
    lastSleep: number;
    averageSleep: number;
    flowTimeToday: number;
    flowTimeWeek: number;
    meditationStreak: number;
    totalMeditationMinutes: number;
  }> {
    const currentEnergy = await this.getCurrentEnergy();
    const latestSleep = await this.getLatestSleep();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const avgEnergy = await this.getAverageEnergy(weekAgo, new Date());
    const avgSleep = await this.getAverageSleep(7);
    const flowToday = await this.getTotalFlowTime(today, tomorrow);
    const flowWeek = await this.getTotalFlowTime(weekAgo, new Date());
    const medStreak = await this.getMeditationStreak();

    const medSessions = await this.getMeditationSessions({ startDate: weekAgo });
    const totalMeditation = medSessions.reduce((acc, s) => acc + s.duration_minutes, 0);

    return {
      currentEnergy: currentEnergy?.level || 0,
      averageEnergy: avgEnergy,
      lastSleep: latestSleep?.duration_hours || 0,
      averageSleep: avgSleep,
      flowTimeToday: flowToday,
      flowTimeWeek: flowWeek,
      meditationStreak: medStreak,
      totalMeditationMinutes: totalMeditation,
    };
  }
}
