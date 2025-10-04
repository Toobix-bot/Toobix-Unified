# 🚀 Toobix Unified - Quick Start

## Für heute Abend: Demo zeigen! 🌟

```bash
# Option 1: Direkt öffnen
start C:\Toobix-Unified\apps\web\index.html

# Option 2: Mit Browser
chrome apps\web\index.html
firefox apps\web\index.html
```

Das wars! Die Demo läuft sofort im Browser.

---

## Installation (für Entwicklung)

### 1. Bun installieren

```bash
# Windows PowerShell (als Administrator)
powershell -c "irm bun.sh/install.ps1 | iex"
```

Nach Installation: PowerShell neu starten!

### 2. Projekt einrichten

```bash
cd C:\Toobix-Unified
bun install                 # Dependencies installieren
bun db:generate             # Migrations generieren
bun db:migrate              # Datenbank erstellen
```

### 3. Demo-Daten laden

```bash
bun run demo                # Lädt Test-Daten
```

### 4. Starten

```bash
bun run dev                 # Development-Server
```

---

## Nächste Schritte (Week 1)

### Soul System portieren (V8)
```bash
# Dateien kopieren:
# C:\GPT\Version_8\src\soul\* → packages\core\src\soul\
bun run migrate:v8 soul
```

### Memory/KB portieren (V8)
```bash
# Dateien kopieren:
# C:\GPT\Version_8\src\memory\* → packages\core\src\memory\
bun run migrate:v8 memory
```

### People Module implementieren
```bash
cd packages\core
# Dateien erstellen:
# src/people/service.ts       # Business logic
# src/people/queries.ts       # Database queries
# src/people/types.ts         # Additional types
```

---

## Projekt-Struktur

```
C:\Toobix-Unified\
├── apps\
│   ├── web\                # Browser Demo (FERTIG! ✅)
│   │   └── index.html
│   └── desktop\            # Tauri App (Week 5)
├── packages\
│   ├── core\               # Kern-Engine
│   │   ├── src\
│   │   │   ├── db\         # Schema (FERTIG! ✅)
│   │   │   ├── soul\       # Week 1
│   │   │   ├── memory\     # Week 1
│   │   │   ├── people\     # Week 1-3
│   │   │   ├── story\      # Week 2
│   │   │   └── index.ts
│   │   └── package.json
│   └── shared\             # Shared utilities
├── plugins\                # Erweiterungen
│   ├── love-engine\        # Week 2
│   └── peace-catalyst\     # Week 6
├── scripts\                # Migration scripts
│   ├── migrate-v8.ts
│   └── migrate-v7.ts
├── data\                   # SQLite Database
│   └── toobix-unified.db
├── docs\                   # Dokumentation
└── package.json            # Root config
```

---

## Kommandos (Cheatsheet)

### Development
```bash
bun run dev                 # Alle packages in watch mode
bun run build               # Production build
bun run test                # Tests
```

### Database
```bash
bun db:generate             # Neue Migration erstellen
bun db:migrate              # Migrations ausführen
bun db:studio               # Drizzle Studio (GUI)
```

### Migration
```bash
bun run migrate:v8          # Version_8 importieren
bun run migrate:v7          # Version_7 importieren
```

### Demo
```bash
bun run demo                # Demo-Daten laden
start apps\web\index.html   # Browser öffnen
```

---

## Wichtige Dateien

| Datei | Beschreibung |
|-------|--------------|
| `README.md` | Vollständige Doku + Vision |
| `QUICK_START.md` | Diese Datei! |
| `apps/web/index.html` | Browser-Demo (zeigbar!) |
| `packages/core/src/db/schema.ts` | Datenbank-Schema (11 Tabellen) |
| `packages/core/src/index.ts` | Haupt-Export |
| `package.json` | Workspace Config |

---

## Troubleshooting

### Problem: "bun: command not found"
```bash
# PowerShell neu starten nach Installation
# Oder manuell zur PATH hinzufügen:
$env:Path += ";$env:USERPROFILE\.bun\bin"
```

### Problem: "Cannot find module 'drizzle-orm'"
```bash
# Dependencies neu installieren
bun install
```

### Problem: Database fehlt
```bash
# Migration ausführen
bun db:generate
bun db:migrate
```

### Problem: Demo lädt nicht
```bash
# Browser-Cache leeren (Ctrl+Shift+R)
# Oder anderen Browser testen
```

---

## Next Steps

1. **Heute Abend**: Demo zeigen (`start apps\web\index.html`)
2. **Morgen**: Bun installieren + `bun install`
3. **Week 1**: Soul + Memory portieren
4. **Week 2**: Story Engine + Love Engine
5. **Week 3**: People Module ausbauen
6. **Week 4**: Browser UI erweitern
7. **Week 5**: Desktop App (Tauri)
8. **Week 6**: Module + Polish

---

## Hilfe

- **README.md**: Vollständige Doku
- **docs/**: Detaillierte Guides
- **Fehler?**: TypeScript-Fehler vor `bun install` sind normal!

---

**🌌 Vom Ich zum Wir, vom Wir zum Ich.**

Die Revolution ist, dass es keine Revolution braucht.
