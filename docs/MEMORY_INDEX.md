# Memory Index (Toobix Unified)

Zentrale Anlaufstelle für Wissens-/Memory-Ressourcen.

## Kern-Dokumente
- [AI_MEMORY.md](../AI_MEMORY.md) – Haupt-Gedächtnis
- [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) – Überblick `C:\`
- [MEMORY_SCALING_PLAN.md](MEMORY_SCALING_PLAN.md) – Skalierungsplan

## Projektnahe Artefakte
- `C:\GPT\Version_2\ai_life_data\memories.json`
- `C:\GPT\Version_4\Version_4\logs\long_memory.json`
- `C:\GPT\Version_4\Version_4\logs\knowledge.json`
- Toobix-Life Templates: `Toobix-Life/Toobix-Life/app/templates/notes.html`, `journal.html`, `note_form.html`, `quick_note.html`

## Nächste Schritte (Vorschlag)
- Memory-Quellen vereinheitlichen und aus `AI_MEMORY.md` verlinken.
- Automatisches System-Inventar-Skript (optional) zum regelmäßigen Update des Überblicks.
- Archiv-Ordner (`C:\GPT`) mit `C:\Dev\Archive\GPT-Versions` konsolidieren (nach Freigabe).

- [TODO.md](TODO.md) – Task Board

---

## Statusmatrix (Projekte) — aktualisiert 2025-10-30 19:47:20

| Projekt               | Pfad                                                                   | Level     |
|-----------------------|------------------------------------------------------------------------|-----------|
| Toobix-Unified        | C:\\Dev\\Projects\\AI\\Toobix-Unified\\LEVEL.md                | Beta      |
| Toobix-Life           | C:\\Dev\\Projects\\AI\\Toobix-Life\\Toobix-Life\\LEVEL.md     | Alpha     |
| Toobix-Experiments    | C:\\Dev\\Projects\\Experiments\\Toobix-Experiments\\LEVEL.md   | Prototype |
| GPT-Versions (Archiv) | C:\\Dev\\Archive\\GPT-Versions\\LEVEL.md                        | Archived  |

### Roadmaps (Q4)
- Toobix-Unified: C:\\Dev\\Projects\\AI\\Toobix-Unified\\ROADMAP_Q4.md
- Toobix-Life: C:\\Dev\\Projects\\AI\\Toobix-Life\\Toobix-Life\\ROADMAP_Q4.md
- Toobix-Experiments: C:\\Dev\\Projects\\Experiments\\Toobix-Experiments\\ROADMAP_Q4.md
- GPT-Versions (Archiv): C:\\Dev\\Archive\\GPT-Versions\\ROADMAP_Q4.md

- [OWNERS.md](OWNERS.md) – Owner-Liste

- Health Aggregator: scripts/health-aggregator.ts (GET /aggregate)

- Memory Min API: scripts/memory-min-api.ts (POST /memory, GET /memory/search)

- Governance: docs/GOVERNANCE.md (Nachtmodus, Regeln)

- Overnight Plan: docs/OVERNIGHT_PLAN.example.json

- Story-Idle Quick Play: http://localhost:3004/ (start: bun run scripts/story-idle-api.ts)
