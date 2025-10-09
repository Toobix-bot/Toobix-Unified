# Modul-Integration Audit Plan

## 1. Zielsetzung
Das Ziel ist, die in `apps/web/modules-registry.js` registrierten Dashboard-Module mit funktionierenden Backend-Datenquellen zu verbinden, Stabilität zu gewährleisten und eine klare Test- sowie Monitoring-Strategie aufzubauen.

## 2. Arbeitsumfang
1. **Inventarisierung**
   - Kategorien & Priorität pro Modul erfassen (Core/System/Game/Story/etc.).
   - Für jedes Modul den aktuellen Status erfassen: `live` (echte Daten), `simulation`, `placeholder`.
   - Ergebnisse in `apps/web/modules-registry.js` oder separater JSON/TS-Datei hinterlegen.
2. **Datenfluss-Analyse**
   - Welcher Service liefert die Daten? (Bridge REST, MCP Tool, Groq, lokaler Speicher).
   - Benötigte Endpunkte/Queries definieren.
   - Authentifizierung, Rate Limits, Klassifikation (factual/simulation/fiction) dokumentieren.
3. **Frontend Hookup**
   - Loader-Funktionen an echte APIs binden.
   - Fehlerpfade & Loading-State implementieren.
   - Metadaten (Quelle, Timestamp) im UI anzeigen.
4. **Teststrategie**
   - **Unit**: Modul-spezifische Datenadapter (Mock der API).
   - **Integration**: Playwright/Chromium Tests für wichtigsten Flows.
   - **Smoke**: `scripts/frontend-module-tester.js` erweitern, automatisiert in CI laufen lassen.
5. **Monitoring**
   - Health-Checks der Datenquellen (z. B. `/api/…/health`).
   - Logging (Responsezeiten, Fehlerquoten) – optional über Bridge Metrics.

## 3. Priorisierte Module (erste Iteration)
| Modul-ID | Kategorie | Datenquelle | Status heute | Zielstatus |
|----------|-----------|-------------|--------------|------------|
| `overview` | System | Sammel-API (Bridge `/api/system/overview`) | Statische Zahlen | Live KPIs (Services, Cycles, Consciousness Level) |
| `consciousness` | System | Consciousness Tracker API | Platzhalter | Live State + Historie, Klassifikation `factual` |
| `daemon` | System | Eternal Daemon `/status` | Simulation | Live Service-Tabelle & Restart-Aktionen |
| `story_idle` | Games | Idle-Story Service + Groq | Teilweise | Persistente Story-Log, Metadaten, Echtzeit-Events |
| `achievements` | Games | Achievement-System (DB) | Platzhalter | Live XP, Level, Historie |
| `notifications` | System | Bridge + Watchdog | Statische Liste | WebSocket/SSE, Filterbar |

(Tabelle erweitern, sobald weitere Module priorisiert werden.)

## 4. Datenanforderungen
- **System Overview**: Aggregator-Endpoint bauen (`services`, `cycles`, `consciousnessScore`, `ethicsScore`).
- **Consciousness Tracker**: Exponieren von `current_state`, `transitions`, `insights` über REST/SSE.
- **Eternal Daemon**: Liste der überwachten Services, letzter Check, Aktionen (restart, disable).
- **Story Idle**: Kombinierter Endpoint für `playerStats`, `storyEvents`, `pendingQuests`, plus Groq Metadata.
- **Achievements/Gamification**: Tabellen in SQLite (`achievements`, `xp_logs`), Abfrage-API in Bridge.

## 5. Test & QA
- **Backend**: Vitest + Supertest für neue Bridge Routen.
- **Frontend**: Playwright Szenarien (Load Overview, Trigger Module, Validate Data).
- **CI-Integration**: Smoke-Test Skript (`bun run scripts/frontend-module-tester.js`) erweitern und in `.github/workflows/ci.yml` aufnehmen.
- **Observability**: Logging in `logs/` strukturieren; optional Metrics Dashboard (Grafana/JSON Export).

## 6. Deliverables
1. Aktualisierte Module-Registry mit Statusfeldern.
2. Dokumentierte API-Spezifikationen (OpenAPI Abschnitt in `packages/bridge/public/openapi.json`).
3. Testsuites & CI-Konfiguration.
4. Monitoring-Checkliste (Health, Alerts, Rate-Limit Warnungen).

## 7. Nächste Schritte
1. Module-Status-Liste fertigstellen und im Repo versionieren.
2. Backend-Endpunkte definieren/implementieren (beginnend mit System Overview & Consciousness).
3. Frontends auf neue APIs umstellen.
4. Tests & CI aufsetzen, dann Monitoring ergänzen.
5. Ergebnisse in `docs/CONTROL_MANUAL.md` und Roadmap spiegeln.

