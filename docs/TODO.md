# Task Board (Toobix Unified)

## Done
- [x] Konsolidierung C:\GPT → C:\Dev\Archive\GPT-Versions (+ Junction)
- [x] Umzug C:\Toobix_EXPEMENT → C:\Dev\Projects\Experiments\Toobix-Experiments
- [x] AI_MEMORY.md Encoding bereinigt (UTF‑8)
- [x] docs/SYSTEM_OVERVIEW.md und docs/MEMORY_INDEX.md angelegt
- [x] scripts/system-inventory.ps1 erstellt und einmal ausgeführt

## In Progress
- [ ] Aufgabe planen: Inventory-Skript automatisch ausführen (Task Scheduler)

## Backlog
- [ ] Einheitliche Readmes je Projekt (Start, Befehle, Links)
- [ ] Obsidian-Vault C:\_MEMORY mit Backlinks (optional)
- [ ] Perplexity-Exports strukturieren und verlinken
- [ ] Toobix-Life: Journaling-/Notes-Flows dokumentieren
- [ ] Experiments: Basisordner erstellen und erstes Experiment dokumentieren

---

# Q4 Roadmap Tasks

## Toobix-Unified
- [ ] M1: Health-Endpoints, zentrales Logging, Basis-Dashboards
- [ ] M2: Memory-API vereinheitlicht, Vector-Store integriert
- [ ] M3: Testabdeckung ≥ 80%, CI/CD-Quality-Gates aktiv
- [ ] M4: Stabilitätsphase, Runbooks/Backups, Beta→Stable Tag

## Toobix-Life
- [ ] M1: API-Vertrag mit Unified, erste CRUD-Integration
- [ ] M2: Embeddings + Suche, einfache Empfehlungen
- [ ] M3: E2E-Tests, UX-Polish, Fehlerbehandlung

## Toobix-Experiments
- [ ] M1: Basisordner + Template für Experiment-README
- [ ] M2: Prototyp 1–2 (Dokumentation + Mini-Test)
- [ ] M3: Prototyp 3 + Entscheidung (Port/Archiv)

## GPT-Versions (Archiv)
- [ ] M1: Inventur + Port-Kandidatenliste
- [ ] M2: Portierung 1–2 Module, Verweise in Unified-Docs
- [ ] M3: Aufräumen/Taggen, Abschlussnotizen

---

# Unified Health/Logging Tickets

## Health Endpoints
- [ ] Einheitliche /health-Route für alle Kernservices (Daemon, Port Manager, Service Consciousness, Tasks, Achievement, BlockWorld, Bridge)
- [ ] Health-Response: { status, version, uptime, deps }
- [ ] Health-Aggregator im Dashboard anzeigen

## Logging (Structured)
- [ ] Logger auswählen (z. B. pino) und als shared util bereitstellen
- [ ] Standard-Logformate (level, ts, svc, reqId, msg, err)
- [ ] Fehlerpfad: Exceptions → strukturierte Logs + Stack + Correlation Id

## Dashboards/Monitoring
- [ ] Metriken minimal: request count/latency, error rate
- [ ] Lightweight Dashboard (lokal) oder Export‑PFAD vorbereiten
- [ ] Alerts (dev): simple threshold‑Logs, später Prometheus/Grafana erwägen

## Backups/Runbooks
- [ ] Backup‑Strategie für SQLite/Config/Logs dokumentieren
- [ ] Runbooks für Start/Stop/Recovery je Service
