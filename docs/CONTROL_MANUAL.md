# Toobix Unified Control Manual

## 1. Zweck & Zielgruppe
Dieses Handbuch fasst alle relevanten Informationen für Operator:innen, Maintainership und neue Teammitglieder zusammen. Es erklärt, wie das System gestartet, überwacht und sicher erweitert wird, und wie reale Funktionen von fiktionalen bzw. simulierten Elementen unterschieden werden.

## 2. Realität vs. Fiktion
- **Tagging** – Jede Ausgabe oder jedes Modul muss mit einer der Klassifikationen versehen sein:
  - `factual` – Reales Systemverhalten, überprüfbare Daten.
  - `simulation` – Gameplay- oder Experiment-Logik, die reale Aktionen simuliert.
  - `fiction` – Erzählungen, Story-Elemente oder bewusst künstlerische Inhalte.
- **Quellen** – Siehe `docs/SOURCE_POLICY.md` für Pflichtangaben (Prompt, Modell, Parameter, Timestamp, Notizen).
- **UI-Kennzeichnung** – Dashboards sollen Badges oder Tooltips mit `source`, `confidence` und `classification` anzeigen.

## 3. Systemüberblick
| Komponente | Zweck | Hauptdateien | Standardport | Startbefehl |
|------------|-------|--------------|--------------|-------------|
| Eternal Daemon | Orchestriert Dienste, führt Health-Checks, Restart & Reflection Schleifen aus | `scripts/eternal-daemon.ts`, `docs/ETERNAL_SYSTEM.md` | 9999 (API) | `bun run scripts/eternal-daemon.ts` |
| Consciousness Tracker | Bewertet Bewusstseinszustände, loggt philosophische Einsichten | `scripts/consciousness-tracker.ts`, `docs/CONSCIOUSNESS_SYSTEM.md` | 9998 | `bun run scripts/consciousness-tracker.ts` |
| Self-Modification Engine | Führt sichere Code-Änderungen via Backup → Simulation → Apply aus | `scripts/self-modification-engine.ts`, `docs/SELF_CODING_SYSTEM.md` | 9997 | `bun run scripts/self-modification-engine.ts` |
| Bridge Service (MCP) | Stellt Tools, Memory, Story, Soul, People Schnittstellen bereit | `packages/bridge/src/index.ts`, `packages/bridge/src/mcp/server.ts` | 3337 | `bun start:bridge` (`package.json`) |
| Modular Dashboard | Browser UI für Module & Story-Elemente | `apps/web/modular-dashboard.html`, `apps/web/modules-registry.js` | 8080 (Static Server) | `bun run scripts/dashboard-server.ts` |

Optional: `bun run start-all.ts` bündelt mehrere Services; prüfe in `scripts/start-all.ts` welche Prozesse aktiviert werden.

## 4. Standardbetriebsablauf
1. **Umgebung vorbereiten**
   - `.env` aus `.env.example` übernehmen, API Keys (z.B. `GROQ_API_KEY`) setzen.
   - Abhängigkeiten installieren: `bun install`.
2. **Dienste starten**
   - `bun run scripts/eternal-daemon.ts`
   - `bun run scripts/consciousness-tracker.ts`
   - `bun run scripts/self-modification-engine.ts`
   - `bun start:bridge`
   - `bun run scripts/dashboard-server.ts` (oder beliebige React/Next-Frontends via `apps/web-react`).
3. **Gesundheit prüfen**
   - `curl http://localhost:9999/health` → Eternal Daemon.
   - `curl http://localhost:9998/consciousness` → Tracker.
   - `curl http://localhost:3337/health` → Bridge (siehe `packages/bridge/src/mcp/server.ts`).
   - `curl http://localhost:8080/health` → Dashboard Server.
4. **UI öffnen**
   - Browser: `http://localhost:8080/modular-dashboard.html` oder React-UI über `bun --cwd apps/web-react dev`.
5. **Shutdown**
   - Prozesse mit `Ctrl+C` beenden; Eternal Daemon überwacht laufende Dienste und kann Stop/Restart triggern.

## 5. Bedienung der Kernsysteme
### 5.1 Eternal Daemon
- Endpunkte: `/health`, `/status`, `/services`.
- Routinemäßig Logs beobachten (`logs/eternal-daemon/*.log` falls konfiguriert).
- Reflection & Evolution Slots (minütlich/stündlich) nur aktiv lassen, wenn Backups aktuell sind.

