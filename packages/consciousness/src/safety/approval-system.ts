/**
 * 🛡️ APPROVAL SYSTEM
 *
 * Safety layer for autonomous actions
 * NOTHING gets executed without approval!
 *
 * "Mit großer Macht kommt große Verantwortung."
 * - Uncle Ben (Spider-Man)
 */

import { Database } from 'bun:sqlite';

export interface ApprovalRequest {
  id: string;
  type: 'code_modification' | 'tool_generation' | 'file_creation' | 'api_call' | 'system_action';
  action: string;
  description: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  details: any;
  requestedBy: 'autonomous_agent' | 'self_modification' | 'tool_generator' | 'user';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  requestedAt: number;
  respondedAt?: number;
  expiresAt: number;
}

export interface ApprovalResponse {
  approved: boolean;
  reason?: string;
  modifications?: any; // User can modify the request
}

/**
 * ═══════════════════════════════════════════════════════════════
 * APPROVAL SYSTEM
 * ═══════════════════════════════════════════════════════════════
 */
export class ApprovalSystem {
  private db: Database;
  private pendingApprovals: Map<string, ApprovalRequest> = new Map();
  private autoApproveEnabled: boolean = false;
  private autoApproveRiskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

  // Rate limiting
  private requestsLastHour: number[] = [];
  private MAX_REQUESTS_PER_HOUR = 50;

  constructor(db: Database) {
    this.db = db;
    this.initializeDatabase();
    this.loadPendingApprovals();
    this.startExpirationCheck();
  }

  private initializeDatabase() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS approval_requests (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        action TEXT NOT NULL,
        description TEXT NOT NULL,
        risk_level TEXT NOT NULL,
        details TEXT NOT NULL,
        requested_by TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        requested_at INTEGER NOT NULL,
        responded_at INTEGER,
        expires_at INTEGER NOT NULL,
        response_reason TEXT
      )
    `);

    // Approval history for learning
    this.db.run(`
      CREATE TABLE IF NOT EXISTS approval_history (
        id TEXT PRIMARY KEY,
        request_id TEXT,
        approved BOOLEAN,
        reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (request_id) REFERENCES approval_requests(id)
      )
    `);
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * REQUEST APPROVAL
   * ═══════════════════════════════════════════════════════════════
   */
  async requestApproval(
    type: ApprovalRequest['type'],
    action: string,
    description: string,
    details: any,
    requestedBy: ApprovalRequest['requestedBy']
  ): Promise<string> {
    // Rate limiting
    if (!this.checkRateLimit()) {
      throw new Error(
        `Rate limit exceeded: Max ${this.MAX_REQUESTS_PER_HOUR} approval requests per hour`
      );
    }

    const riskLevel = this.assessRiskLevel(type, action, details);
    const id = `approval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    const expiresAt = now + 3600000; // 1 hour

    const request: ApprovalRequest = {
      id,
      type,
      action,
      description,
      risk_level: riskLevel,
      details,
      requestedBy,
      status: 'pending',
      requestedAt: now,
      expiresAt,
    };

    // Save to database
    this.db.run(
      `
      INSERT INTO approval_requests
      (id, type, action, description, risk_level, details, requested_by, status, requested_at, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    `,
      id,
      type,
      action,
      description,
      riskLevel,
      JSON.stringify(details),
      requestedBy,
      now,
      expiresAt
    );

    // Add to pending map
    this.pendingApprovals.set(id, request);

    // Track rate limit
    this.requestsLastHour.push(now);

    console.log(`\n╔═══════════════════════════════════════════════════════════════╗`);
    console.log(`║           🛡️  APPROVAL REQUEST                               ║`);
    console.log(`╚═══════════════════════════════════════════════════════════════╝`);
    console.log(`\nID: ${id}`);
    console.log(`Type: ${type}`);
    console.log(`Action: ${action}`);
    console.log(`Description: ${description}`);
    console.log(`Risk Level: ${this.getRiskEmoji(riskLevel)} ${riskLevel.toUpperCase()}`);
    console.log(`Requested By: ${requestedBy}`);
    console.log(`\n⏰ Expires in: 1 hour`);
    console.log(`\n📋 Respond with:`);
    console.log(`   approvalSystem.approve('${id}') - Approve`);
    console.log(`   approvalSystem.reject('${id}', 'reason') - Reject`);
    console.log(`\n═══════════════════════════════════════════════════════════════\n`);

