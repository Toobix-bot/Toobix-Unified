#!/usr/bin/env bun
/**
 * Toobix Voice Control (Text-to-Command)
 * 
 * Noch einfacher: Ein Befehl = Eine Aktion
 * Nutzt Groq's Whisper API für Sprach-zu-Text (optional)
 * 
 * Usage:
 *   bun run scripts/toobix-voice.ts "füge ein neues feature hinzu"
 */

const BRIDGE_URL = process.env.BRIDGE_URL || 'http://localhost:3337';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

interface CommandResult {
  action: string;
  parameters: any;
  needsConfirmation: boolean;
  description: string;
}

async function callTool(toolName: string, args: any = {}): Promise<any> {
  try {
    const response = await fetch(`${BRIDGE_URL}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: { name: toolName, arguments: args },
        id: Date.now()
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    const resultText = data.result?.content?.[0]?.text;
    return resultText ? JSON.parse(resultText) : null;
  } catch (error: any) {
    console.error(`❌ Error calling ${toolName}:`, error.message);
    return null;
  }
}

async function parseCommand(voiceInput: string): Promise<CommandResult> {
  // Nutze Groq um natürliche Sprache zu strukturiertem Befehl zu machen
  const prompt = `Du bist ein Command Parser für Toobix, ein selbst-modifizierendes AI System.

Verfügbare Aktionen:
- code_read: Code lesen/anzeigen
- code_modify: Code ändern/hinzufügen/löschen
- code_suggest: Verbesserungsvorschläge
- system_info: Systemstatus anzeigen
- memory_search: Erinnerungen durchsuchen
- story_info: Story/Level Status
- chat: Normales Gespräch

User Input: "${voiceInput}"

Antworte NUR mit JSON in diesem Format:
{
  "action": "code_modify",
  "parameters": { "file": "example.ts", "description": "Add new feature" },
  "needsConfirmation": true,
  "description": "Fügt ein neues Feature zu example.ts hinzu"
}`;

  try {
    const result = await callTool('generate', { prompt, maxTokens: 200 });
    
    if (result && result.text) {
      // Parse JSON aus der Antwort
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (error) {
    console.log('⚠️  Fallback zu einfachem Parsing...');
  }
  
  // Fallback: Einfaches Pattern Matching
  const input = voiceInput.toLowerCase();
  
  if (input.includes('status') || input.includes('system') || input.includes('gesundheit')) {
    return {
      action: 'system_info',
      parameters: {},
      needsConfirmation: false,
      description: 'Zeige Systemstatus'
    };
  }
  
  if (input.includes('level') || input.includes('xp') || input.includes('geschichte')) {
    return {
      action: 'story_info',
      parameters: {},
      needsConfirmation: false,
      description: 'Zeige Story Status'
    };
  }
  
  if (input.includes('autonom') || input.includes('selbstständig') || input.includes('aktiviere')) {
    return {
      action: 'autonomous_control',
      parameters: { enable: input.includes('aktiviere') || input.includes('enable') },
      needsConfirmation: true,
      description: input.includes('aktiviere') 
        ? 'Aktiviere autonome Aktionen' 
        : 'Zeige Autonomie-Status'
    };
  }
  
  if (input.includes('füge') || input.includes('ändere') || input.includes('lösche')) {
    return {
      action: 'code_modify',
      parameters: { description: voiceInput },
      needsConfirmation: true,
      description: `Code-Änderung: ${voiceInput}`
    };
  }
  
  if (input.includes('zeig') || input.includes('lese')) {
    return {
      action: 'code_read',
      parameters: { query: voiceInput },
      needsConfirmation: false,
      description: `Code lesen: ${voiceInput}`
    };
  }
  
  if (input.includes('verbesser') || input.includes('vorschlag') || input.includes('idee')) {
    return {
      action: 'code_suggest',
      parameters: { context: voiceInput },
      needsConfirmation: false,
      description: `Verbesserungsvorschläge für: ${voiceInput}`
    };
  }
  
  if (input.includes('such') || input.includes('weiß') || input.includes('erinner')) {
    return {
      action: 'memory_search',
      parameters: { query: voiceInput },
      needsConfirmation: false,
      description: `Suche in Erinnerungen: ${voiceInput}`
    };
  }
  
  return {
    action: 'chat',
    parameters: { message: voiceInput },
    needsConfirmation: false,
    description: `Gespräch: ${voiceInput}`
  };
}

async function executeCommand(command: CommandResult): Promise<string> {
  console.log(`\n🎯 Aktion: ${command.action}`);
  console.log(`📝 ${command.description}`);
  
  if (command.needsConfirmation) {
    console.log('\n⚠️  Diese Aktion benötigt Bestätigung!');
    console.log('   Verwende toobix-assistant.ts für interaktive Bestätigung.');
    return '⏸️  Warte auf Bestätigung...';
  }
  
  let result: any;
  
  switch (command.action) {
    case 'system_info':
      const [health, soul, story] = await Promise.all([
        callTool('system_analyze'),
        callTool('soul_state'),
        callTool('story_state')
      ]);
      
      let info = '📊 System Status:\n\n';
      if (health) info += `🏥 Gesundheit: ${health.status || 'OK'}\n`;
      if (soul) {
        const emotions = soul.emotional?.emotions || {};
        const topEmotion = Object.entries(emotions).sort((a: any, b: any) => b[1] - a[1])[0];
        info += `💝 Emotion: ${topEmotion ? topEmotion[0] : 'calm'}\n`;
      }
      if (story) info += `🎮 Level: ${story.currentLevel || 1}, XP: ${story.currentXP || 0}\n`;
      
      return info;
      
    case 'story_info':
      result = await callTool('story_state');
      if (result) {
        return `📖 Level: ${result.currentLevel || 1}, XP: ${result.currentXP || 0}/${result.xpToNextLevel || 100}`;
      }
      break;
      
    case 'code_read':
      result = await callTool('system_read_self', command.parameters);
      return result?.content || '❌ Konnte Code nicht lesen';
      
    case 'code_suggest':
      result = await callTool('system_suggest', command.parameters);
      if (result?.suggestions) {
        let suggestions = '💡 Vorschläge:\n\n';
        result.suggestions.forEach((s: any, i: number) => {
          suggestions += `${i + 1}. ${s.title || s.description}\n`;
        });
        return suggestions;
      }
      break;
      
    case 'memory_search':
      result = await callTool('memory_search', command.parameters);
      if (result?.results) {
        let memories = '💾 Gefundene Erinnerungen:\n\n';
        result.results.forEach((m: any, i: number) => {
          memories += `${i + 1}. ${m.content || m.text}\n`;
        });
        return memories;
      }
      break;
      
    case 'autonomous_control':
      if (command.parameters.enable) {
        result = await callTool('autonomous_enable', { enabled: true });
        return result?.message || '⚡ Autonome Aktionen aktiviert!';
      } else {
        result = await callTool('autonomous_status');
        if (result) {
          let status = `🤖 Autonomie-Status:\n\n`;
          status += `Status: ${result.enabled ? '✅ AKTIV' : '❌ INAKTIV'}\n`;
          status += `Gesamt-Aktionen: ${result.totalActions}\n`;
          status += `Erfolgreich: ${result.successfulActions}\n`;
          status += `Erfolgsrate: ${result.successRate}\n`;
          status += `Durchschn. Ethik-Score: ${result.avgEthicalScore}/100\n`;
          return status;
        }
      }
      break;
      
    case 'chat':
      result = await callTool('consciousness_think', { topic: command.parameters.message });
      return result?.reflection || 'Hmm, interessante Frage...';
      
    default:
      return '❓ Unbekannte Aktion';
  }
  
  return '✅ Fertig!';
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║              🎤 TOOBIX VOICE CONTROL 🎤                      ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('📖 Usage:');
    console.log('   bun run scripts/toobix-voice.ts "dein befehl hier"');
    console.log('');
    console.log('💡 Beispiele:');
    console.log('   bun run scripts/toobix-voice.ts "status"');
    console.log('   bun run scripts/toobix-voice.ts "zeig mir level und xp"');
    console.log('   bun run scripts/toobix-voice.ts "wie geht es dir"');
    console.log('   bun run scripts/toobix-voice.ts "füge ein neues feature hinzu"');
    console.log('   bun run scripts/toobix-voice.ts "verbessere das memory system"');
    console.log('');
    console.log('🎯 Für interaktive Sessions:');
    console.log('   bun run scripts/toobix-assistant.ts');
    console.log('');
    process.exit(0);
  }
  
  const voiceInput = args.join(' ');
  
  console.log(`\n🎤 Input: "${voiceInput}"\n`);
  
  // Check connection
  try {
    await callTool('ping');
  } catch (error) {
    console.log('❌ Kann nicht mit Bridge verbinden. Starte zuerst:');
    console.log('   bun run packages/bridge/src/index.ts\n');
    process.exit(1);
  }
  
  // Parse command
  console.log('🧠 Analysiere Befehl...');
  const command = await parseCommand(voiceInput);
  
  // Execute
  const result = await executeCommand(command);
  
  console.log(`\n🤖 Toobix:\n${result}\n`);
}

main().catch(console.error);

export {};
