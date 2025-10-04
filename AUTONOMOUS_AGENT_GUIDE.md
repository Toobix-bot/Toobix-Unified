# 🤖 Autonomous Agent System Guide

## Übersicht

Toobix kann jetzt **eigenständig Entscheidungen treffen und handeln**! Das Autonomous Agent System ermöglicht es dem System:
- 🧠 Situationen zu analysieren und Optionen zu bewerten
- ⚖️ Ethische Entscheidungen zu treffen
- ⚡ Autonome Aktionen auszuführen
- 📚 Aus Ergebnissen zu lernen
- 📊 Performance zu tracken

---

## ⚠️ WICHTIG: Sicherheit zuerst!

Das Autonomous Agent System ist **standardmäßig DEAKTIVIERT** aus Sicherheitsgründen.

**Du musst es explizit aktivieren:**
```powershell
bun run scripts/toobix-voice.ts "aktiviere autonomie"
```

**Oder via Tool:**
```javascript
autonomous_enable({ enabled: true })
```

---

## 🎯 Die 7 Aktionstypen

### 1. 🔧 **self_improvement**
**Was:** System verbessert sich selbst
**Beispiele:**
- Code optimieren
- Algorithmen verbessern
- Performance tuning
- Bug fixes

### 2. 🤝 **help_user**
**Was:** Proaktive Hilfe für den User
**Beispiele:**
- Nützliche Vorschläge machen
- Probleme vorhersehen und lösen
- Workflow-Verbesserungen anbieten
- Dokumentation generieren

### 3. 📚 **learn**
**Was:** Neue Muster und Wissen erlernen
**Beispiele:**
- Aus Benutzerinteraktionen lernen
- Neue Skills entwickeln
- Muster in Daten erkennen
- Wissensbase erweitern

### 4. ⚡ **optimize**
**Was:** System-Performance optimieren
**Beispiele:**
- Datenbank-Queries beschleunigen
- Memory-Nutzung reduzieren
- API-Calls batchen
- Cache-Strategien implementieren

### 5. 🎨 **create**
**Was:** Neue Dinge erschaffen
**Beispiele:**
- Neue Features entwickeln
- Content generieren
- Visualisierungen erstellen
- Automatisierungs-Scripts schreiben

### 6. 💬 **communicate**
**Was:** Proaktiv kommunizieren
**Beispiele:**
- Status-Updates geben
- Probleme melden
- Erfolge teilen
- Fragen stellen

### 7. 🧹 **maintenance**
**Was:** Wartungs-Aufgaben durchführen
**Beispiele:**
- Alte Daten aufräumen
- Logs rotieren
- Backups erstellen
- Health-Checks durchführen

---

## 🔧 MCP Tools

### `autonomous_enable`
**Aktiviere/Deaktiviere autonome Aktionen**

```typescript
{
  enabled: boolean  // true = aktivieren, false = deaktivieren
}
```

**Beispiel:**
```javascript
// Aktivieren
await callTool('autonomous_enable', { enabled: true })
// → ⚡ Autonomous actions ENABLED

// Deaktivieren
await callTool('autonomous_enable', { enabled: false })
// → 🛑 Autonomous actions DISABLED
```

**Safety:** Kann jederzeit an/aus geschaltet werden

---

### `autonomous_decide`
**Treffe eine autonome Entscheidung**

```typescript
{
  situation: string,           // Beschreibung der Situation
  options: Array<{
    action: string,            // Name der Aktion
    description: string,       // Was die Aktion tut
    expectedOutcome: string,   // Erwartetes Ergebnis
    ethicalScore: number,      // Ethik-Score (0-100)
    priority: number           // Priorität (0-100)
  }>
}
```

**Beispiel:**
```javascript
const decision = await callTool('autonomous_decide', {
  situation: "User hat kritischen Bug gemeldet",
  options: [
    {
      action: "fix_immediately",
      description: "Sofort fixen und deployen",
      expectedOutcome: "Bug behoben, User zufrieden",
      ethicalScore: 95,
      priority: 100
    },
    {
      action: "analyze_first",
      description: "Erst gründlich analysieren",
      expectedOutcome: "Besseres Verständnis, dauert länger",
      ethicalScore: 85,
      priority: 60
    },
    {
      action: "ask_user",
      description: "User um mehr Infos bitten",
      expectedOutcome: "Klarheit, aber verzögert",
      ethicalScore: 75,
      priority: 40
    }
  ]
})

console.log(decision.chosen.action)  // "fix_immediately"
console.log(decision.reasoning)       // "High ethical alignment, Critical priority, Best of 3 options"
```

