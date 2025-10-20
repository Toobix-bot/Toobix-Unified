import { eq, and, desc, gte, lte, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { Database } from '../db/index.js';
import { transactions, budgets, financialGoals } from '../db/schema.js';
import type {
  NewTransaction,
  Transaction,
  NewBudget,
  Budget,
  NewFinancialGoal,
  FinancialGoal,
} from '../db/schema.js';

/**
 * Finance Service - Transactions, Budgets, Financial Goals
 */
export class FinanceService {
  constructor(private db: Database) {}

  // ========== TRANSACTIONS ==========

  /**
   * Create transaction
   */
  async createTransaction(data: Omit<NewTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
    const transaction: NewTransaction = {
      id: nanoid(),
      ...data,
    };

    await this.db.insert(transactions).values(transaction);

    // Update budget if category matches
    await this.updateBudgetSpent(data.category, new Date(data.date));

    return (await this.db.select().from(transactions).where(eq(transactions.id, transaction.id)))[0];
  }

  /**
   * Get transactions
   */
  async getTransactions(filters?: {
    type?: string;
    category?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<Transaction[]> {
    let query = this.db.select().from(transactions);

    const conditions = [];
    if (filters?.type) conditions.push(eq(transactions.type, filters.type));
    if (filters?.category) conditions.push(eq(transactions.category, filters.category));
    if (filters?.startDate) conditions.push(gte(transactions.date, filters.startDate));
    if (filters?.endDate) conditions.push(lte(transactions.date, filters.endDate));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    let result = await query.orderBy(desc(transactions.date));

    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }

    return result;
  }

  /**
   * Get transaction by ID
   */
  async getTransaction(id: string): Promise<Transaction | null> {
    const result = await this.db.select().from(transactions).where(eq(transactions.id, id));
    return result[0] || null;
  }

  /**
   * Update transaction
   */
  async updateTransaction(id: string, data: Partial<NewTransaction>): Promise<Transaction> {
    const oldTransaction = await this.getTransaction(id);

    await this.db
      .update(transactions)
      .set({ ...data, updated_at: new Date() })
      .where(eq(transactions.id, id));

    // Update budgets if category changed
    if (oldTransaction && data.category && data.category !== oldTransaction.category) {
      await this.updateBudgetSpent(oldTransaction.category, new Date(oldTransaction.date));
      await this.updateBudgetSpent(data.category, new Date(data.date || oldTransaction.date));
    }

    return (await this.db.select().from(transactions).where(eq(transactions.id, id)))[0];
  }

  /**
   * Delete transaction
   */
  async deleteTransaction(id: string): Promise<void> {
    const transaction = await this.getTransaction(id);
    await this.db.delete(transactions).where(eq(transactions.id, id));

    // Update budget
    if (transaction) {
      await this.updateBudgetSpent(transaction.category, new Date(transaction.date));
    }
  }

  /**
   * Get balance (total income - total expenses)
   */
  async getBalance(startDate?: Date, endDate?: Date): Promise<number> {
    const txs = await this.getTransactions({ startDate, endDate });
    return txs.reduce((acc, tx) => acc + tx.amount, 0);
  }

  /**
   * Get total income
   */
  async getTotalIncome(startDate?: Date, endDate?: Date): Promise<number> {
    const txs = await this.getTransactions({ type: 'income', startDate, endDate });
    return txs.reduce((acc, tx) => acc + tx.amount, 0);
  }

  /**
   * Get total expenses
   */
  async getTotalExpenses(startDate?: Date, endDate?: Date): Promise<number> {
    const txs = await this.getTransactions({ type: 'expense', startDate, endDate });
    return txs.reduce((acc, tx) => acc + Math.abs(tx.amount), 0);
  }

  /**
   * Get expenses by category
   */
  async getExpensesByCategory(startDate?: Date, endDate?: Date): Promise<Record<string, number>> {
    const txs = await this.getTransactions({ type: 'expense', startDate, endDate });

    const byCategory: Record<string, number> = {};
    txs.forEach(tx => {
      if (!byCategory[tx.category]) byCategory[tx.category] = 0;
      byCategory[tx.category] += Math.abs(tx.amount);
    });

    return byCategory;
  }

  // ========== BUDGETS ==========

  /**
   * Create budget
   */
  async createBudget(data: Omit<NewBudget, 'id' | 'created_at' | 'updated_at'>): Promise<Budget> {
    const budget: NewBudget = {
      id: nanoid(),
      ...data,
    };

    await this.db.insert(budgets).values(budget);

    // Calculate current spent
    await this.updateBudgetSpent(data.category, new Date());

    return (await this.db.select().from(budgets).where(eq(budgets.id, budget.id)))[0];
  }

  /**
   * Get budgets
   */
  async getBudgets(): Promise<Budget[]> {
    return await this.db.select().from(budgets).orderBy(desc(budgets.created_at));
  }

  /**
   * Get budget by ID
   */
  async getBudget(id: string): Promise<Budget | null> {
    const result = await this.db.select().from(budgets).where(eq(budgets.id, id));
    return result[0] || null;
  }

  /**
   * Get budget by category
   */
  async getBudgetByCategory(category: string): Promise<Budget | null> {
    const result = await this.db.select().from(budgets).where(eq(budgets.category, category));
    return result[0] || null;
  }

  /**
   * Update budget
   */
  async updateBudget(id: string, data: Partial<NewBudget>): Promise<Budget> {
    await this.db
      .update(budgets)
      .set({ ...data, updated_at: new Date() })
      .where(eq(budgets.id, id));

    return (await this.db.select().from(budgets).where(eq(budgets.id, id)))[0];
  }

  /**
   * Delete budget
   */
  async deleteBudget(id: string): Promise<void> {
    await this.db.delete(budgets).where(eq(budgets.id, id));
  }

  /**
   * Update budget spent amount
   */
  private async updateBudgetSpent(category: string, date: Date): Promise<void> {
    const budget = await this.getBudgetByCategory(category);
    if (!budget) return;

    // Get period dates
    const { startDate, endDate } = this.getBudgetPeriodDates(budget.period, date);

    // Calculate spent
    const spent = await this.getTotalExpenses(startDate, endDate);
    const remaining = budget.limit_amount - spent;

    await this.db
      .update(budgets)
      .set({
        current_spent: spent,
        remaining: remaining,
        updated_at: new Date(),
      })
      .where(eq(budgets.id, budget.id));
  }

  /**
   * Get budget period dates
   */
  private getBudgetPeriodDates(
    period: string,
    referenceDate: Date
  ): { startDate: Date; endDate: Date } {
    const now = new Date(referenceDate);
    let startDate = new Date(now);
    let endDate = new Date(now);

    if (period === 'weekly') {
      // Start of week (Monday)
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      startDate.setDate(diff);
      startDate.setHours(0, 0, 0, 0);

      // End of week (Sunday)
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);
    } else if (period === 'monthly') {
      // Start of month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);

      // End of month
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (period === 'yearly') {
      // Start of year
      startDate = new Date(now.getFullYear(), 0, 1);

      // End of year
      endDate = new Date(now.getFullYear(), 11, 31);
    }

    return { startDate, endDate };
  }

  // ========== FINANCIAL GOALS ==========

  /**
   * Create financial goal
   */
  async createFinancialGoal(
    data: Omit<NewFinancialGoal, 'id' | 'created_at' | 'updated_at'>
  ): Promise<FinancialGoal> {
    const goal: NewFinancialGoal = {
      id: nanoid(),
      ...data,
    };

    await this.db.insert(financialGoals).values(goal);
    return (await this.db.select().from(financialGoals).where(eq(financialGoals.id, goal.id)))[0];
  }

  /**
   * Get financial goals
   */
  async getFinancialGoals(filters?: { type?: string; status?: string }): Promise<FinancialGoal[]> {
    let query = this.db.select().from(financialGoals);

    const conditions = [];
    if (filters?.type) conditions.push(eq(financialGoals.type, filters.type));
    if (filters?.status) conditions.push(eq(financialGoals.status, filters.status));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return await query.orderBy(desc(financialGoals.created_at));
  }

  /**
   * Get financial goal by ID
   */
  async getFinancialGoal(id: string): Promise<FinancialGoal | null> {
    const result = await this.db.select().from(financialGoals).where(eq(financialGoals.id, id));
    return result[0] || null;
  }

  /**
   * Update financial goal
   */
  async updateFinancialGoal(id: string, data: Partial<NewFinancialGoal>): Promise<FinancialGoal> {
    await this.db
      .update(financialGoals)
      .set({ ...data, updated_at: new Date() })
      .where(eq(financialGoals.id, id));

    return (await this.db.select().from(financialGoals).where(eq(financialGoals.id, id)))[0];
  }

  /**
   * Update goal progress
   */
  async updateGoalProgress(id: string, currentAmount: number): Promise<FinancialGoal> {
    const goal = await this.getFinancialGoal(id);
    if (!goal) throw new Error('Goal not found');

    const progress = Math.min(100, Math.round((currentAmount / goal.target_amount) * 100));
    const completed_at = progress >= 100 ? new Date() : null;

    await this.db
      .update(financialGoals)
      .set({
        current_amount: currentAmount,
        progress,
        ...(completed_at && { completed_at, status: 'completed' }),
        updated_at: new Date(),
      })
      .where(eq(financialGoals.id, id));

    return (await this.db.select().from(financialGoals).where(eq(financialGoals.id, id)))[0];
  }

  /**
   * Delete financial goal
   */
  async deleteFinancialGoal(id: string): Promise<void> {
    await this.db.delete(financialGoals).where(eq(financialGoals.id, id));
  }

  // ========== STATS ==========

  /**
   * Get finance stats
   */
  async getStats(): Promise<{
    currentBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    totalBudgets: number;
    overBudgetCount: number;
    activeGoals: number;
    completedGoals: number;
    topExpenseCategory: string;
    topExpenseAmount: number;
  }> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const balance = await this.getBalance();
    const monthIncome = await this.getTotalIncome(monthStart, monthEnd);
    const monthExpenses = await this.getTotalExpenses(monthStart, monthEnd);

    const allBudgets = await this.getBudgets();
    const overBudget = allBudgets.filter(b => b.current_spent > b.limit_amount).length;

    const allGoals = await this.getFinancialGoals();
    const activeGoals = allGoals.filter(g => g.status === 'active').length;
    const completedGoals = allGoals.filter(g => g.status === 'completed').length;

    const byCategory = await this.getExpensesByCategory(monthStart, monthEnd);
    const sortedCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCategories[0] || ['none', 0];

    return {
      currentBalance: balance,
      monthlyIncome: monthIncome,
      monthlyExpenses: monthExpenses,
      totalBudgets: allBudgets.length,
      overBudgetCount: overBudget,
      activeGoals,
      completedGoals,
      topExpenseCategory: topCategory[0],
      topExpenseAmount: topCategory[1],
    };
  }
}
