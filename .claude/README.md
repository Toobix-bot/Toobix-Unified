# Claude Code Commands für Toobix-Unified

Dieser Ordner enthält Custom Slash Commands für Claude Code Sessions.

## Verfügbare Commands

### `/sync` - Session Start
Lädt den vollständigen Projekt-Status am Anfang jeder Session:
- Git Status
- Service Health Checks
- AI_SESSION_START.md
- PROJEKT_STATUS_OKTOBER_2025.md
- Zusammenfassung der aktuellen Quest

**Verwendung:** Am Anfang jeder neuen Claude Code Session ausführen!

### `/status` - Quick Status
Schneller Überblick über:
- Service Status (4 Services)
- Git uncommitted changes
- Letzte 3 Commits
- Aktuelle Phase/Quest

**Verwendung:** Zwischendurch, um schnell Status zu prüfen

### `/session-end` - Session Ende
Sauberer Session-Abschluss:
- Git Commit aller Changes
- AI_SESSION_START.md Update
- CHANGELOG.md Update
- Session Summary
- Optional: Git Push

**Verwendung:** Am Ende jeder Session!

## Workflow Empfehlung

```
1. Session Start:   /sync
2. Arbeiten...      (Code, Features, Fixes)
3. Status Check:    /status  (optional, wenn nötig)
4. Session Ende:    /session-end
```

## Nächste Schritte

Nach Erstellung dieser Commands kannst du sie sofort nutzen:
- In Claude Code: Tippe `/sync` und drücke Enter
- Claude wird automatisch alle Status-Infos laden

**Hinweis:** Diese Commands funktionieren NUR in Claude Code (CLI), nicht im Web-Interface!
