// Beautiful Visual Effects for Terminal UI
// Using colors, gradients, animations, and ASCII art

export const colors = {
  // Main palette
  primary: '\x1b[38;5;141m',      // Soft purple
  secondary: '\x1b[38;5;117m',    // Sky blue
  accent: '\x1b[38;5;229m',       // Warm yellow
  success: '\x1b[38;5;120m',      // Soft green
  love: '\x1b[38;5;211m',         // Pink
  peace: '\x1b[38;5;153m',        // Lavender
  wisdom: '\x1b[38;5;186m',       // Gold
  creativity: '\x1b[38;5;219m',   // Rose
  stability: '\x1b[38;5;109m',    // Teal

  // Text styles
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',

  // Special
  rainbow: [
    '\x1b[38;5;196m', // Red
    '\x1b[38;5;208m', // Orange
    '\x1b[38;5;226m', // Yellow
    '\x1b[38;5;82m',  // Green
    '\x1b[38;5;33m',  // Blue
    '\x1b[38;5;93m',  // Purple
  ],

  reset: '\x1b[0m'
}

export const symbols = {
  // Characters
  heart: '💝',
  peace: '☮️',
  wisdom: '📚',
  creativity: '🎨',
  stability: '🛡️',

  // Progress
  star: '✨',
  sparkle: '⭐',
  fire: '🔥',
  gem: '💎',
  crown: '👑',

  // Nature
  tree: '🌳',
  flower: '🌸',
  moon: '🌙',
  sun: '☀️',
  rainbow: '🌈',

  // Magic
  magic: '✨',
  wand: '🪄',
  crystal: '🔮',
  potion: '🧪',

  // UI
  arrow: '→',
  check: '✓',
  cross: '✗',
  dot: '•',

  // Bars
  barFull: '█',
  barHalf: '▌',
  barEmpty: '░',

  // Corners
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
  horizontal: '─',
  vertical: '│',
}

export function gradient(text: string, colors: string[]): string {
  let result = ''
  const step = Math.max(1, Math.floor(text.length / colors.length))

  for (let i = 0; i < text.length; i++) {
    const colorIndex = Math.min(Math.floor(i / step), colors.length - 1)
    result += colors[colorIndex] + text[i]
  }

  return result + '\x1b[0m'
}

export function rainbowText(text: string): string {
  return gradient(text, colors.rainbow)
}

export function glowText(text: string, color: string): string {
  return `${color}${colors.bold}✨ ${text} ✨${colors.reset}`
}

export function progressBar(
  current: number,
  max: number,
  width: number = 20,
  color: string = colors.primary
): string {
  const percentage = Math.max(0, Math.min(1, current / max))
  const filled = Math.floor(percentage * width)
  const empty = width - filled

  const bar = color + symbols.barFull.repeat(filled) +
              colors.dim + symbols.barEmpty.repeat(empty) +
              colors.reset

  const percent = Math.floor(percentage * 100)
  return `${bar} ${color}${percent}%${colors.reset}`
}

export function statBar(
  label: string,
  value: number,
  icon: string,
  color: string
): string {
  const bar = progressBar(value, 100, 15, color)
  return `${icon} ${color}${label}${colors.reset} ${bar} ${color}${value}/100${colors.reset}`
}

export function box(
  content: string[],
  title?: string,
  color: string = colors.primary
): string {
  const maxWidth = Math.max(
    ...content.map(line => stripAnsi(line).length),
    title ? stripAnsi(title).length : 0
  )

  const width = maxWidth + 4

  let result = ''

  // Top border
  result += color + symbols.topLeft + symbols.horizontal.repeat(width - 2) + symbols.topRight + colors.reset + '\n'

  // Title (if provided)
  if (title) {
    const padding = Math.floor((width - stripAnsi(title).length - 2) / 2)
    result += color + symbols.vertical + colors.reset
    result += ' '.repeat(padding) + title + ' '.repeat(width - padding - stripAnsi(title).length - 2)
    result += color + symbols.vertical + colors.reset + '\n'
    result += color + symbols.vertical + symbols.horizontal.repeat(width - 2) + symbols.vertical + colors.reset + '\n'
  }

  // Content
  for (const line of content) {
    const plainLength = stripAnsi(line).length
    const padding = width - plainLength - 2
    result += color + symbols.vertical + colors.reset + ' '
    result += line
    result += ' '.repeat(Math.max(0, padding - 1))
    result += color + symbols.vertical + colors.reset + '\n'
  }

  // Bottom border
  result += color + symbols.bottomLeft + symbols.horizontal.repeat(width - 2) + symbols.bottomRight + colors.reset + '\n'

  return result
}