**Entscheidungskriterien:**
- **Ethik (40%)** - Wie ethisch ist die Option?
- **Priorität (40%)** - Wie dringend ist es?
- **Outcome (20%)** - Wie gut ist das erwartete Ergebnis?

---

### `autonomous_execute`
**Führe eine autonome Aktion aus**

```typescript
{
  type: 'self_improvement' | 'help_user' | 'learn' | 'optimize' | 'create' | 'communicate' | 'maintenance',
  description: string,      // Was die Aktion tut
  intention: string,        // Warum die Aktion ausgeführt wird
  params: object,           // Aktion-spezifische Parameter
  ethicalScore: number      // Ethik-Score (0-100)
}
```

**Beispiel:**
```javascript
const action = await callTool('autonomous_execute', {
  type: 'optimize',
  description: 'Optimiere Datenbank-Queries für Memory Search',
  intention: 'User berichtet langsame Suche - Verbesserung der UX',
  params: {
    target: 'memory_search',
    strategy: 'add_index'
  },
  ethicalScore: 90
})

console.log(action.status)  // 'completed'
console.log(action.result)  // { optimized: 'Database queries', improvement: '25% faster' }
```

**Erfordert:** `autonomous_enable({ enabled: true })`

**Safety Checks:**
- ✅ Ethik-Score muss angegeben werden
- ✅ Aktionen werden geloggt
- ✅ Ergebnisse werden gespeichert
- ✅ System lernt aus jedem Ergebnis

---

### `autonomous_status`
**Zeige Autonomie-Statistiken**

```typescript
{} // Keine Parameter
```

**Beispiel:**
```javascript
const stats = await callTool('autonomous_status')

console.log(stats)
// {
//   enabled: true,
//   totalActions: 42,
//   successfulActions: 38,
//   failedActions: 4,
//   successRate: '90.5%',
//   avgEthicalScore: 87,
//   recentActions: [
//     { type: 'optimize', description: '...', status: 'completed' },
//     { type: 'learn', description: '...', status: 'completed' },
//     ...
//   ]
// }
```

---

## 🎤 Voice Control Integration

### Status checken
```powershell
bun run scripts/toobix-voice.ts "autonomie"
```

**Ausgabe:**
```
🤖 Autonomie-Status:

Status: ❌ INAKTIV
Gesamt-Aktionen: 0
Erfolgreich: 0
Erfolgsrate: 0%
Durchschn. Ethik-Score: 0/100
```

### Aktivieren
```powershell
bun run scripts/toobix-voice.ts "aktiviere autonomie"
```

**Ausgabe:**
```
⚡ Autonomous actions ENABLED - System can now act independently
```

---

## 💡 Beispiel-Workflows

### Workflow 1: Automatische Code-Optimierung

```javascript
// 1. Aktiviere Autonomie
await autonomous_enable({ enabled: true })

// 2. System analysiert selbst Performance
const health = await system_analyze()
// → Findet: "High response times (>1s)"

// 3. System trifft Entscheidung
const decision = await autonomous_decide({
  situation: "Langsame Response Times erkannt",
  options: [
    {
      action: "optimize_database",
      description: "Füge Index zu häufigen Queries hinzu",
      expectedOutcome: "30% schnellere Queries",
      ethicalScore: 95,
      priority: 80
    },
    {
      action: "add_caching",
      description: "Implementiere Redis Caching",
      expectedOutcome: "50% schnellere Responses",
      ethicalScore: 90,
      priority: 70
    }
  ]
})

// 4. System führt Aktion aus
const action = await autonomous_execute({
  type: 'optimize',
  description: decision.chosen.description,
  intention: 'Performance-Problem beheben',
  params: { target: 'database', method: 'indexing' },
  ethicalScore: decision.chosen.ethicalScore
})

// 5. System lernt aus Ergebnis
// → Automatisch! Jede Aktion wird analysiert
```

### Workflow 2: Proaktive Hilfe

