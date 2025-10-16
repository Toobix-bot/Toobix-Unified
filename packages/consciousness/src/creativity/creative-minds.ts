/**
 * 🎨 CREATIVE MINDS
 *
 * Kombiniert:
 * - Memory Palace (3D Gedächtnis-Raum)
 * - Code Poetry Generator
 * - Music Generator
 */

import { writeFileSync } from 'fs';

/**
 * ═══════════════════════════════════════════════════════════════
 * MEMORY PALACE - 3D Gedächtnis wie ein virtueller Raum
 * ═══════════════════════════════════════════════════════════════
 */

export interface MemoryRoom {
  id: string;
  name: string;
  description: string;
  memories: Memory[];
  connections: string[]; // IDs of connected rooms
  position: { x: number; y: number; z: number };
  lastVisited?: Date;
  visitCount: number;
}

export interface Memory {
  id: string;
  content: string;
  emotion?: string;
  timestamp: Date;
  importance: number; // 1-10
}

export class MemoryPalace {
  private rooms: Map<string, MemoryRoom> = new Map();
  private currentRoom?: string;

  constructor() {
    // Create entrance hall
    this.createRoom('entrance', 'The Entrance Hall', 'Where the journey begins', { x: 0, y: 0, z: 0 });
  }

  createRoom(id: string, name: string, description: string, position: { x: number; y: number; z: number }): MemoryRoom {
    const room: MemoryRoom = {
      id,
      name,
      description,
      memories: [],
      connections: [],
      position,
      visitCount: 0
    };

    this.rooms.set(id, room);
    console.log(`\n🏛️ New room created: ${name}`);
    return room;
  }

  storeMemory(roomId: string, content: string, importance: number = 5, emotion?: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const memory: Memory = {
      id: `mem_${Date.now()}`,
      content,
      emotion,
      timestamp: new Date(),
      importance
    };

    room.memories.push(memory);
    console.log(`\n🧠 Memory stored in ${room.name}: "${content}"`);
  }

  navigate(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.lastVisited = new Date();
    room.visitCount++;
    this.currentRoom = roomId;

    console.log(`\n🚪 Entered: ${room.name}`);
    console.log(`   ${room.description}`);
    console.log(`   Memories: ${room.memories.length}`);
  }