export function banner(text: string, subtitle?: string): string {
  const width = 60

  let result = '\n'
  result += colors.primary + '═'.repeat(width) + colors.reset + '\n'

  // Main text
  const mainPadding = Math.floor((width - stripAnsi(text).length) / 2)
  result += ' '.repeat(mainPadding) + rainbowText(text) + '\n'

  // Subtitle
  if (subtitle) {
    const subPadding = Math.floor((width - stripAnsi(subtitle).length) / 2)
    result += ' '.repeat(subPadding) + colors.dim + subtitle + colors.reset + '\n'
  }

  result += colors.primary + '═'.repeat(width) + colors.reset + '\n\n'

  return result
}

export function title(text: string, level: number = 1): string {
  const styles = [
    (t: string) => glowText(t, colors.primary),
    (t: string) => `${colors.secondary}${colors.bold}${symbols.star} ${t}${colors.reset}`,
    (t: string) => `${colors.accent}${symbols.arrow} ${t}${colors.reset}`
  ]

  return styles[Math.min(level - 1, styles.length - 1)](text)
}

export function divider(char: string = '─', color: string = colors.primary): string {
  return color + char.repeat(60) + colors.reset
}

export function characterPortrait(
  name: string,
  quote: string,
  relationship: number,
  icon: string = '🌟'
): string {
  const lines = [
    `${icon} ${colors.bold}${name}${colors.reset}`,
    `${colors.dim}"${quote}"${colors.reset}`,
    '',
    statBar('Bond', relationship, symbols.heart, colors.love)
  ]

  return box(lines, undefined, colors.secondary)
}

export function achievement(
  name: string,
  description: string,
  rarity: 'common' | 'rare' | 'epic' | 'legendary' = 'common'
): string {
  const rarityColors = {
    common: colors.success,
    rare: colors.primary,
    epic: colors.creativity,
    legendary: colors.accent
  }

  const rarityIcons = {
    common: symbols.check,
    rare: symbols.star,
    epic: symbols.gem,
    legendary: symbols.crown
  }

  const color = rarityColors[rarity]
  const icon = rarityIcons[rarity]

  return glowText(`${icon} ${name}`, color) + '\n' +
         `${colors.dim}${description}${colors.reset}`
}

export function questCard(
  title: string,
  description: string,
  progress: number,
  maxProgress: number,
  rewards: string[]
): string {
  const lines = [
    `${colors.bold}${title}${colors.reset}`,
    '',
    `${colors.dim}${description}${colors.reset}`,
    '',
    `Progress: ${progressBar(progress, maxProgress, 20, colors.creativity)}`,
    '',
    `${colors.accent}Rewards:${colors.reset}`,
    ...rewards.map(r => `  ${symbols.star} ${r}`)
  ]

  return box(lines, `${symbols.magic} QUEST`, colors.accent)
}

export function levelUpEffect(newLevel: number): string {
  const art = `
    ${rainbowText('✨ ═══════════════════════════════════ ✨')}

         ${glowText('LEVEL UP!', colors.accent)}

         ${colors.primary}You are now Level ${newLevel}!${colors.reset}

         ${symbols.star.repeat(5)}

    ${rainbowText('✨ ═══════════════════════════════════ ✨')}
  `

  return art
}

// Helper function to strip ANSI codes for length calculation
function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, '')
}

export function animate(frames: string[], delayMs: number = 100): void {
  let currentFrame = 0

  const interval = setInterval(() => {
    process.stdout.write('\x1b[2J\x1b[H') // Clear screen
    console.log(frames[currentFrame])
    currentFrame = (currentFrame + 1) % frames.length
  }, delayMs)

  // Stop after showing all frames once
  setTimeout(() => clearInterval(interval), delayMs * frames.length)
}

export function typewriter(text: string, delayMs: number = 30): Promise<void> {
  return new Promise((resolve) => {
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        process.stdout.write(text[i])
        i++
      } else {
        clearInterval(interval)
        console.log() // New line
        resolve()
      }
    }, delayMs)
  })
}