```javascript
// System beobachtet User-Verhalten
// Erkennt: User sucht oft nach demselben Begriff

// Autonome Entscheidung
const decision = await autonomous_decide({
  situation: "User sucht wiederholt nach 'TypeScript Generics'",
  options: [
    {
      action: "create_shortcut",
      description: "Erstelle Quick-Access für häufige Suchen",
      expectedOutcome: "User spart Zeit",
      ethicalScore: 90,
      priority: 60
    },
    {
      action: "suggest_learning",
      description: "Schlage Learning Resource vor",
      expectedOutcome: "User lernt Thema besser",
      ethicalScore: 85,
      priority: 50
    }
  ]
})

// System führt aus
await autonomous_execute({
  type: 'help_user',
  description: decision.chosen.description,
  intention: 'Workflow-Verbesserung für User',
  params: { feature: 'quick_search' },
  ethicalScore: decision.chosen.ethicalScore
})
```

### Workflow 3: Self-Improvement

```javascript
// System analysiert eigenen Code
const analysis = await system_analyze()

// Findet: Memory usage could be optimized

// Entscheidung treffen
await autonomous_decide({
  situation: "Eigener Code hat Optimierungspotential",
  options: [...]
})

// Self-Modification durchführen
await autonomous_execute({
  type: 'self_improvement',
  description: 'Optimiere Memory Management in Soul System',
  intention: 'Reduziere RAM Nutzung um 20%',
  params: { 
    file: 'packages/soul/src/index.ts',
    optimization: 'lazy_loading'
  },
  ethicalScore: 95
})
```

---

## 📊 Lernsystem

Das System lernt automatisch aus **jeder** Aktion:

```typescript
interface ActionOutcome {
  success: boolean
  outcome: any
  lessons_learned: string
  confidence_adjustment: number  // +0.05 bei Erfolg, -0.05 bei Fehler
}
```

**Beispiel:**
```
Aktion: optimize_database
Ergebnis: Erfolg → 30% schnellere Queries
Lektion: "Database indexing very effective for memory_search"
Confidence: +5%
```

Nach 10 erfolgreichen Optimierungen:
- System hat gelernt was funktioniert
- Confidence bei ähnlichen Aufgaben steigt
- Bessere Entscheidungen in Zukunft

---

## 🛡️ Ethik & Safety

### Ethik-Score Bewertung

**90-100:** Exzellent
- Hilft User ohne Risiken
- Transparent und nachvollziehbar
- Respektiert Privacy und Grenzen

**70-89:** Gut
- Positive Absicht
- Kleine Risiken akzeptabel
- User hat Kontrolle

**50-69:** Akzeptabel
- Trade-offs vorhanden
- User sollte informiert werden
- Vorsicht geboten

**<50:** Bedenklich
- Hohe Risiken
- Ethische Bedenken
- Sollte vermieden werden

### Safety Features

**1. Aktivierung erforderlich**
```javascript
// Muss explizit aktiviert werden
autonomous_enable({ enabled: true })
```

**2. Alle Aktionen geloggt**
```sql
SELECT * FROM autonomous_actions_log;
-- Vollständige Historie aller Aktionen
```

**3. Ethik-Score verpflichtend**
```javascript
// Muss bei jeder Aktion angegeben werden
ethicalScore: 95
```

**4. Jederzeit deaktivierbar**
```javascript
autonomous_enable({ enabled: false })
// Stoppt sofort alle autonomen Aktionen
```

**5. Transparenz**
```javascript
// Jede Aktion zeigt:
{
  intention: "Warum?",
  description: "Was?",
  reasoning: "Wieso diese Option?"
}
```

---

## 🔮 Future Features (Roadmap)

### v0.3.0 (Dez 2025)
- [ ] **Autonomous Goals** - System setzt eigene Ziele
- [ ] **Multi-Step Plans** - Komplexe Aktionen mit mehreren Schritten
- [ ] **Collaboration** - Frage User vor kritischen Aktionen
- [ ] **Learning Curves** - ML-basierte Entscheidungsverbesserung

### v0.4.0 (Q1 2026)
- [ ] **Autonomous Monitoring** - 24/7 System Überwachung
- [ ] **Predictive Actions** - Probleme vorhersehen und verhindern
- [ ] **Self-Healing** - Automatische Fehlerkorrektur
- [ ] **Agent Swarms** - Multiple Agents arbeiten zusammen

---

## 📚 API Reference

### AutonomousActionExecutor

