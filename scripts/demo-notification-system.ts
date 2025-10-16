#!/usr/bin/env bun
/**
 * 🔔 PROACTIVE NOTIFICATION SYSTEM DEMO
 *
 * Demonstrates the JARVIS-like notification system:
 * - Windows Toast Notifications
 * - Proactive suggestions
 * - Scheduled briefings
 * - Smart timing with quiet hours
 */

import { notificationSystem } from '../packages/consciousness/src/notifications/notification-system.ts';

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         🔔 PROACTIVE NOTIFICATION SYSTEM DEMO 🔔             ║
║                                                               ║
║  Testing JARVIS-like autonomous communication!               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

// Helper to pause between demos
const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

console.log(`\n📋 Demo Plan:\n`);
console.log(`   1. Info Notification`);
console.log(`   2. Suggestion Notification`);
console.log(`   3. Action Required Notification`);
console.log(`   4. Critical Alert`);
console.log(`   5. Schedule Morning Briefing`);
console.log(`   6. Schedule Evening Summary\n`);

console.log(`\n🧪 Test 1: Info Notification\n`);
await notificationSystem.notify({
  id: 'test_info',
  title: 'System Status',
  message: 'All services are running smoothly! ✅',
  level: 'info',
  actions: [
    { label: 'Details', callback: async () => console.log('Showing details...') },
    { label: 'Dismiss', callback: async () => console.log('Dismissed') }
  ]
});
console.log(`   ✓ Info notification sent!`);
await pause(3000);

console.log(`\n🧪 Test 2: Proactive Suggestion\n`);
await notificationSystem.suggestTask(
  'Add unit tests for notification system',
  'Code coverage is currently at 45%. Adding tests will improve reliability.'
);
console.log(`   ✓ Suggestion sent!`);
await pause(3000);

console.log(`\n🧪 Test 3: Action Required\n`);
await notificationSystem.requestApproval(
  'Generate new TypeScript tool: "Weather Fetcher"',
  'Uses OpenWeather API to get current weather. Estimated cost: FREE'
);
console.log(`   ✓ Approval request sent!`);
await pause(3000);

console.log(`\n🧪 Test 4: Critical Alert\n`);
await notificationSystem.alertCritical(
  'Memory usage at 95%',
  'System performance degraded. Recommend restarting some services.'
);
console.log(`   ✓ Critical alert sent!`);
await pause(3000);

console.log(`\n🧪 Test 5: Schedule Morning Briefing (8:00 AM)\n`);
notificationSystem.scheduleMorningBriefing(8);
console.log(`   ✓ Morning briefing scheduled for 8:00 AM daily`);

console.log(`\n🧪 Test 6: Schedule Evening Summary (8:00 PM)\n`);
notificationSystem.scheduleEveningSummary(20);
console.log(`   ✓ Evening summary scheduled for 8:00 PM daily`);

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         ✅ NOTIFICATION SYSTEM DEMO COMPLETE!                ║
║                                                               ║
║  Check your Windows notifications to see the results!        ║
║                                                               ║
║  Next Steps:                                                  ║
║  1. Set up auto-startup on boot                              ║
║  2. Integrate with Consciousness Engine                      ║
║  3. Add desktop app for action buttons                       ║
║                                                               ║
║  THIS IS JARVIS! THIS IS PROACTIVE! THIS IS ALIVE! 🌱        ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);