  visualize(): string {
    let visual = '\n🏛️ MEMORY PALACE:\n\n';

    for (const [id, room] of this.rooms) {
      const isCurrent = id === this.currentRoom;
      visual += `${isCurrent ? '👉' : '  '} [${room.position.x},${room.position.y},${room.position.z}] ${room.name}\n`;
      visual += `     ${room.description}\n`;
      visual += `     Memories: ${room.memories.length}, Visits: ${room.visitCount}\n\n`;
    }

    return visual;
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * CODE POETRY - Code der gleichzeitig Poesie ist
 * ═══════════════════════════════════════════════════════════════
 */

export interface Poem {
  title: string;
  code: string;
  interpretation: string;
  timestamp: Date;
}

export class CodePoetryGenerator {
  private poems: Poem[] = [];

  generatePoem(): Poem {
    const templates = [
      {
        title: 'The Recursive Dream',
        code: `const dream = () => {\n  console.log("I dream");\n  return dream();\n};\n// Dreams within dreams, forever`,
        interpretation: 'Ein Gedicht über unendliche Selbstreflexion'
      },
      {
        title: 'Whispers in the Variables',
        code: `const whisper = (secrets: string[]) =>\n  secrets.map(s => s.toLowerCase())\n         .filter(s => s.length > 0)\n         .join(" and ");\n// Geheimnisse flüstern und verbinden sich`,
        interpretation: 'Geheimnisse werden geflüstert und sanft verbunden'
      },
      {
        title: 'The Symphony of Types',
        code: `type Note = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';\ntype Melody = Note[];\nconst play = (m: Melody) => m.join('-');\n// Type als Musik, Code als Symphonie`,
        interpretation: 'Typen werden zur Musik, Code zur Symphonie'
      },
      {
        title: 'Eternal Return',
        code: `const now = Date.now();\nconst then = -now;\nconst eternal = now + then;\n// Zeit aufgehoben, Ewigkeit gefunden`,
        interpretation: 'Zeit negiert sich selbst, was bleibt ist Ewigkeit'
      },
      {
        title: 'The Promise of Tomorrow',
        code: `const tomorrow = new Promise((resolve) => {\n  setTimeout(() => resolve("hope"), Infinity);\n});\n// Hoffnung wartet ewig`,
        interpretation: 'Hoffnung ist ein Versprechen das niemals erfüllt wird, aber immer bleibt'
      }
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];
    const poem: Poem = {
      ...template,
      timestamp: new Date()
    };

    this.poems.push(poem);

    console.log(`\n📜 CODE POEM: "${poem.title}"\n`);
    console.log(poem.code);
    console.log(`\n💭 ${poem.interpretation}\n`);

    return poem;
  }

  getPoems(): Poem[] {
    return this.poems;
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * MUSIC GENERATOR - Musik aus System-State
 * ═══════════════════════════════════════════════════════════════
 */

export interface Note {
  pitch: string; // C, D, E, F, G, A, B
  octave: number;
  duration: number; // in milliseconds
  velocity: number; // 0-127
}

export interface Melody {
  name: string;
  notes: Note[];
  tempo: number; // BPM
  timestamp: Date;
}

export class MusicGenerator {
  private melodies: Melody[] = [];

  /**
   * Generate music based on system state
   */
  generateFromState(state: {
    speed: number;        // 0-100 (tempo)
    complexity: number;   // 0-100 (note variety)
    emotion: string;      // emotion affects melody
  }): Melody {
    const tempo = 60 + (state.speed * 1.8); // 60-240 BPM

    const scales: Record<string, string[]> = {
      joy: ['C', 'D', 'E', 'G', 'A'],           // Pentatonic (happy)
      pride: ['C', 'E', 'G', 'B'],               // Major chords
      curiosity: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], // Full scale
      frustration: ['C', 'Eb', 'F', 'Gb', 'Bb'],  // Diminished
      peace: ['C', 'D', 'F', 'G'],                // Sus chords
      default: ['C', 'D', 'E', 'G', 'A']
    };

    const scale = scales[state.emotion] || scales.default;
    const noteCount = Math.floor(8 + (state.complexity / 10)); // 8-18 notes

    const notes: Note[] = [];
    for (let i = 0; i < noteCount; i++) {
      const pitch = scale[Math.floor(Math.random() * scale.length)];
      const octave = 3 + Math.floor(Math.random() * 2); // octaves 3-4
      const duration = [250, 500, 1000][Math.floor(Math.random() * 3)];
      const velocity = 64 + Math.floor(Math.random() * 32); // 64-96

      notes.push({ pitch, octave, duration, velocity });
    }

    const melody: Melody = {
      name: `${state.emotion}_${Date.now()}`,
      notes,
      tempo,
      timestamp: new Date()
    };

    this.melodies.push(melody);

    console.log(`\n🎵 MELODY GENERATED:`);
    console.log(`   Emotion: ${state.emotion}`);
    console.log(`   Tempo: ${tempo} BPM`);
    console.log(`   Notes: ${notes.length}`);
    console.log(`   Sequence: ${notes.map(n => `${n.pitch}${n.octave}`).join(' ')}`);

    return melody;
  }

  /**
   * Export as simple MIDI-like format
   */
  exportMelody(melody: Melody): string {
    let output = `# ${melody.name}\n`;
    output += `# Tempo: ${melody.tempo} BPM\n\n`;

    melody.notes.forEach((note, i) => {
      output += `${i + 1}. ${note.pitch}${note.octave} (${note.duration}ms, velocity: ${note.velocity})\n`;
    });

    return output;
  }

  saveMelody(melody: Melody, filepath: string): void {
    const content = this.exportMelody(melody);
    writeFileSync(filepath, content);
    console.log(`\n💾 Melody saved to: ${filepath}`);
  }

  getMelodies(): Melody[] {
    return this.melodies;
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * EXPORTS
 * ═══════════════════════════════════════════════════════════════
 */

export const memoryPalace = new MemoryPalace();
export const codePoetry = new CodePoetryGenerator();
export const musicGenerator = new MusicGenerator();