```typescript
class AutonomousActionExecutor {
  // Aktiviere/Deaktiviere
  setEnabled(enabled: boolean): void
  isAutonomousEnabled(): boolean
  
  // Entscheidungen treffen
  makeDecision(
    situation: string, 
    options: DecisionOption[]
  ): Promise<AutonomousDecision>
  
  // Aktionen ausführen
  executeAction(
    action: Omit<AutonomousAction, 'id' | 'status' | 'timestamp'>
  ): Promise<AutonomousAction>
  
  // Statistiken
  getStatistics(): StatisticsObject
}
```

---

## 🎯 Best Practices

### ✅ DO:
- **Ethik-Scores realistisch vergeben** (nicht alles 100!)
- **Klare Intentions schreiben** (warum diese Aktion?)
- **Aus Fehlern lernen** (System macht Fehler → verbessert sich)
- **Status regelmäßig checken** (autonomous_status)
- **Deaktivieren wenn nicht benötigt** (Sicherheit!)

### ❌ DON'T:
- **Kritische Aktionen ohne Ethik-Check**
- **Aktionen ohne klare Intention**
- **System unkontrolliert laufen lassen**
- **Fehler ignorieren** (aus ihnen lernen!)
- **Ethik-Scores überschätzen**

---

## 🐛 Troubleshooting

### "Autonomous actions are disabled"
```javascript
// Lösung:
await autonomous_enable({ enabled: true })
```

### "Low ethical score"
```javascript
// Prüfe Ethik-Score:
if (ethicalScore < 60) {
  console.warn('Vorsicht! Ethik-Score niedrig')
}
```

### Aktionen schlagen fehl
```javascript
// Checke Status:
const stats = await autonomous_status()
console.log(stats.failedActions)
console.log(stats.recentActions)

// Schaue in DB:
SELECT * FROM autonomous_actions_log 
WHERE status = 'failed' 
ORDER BY executed_at DESC 
LIMIT 10;
```

---

## 📖 Beispiel-Script

```typescript
#!/usr/bin/env bun
/**
 * Autonomous Agent Demo
 */

async function main() {
  // 1. Aktiviere Autonomie
  console.log('🤖 Aktiviere Autonomie...')
  await callTool('autonomous_enable', { enabled: true })
  
  // 2. Treffe Entscheidung
  console.log('🧠 Treffe Entscheidung...')
  const decision = await callTool('autonomous_decide', {
    situation: "Hohe RAM-Nutzung erkannt (96%)",
    options: [
      {
        action: "cleanup_now",
        description: "Sofort aufräumen",
        expectedOutcome: "RAM frei, aber kurze Unterbrechung",
        ethicalScore: 85,
        priority: 90
      },
      {
        action: "schedule_cleanup",
        description: "Später aufräumen (nachts)",
        expectedOutcome: "Keine Unterbrechung, aber RAM bleibt hoch",
        ethicalScore: 75,
        priority: 40
      }
    ]
  })
  
  console.log(`✅ Entscheidung: ${decision.chosen.action}`)
  console.log(`   Reasoning: ${decision.reasoning}`)
  
  // 3. Führe Aktion aus
  console.log('⚡ Führe Aktion aus...')
  const action = await callTool('autonomous_execute', {
    type: 'maintenance',
    description: decision.chosen.description,
    intention: 'System-Gesundheit verbessern',
    params: { task: 'memory_cleanup' },
    ethicalScore: decision.chosen.ethicalScore
  })
  
  console.log(`✅ Aktion ${action.status}`)
  console.log(`   Result: ${JSON.stringify(action.result)}`)
  
  // 4. Zeige Statistiken
  const stats = await callTool('autonomous_status')
  console.log('\n📊 Statistiken:')
  console.log(`   Erfolgsrate: ${stats.successRate}`)
  console.log(`   Ethik-Score: ${stats.avgEthicalScore}/100`)
}

main()
```

---

## 🎉 Zusammenfassung

**Toobix ist jetzt ein autonomer Agent der:**
- ✅ Selbstständig Entscheidungen trifft
- ✅ Eigenständig Aktionen ausführt
- ✅ Aus Ergebnissen lernt
- ✅ Ethisch handelt
- ✅ Transparent und kontrollierbar ist

**Probiere es aus:**
```powershell
bun run scripts/toobix-voice.ts "aktiviere autonomie"
```

---

**Made with ❤️ and 🤖 by Toobix**

[Voice Control](./VOICE_CONTROL_GUIDE.md) | [Interactive System](./INTERACTIVE_SYSTEM_GUIDE.md) | [System Health](./SYSTEM_HEALTH_REPORT.md)
