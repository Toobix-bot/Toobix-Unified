// SVG Scene Generator
// Creates beautiful, shareable visual scenes

export interface SceneData {
  luna: {
    mood: 'peaceful' | 'excited' | 'loving' | 'wise' | 'thoughtful'
    relationship: number
    level: number
  }
  player: {
    name: string
    level: number
    xp: number
    xpToNext: number
  }
  stats: {
    love: number
    peace: number
    wisdom: number
    creativity: number
    stability: number
  }
  quest?: {
    name: string
    progress: number
    total: number
  }
  weather: 'sunny' | 'cloudy' | 'rainy' | 'starry'
  time: 'dawn' | 'day' | 'dusk' | 'night'
}

export class SVGSceneGenerator {
  private width = 800
  private height = 600

  // Generate complete scene
  generateScene(data: SceneData): string {
    const sky = this.generateSky(data.weather, data.time)
    const landscape = this.generateLandscape()
    const luna = this.generateLuna(data.luna, 200, 250)
    const player = this.generatePlayer(data.player, 500, 250)
    const stats = this.generateStatsDisplay(data.stats, 20, 400)
    const questBanner = data.quest ? this.generateQuestBanner(data.quest, 200, 50) : ''

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${this.generateGradients()}
    ${this.generateFilters()}
  </defs>

  <!-- Sky -->
  ${sky}

  <!-- Landscape -->
  ${landscape}

  <!-- Characters -->
  ${luna}
  ${player}

  <!-- UI Elements -->
  ${stats}
  ${questBanner}

  <!-- Decorations -->
  ${this.generateDecorations(data.weather)}
</svg>`
  }

  private generateSky(weather: string, time: string): string {
    const skyColors = {
      'sunny-day': ['#87CEEB', '#E0F6FF'],
      'sunny-dusk': ['#FF6B6B', '#FFE66D'],
      'sunny-night': ['#1a1a2e', '#16213e'],
      'cloudy-day': ['#B0C4DE', '#D3D3D3'],
      'rainy-day': ['#708090', '#A9A9A9'],
      'starry-night': ['#0f0c29', '#302b63', '#24243e']
    }

    const key = `${weather}-${time}`
    const colors = skyColors[key as keyof typeof skyColors] || skyColors['sunny-day']

    return `
  <rect width="${this.width}" height="${this.height}" fill="url(#skyGradient)"/>
  <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
    <stop offset="100%" style="stop-color:${colors[1] || colors[0]};stop-opacity:1" />
  </linearGradient>
    `
  }

  private generateLandscape(): string {
    return `
  <!-- Ground -->
  <rect y="400" width="${this.width}" height="200" fill="#2d5016" />

  <!-- Trees -->
  <g class="tree">
    <rect x="100" y="350" width="20" height="80" fill="#8B4513"/>
    <circle cx="110" cy="340" r="40" fill="#228B22"/>
  </g>
  <g class="tree">
    <rect x="650" y="350" width="20" height="80" fill="#8B4513"/>
    <circle cx="660" cy="340" r="40" fill="#228B22"/>
  </g>

  <!-- Castle -->
  <g class="castle">
    <rect x="350" y="300" width="100" height="100" fill="#696969"/>
    <polygon points="350,300 400,250 450,300" fill="#A9A9A9"/>
    <rect x="380" y="350" width="40" height="50" fill="#4B4B4B"/>
  </g>
    `
  }

  private generateLuna(luna: SceneData['luna'], x: number, y: number): string {
    const moodEmojis = {
      peaceful: '😌',
      excited: '🤩',
      loving: '🥰',
      wise: '🧘‍♀️',
      thoughtful: '🤔'
    }

    const glowIntensity = luna.relationship / 100

    return `
  <g class="luna" transform="translate(${x}, ${y})">
    <!-- Glow effect -->
    <circle r="${40 + glowIntensity * 20}" fill="url(#lunaGlow)" opacity="${glowIntensity}"/>

    <!-- Moon body -->
    <circle r="40" fill="#FFE4B5" filter="url(#softGlow)"/>

    <!-- Craters -->
    <circle cx="-10" cy="-5" r="8" fill="#F5DEB3"/>
    <circle cx="15" cy="10" r="5" fill="#F5DEB3"/>

    <!-- Mood indicator -->
    <text x="0" y="60" text-anchor="middle" font-size="24">${moodEmojis[luna.mood]}</text>

    <!-- Level -->
    <text x="0" y="-60" text-anchor="middle" fill="#FFD700" font-size="16" font-weight="bold">
      Lv.${luna.level}
    </text>

    <!-- Relationship hearts -->
    ${this.generateHearts(luna.relationship, 0, 80)}
  </g>

  <radialGradient id="lunaGlow">
    <stop offset="0%" style="stop-color:#FFE4B5;stop-opacity:0.8" />
    <stop offset="100%" style="stop-color:#FFE4B5;stop-opacity:0" />
  </radialGradient>
    `
  }

  private generatePlayer(player: SceneData['player'], x: number, y: number): string {
    const xpPercent = (player.xp / player.xpToNext) * 100

    return `
  <g class="player" transform="translate(${x}, ${y})">
    <!-- Character -->
    <circle r="35" fill="#4A90E2"/>
    <text x="0" y="10" text-anchor="middle" font-size="40">👤</text>

    <!-- Name -->
    <text x="0" y="-55" text-anchor="middle" fill="#fff" font-size="18" font-weight="bold">
      ${player.name}
    </text>

    <!-- Level -->
    <text x="0" y="-35" text-anchor="middle" fill="#FFD700" font-size="16">
      Level ${player.level}
    </text>

    <!-- XP Bar -->
    <rect x="-40" y="50" width="80" height="8" fill="#333" rx="4"/>
    <rect x="-40" y="50" width="${(xpPercent / 100) * 80}" height="8" fill="#4CAF50" rx="4"/>
    <text x="0" y="70" text-anchor="middle" font-size="10" fill="#fff">
      ${player.xp}/${player.xpToNext} XP
    </text>
  </g>
    `
  }

  private generateStatsDisplay(stats: SceneData['stats'], x: number, y: number): string {
    const statData = [
      { name: 'Love', value: stats.love, color: '#FF69B4', icon: '💝' },
      { name: 'Peace', value: stats.peace, color: '#87CEEB', icon: '☮️' },
      { name: 'Wisdom', value: stats.wisdom, color: '#FFD700', icon: '📚' },
      { name: 'Creativity', value: stats.creativity, color: '#DA70D6', icon: '🎨' },
      { name: 'Stability', value: stats.stability, color: '#20B2AA', icon: '🛡️' }
    ]

    return `
  <g class="stats" transform="translate(${x}, ${y})">
    <rect width="250" height="180" fill="rgba(0,0,0,0.7)" rx="10"/>
    <text x="125" y="25" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold">
      Your Essence
    </text>

    ${statData.map((stat, i) => `
      <g transform="translate(10, ${40 + i * 28})">
        <text x="0" y="0" font-size="14">${stat.icon}</text>
        <text x="25" y="0" fill="#fff" font-size="12">${stat.name}</text>
        <rect x="100" y="-10" width="130" height="14" fill="#333" rx="7"/>
        <rect x="100" y="-10" width="${stat.value * 1.3}" height="14" fill="${stat.color}" rx="7"/>
        <text x="235" y="0" fill="#fff" font-size="10" text-anchor="end">${stat.value}</text>
      </g>
    `).join('')}
  </g>
    `
  }

  private generateQuestBanner(quest: SceneData['quest'], x: number, y: number): string {
    const progress = (quest.progress / quest.total) * 100

    return `
  <g class="quest" transform="translate(${x}, ${y})">
    <rect width="400" height="60" fill="rgba(255,215,0,0.9)" rx="10" filter="url(#softGlow)"/>

    <text x="200" y="25" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">
      ⭐ ${quest.name}
    </text>

    <rect x="20" y="35" width="360" height="15" fill="#333" rx="7"/>
    <rect x="20" y="35" width="${(progress / 100) * 360}" height="15" fill="#4CAF50" rx="7"/>
    <text x="200" y="47" text-anchor="middle" font-size="10" fill="#fff">
      ${quest.progress}/${quest.total} Milestones
    </text>
  </g>
    `
  }

  private generateHearts(relationship: number, x: number, y: number): string {
    const fullHearts = Math.floor(relationship / 20)
    const hearts = []

    for (let i = 0; i < 5; i++) {
      const fill = i < fullHearts ? '#FF1493' : '#333'
      hearts.push(`<text x="${(i - 2) * 20}" y="${y}" font-size="16" fill="${fill}">💝</text>`)
    }

    return hearts.join('')
  }

  private generateDecorations(weather: string): string {
    if (weather === 'rainy') {
      return this.generateRain()
    } else if (weather === 'starry') {
      return this.generateStars()
    } else if (weather === 'sunny') {
      return this.generateSun()
    }
    return ''
  }

  private generateRain(): string {
    const drops = []
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * this.width
      const y = Math.random() * 300
      const animDuration = 1 + Math.random()
      drops.push(`
        <line x1="${x}" y1="${y}" x2="${x}" y2="${y + 20}" stroke="#6BA3D4" stroke-width="2" opacity="0.6">
          <animate attributeName="y1" from="${y}" to="${y + 400}" dur="${animDuration}s" repeatCount="indefinite"/>
          <animate attributeName="y2" from="${y + 20}" to="${y + 420}" dur="${animDuration}s" repeatCount="indefinite"/>
        </line>
      `)
    }
    return drops.join('')
  }

  private generateStars(): string {
    const stars = []
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * this.width
      const y = Math.random() * 400
      const size = 1 + Math.random() * 2
      stars.push(`<circle cx="${x}" cy="${y}" r="${size}" fill="#FFF" opacity="0.8"/>`)
    }
    return stars.join('')
  }

  private generateSun(): string {
    return `
      <circle cx="700" cy="100" r="50" fill="#FFD700" filter="url(#softGlow)"/>
      <circle cx="700" cy="100" r="60" fill="#FFD700" opacity="0.3"/>
    `
  }

  private generateGradients(): string {
    return `
      <radialGradient id="lunaGlow">
        <stop offset="0%" style="stop-color:#FFE4B5;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#FFE4B5;stop-opacity:0" />
      </radialGradient>
    `
  }

  private generateFilters(): string {
    return `
      <filter id="softGlow">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    `
  }

  // Save to file
  async saveScene(svg: string, filename: string): Promise<void> {
    const path = `./visual-scenes/${filename}.svg`
    await Bun.write(path, svg)
    console.log(`✅ Scene saved: ${path}`)
  }
}
