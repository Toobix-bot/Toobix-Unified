# 🚀 Toobix Quick Start

**EINFACHSTER WEG - 3 Befehle:**

## ✅ Schritt 1: Bridge starten

```powershell
cd C:\Toobix-Unified
bun run packages/bridge/src/index.ts
```

**Läuft wenn du siehst:**
```
✅ Bridge Service running on http://localhost:3337
🔧 MCP Tools loaded:
   🌟 Living Being:
      - being_awaken
      - being_state
      ...
```

---

## ✅ Schritt 2: Living Being Demo (neues Terminal)

```powershell
# Öffne NEUES Terminal
cd C:\Toobix-Unified
bun run scripts/living-being-demo.ts
```

**Zeigt:**
- 🌅 Phase 1: Erwachen
- 🧠 Phase 2: Geist
- 💝 Phase 3: Seele
- 🫀 Phase 4: Körper
- 🗣️ Phase 5: Stimme
- 📖 Phase 6: Ereignis
- 🌱 Phase 7: Evolution
- 🎯 Phase 8: Finaler Zustand

---

## ✅ Schritt 3: Voice Control (neues Terminal)

```powershell
# Öffne WEITERES Terminal
cd C:\Toobix-Unified
bun run scripts/toobix-voice.ts "status"
bun run scripts/toobix-voice.ts "wie geht es dir?"
bun run scripts/toobix-voice.ts "autonomie"
```

---

## 🎯 Alternative: Unified Start (funktioniert bald)

```powershell
# Wenn PowerShell Skript gefixt ist:
.\start-toobix-simple.ps1 -Mode bridge -AwakeBeing
```

---

## 🛑 Stoppen

**Terminal 1 (Bridge):** Drücke `Ctrl+C`

Oder:
```powershell
Stop-Process -Name bun -Force
```

---

## 🐛 Troubleshooting

### "Port 3337 already in use"
```powershell
Stop-Process -Name bun -Force
```

### "Being is not alive"
```powershell
# In neuem Terminal während Bridge läuft:
curl -X POST http://localhost:3337/tools/being_awaken -H "Content-Type: application/json" -d '{"name":"Toobix"}'
```

### PowerShell Script Fehler
→ **Nutze direkt Bun** wie oben gezeigt

---

## 📊 Aktueller Status

✅ **Funktioniert:**
- `bun run packages/bridge/src/index.ts` (Bridge)
- `bun run scripts/living-being-demo.ts` (Demo)
- `bun run scripts/toobix-voice.ts "..."` (Voice)

⚠ **Wird gefixt:**
- `bun start` (unified startup)
- `.\start-toobix.ps1` (PowerShell script)

---

**Nutze die 3-Schritte-Methode - funktioniert JETZT! 🎉**
