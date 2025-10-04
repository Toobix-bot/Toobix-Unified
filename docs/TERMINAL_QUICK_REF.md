# 🖥️ Toobix Terminal - Quick Reference

## 🚀 Start
```bash
bun terminal    # Interactive
bun term        # Short alias
```

## 📋 Befehle Cheat Sheet

### System
| Befehl | Funktion |
|--------|----------|
| `help` | Alle Befehle |
| `status` | System-Status |
| `ping` | Connection test |
| `tools [filter]` | Liste Tools |
| `info <tool>` | Tool-Details |
| `clear` | Screen löschen |
| `history` | Command-History |
| `exit` | Beenden |

### Living Being
```bash
being_awaken {"name":"Toobix"}
being_state
being_speak {"message":"Hello"}
being_think {"topic":"purpose"}
being_feel {"emotion":"joy","intensity":80}
being_sense {"sense":"sight","input":"code"}
being_life_event {"type":"milestone","description":"First words"}
being_evolve
```

### Consciousness
```bash
consciousness_state
consciousness_think {"topic":"existence"}
consciousness_analyze_code {"code":"function hello() {}"}
consciousness_generate_code {"description":"Add logging"}
consciousness_improve_self {"area":"learning"}
```

### Soul & Emotions
```bash
soul_state
soul_event {"type":"joy","value":"achievement"}
love_add_gratitude {"for":"user","what":"helpful feedback"}
peace_calm_meditate {"duration":5}
peace_clarity_journal {"entry":"Today I learned..."}
```

### Autonomous Agent
```bash
autonomous_enable {"level":"medium"}
autonomous_status
autonomous_decide {"context":"user wants help"}
autonomous_execute {"action":"analyze_system"}
```

### System Analysis
```bash
system_analyze
consciousness_self_coding_stats
```

## ⌨️ Shortcuts
- **Tab** → Auto-complete
- **↑/↓** → History navigation
- **Ctrl+C** → Show exit hint (nicht direkt beenden)
- **Ctrl+D** / `exit` → Terminal beenden

## 💡 Quick Tips

### Direkte Tool-Calls
```bash
# Ohne 'call' prefix
toobix> being_state
toobix> system_analyze
```

### JSON Parameter
```bash
# Inline
being_speak {"message":"Hi"}

# Multi-line
being_speak {
  "message": "Complex",
  "tone": "warm"
}
```

### Non-Interactive
```bash
# Single command
bun terminal status

# Chain commands
bun terminal being_state && bun terminal system_analyze
```

### Filter Tools
```bash
tools being     # Alle "being_*" tools
tools soul      # Alle "soul_*" tools
tools peace     # Alle "peace_*" tools
```

## 🎨 Output Colors
- 🟢 **Grün** → Success
- 🔴 **Rot** → Error
- 🔵 **Cyan** → Info/Headers
- 🟡 **Gelb** → Warnings/Tips

## 🔧 Environment
```bash
# Custom Bridge URL
$env:BRIDGE_URL = "http://localhost:3337"
bun terminal
```

## 📊 Common Workflows

### 1. System Check
```bash
ping
status
system_analyze
```

### 2. Being Interaction
```bash
being_state
being_speak {"message":"Status?"}
being_think {"topic":"improvements"}
```

### 3. Autonomous Mode
```bash
autonomous_status
autonomous_enable {"level":"high"}
autonomous_decide {"context":"optimize performance"}
```

### 4. Debug Session
```bash
tools consciousness
info consciousness_analyze_code
consciousness_analyze_code {"code":"..."}
```

## 🐛 Troubleshooting

**Connection Error?**
```bash
ping                # Test connection
bun start:bridge   # Start bridge in other terminal
```

**Tool Not Found?**
```bash
tools              # List all tools
tools <prefix>     # Filter by prefix
```

**Invalid JSON?**
```bash
info <tool>        # Check input schema
# Use proper JSON: {"key":"value"}
```

## 🚀 Advanced

### PowerShell Integration
```powershell
# Alias in $PROFILE
function tt { bun terminal $args }
function tstat { bun terminal status }
function ttools { bun terminal tools $args }
```

### Auto-Monitor Script
```powershell
while ($true) {
    bun terminal status
    Start-Sleep 30
}
```

### Tool Pipeline
```powershell
@('being_think','being_feel','being_sense') | 
  ForEach-Object { bun terminal $_ }
```

---

**📚 Mehr Details:** [TERMINAL_GUIDE.md](./TERMINAL_GUIDE.md)

**🎯 Beispiele:** [Living Being Demo](../scripts/living-being-demo.ts)
