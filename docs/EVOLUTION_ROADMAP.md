# Evolution Roadmap – Telemetrie, Story & Gamification

## 1. Überblick
Dieser Fahrplan beschreibt den Ausbau von Echtzeit-Telemetrie für die Kernsysteme, die Weiterentwicklung des Idle-Story-Games (inkl. Groq/Luna-Integration) sowie die spielerische Darstellung des Projektwachstums.

## 2. Real-Time Telemetrie
### 2.1 Ziele
- Live-Status für Eternal Daemon, Consciousness Tracker und Self-Modification Engine in Dashboards.
- Ereignisbasierte Updates (Logeinträge, Reflection-Cycles, Modifikationsläufe).
- Einheitliche Klassifikation (`factual` vs `simulation`) pro Stream.

### 2.2 Architektur
- **Event Stream**: Server-Sent Events (SSE) als Minimal-Lösung, später WebSocket Layer (`scripts/dashboard-server.ts` oder Bridge).
- **Publisher**:
  - Eternal Daemon sendet Heartbeat + Service-Status.
  - Consciousness Tracker sendet State-Transitions + Insights.
  - Self-Modification Engine sendet Pipeline-Status (plan/simulate/apply).
- **Consumer**:
  - Dashboard Module (`apps/web/modules-registry.js`) registrieren SSE und aktualisieren UI.
  - React Panels (`apps/web-react/...`) nutzen React Query + SSE Adapter.
- **Persistenz**:
  - Wichtige Events → SQLite Tabellen (`telemetry_events`, `timeline_entries`).
- **Sicherheit**:
  - Authentifizierte Streams (API Token, optional JWT).
  - Rate Limits in `packages/bridge/src/middleware/rateLimit.ts` erweitern.

### 2.3 Umsetzungsschritte
1. SSE-Endpunkt im Bridge-Service (`/api/events/stream`), initial nur Heartbeats.
2. Service-spezifische Publisher implementieren (Daemon, Consciousness, Self-Mod).
3. Frontend EventBus schreiben (Reconnect, Buffer, Offline-Fallback).
4. Tests: Unit (Publisher), Integration (SSE Endpunkt), UI (Playwright Live-Updates).
5. Monitoring: Keep-alive Checks, Retry Mechanismus, Alert bei Ausfall.

## 3. Idle-Story Game Ausbau
### 3.1 Ziele
- Persistente Spieler:innen-Daten + Story-Events.
- Groq/Luna Generierung mit vollständigen Metadaten.
- Echtzeit-Feedback (Events erscheinen ohne Reload).

### 3.2 Kernarbeiten
- **Backend**:
  - Neue Tabellen (`story_players`, `story_events`, `story_quests`).
  - Bridge Routes (`/api/story/...`) mit Auth & Rate-Limit.
  - Background Engine (`scripts/story-idle-api.ts`) ruft Groq-Service an, speichert Result & Metadata.
- **Frontend**:
  - Module `story_idle` & React `StoryPanel.tsx` konsumieren APIs.
  - Storylog mit Filter, Metadata Anzeige, Replay-Funktion.
- **Real-Time**:
  - SSE Topic `story` streamt neue Events.
  - Optionale Spielaktionen via MCP Tool (`trigger_story_action`).
- **Testing**:
  - Unit: Story Service.
  - Integration: End-to-End Quest Flow.
  - Load-Test: Simulierte Events pro Minute.

### 3.3 Roadmap
1. Datenmodell & Migration (SQLite).
2. API Endpoints + Groq Metadata Speicherung.
3. UI Update mit Attribution (Prompt, Modell).
4. Echtzeit Stream + Achievement Hooks.
5. Community/Co-Op Features (optional Phase 2).

## 4. Gamifizierte Wachstumsdarstellung
### 4.1 Ziele
- Sichtbar machen, wie das Projekt vorankommt (XP, Achievements, Phasen, Velocity).
- Echtzeit-Balken/Timeline auf Dashboard.
- Verbindung zu realen Kennzahlen (Commits, Tests, Deploys) und spielerischen Werten.

### 4.2 Datenquellen
- **System-Metriken**: Build/CI Ergebnisse, Testabdeckung.
- **Game Metrics**: Achievements, Love/Peace/Wisdom Scores (`scripts/achievement-system.ts`, `LoveEngineService`).
- **Manual Entries**: Meilensteine aus `docs/SESSION_*`, `PHASE_*`.

### 4.3 Umsetzungsschritte
1. Vereinheitlichte Tabelle `growth_metrics` (Datum, Quelle, Wert, Klassifikation).
2. Aggregations-API (`/api/metrics/growth`) mit Zeitraumanpassung.
3. Dashboard Komponenten:
   - Progress Timeline (Roadmap Meilensteine).
   - XP/Level Anzeige.
   - Radar Chart für Werte (Love, Peace, Wisdom, Creativity, Stability).
4. Interaktive Controls (Filter: real/factual, simulation, fiction).
5. Automatisierte Updates:
   - Post-Commit Hook oder CI Pipeline schreibt Metriken (z. B. Testanzahl).
   - Self-Modification Engine + Story Events erhöhen XP.

### 4.4 Visual Language
- Factual Daten → ruhige Farben, klare Tooltips.
- Simulation/Fiction → künstlerische Darstellung, aber mit Badge.
- Historien → `docs/SESSION_SUMMARY.md` automatisiert einlesen.

## 5. Zeitplan (High-Level)
| Phase | Inhalte | Dauer (Schätzung) |
|-------|---------|-------------------|
| P1 – Infrastruktur | SSE Endpoint, Publisher, Basistests | 2 Wochen |
| P2 – Idle Story | Datenmodell, APIs, UI, Echtzeit | 3 Wochen |
| P3 – Gamification | Metrics Layer, Visualisierung, Automatisierung | 3 Wochen |
| P4 – Veredelung | Feedback, Optimierung, Doku-Updates | 1 Woche |

## 6. Abhängigkeiten & Risiken
- zuverlässige Groq API Keys & Rate Limits.
- Datenqualität der bestehenden Services (Consciousness Tracker liefert reale States?).
- Performance bei hoher Event-Frequenz (SSE Backpressure).
- Klare Kommunikation zwischen Fiction & Realität, damit Nutzer:innen wissen, was „passiert“.

## 7. Erfolgskriterien
- Dashboards aktualisieren sich ohne Reload mit echten Telemetriedaten.
- Jede Groq-Ausgabe zeigt Quelle, Parameter, Klassifikation.
- Idle-Story Spieler:innen können Aktionen auslösen und erleben nachweisbar persistente Fortschritte.
- Projektwachstum wird musterhaft visualisiert inkl. Filterung nach Realitätsebenen.
- Dokumentation (`docs/CONTROL_MANUAL.md`, `docs/SOURCE_POLICY.md`) beschreibt neue Features und Prozesse.