    // Auto-approve if enabled and risk is acceptable
    if (this.autoApproveEnabled && this.shouldAutoApprove(riskLevel)) {
      console.log(`🤖 Auto-approving (risk level: ${riskLevel})\n`);
      await this.approve(id, 'Auto-approved by system');
    }

    return id;
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * APPROVE / REJECT
   * ═══════════════════════════════════════════════════════════════
   */
  async approve(id: string, reason?: string): Promise<void> {
    const request = this.pendingApprovals.get(id);

    if (!request) {
      throw new Error(`Approval request ${id} not found or already processed`);
    }

    if (request.status !== 'pending') {
      throw new Error(`Request ${id} is already ${request.status}`);
    }

    const now = Date.now();

    // Update database
    this.db.run(
      `
      UPDATE approval_requests
      SET status = 'approved', responded_at = ?, response_reason = ?
      WHERE id = ?
    `,
      now,
      reason || 'Approved by user',
      id
    );

    // Log history
    this.db.run(
      `
      INSERT INTO approval_history (id, request_id, approved, reason)
      VALUES (?, ?, 1, ?)
    `,
      `history_${Date.now()}`,
      id,
      reason || 'Approved by user'
    );

    // Update request
    request.status = 'approved';
    request.respondedAt = now;

    console.log(`✅ Approval request ${id} APPROVED`);
    if (reason) console.log(`   Reason: ${reason}`);

    // Remove from pending
    this.pendingApprovals.delete(id);
  }