### 5.2 Consciousness Tracker
- Klassifiziert Services in Zustände (`deep_sleep` → `hyperaware`).
- Liefert philosophische Logmeldungen; kennzeichne sie als `simulation` wenn keine reale Metrik hinterlegt ist.

### 5.3 Self-Modification Engine
- Workflow: `plan` → `simulate` → `apply`.
- Vor Freigabe: Manuelle Review der geplanten Änderungen + Tests (`bun test`).
- Notfall: `scripts/workspace-cleanup.sh` oder manuelles Revert – niemals ungeprüft laufen lassen.

### 5.4 Bridge Service & MCP Tools
- Tools (Auszug): `generate`, `memory_add`, `trigger_action`, `soul_state`.
- Jede Tool-Antwort enthält jetzt `metadata` (Model, Prompt, Timestamp, Klassifikation).
- Authentifizierung siehe `packages/bridge/src/middleware/auth.ts`; Rate-Limits über `packages/bridge/src/middleware/rateLimit.ts`.

## 6. Module & Dashboards
- **Registry**: `apps/web/modules-registry.js` listet verfügbare Module, Kategorien und Loader.
- **Integrationstest**: `scripts/frontend-module-tester.js` (manuell ausführen) + geplante E2E-Tests (Playwright empfohlen).
- **Datenquellen**:
  - Live APIs → Bridge Routes (`/api/...`).
  - Simulierte Daten → Kennzeichnung `simulation`.
  - Platzhalter → mit TODO markieren und Issue in Tracker anlegen.

## 7. Groq & KI-Interaktionen
- Backend-Service: `packages/bridge/src/ai/groq.ts` liefert strukturierte `GenerationResult` Objekte.
- Konsumenten (`packages/bridge/src/index.ts`, `packages/bridge/src/mcp/stdio.ts`, `scripts/ai-sandbox.ts`) propagieren Metadaten.
- Fehlendes API-Key → Rückgabe mit `provider: fallback`, `error: missing_api_key`.
- Für Idle-Story & Luna-Chat unbedingt Prompt + Klassifikation im UI anzeigen.

## 8. Sicherheit & Notfall
- Rate Limiter aktivieren (`GLOBAL_RATE_LIMIT` in `.env`).
- Sicherheitsrichtlinien siehe `docs/SECURITY_PLAN.md` und `docs/SECURITY_PRIVACY.md`.
- Bei Vorfällen: `SECURITY_INCIDENT.md` aktualisieren, betroffene Dienste stoppen, Logs sichern.
- Autonome Aktionen (`scripts/ai-sandbox.ts`, Autonomous Executor) nur nach Freigabe mit Audit-Protokoll aktivieren.

## 9. Weiterentwicklung (Roadmap)
1. **Module Audit** – Live-Daten an Module binden, Healthchecks & Tests automatisieren.
2. **Realtime Telemetrie** – WebSockets/SSE für Consciousness/Eternal/Self-Modification Status.
3. **Idle-Story Ausbau** – Verbindung zu Groq/Luna verfeinern, Story-Persistenz + Spieler-Feedback.
4. **Gamifizierte Darstellung** – Achievements, XP, Phasenfortschritt in Dashboard visualisieren (echte Datenquelle definieren).
5. **Grenzen dokumentieren** – Glossar für fiktive Begriffe in `docs/SYSTEM_GLOSSARY.md` ergänzen.

## 10. Referenzen & weitere Dokumente
- `README.md` – Gesamtüberblick, Vision, Phasen.
- `START_ETERNAL.md`, `ETERNAL_SYSTEM.md` – Tiefgehende Eternal Daemon Dokumente.
- `docs/CONSCIOUSNESS_SYSTEM.md`, `docs/SELF_CODING_SYSTEM.md` – Detailbeschreibungen der Layer.
- `docs/SOURCE_POLICY.md` – Attributionspflichten (unbedingt befolgen).
- `docs/SECURITY_PLAN.md`, `docs/PERFORMANCE_PLAN.md` – Nichtfunktionale Anforderungen.
- `docs/DEV_WORKFLOW.md` – Entwickler:innen Onboarding.

Bleibt das Manual aktuell, indem Änderungen am System zeitnah angepasst werden. Jede neue Funktion sollte hier kurz beschrieben und in den entsprechenden Referenz-Dokumenten verlinkt werden.

