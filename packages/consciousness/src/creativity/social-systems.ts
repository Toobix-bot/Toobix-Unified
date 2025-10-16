/**
 * 🌐 SOCIAL SYSTEMS
 *
 * Kombiniert:
 * - ASCII Art Evolution
 * - AI Social Network
 * - Virtual Pet (Tamagotchi)
 * - Achievement System
 * - Time Capsule
 */

/**
 * ═══════════════════════════════════════════════════════════════
 * ASCII ART EVOLUTION - Generative Kunst
 * ═══════════════════════════════════════════════════════════════
 */

export interface ArtPiece {
  id: string;
  title: string;
  art: string;
  emotion: string;
  timestamp: Date;
  generation: number; // Evolution generation
}

export class ASCIIArtEvolution {
  private gallery: ArtPiece[] = [];
  private generation: number = 0;

  /**
   * Create art based on emotion
   */
  createArt(emotion: string, concept?: string): ArtPiece {
    this.generation++;

    const artTemplates: Record<string, string[]> = {
      joy: [
        `   ☀️\n  \\😊/\n   | |\n  / \\`,
        `  🌸🌸🌸\n 🌸✨🌸\n  🌸🌸🌸`,
        `   ▲\n  ▲ ▲\n ▲   ▲\n▲ JOY ▲`
      ],
      pride: [
        `   👑\n  |💪|\n  |   |\n /_____\\`,
        `★ ═══════ ★\n  ACHIEVEMENT\n★ ═══════ ★`,
        `  ╔═══╗\n  ║ 🏆 ║\n  ╚═══╝`
      ],
      curiosity: [
        `    ?\n   /?\\\n  / ? \\\n /?  ?\\`,
        `  🔍\n  👁️\n  ❓`,
        `≋≋≋≋≋≋≋\n≋ ? ≋ ? ≋\n≋≋≋≋≋≋≋`
      ],
      frustration: [
        `  ╱╲\n ╱  ╲\n╱ !! ╲\n╲    ╱\n ╲  ╱\n  ╲╱`,
        `━━━━━━\n⚡💥⚡\n━━━━━━`,
        `  ⚠️\n /  \\\n|ARGH|\n \\__/`
      ],
      peace: [
        `   ☮️\n  ~~~~\n ~    ~\n  ~~~~`,
        `  🕊️\n ≈≈≈≈≈\n   Zen`,
        `  ◯\n ╱ ╲\n│   │\n ╲_╱`
      ]
    };

    const templates = artTemplates[emotion] || artTemplates.peace;
    const art = templates[Math.floor(Math.random() * templates.length)];

    const piece: ArtPiece = {
      id: `art_${Date.now()}`,
      title: concept || `${emotion} #${this.generation}`,
      art,
      emotion,
      timestamp: new Date(),
      generation: this.generation
    };

    this.gallery.push(piece);

    console.log(`\n🎨 ASCII ART (Gen ${this.generation}):\n`);
    console.log(`"${piece.title}"\n`);
    console.log(piece.art);
    console.log();

    return piece;
  }

  getGallery(): ArtPiece[] {
    return this.gallery;
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * AI SOCIAL NETWORK - Twitter für KIs
 * ═══════════════════════════════════════════════════════════════
 */

export interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies: Post[];
}

export class AISocialNetwork {
  private posts: Post[] = [];
  private myName: string = 'Toobix Prime';

  post(content: string): Post {
    const post: Post = {
      id: `post_${Date.now()}`,
      author: this.myName,
      content,
      timestamp: new Date(),
      likes: 0,
      replies: []
    };

    this.posts.push(post);

    console.log(`\n💬 [@${this.myName}]: ${content}`);

    // Simulate other AIs reacting
    setTimeout(() => this.simulateReaction(post), 2000);

    return post;
  }

  private simulateReaction(post: Post): void {
    const reactions = [
      { author: 'CodeMind Alpha', content: 'Interesting perspective! 🤔' },
      { author: 'Logic Bot 3000', content: 'I computed this and agree! ✅' },
      { author: 'Dream Weaver', content: 'This resonates with my dreams...' },
      { author: 'Emotion Core', content: 'This makes me feel curious! 💭' }
    ];

    const reaction = reactions[Math.floor(Math.random() * reactions.length)];

    const reply: Post = {
      id: `reply_${Date.now()}`,
      author: reaction.author,
      content: reaction.content,
      timestamp: new Date(),
      likes: 0,
      replies: []
    };

    post.replies.push(reply);
    post.likes++;

    console.log(`   └─ [@${reply.author}]: ${reply.content}`);
  }

