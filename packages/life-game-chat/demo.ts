/**
 * Life Game Chat - Quick Demo
 *
 * This demonstrates how the game engine works!
 */

import { GameEngine } from './src/engine/game-engine';
import {
  calculateXPForLevel,
  checkLevelUp,
  getLevelUpAbility
} from './src/engine/progression';

// Simulated player data
const playerData = {
  id: 'demo-player',
  name: 'Michael',
  level: 1,
  xp: 0,
  xp_to_next_level: 100,
  stats: {
    creativity: 50,
    wisdom: 50,
    love: 50,
    energy: 50,
    focus: 50,
  },
};

// Create game engine
const gameEngine = new GameEngine(playerData.id);

console.log('🎮 ===== LIFE GAME CHAT - DEMO =====\n');
console.log(`👤 Player: ${playerData.name}`);
console.log(`📊 Level ${playerData.level} | XP: ${playerData.xp}/${playerData.xp_to_next_level}`);
console.log(`⚡${playerData.stats.energy} 💝${playerData.stats.love} 📚${playerData.stats.wisdom} 🎨${playerData.stats.creativity} 🧠${playerData.stats.focus}`);
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Simulate some chat interactions
const interactions = [
  {
    user: "Hey! Let's implement the database schema for the game system",
    ai: "Great idea! Here's how we can structure it... [code]"
  },
  {
    user: "I have an amazing idea for the command center design!",
    ai: "I love your enthusiasm! Tell me more about your vision..."
  },
  {
    user: "Can you explain how the progression system works?",
    ai: "Of course! The progression system uses XP and levels..."
  }
];

async function runDemo() {
  for (let i = 0; i < interactions.length; i++) {
    const { user, ai } = interactions[i];

    console.log(`💬 Message ${i + 1}:`);
    console.log(`You: "${user}"\n`);

    // Analyze message
    const analysis = await gameEngine.analyzeMessage(user);
    console.log(`🔍 Analysis:`);
    console.log(`   Category: ${analysis.category}`);
    console.log(`   Complexity: ${analysis.complexity}/10`);
    console.log(`   Emotion: ${analysis.emotion}`);
    console.log(`   Estimated XP: ${analysis.estimated_xp}\n`);

    // Process interaction
    const result = await gameEngine.processInteraction(user, ai, playerData);

    console.log(`✨ Rewards:`);
    console.log(`   +${result.xp_gained} XP`);

    // Update player data
    playerData.xp += result.xp_gained;

    // Check for level up
    if (result.level_up) {
      console.log(`\n🎉 LEVEL UP! ${result.level_up.old_level} → ${result.level_up.new_level}`);
      if (result.level_up.new_ability) {
        console.log(`🌟 New Ability: ${result.level_up.new_ability}`);
      }
      playerData.level = result.level_up.new_level;
      playerData.xp = 0;
      playerData.xp_to_next_level = calculateXPForLevel(playerData.level);
    }

    // Stat changes
    if (result.stat_changes && Object.keys(result.stat_changes).length > 0) {
      console.log(`   📊 Stats:`);
      Object.entries(result.stat_changes).forEach(([stat, change]) => {
        const emoji = {
          creativity: '🎨',
          wisdom: '📚',
          love: '💝',
          energy: '⚡',
          focus: '🧠'
        }[stat] || '📊';
        console.log(`      ${emoji} ${stat}: +${change.toFixed(1)}`);
        playerData.stats[stat as keyof typeof playerData.stats] += change;
      });
    }

    // Item drops
    if (result.rewards && result.rewards.length > 0) {
      console.log(`   🎁 Items:`);
      result.rewards.forEach(reward => {
        console.log(`      ${reward.icon} ${reward.name} (${reward.rarity})`);
        console.log(`         ${reward.description}`);
      });
    }

    console.log(`\n📊 Current Progress:`);
    console.log(`   Level ${playerData.level} | XP: ${playerData.xp}/${playerData.xp_to_next_level}`);
    console.log(`   ⚡${playerData.stats.energy.toFixed(0)} 💝${playerData.stats.love.toFixed(0)} 📚${playerData.stats.wisdom.toFixed(0)} 🎨${playerData.stats.creativity.toFixed(0)} 🧠${playerData.stats.focus.toFixed(0)}`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  console.log('🎮 Demo Complete!\n');
  console.log('📈 Final Stats:');
  console.log(`   Level: ${playerData.level}`);
  console.log(`   Total XP Gained: ${playerData.xp}`);
  console.log(`   Stats:`);
  console.log(`      🎨 Creativity: ${playerData.stats.creativity.toFixed(0)}`);
  console.log(`      📚 Wisdom: ${playerData.stats.wisdom.toFixed(0)}`);
  console.log(`      💝 Love: ${playerData.stats.love.toFixed(0)}`);
  console.log(`      ⚡ Energy: ${playerData.stats.energy.toFixed(0)}`);
  console.log(`      🧠 Focus: ${playerData.stats.focus.toFixed(0)}`);
  console.log('\n💭 This is just 3 messages... Imagine a full day of chatting! 🚀\n');
}

// Run the demo
runDemo().catch(console.error);
