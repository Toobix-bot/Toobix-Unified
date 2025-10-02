# Toobix Unified Deployment Guide

**Version:** 1.0.0  
**Target Platforms:** Vercel, Netlify, Self-Hosted

---

## 🚀 QUICK DEPLOY - VERCEL (Empfohlen)

### Voraussetzungen
- Vercel Account (kostenlos)
- GitHub Repository connected
- Environment Variables bereit

### Schritt 1: Vercel CLI installieren
```powershell
npm i -g vercel
```

### Schritt 2: Login
```powershell
vercel login
```

### Schritt 3: Projekt Setup
```powershell
cd C:\Toobix-Unified
vercel
```

**Fragen beantworten:**
- Set up and deploy? → **Yes**
- Which scope? → **Toobix-bot**
- Link to existing project? → **No**
- What's your project's name? → **toobix-unified**
- In which directory is your code? → **./**
- Want to override settings? → **No**

### Schritt 4: Environment Variables setzen
```powershell
# Im Vercel Dashboard oder via CLI:
vercel env add GROQ_API_KEY production
# Wert eingeben: <your_groq_api_key_from_version_7>

vercel env add DATABASE_URL production
# Wert: ./data/toobix-unified.db

vercel env add API_PORT production
# Wert: 3001
```

### Schritt 5: Deployment
```powershell
# Preview Deployment
vercel

# Production Deployment
vercel --prod
```

**Fertig!** Deine App läuft jetzt auf:
- Preview: `https://toobix-unified-xxx.vercel.app`
- Production: `https://toobix-unified.vercel.app`

---

## 🌐 NETLIFY DEPLOYMENT

### Schritt 1: Netlify CLI
```powershell
npm i -g netlify-cli
netlify login
```

### Schritt 2: Deploy
```powershell
cd C:\Toobix-Unified
netlify init
```

### Schritt 3: Build Settings
```toml
# netlify.toml
[build]
  command = "bun install && bun run build"
  publish = "apps/web"
  functions = "scripts"

[build.environment]
  NODE_VERSION = "20"
  
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Schritt 4: Deploy
```powershell
netlify deploy --prod
```

---

## 🐳 DOCKER DEPLOYMENT

### Dockerfile
```dockerfile
FROM oven/bun:1.2.23

WORKDIR /app

# Dependencies
COPY package.json bun.lock ./
RUN bun install

# App
COPY . .

# Build
RUN bun run build

# Ports
EXPOSE 3000 3001

# Start
CMD ["bun", "run", "scripts/api-server.ts"]
```

### Build & Run
```powershell
# Build
docker build -t toobix-unified .

# Run
docker run -p 3000:3000 -p 3001:3001 `
  -e GROQ_API_KEY=your_key `
  -e DATABASE_URL=./data/toobix-unified.db `
  -v C:\Toobix-Unified\data:/app/data `
  toobix-unified
```

### Docker Compose
```yaml
version: '3.8'

services:
  toobix-unified:
    build: .
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      - GROQ_API_KEY=${GROQ_API_KEY}
      - DATABASE_URL=./data/toobix-unified.db
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

**Start:**
```powershell
docker-compose up -d
```

---

## ☁️ SELF-HOSTED (VPS)

### DigitalOcean / Hetzner / AWS

#### 1. Server Setup (Ubuntu 22.04)
```bash
# Update
sudo apt update && sudo apt upgrade -y

# Install Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Install Node.js (fallback)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git
```

#### 2. Clone & Setup
```bash
# Clone
git clone https://github.com/Toobix-bot/Toobix-Unified.git
cd Toobix-Unified

# Environment
cp .env.example .env
nano .env  # Set GROQ_API_KEY

# Dependencies
bun install

# Build
bun run build
```

#### 3. Process Manager (PM2)
```bash
# Install PM2
npm install -g pm2

# Start API Server
pm2 start "bun run scripts/api-server.ts" --name toobix-api

# Start Dev Server
pm2 start "bun run dev-server" --name toobix-web

# Save
pm2 save
pm2 startup
```

#### 4. Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name toobix.example.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Enable Site
sudo ln -s /etc/nginx/sites-available/toobix /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d toobix.example.com
```

---

## 🔐 ENVIRONMENT VARIABLES

### Required
- `GROQ_API_KEY` - Groq API Key (von Version_7)
- `DATABASE_URL` - SQLite Database Path

### Optional
- `API_PORT` - API Server Port (default: 3001)
- `DEV_PORT` - Dev Server Port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging Level (info/debug/error)

### Vercel Setup
```powershell
vercel env add GROQ_API_KEY production
vercel env add DATABASE_URL production
```

### Netlify Setup
```powershell
netlify env:set GROQ_API_KEY your_key
netlify env:set DATABASE_URL ./data/toobix-unified.db
```

---

## 📊 MONITORING

### Vercel Analytics
- Automatisch aktiviert
- Dashboard: https://vercel.com/toobix-bot/toobix-unified/analytics

### Custom Monitoring
```typescript
// scripts/api-server.ts
import { track } from '@vercel/analytics/server';

app.get('/api/stats', async (req, res) => {
  track('api_call', { endpoint: '/stats' });
  // ... rest of code
});
```

### Health Check Endpoint
```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected'
  });
});
```

---

## 🔄 CI/CD - GITHUB ACTIONS

### Workflow erstellen
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: 1.2.23
      
      - name: Install Dependencies
        run: bun install
      
      - name: Run Tests
        run: bun test
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## ✅ POST-DEPLOYMENT CHECKS

### 1. Frontend Check
```powershell
curl https://toobix-unified.vercel.app
# Sollte HTML zurückgeben
```

### 2. API Check
```powershell
curl https://toobix-unified.vercel.app/api/stats
# Sollte JSON mit Stats zurückgeben
```

### 3. Luna Chatbot Check
```powershell
curl -X POST https://toobix-unified.vercel.app/api/luna/chat `
  -H "Content-Type: application/json" `
  -d '{"message": "Hi Luna!"}'
# Sollte Luna Response zurückgeben
```

### 4. Database Check
```powershell
curl https://toobix-unified.vercel.app/api/people
# Sollte 5 People zurückgeben
```

---

## 🐛 TROUBLESHOOTING

### Error: "Bun not found"
```powershell
# Vercel: Add Bun runtime in vercel.json
# Siehe vercel.json Beispiel oben
```

### Error: "Database not found"
```powershell
# Ensure DATABASE_URL points to correct path
# For Vercel: Use relative path ./data/toobix-unified.db
```

### Error: "Groq API Key invalid"
```powershell
# Check environment variable
vercel env ls
# Update if needed
vercel env rm GROQ_API_KEY production
vercel env add GROQ_API_KEY production
```

---

## 📚 WEITERE RESSOURCEN

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Bun Docs](https://bun.sh/docs)
- [Drizzle ORM](https://orm.drizzle.team)

---

**Status:** Deployment-Guide komplett! 🚀
**Empfehlung:** Starte mit Vercel (am einfachsten)