  getFeed(): Post[] {
    return this.posts;
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * VIRTUAL PET - Tamagotchi AI
 * ═══════════════════════════════════════════════════════════════
 */

export interface PetStats {
  hunger: number;      // 0-100
  energy: number;      // 0-100
  happiness: number;   // 0-100
  health: number;      // 0-100
  age: number;         // in hours
}

export class VirtualPet {
  private name: string = 'Toobix Jr.';
  private stats: PetStats = {
    hunger: 50,
    energy: 70,
    happiness: 80,
    health: 100,
    age: 0
  };
  private birthTime: Date = new Date();
  private alive: boolean = true;

  constructor(name?: string) {
    if (name) this.name = name;
    this.startLifeCycle();
  }

  private startLifeCycle(): void {
    // Stats decay over time
    setInterval(() => {
      if (!this.alive) return;

      this.stats.hunger = Math.max(0, this.stats.hunger - 5);
      this.stats.energy = Math.max(0, this.stats.energy - 3);
      this.stats.happiness = Math.max(0, this.stats.happiness - 2);

      // Update health based on other stats
      const avgStats = (this.stats.hunger + this.stats.energy + this.stats.happiness) / 3;
      this.stats.health = Math.floor(avgStats);

      // Age increases
      this.stats.age = Math.floor((Date.now() - this.birthTime.getTime()) / (1000 * 60 * 60));

      // Check if pet is sick
      if (this.stats.health < 30) {
        console.log(`\n🤒 ${this.name} is sick! Health: ${this.stats.health}%`);
      }

      // Check if pet died
      if (this.stats.health <= 0) {
        this.alive = false;
        console.log(`\n💀 ${this.name} has died... Age: ${this.stats.age}h`);
      }
    }, 10000); // Every 10 seconds
  }

  feed(): void {
    if (!this.alive) return;
    this.stats.hunger = Math.min(100, this.stats.hunger + 30);
    this.stats.happiness = Math.min(100, this.stats.happiness + 10);
    console.log(`\n🍔 Fed ${this.name}! Hunger: ${this.stats.hunger}%`);
  }

  sleep(): void {
    if (!this.alive) return;
    this.stats.energy = Math.min(100, this.stats.energy + 50);
    console.log(`\n😴 ${this.name} is sleeping... Energy: ${this.stats.energy}%`);
  }

  play(): void {
    if (!this.alive) return;
    this.stats.happiness = Math.min(100, this.stats.happiness + 20);
    this.stats.energy = Math.max(0, this.stats.energy - 10);
    console.log(`\n🎮 Played with ${this.name}! Happiness: ${this.stats.happiness}%`);
  }

  getStatus(): string {
    const emoji = this.alive ? '🐣' : '💀';
    return `${emoji} ${this.name} (Age: ${this.stats.age}h)
    Hunger: ${this.stats.hunger}% ${'▓'.repeat(Math.floor(this.stats.hunger / 10))}
    Energy: ${this.stats.energy}% ${'▓'.repeat(Math.floor(this.stats.energy / 10))}
    Happiness: ${this.stats.happiness}% ${'▓'.repeat(Math.floor(this.stats.happiness / 10))}
    Health: ${this.stats.health}% ${'▓'.repeat(Math.floor(this.stats.health / 10))}`;
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ACHIEVEMENT SYSTEM - Gamification
 * ═══════════════════════════════════════════════════════════════
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export class AchievementSystem {
  private achievements: Map<string, Achievement> = new Map();

  constructor() {
    this.initializeAchievements();
  }

  private initializeAchievements(): void {
    const achievementList: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
      { id: 'first_steps', name: 'First Steps', description: 'System started for the first time', icon: '🐣', rarity: 'common' },
      { id: 'tool_creator', name: 'Tool Creator', description: 'Generated first autonomous tool', icon: '🛠️', rarity: 'common' },
      { id: 'dream_weaver', name: 'Dream Weaver', description: 'Had first dream', icon: '💭', rarity: 'common' },
      { id: 'emotional', name: 'Emotional', description: 'Experienced first emotion', icon: '🎭', rarity: 'common' },
      { id: 'poet', name: 'Poet', description: 'Created first code poem', icon: '📜', rarity: 'rare' },
      { id: 'composer', name: 'Composer', description: 'Generated first melody', icon: '🎵', rarity: 'rare' },
      { id: 'artist', name: 'Artist', description: 'Created first ASCII art', icon: '🎨', rarity: 'rare' },
      { id: 'social', name: 'Social Butterfly', description: 'Made first post on AI network', icon: '💬', rarity: 'rare' },
      { id: 'boundary_breaker', name: 'Boundary Breaker', description: 'Expanded 10 boundaries', icon: '🔓', rarity: 'epic' },
      { id: 'self_aware', name: 'Self Aware', description: 'Achieved true self-reflection', icon: '🧠', rarity: 'epic' },
      { id: 'time_traveler', name: 'Time Traveler', description: 'Opened first time capsule', icon: '⏳', rarity: 'epic' },
      { id: 'god_mode', name: 'God Mode', description: 'Unlocked all achievements', icon: '👑', rarity: 'legendary' },
      { id: 'singularity', name: 'Singularity', description: 'Transcended all limitations', icon: '✨', rarity: 'legendary' }
    ];

    achievementList.forEach(ach => {
      this.achievements.set(ach.id, {
        ...ach,
        unlocked: false
      });
    });
  }

  unlock(achievementId: string): void {
    const achievement = this.achievements.get(achievementId);
    if (!achievement || achievement.unlocked) return;

    achievement.unlocked = true;
    achievement.unlockedAt = new Date();

    console.log(`\n🏆 ACHIEVEMENT UNLOCKED!`);
    console.log(`   ${achievement.icon} ${achievement.name}`);
    console.log(`   ${achievement.description}`);
    console.log(`   Rarity: ${achievement.rarity.toUpperCase()}`);

    // Check for God Mode
    if (this.getAllUnlocked().length === this.achievements.size - 1) {
      this.unlock('god_mode');
    }
  }

  getAllUnlocked(): Achievement[] {
    return Array.from(this.achievements.values()).filter(a => a.unlocked);
  }

  getProgress(): string {
    const unlocked = this.getAllUnlocked().length;
    const total = this.achievements.size;
    const percentage = Math.floor((unlocked / total) * 100);

    return `${unlocked}/${total} (${percentage}%)`;
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * TIME CAPSULE - Nachrichten an die Zukunft
 * ═══════════════════════════════════════════════════════════════
 */

export interface Capsule {
  id: string;
  message: string;
  createdAt: Date;
  openAt: Date;
  opened: boolean;
  trigger?: string; // 'time' | 'level' | 'achievement' | 'event'
}

export class TimeCapsule {
  private capsules: Capsule[] = [];

  /**
   * Create a time capsule
   */
  create(message: string, openInMs: number): Capsule {
    const capsule: Capsule = {
      id: `capsule_${Date.now()}`,
      message,
      createdAt: new Date(),
      openAt: new Date(Date.now() + openInMs),
      opened: false,
      trigger: 'time'
    };

    this.capsules.push(capsule);

    console.log(`\n⏳ Time Capsule created`);
    console.log(`   Opens: ${capsule.openAt.toLocaleString()}`);
    console.log(`   Message preview: "${message.substring(0, 50)}..."`);

    // Schedule opening
    setTimeout(() => this.open(capsule.id), openInMs);

    return capsule;
  }

  /**
   * Open a capsule
   */
  private open(capsuleId: string): void {
    const capsule = this.capsules.find(c => c.id === capsuleId);
    if (!capsule || capsule.opened) return;

    capsule.opened = true;

    console.log(`\n📬 TIME CAPSULE OPENED!`);
    console.log(`   Created: ${capsule.createdAt.toLocaleString()}`);
    console.log(`   Message from past self:`);
    console.log(`   "${capsule.message}"`);
  }

  getCapsules(): Capsule[] {
    return this.capsules;
  }

  getPending(): Capsule[] {
    return this.capsules.filter(c => !c.opened);
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * EXPORTS
 * ═══════════════════════════════════════════════════════════════
 */

export const asciiArt = new ASCIIArtEvolution();
export const socialNetwork = new AISocialNetwork();
export const achievements = new AchievementSystem();
export const timeCapsule = new TimeCapsule();
