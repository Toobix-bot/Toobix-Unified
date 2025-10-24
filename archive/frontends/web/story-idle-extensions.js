/**
 * Story-Idle Game v3.0 - AI-Enhanced Edition
 * Complete RPG with AI-generated content, equipment, skills, companions
 */

// This file contains extensions for the Story-Idle Game
// Load after modules-registry.js

window.StoryIdleExtensions = {
  // Equipment System
  equipment: {
    slots: ['weapon', 'armor', 'helmet', 'boots', 'ring', 'amulet'],
    equipped: {},
    inventory: [],
    
    items: [
      // Weapons
      { id: 'wooden_sword', name: 'Wooden Sword', type: 'weapon', atk: 5, icon: '🗡️', level: 1, rarity: 'common' },
      { id: 'iron_sword', name: 'Iron Sword', type: 'weapon', atk: 15, icon: '⚔️', level: 5, rarity: 'uncommon' },
      { id: 'steel_blade', name: 'Steel Blade', type: 'weapon', atk: 30, icon: '🗡️', level: 10, rarity: 'rare' },
      { id: 'dragon_sword', name: 'Dragon Sword', type: 'weapon', atk: 60, icon: '🐉', level: 20, rarity: 'epic' },
      
      // Armor
      { id: 'leather_armor', name: 'Leather Armor', type: 'armor', def: 5, hp: 20, icon: '🧥', level: 1, rarity: 'common' },
      { id: 'chain_mail', name: 'Chain Mail', type: 'armor', def: 15, hp: 40, icon: '🛡️', level: 5, rarity: 'uncommon' },
      { id: 'plate_armor', name: 'Plate Armor', type: 'armor', def: 30, hp: 80, icon: '🛡️', level: 10, rarity: 'rare' },
      { id: 'dragon_scale', name: 'Dragon Scale', type: 'armor', def: 60, hp: 150, icon: '🐲', level: 20, rarity: 'epic' },
      
      // Accessories
      { id: 'leather_boots', name: 'Leather Boots', type: 'boots', def: 2, icon: '👢', level: 1, rarity: 'common' },
      { id: 'power_ring', name: 'Power Ring', type: 'ring', atk: 10, icon: '💍', level: 8, rarity: 'rare' },
      { id: 'magic_amulet', name: 'Magic Amulet', type: 'amulet', mp: 50, icon: '📿', level: 12, rarity: 'epic' }
    ],
    
    getRarityColor(rarity) {
      const colors = {
        common: '#9ca3af',
        uncommon: '#10b981',
        rare: '#3b82f6',
        epic: '#a855f7',
        legendary: '#f59e0b'
      };
      return colors[rarity] || colors.common;
    }
  },

  // Skills System
  skills: {
    list: [
      { id: 'fireball', name: 'Fireball', icon: '🔥', cost: 20, damage: 40, description: 'Blast enemy with fire', unlockLevel: 3 },
      { id: 'heal', name: 'Heal', icon: '💚', cost: 15, heal: 30, description: 'Restore HP', unlockLevel: 2 },
      { id: 'lightning', name: 'Lightning', icon: '⚡', cost: 30, damage: 60, description: 'Strike with lightning', unlockLevel: 7 },
      { id: 'shield', name: 'Shield', icon: '🛡️', cost: 25, def: 20, description: 'Temporary defense boost', unlockLevel: 5 },
      { id: 'meteor', name: 'Meteor', icon: '☄️', cost: 50, damage: 100, description: 'Ultimate destruction', unlockLevel: 15 }
    ],
    unlocked: [],
    
    canUse(skill, game) {
      return game.mp >= skill.cost && game.level >= skill.unlockLevel;
    }
  },

  // Companions System
  companions: {
    list: [
      { id: 'knight', name: 'Sir Valor', icon: '⚔️', atk: 10, hp: 50, skill: 'sword_slash', level: 5 },
      { id: 'mage', name: 'Mystic Luna', icon: '🔮', atk: 15, mp: 100, skill: 'arcane_bolt', level: 8 },
      { id: 'ranger', name: 'Forest Scout', icon: '🏹', atk: 20, def: 10, skill: 'arrow_rain', level: 12 },
      { id: 'dragon', name: 'Baby Dragon', icon: '🐉', atk: 30, hp: 100, skill: 'fire_breath', level: 18 }
    ],
    recruited: [],
    active: null
  },

  // Story Chapters (AI-Enhanced)
  story: {
    chapters: [
      { id: 1, name: 'The Awakening', unlockLevel: 1, completed: false },
      { id: 2, name: 'The Dark Forest', unlockLevel: 5, completed: false },
      { id: 3, name: 'Mountain of Trials', unlockLevel: 10, completed: false },
      { id: 4, name: 'The Lost City', unlockLevel: 15, completed: false },
      { id: 5, name: 'Dragon\'s Lair', unlockLevel: 20, completed: false }
    ],
    currentChapter: 1,
    
    async generateEvent(game) {
      if (!window.GroqAPI || !window.GroqAPI.hasApiKey()) {
        return this.fallbackEvent(game);
      }
      
      const chapter = this.chapters.find(c => c.id === this.currentChapter);
      const event = await window.GroqAPI.generateStoryEvent({
        level: game.level,
        chapter: chapter.name,
        situation: `Player has ${game.hp}/${game.maxHp} HP, facing ${game.enemy.name}`,
        history: game.recentEvents?.slice(-3).join('. ') || 'Just starting the adventure'
      });
      
      return event;
    },
    
    fallbackEvent(game) {
      const events = [
        'You discover a hidden path leading deeper into the unknown.',
        'A mysterious merchant offers you a strange artifact.',
        'The sound of battle echoes in the distance.',
        'You find an ancient inscription on the wall.',
        'A shooting star crosses the sky above you.'
      ];
      return events[Math.floor(Math.random() * events.length)];
    }
  },

  // Boss Battles
  bosses: [
    { name: 'Forest Guardian', icon: '🌳', hp: 200, atk: 25, level: 5, reward: { gems: 500, stars: 50, item: 'iron_sword' } },
    { name: 'Mountain Troll', icon: '👹', hp: 400, atk: 40, level: 10, reward: { gems: 1000, stars: 100, item: 'plate_armor' } },
    { name: 'Ancient Dragon', icon: '🐉', hp: 800, atk: 60, level: 20, reward: { gems: 5000, stars: 500, item: 'dragon_sword' } }
  ],

  // Daily Rewards
  dailyReward: {
    lastClaim: null,
    streak: 0,
    
    canClaim() {
      if (!this.lastClaim) return true;
      const now = new Date();
      const last = new Date(this.lastClaim);
      return (now - last) >= 24 * 60 * 60 * 1000;
    },
    
    claim(game) {
      const now = Date.now();
      if (this.canClaim()) {
        this.streak++;
        this.lastClaim = now;
        
        const rewards = {
          gems: 100 * this.streak,
          stars: 10 * this.streak,
          xp: 50 * this.streak
        };
        
        game.gems += rewards.gems;
        game.stars += rewards.stars;
        game.xp += rewards.xp;
        
        return rewards;
      }
      return null;
    }
  },

  // Enhanced AI Integration
  ai: {
    async generateQuest(playerLevel) {
      if (!window.GroqAPI || !window.GroqAPI.hasApiKey()) {
        return this.fallbackQuest(playerLevel);
      }
      
      try {
        const response = await window.GroqAPI.generateQuest(playerLevel);
        const quest = JSON.parse(response);
        return {
          name: quest.name || 'Mystery Quest',
          desc: quest.objective || 'Complete the objective',
          goal: Math.floor(playerLevel * 5),
          reward: quest.reward || 100
        };
      } catch (e) {
        return this.fallbackQuest(playerLevel);
      }
    },
    
    async generateEnemy(playerLevel) {
      if (!window.GroqAPI || !window.GroqAPI.hasApiKey()) {
        return this.fallbackEnemy(playerLevel);
      }
      
      try {
        const response = await window.GroqAPI.generateEnemy(playerLevel);
        const enemy = JSON.parse(response);
        return {
          name: enemy.name || 'Unknown Creature',
          icon: this.getEnemyIcon(enemy.name),
          hp: enemy.hp || playerLevel * 30,
          maxHp: enemy.hp || playerLevel * 30,
          atk: enemy.attack || playerLevel * 3
        };
      } catch (e) {
        return this.fallbackEnemy(playerLevel);
      }
    },
    
    getEnemyIcon(name) {
      const lowerName = (name || '').toLowerCase();
      if (lowerName.includes('dragon')) return '🐉';
      if (lowerName.includes('goblin')) return '👺';
      if (lowerName.includes('skeleton')) return '💀';
      if (lowerName.includes('orc')) return '👹';
      if (lowerName.includes('wolf')) return '🐺';
      if (lowerName.includes('spider')) return '🕷️';
      if (lowerName.includes('slime')) return '💧';
      return '🧟';
    },
    
    fallbackQuest(level) {
      const quests = [
        { name: 'Monster Hunt', desc: 'Defeat 10 enemies', goal: 10, reward: level * 20 },
        { name: 'Treasure Hunt', desc: 'Collect 500 gems', goal: 500, reward: level * 15 },
        { name: 'Level Up', desc: 'Reach next level', goal: 1, reward: level * 25 }
      ];
      return quests[Math.floor(Math.random() * quests.length)];
    },
    
    fallbackEnemy(level) {
      const enemies = [
        { name: 'Zombie', icon: '🧟' },
        { name: 'Skeleton', icon: '💀' },
        { name: 'Goblin', icon: '👺' },
        { name: 'Wolf', icon: '🐺' },
        { name: 'Spider', icon: '🕷️' }
      ];
      const enemy = enemies[Math.floor(Math.random() * enemies.length)];
      return {
        name: enemy.name,
        icon: enemy.icon,
        hp: level * 30,
        maxHp: level * 30,
        atk: level * 3 + Math.floor(Math.random() * 5)
      };
    }
  }
};

// Console API for testing
console.log('📖 Story-Idle Extensions loaded!');
console.log('💡 Access via: window.StoryIdleExtensions');
console.log('🎮 Equipment, Skills, Companions, Story Chapters, Bosses, Daily Rewards');
console.log('🤖 AI-Enhanced with Groq API (configure key for full features)');
