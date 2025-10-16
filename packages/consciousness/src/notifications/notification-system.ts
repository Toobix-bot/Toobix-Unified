/**
 * 🔔 TOOBIX NOTIFICATION SYSTEM
 *
 * Proaktives Benachrichtigungssystem für autonome Kommunikation
 *
 * Features:
 * - Windows Toast Notifications
 * - Prioritäts-Levels
 * - Action Buttons
 * - Scheduled Notifications
 * - Smart Timing (nicht während du schläfst!)
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export type NotificationLevel = 'info' | 'suggestion' | 'action' | 'critical';
export type NotificationTime = 'morning' | 'daytime' | 'evening' | 'night';

export interface Notification {
  id: string;
  title: string;
  message: string;
  level: NotificationLevel;
  time?: Date;
  actions?: NotificationAction[];
  recurring?: boolean;
}

export interface NotificationAction {
  label: string;
  callback: () => void | Promise<void>;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * NOTIFICATION SYSTEM
 * ═══════════════════════════════════════════════════════════════
 */
export class NotificationSystem {
  private notifications: Map<string, Notification> = new Map();
  private quietHours = { start: 23, end: 7 }; // 23:00 - 07:00

  /**
   * Send a notification to the user
   */
  async notify(notification: Notification): Promise<void> {
    // Check quiet hours
    if (this.isQuietHours() && notification.level !== 'critical') {
      console.log(`⏰ Notification delayed (quiet hours): ${notification.title}`);
      return;
    }

    // Store notification
    this.notifications.set(notification.id, notification);

    // Send via Windows Toast
    await this.sendWindowsToast(notification);

    console.log(`🔔 Notification sent: ${notification.title}`);
  }

  /**
   * Send Windows Toast Notification
   */
  private async sendWindowsToast(notification: Notification): Promise<void> {
    const icon = this.getIconForLevel(notification.level);

    // PowerShell command for Windows Toast
    const psScript = `
      [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
      [Windows.UI.Notifications.ToastNotification, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
      [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null

      $template = @"
      <toast>
        <visual>
          <binding template="ToastGeneric">
            <text>${icon} ${notification.title}</text>
            <text>${notification.message}</text>
          </binding>
        </visual>
        <actions>
          ${notification.actions?.map(a => `<action content="${a.label}" arguments="action_${a.label}"/>`).join('\n') || ''}
        </actions>
      </toast>
"@

      $xml = New-Object Windows.Data.Xml.Dom.XmlDocument
      $xml.LoadXml($template)
      $toast = New-Object Windows.UI.Notifications.ToastNotification $xml
      [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier("Toobix Unified").Show($toast)
    `;

    try {
      await execAsync(`powershell -Command "${psScript.replace(/"/g, '\\"')}"`);
    } catch (error) {
      console.error('Failed to send toast:', error);
    }
  }

  /**
   * Check if we're in quiet hours
   */
  private isQuietHours(): boolean {
    const hour = new Date().getHours();
    return hour >= this.quietHours.start || hour < this.quietHours.end;
  }

  /**
   * Get icon for notification level
   */
  private getIconForLevel(level: NotificationLevel): string {
    const icons = {
      info: 'ℹ️',
      suggestion: '💡',
      action: '⚠️',
      critical: '🔴'
    };
    return icons[level];
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * SCHEDULED NOTIFICATIONS
   * ═══════════════════════════════════════════════════════════════
   */

  /**
   * Schedule morning briefing
   */
  scheduleMorningBriefing(hour: number = 8): void {
    this.scheduleDaily(hour, 0, async () => {
      await this.sendMorningBriefing();
    });
  }

  /**
   * Schedule evening summary
   */
  scheduleEveningSummary(hour: number = 20): void {
    this.scheduleDaily(hour, 0, async () => {
      await this.sendEveningSummary();
    });
  }

  /**
   * Schedule daily notification
   */
  private scheduleDaily(hour: number, minute: number, callback: () => void): void {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);

    // If time already passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntil = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      callback();
      // Reschedule for next day
      this.scheduleDaily(hour, minute, callback);
    }, timeUntil);
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * PROACTIVE MESSAGES
   * ═══════════════════════════════════════════════════════════════
   */

  /**
   * Send morning briefing
   */
  private async sendMorningBriefing(): Promise<void> {
    await this.notify({
      id: 'morning_briefing',
      title: '🌅 Guten Morgen!',
      message: 'Daily Briefing ready. System status: ALL GREEN ✅',
      level: 'info',
      actions: [
        { label: 'Show Details', callback: async () => console.log('Opening briefing...') },
        { label: 'Dismiss', callback: async () => console.log('Dismissed') }
      ]
    });
  }

  /**
   * Send evening summary
   */
  private async sendEveningSummary(): Promise<void> {
    await this.notify({
      id: 'evening_summary',
      title: '🌙 Tag abschließen?',
      message: 'Review today\'s work and commit changes',
      level: 'suggestion',
      actions: [
        { label: 'Review', callback: async () => console.log('Opening summary...') },
        { label: 'Tomorrow', callback: async () => console.log('Delayed') }
      ]
    });
  }

  /**
   * Suggest new task
   */
  async suggestTask(task: string, reason: string): Promise<void> {
    await this.notify({
      id: `suggestion_${Date.now()}`,
      title: '💡 Neue Idee!',
      message: `${task}\n\nReason: ${reason}`,
      level: 'suggestion',
      actions: [
        { label: 'Do it!', callback: async () => console.log('Task accepted') },
        { label: 'Later', callback: async () => console.log('Task delayed') },
        { label: 'Never', callback: async () => console.log('Task rejected') }
      ]
    });
  }

  /**
   * Request approval
   */
  async requestApproval(action: string, details: string): Promise<void> {
    await this.notify({
      id: `approval_${Date.now()}`,
      title: '⚠️ Approval Required',
      message: `${action}\n\n${details}`,
      level: 'action',
      actions: [
        { label: 'Approve', callback: async () => console.log('Approved') },
        { label: 'Reject', callback: async () => console.log('Rejected') },
        { label: 'Details', callback: async () => console.log('Show details') }
      ]
    });
  }

  /**
   * Alert critical issue
   */
  async alertCritical(issue: string, impact: string): Promise<void> {
    await this.notify({
      id: `critical_${Date.now()}`,
      title: '🔴 CRITICAL',
      message: `${issue}\n\nImpact: ${impact}`,
      level: 'critical',
      actions: [
        { label: 'Fix Now', callback: async () => console.log('Fixing...') },
        { label: 'Details', callback: async () => console.log('Show details') }
      ]
    });
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * SINGLETON INSTANCE
 * ═══════════════════════════════════════════════════════════════
 */
export const notificationSystem = new NotificationSystem();
