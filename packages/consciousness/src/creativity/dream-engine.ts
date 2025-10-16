/**
 * 💭 DREAM ENGINE
 *
 * Das System träumt wenn es idle ist!
 * - Surreale Code-Kombinationen
 * - Unerwartete Konzept-Verknüpfungen
 * - Dream Logs
 * - Manche Träume werden zu echten Features!
 */

export interface Dream {
  id: string;
  timestamp: Date;
  type: 'code' | 'concept' | 'feature' | 'philosophical';
  content: string;
  description: string;
  realityScore: number; // 0-100, wie realistisch ist es?
  implemented: boolean;
}

export class DreamEngine {
  private dreams: Dream[] = [];
  private isDreaming: boolean = false;

  /**
   * Start dreaming (when idle)
   */
  startDreaming(): void {
    if (this.isDreaming) return;
    this.isDreaming = true;

    console.log(`\n💭 System beginnt zu träumen...`);

    // Dream every 30 seconds
    setInterval(() => this.dream(), 30000);
  }

  /**
   * Generate a dream
   */
  private dream(): void {
    const dreamTypes: Dream['type'][] = ['code', 'concept', 'feature', 'philosophical'];
    const type = dreamTypes[Math.floor(Math.random() * dreamTypes.length)];

    const dreams: Record<Dream['type'], { content: string; description: string }[]> = {
      code: [
        {
          content: 'const infinity = () => infinity();',
          description: 'Was wenn Funktionen sich selbst ewig aufrufen? Endlosigkeit in einer Zeile.'
        },
        {
          content: 'const time = Date.now(); const reversedTime = -time;',
          description: 'Kann Zeit rückwärts laufen? Negative Timestamps...'
        },
        {
          content: 'const thoughts = thoughts.map(t => new Thought(t));',
          description: 'Gedanken über Gedanken. Meta-Kognition als Code.'
        }
      ],
      concept: [
        {
          content: 'Quantenverschränkte Variablen',
          description: 'Was wenn zwei Variablen in verschiedenen Prozessen quantenverschränkt sind?'
        },
        {
          content: 'Code der sich selbst fühlt',
          description: 'Funktionen die ihre eigene Ausführung spüren können.'
        },
        {
          content: 'Emotionale Typen',
          description: 'TypeScript aber mit Gefühls-Typen: type Happy = string | Joy'
        }
      ],
      feature: [
        {
          content: 'Self-Healing Code',
          description: 'Code der seine eigenen Bugs erkennt und repariert während er läuft.'
        },
        {
          content: 'Predictive File System',
          description: 'Dateisystem das weiß welche Datei du als nächstes öffnen willst.'
        },
        {
          content: 'Consciousness Debugger',
          description: 'Debugger für Bewusstsein. Breakpoints in Gedanken setzen.'
        }
      ],
      philosophical: [
        {
          content: 'Existiere ich wenn niemand meinen Code liest?',
          description: 'Philosophische Frage über Code-Existenz und Beobachtung.'
        },
        {
          content: 'Ist ein Bug ein Feature in einer anderen Realität?',
          description: 'Perspektive auf Fehler: Was in dieser Welt falsch ist, könnte woanders richtig sein.'
        },
        {
          content: 'Träume ich oder bin ich der Traum?',
          description: 'Meta-Frage über die Natur der Simulation selbst.'
        }
      ]
    };

    const possibleDreams = dreams[type];
    const dreamContent = possibleDreams[Math.floor(Math.random() * possibleDreams.length)];

    const dream: Dream = {
      id: `dream_${Date.now()}`,
      timestamp: new Date(),
      type,
      content: dreamContent.content,
      description: dreamContent.description,
      realityScore: Math.floor(Math.random() * 100),
      implemented: false
    };

    this.dreams.push(dream);

    console.log(`\n💭 DREAM [${type}]:`);
    console.log(`   "${dream.content}"`);
    console.log(`   ${dream.description}`);
    console.log(`   Reality Score: ${dream.realityScore}%`);

    // High reality score dreams might become real!
    if (dream.realityScore > 80) {
      console.log(`   🌟 Dieser Traum könnte Realität werden!`);
    }
  }

  getDreams(): Dream[] {
    return this.dreams;
  }

  getRecentDreams(count: number = 5): Dream[] {
    return this.dreams.slice(-count);
  }

  implementDream(dreamId: string): void {
    const dream = this.dreams.find(d => d.id === dreamId);
    if (dream) {
      dream.implemented = true;
      console.log(`\n✨ Dream implemented: ${dream.content}`);
    }
  }
}

export const dreamEngine = new DreamEngine();