  async reject(id: string, reason?: string): Promise<void> {
    const request = this.pendingApprovals.get(id);

    if (!request) {
      throw new Error(`Approval request ${id} not found or already processed`);
    }

    if (request.status !== 'pending') {
      throw new Error(`Request ${id} is already ${request.status}`);
    }

    const now = Date.now();

    // Update database
    this.db.run(
      `
      UPDATE approval_requests
      SET status = 'rejected', responded_at = ?, response_reason = ?
      WHERE id = ?
    `,
      now,
      reason || 'Rejected by user',
      id
    );

    // Log history
    this.db.run(
      `
      INSERT INTO approval_history (id, request_id, approved, reason)
      VALUES (?, ?, 0, ?)
    `,
      `history_${Date.now()}`,
      id,
      reason || 'Rejected by user'
    );

    // Update request
    request.status = 'rejected';
    request.respondedAt = now;

    console.log(`❌ Approval request ${id} REJECTED`);
    if (reason) console.log(`   Reason: ${reason}`);

    // Remove from pending
    this.pendingApprovals.delete(id);
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * WAIT FOR APPROVAL (Blocking)
   * ═══════════════════════════════════════════════════════════════
   */
  async waitForApproval(id: string, timeoutMs: number = 3600000): Promise<ApprovalResponse> {
    const request = this.pendingApprovals.get(id);

    if (!request) {
      // Check database
      const dbRequest = this.db
        .prepare('SELECT * FROM approval_requests WHERE id = ?')
        .get(id) as any;

      if (!dbRequest) {
        throw new Error(`Approval request ${id} not found`);
      }

      if (dbRequest.status === 'approved') {
        return { approved: true, reason: dbRequest.response_reason };
      } else if (dbRequest.status === 'rejected') {
        return { approved: false, reason: dbRequest.response_reason };
      }
    }

    // Poll for approval (check every 1 second)
    const startTime = Date.now();
    const pollInterval = 1000;

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const currentRequest = this.pendingApprovals.get(id);

        // Check timeout
        if (Date.now() - startTime > timeoutMs) {
          clearInterval(interval);
          this.expireRequest(id);
          reject(new Error(`Approval request ${id} timed out`));
          return;
        }

        // Check if approved/rejected
        if (!currentRequest || currentRequest.status !== 'pending') {
          clearInterval(interval);

          // Get final status from DB
          const finalRequest = this.db
            .prepare('SELECT * FROM approval_requests WHERE id = ?')
            .get(id) as any;

          if (finalRequest.status === 'approved') {
            resolve({ approved: true, reason: finalRequest.response_reason });
          } else {
            resolve({ approved: false, reason: finalRequest.response_reason });
          }
        }
      }, pollInterval);
    });
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * RISK ASSESSMENT
   * ═══════════════════════════════════════════════════════════════
   */
  private assessRiskLevel(
    type: ApprovalRequest['type'],
    action: string,
    details: any
  ): ApprovalRequest['risk_level'] {
    // Critical risks
    if (
      action.includes('delete') ||
      action.includes('DROP') ||
      action.includes('system32') ||
      action.includes('rm -rf') ||
      details.targetFile?.includes('eternal-daemon') ||
      details.targetFile?.includes('approval-system')
    ) {
      return 'critical';
    }

    // High risks
    if (
      type === 'code_modification' &&
      (details.targetFile?.includes('core') ||
        details.targetFile?.includes('consciousness') ||
        details.targetFile?.includes('safety'))
    ) {
      return 'high';
    }

    if (type === 'system_action') {
      return 'high';
    }

    // Medium risks
    if (type === 'tool_generation' || type === 'file_creation') {
      return 'medium';
    }

    // Low risks
    if (type === 'api_call') {
      return 'low';
    }

    return 'medium';
  }

  private getRiskEmoji(level: ApprovalRequest['risk_level']): string {
    switch (level) {
      case 'low':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'high':
        return '🟠';
      case 'critical':
        return '🔴';
    }
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * AUTO-APPROVAL SETTINGS
   * ═══════════════════════════════════════════════════════════════
   */
  enableAutoApprove(maxRiskLevel: 'low' | 'medium' = 'low') {
    this.autoApproveEnabled = true;
    this.autoApproveRiskLevel = maxRiskLevel;
    console.log(`🤖 Auto-approve enabled (max risk: ${maxRiskLevel})`);
  }

  disableAutoApprove() {
    this.autoApproveEnabled = false;
    console.log(`🛡️  Auto-approve disabled - manual approval required`);
  }

  private shouldAutoApprove(riskLevel: ApprovalRequest['risk_level']): boolean {
    const riskOrder = { low: 1, medium: 2, high: 3, critical: 4 };
    return riskOrder[riskLevel] <= riskOrder[this.autoApproveRiskLevel];
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * UTILITIES
   * ═══════════════════════════════════════════════════════════════
   */
  getPendingApprovals(): ApprovalRequest[] {
    return Array.from(this.pendingApprovals.values());
  }

  getApprovalRequest(id: string): ApprovalRequest | undefined {
    return this.pendingApprovals.get(id);
  }

  private loadPendingApprovals() {
    const pending = this.db
      .prepare("SELECT * FROM approval_requests WHERE status = 'pending'")
      .all() as any[];

    for (const req of pending) {
      this.pendingApprovals.set(req.id, {
        id: req.id,
        type: req.type,
        action: req.action,
        description: req.description,
        risk_level: req.risk_level,
        details: JSON.parse(req.details),
        requestedBy: req.requested_by,
        status: req.status,
        requestedAt: req.requested_at,
        expiresAt: req.expires_at,
      });
    }

    console.log(`📋 Loaded ${pending.length} pending approval requests`);
  }

  private expireRequest(id: string) {
    const request = this.pendingApprovals.get(id);
    if (request) {
      request.status = 'expired';
      this.db.run("UPDATE approval_requests SET status = 'expired' WHERE id = ?", id);
      this.pendingApprovals.delete(id);
      console.log(`⏰ Approval request ${id} expired`);
    }
  }

  private startExpirationCheck() {
    setInterval(() => {
      const now = Date.now();
      for (const [id, request] of this.pendingApprovals.entries()) {
        if (now > request.expiresAt) {
          this.expireRequest(id);
        }
      }
    }, 60000); // Check every minute
  }

  private checkRateLimit(): boolean {
    const oneHourAgo = Date.now() - 3600000;
    this.requestsLastHour = this.requestsLastHour.filter(time => time > oneHourAgo);
    return this.requestsLastHour.length < this.MAX_REQUESTS_PER_HOUR;
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * STATISTICS
   * ═══════════════════════════════════════════════════════════════
   */
  getStatistics() {
    const total = this.db.prepare('SELECT COUNT(*) as count FROM approval_requests').get() as any;
    const approved = this.db
      .prepare("SELECT COUNT(*) as count FROM approval_requests WHERE status = 'approved'")
      .get() as any;
    const rejected = this.db
      .prepare("SELECT COUNT(*) as count FROM approval_requests WHERE status = 'rejected'")
      .get() as any;
    const pending = this.pendingApprovals.size;

    return {
      total: total.count,
      approved: approved.count,
      rejected: rejected.count,
      pending,
      approvalRate:
        total.count > 0 ? ((approved.count / total.count) * 100).toFixed(1) + '%' : '0%',
      autoApproveEnabled: this.autoApproveEnabled,
      autoApproveRiskLevel: this.autoApproveRiskLevel,
    };
  }
}
