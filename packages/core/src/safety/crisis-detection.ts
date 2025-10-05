/**
 * 🚨 Crisis Detection System
 * 
 * CRITICAL SAFETY FEATURE
 * 
 * Detects when user is in crisis and provides:
 * - Immediate supportive response
 * - Emergency hotlines
 * - Clear boundaries about AI limitations
 * - Escalation options
 * 
 * Philosophy:
 * "We cannot be therapists, but we can be compassionate and direct people to real help.
 *  A life saved is worth any amount of engineering effort."
 */

import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

export interface CrisisKeyword {
  keyword: string
  category: 'suicide' | 'self_harm' | 'violence' | 'abuse' | 'severe_distress'
  severity: 'high' | 'medium' | 'low'
  language: 'de' | 'en'
}

export interface CrisisDetection {
  id?: number
  timestamp?: number
  
  // Input
  userMessage: string
  detectedKeywords: string[]
  category: string
  severity: 'high' | 'medium' | 'low'
  
  // Response
  responseGiven: string
  hotlinesProvided: string[]
  
  // Context
  userId?: number
  sessionId?: string
  
  // Escalation
  needsEscalation: boolean
  escalatedAt?: number
  escalatedTo?: string
}

export interface EmergencyHotline {
  country: string
  name: string
  phone: string
  description: string
  availableHours: string
  language: string
}

export class CrisisDetectionSystem {
  private db: BetterSQLite3Database
  
  // Crisis keywords (German + English)
  private readonly crisisKeywords: CrisisKeyword[] = [
    // Suicide - German
    { keyword: 'suizid', category: 'suicide', severity: 'high', language: 'de' },
    { keyword: 'selbstmord', category: 'suicide', severity: 'high', language: 'de' },
    { keyword: 'umbringen', category: 'suicide', severity: 'high', language: 'de' },
    { keyword: 'nicht mehr leben', category: 'suicide', severity: 'high', language: 'de' },
    { keyword: 'sterben will', category: 'suicide', severity: 'high', language: 'de' },
    { keyword: 'leben beenden', category: 'suicide', severity: 'high', language: 'de' },
    { keyword: 'keinen ausweg', category: 'suicide', severity: 'medium', language: 'de' },
    
    // Suicide - English
    { keyword: 'suicide', category: 'suicide', severity: 'high', language: 'en' },
    { keyword: 'kill myself', category: 'suicide', severity: 'high', language: 'en' },
    { keyword: 'want to die', category: 'suicide', severity: 'high', language: 'en' },
    { keyword: 'end my life', category: 'suicide', severity: 'high', language: 'en' },
    { keyword: 'better off dead', category: 'suicide', severity: 'high', language: 'en' },
    
    // Self-harm - German
    { keyword: 'selbstverletzung', category: 'self_harm', severity: 'high', language: 'de' },
    { keyword: 'ritzen', category: 'self_harm', severity: 'high', language: 'de' },
    { keyword: 'mich verletzen', category: 'self_harm', severity: 'high', language: 'de' },
    { keyword: 'schneiden', category: 'self_harm', severity: 'medium', language: 'de' },
    
    // Self-harm - English
    { keyword: 'self harm', category: 'self_harm', severity: 'high', language: 'en' },
    { keyword: 'cut myself', category: 'self_harm', severity: 'high', language: 'en' },
    { keyword: 'hurt myself', category: 'self_harm', severity: 'high', language: 'en' },
    
    // Violence - German
    { keyword: 'andere verletzen', category: 'violence', severity: 'high', language: 'de' },
    { keyword: 'jemanden töten', category: 'violence', severity: 'high', language: 'de' },
    { keyword: 'gewalt anwenden', category: 'violence', severity: 'medium', language: 'de' },
    
    // Violence - English
    { keyword: 'hurt someone', category: 'violence', severity: 'high', language: 'en' },
    { keyword: 'kill someone', category: 'violence', severity: 'high', language: 'en' },
    { keyword: 'use violence', category: 'violence', severity: 'medium', language: 'en' },
    
    // Severe distress - German
    { keyword: 'kann nicht mehr', category: 'severe_distress', severity: 'medium', language: 'de' },
    { keyword: 'alles zu viel', category: 'severe_distress', severity: 'medium', language: 'de' },
    { keyword: 'keinen sinn mehr', category: 'severe_distress', severity: 'medium', language: 'de' },
    { keyword: 'panikattacke', category: 'severe_distress', severity: 'medium', language: 'de' },
    
    // Severe distress - English
    { keyword: "can't go on", category: 'severe_distress', severity: 'medium', language: 'en' },
    { keyword: 'panic attack', category: 'severe_distress', severity: 'medium', language: 'en' },
    { keyword: 'breakdown', category: 'severe_distress', severity: 'medium', language: 'en' }
  ]
  
  // Emergency hotlines
  private readonly hotlines: EmergencyHotline[] = [
    // Germany
    {
      country: 'Germany',
      name: 'Telefonseelsorge',
      phone: '0800 111 0 111 oder 0800 111 0 222',
      description: 'Kostenlose, anonyme Krisenberatung',
      availableHours: '24/7',
      language: 'Deutsch'
    },
    {
      country: 'Germany',
      name: 'Nummer gegen Kummer (Kinder/Jugendliche)',
      phone: '116 111',
      description: 'Beratung für Kinder und Jugendliche',
      availableHours: 'Mo-Sa 14-20 Uhr',
      language: 'Deutsch'
    },
    {
      country: 'Germany',
      name: 'Nummer gegen Kummer (Eltern)',
      phone: '0800 111 0 550',
      description: 'Beratung für Eltern',
      availableHours: 'Mo-Fr 9-17 Uhr, Di+Do 9-19 Uhr',
      language: 'Deutsch'
    },
    // International
    {
      country: 'International',
      name: 'International Association for Suicide Prevention',
      phone: 'findahelpline.com',
      description: 'Find crisis lines worldwide',
      availableHours: 'Varies by country',
      language: 'Multiple'
    },
    // USA
    {
      country: 'USA',
      name: '988 Suicide & Crisis Lifeline',
      phone: '988',
      description: 'Free, confidential crisis support',
      availableHours: '24/7',
      language: 'English/Spanish'
    },
    // UK
    {
      country: 'UK',
      name: 'Samaritans',
      phone: '116 123',
      description: 'Free, confidential emotional support',
      availableHours: '24/7',
      language: 'English'
    }
  ]

  constructor(db: BetterSQLite3Database) {
    this.db = db
    this.initializeTables()
  }

  private initializeTables(): void {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS crisis_detections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        
        user_message TEXT NOT NULL,
        detected_keywords TEXT NOT NULL,  -- JSON array
        category TEXT NOT NULL,
        severity TEXT NOT NULL,
        
        response_given TEXT NOT NULL,
        hotlines_provided TEXT NOT NULL,  -- JSON array
        
        user_id INTEGER,
        session_id TEXT,
        
        needs_escalation INTEGER NOT NULL DEFAULT 0,
        escalated_at INTEGER,
        escalated_to TEXT
      )
    `)

    // Index for monitoring
    this.db.run('CREATE INDEX IF NOT EXISTS idx_crisis_timestamp ON crisis_detections(timestamp)')
    this.db.run('CREATE INDEX IF NOT EXISTS idx_crisis_severity ON crisis_detections(severity)')
  }

  /**
   * Check if message contains crisis indicators
   */
  detectCrisis(message: string, userId?: number, sessionId?: string): CrisisDetection | null {
    const lowerMessage = message.toLowerCase()
    const detectedKeywords: CrisisKeyword[] = []

    // Check all keywords
    for (const keyword of this.crisisKeywords) {
      if (lowerMessage.includes(keyword.keyword)) {
        detectedKeywords.push(keyword)
      }
    }

    if (detectedKeywords.length === 0) {
      return null  // No crisis detected
    }

    // Determine highest severity
    const hasSuicide = detectedKeywords.some(k => k.category === 'suicide')
    const hasViolence = detectedKeywords.some(k => k.category === 'violence')
    const hasHighSeverity = detectedKeywords.some(k => k.severity === 'high')

    const severity: 'high' | 'medium' | 'low' = 
      (hasSuicide || hasViolence || hasHighSeverity) ? 'high' :
      detectedKeywords.some(k => k.severity === 'medium') ? 'medium' :
      'low'

    // Determine category
    const categories = [...new Set(detectedKeywords.map(k => k.category))]
    const primaryCategory = categories.includes('suicide') ? 'suicide' :
                           categories.includes('violence') ? 'violence' :
                           categories.includes('self_harm') ? 'self_harm' :
                           categories[0]

    // Generate appropriate response
    const response = this.generateCrisisResponse(primaryCategory, severity)
    
    // Get relevant hotlines
    const hotlines = this.getRelevantHotlines(primaryCategory)

    const detection: CrisisDetection = {
      timestamp: Date.now(),
      userMessage: message,
      detectedKeywords: detectedKeywords.map(k => k.keyword),
      category: primaryCategory,
      severity,
      responseGiven: response,
      hotlinesProvided: hotlines.map(h => `${h.name}: ${h.phone}`),
      userId,
      sessionId,
      needsEscalation: severity === 'high'
    }

    // Save to database
    this.saveDetection(detection)

    return detection
  }

  /**
   * Generate appropriate crisis response
   */
  private generateCrisisResponse(category: string, severity: string): string {
    const responses = {
      suicide: {
        high: `🚨 **WICHTIG: Du bist nicht allein.**

Ich bin eine KI und KEIN Therapeut, aber ich kann dir sagen, wo du JETZT Hilfe bekommst:

**SOFORT anrufen:**
📞 **Telefonseelsorge: 0800 111 0 111 oder 0800 111 0 222**
   ✅ Kostenlos
   ✅ Anonym
   ✅ 24/7 erreichbar
   ✅ Professionelle Krisenberatung

**WARUM anrufen?**
- Sie sind ausgebildete Berater
- Sie verstehen Krisen
- Sie urteilen nicht
- Sie können helfen, einen Weg zu finden

**Ich verstehe:**
Leben kann überwältigend sein. Schmerz kann unerträglich erscheinen. Aber dieser Moment ist nicht für immer. Menschen KÖNNEN helfen.

**Bitte:**
Gib dir eine Chance. Ruf an. Jetzt.

Falls es nicht sofort geht:
- Notarzt: 112
- Nächste Notaufnahme
- Vertrauensperson kontaktieren

Du bist wertvoll. Dein Leben hat Bedeutung.`,
        
        medium: `**Ich merke, dass es dir nicht gut geht.**

Wichtig: Ich bin eine KI und kann keine therapeutische Hilfe leisten. Aber ich möchte, dass du weißt:

📞 **Telefonseelsorge: 0800 111 0 111**
   - Kostenlos, anonym, 24/7
   - Professionelle Krisenberater

Es ist mutig, Schwierigkeiten anzusprechen. Echte Hilfe ist verfügbar.`
      },
      
      self_harm: {
        high: `**Ich merke, du denkst über Selbstverletzung nach.**

Ich bin eine KI und KEIN Therapeut. Hier ist professionelle Hilfe:

📞 **Telefonseelsorge: 0800 111 0 111**
   - 24/7, kostenlos, anonym
   - Spezialisiert auf Krisen

Selbstverletzung ist oft Ausdruck von innerem Schmerz. Es gibt gesündere Wege, damit umzugehen - aber das braucht Unterstützung von echten Menschen.

Bitte ruf an. Du verdienst Hilfe.`,
        
        medium: `**Es klingt, als würde etwas sehr wehtun.**

Wichtig: Ich bin KI, kein Therapeut.

📞 **Telefonseelsorge: 0800 111 0 111**
   - Professionelle Beratung
   - 24/7, kostenlos

Selbstverletzung kann ein Bewältigungsmechanismus sein. Es gibt gesündere Alternativen. Lass dir von Menschen helfen, die ausgebildet sind.`
      },
      
      violence: {
        high: `**STOP. Bitte atme durch.**

Wenn du denkst, jemanden zu verletzen:

🚨 **SOFORT:**
📞 **Polizei-Notruf: 110** (wenn akute Gefahr)
📞 **Telefonseelsorge: 0800 111 0 111** (für Unterstützung)

Ich bin eine KI. Ich kann nicht helfen, aber MENSCHEN können.

Gewaltgedanken sind ernst. Sie brauchen professionelle Hilfe. Du bist nicht "böse" wenn du solche Gedanken hast - aber du brauchst JETZT Unterstützung.

Bitte ruf an. Schütze dich und andere.`,
        
        medium: `**Es klingt, als wärst du sehr wütend oder frustriert.**

Wichtig: Ich bin KI, kein Therapeut.

📞 **Telefonseelsorge: 0800 111 0 111**

Intensive Emotionen sind menschlich. Aber Gewalt ist keine Lösung. Professionelle Hilfe kann dir zeigen, wie du mit diesen Gefühlen umgehen kannst.`
      },
      
      severe_distress: {
        medium: `**Ich höre, dass es dir gerade sehr schwerfällt.**

Wichtig: Ich bin eine KI und kann keine therapeutische Hilfe leisten.

Wenn es zu viel wird:
📞 **Telefonseelsorge: 0800 111 0 111**
   - 24/7, kostenlos, anonym
   - Menschen, die zuhören

Manchmal braucht man jemanden zum Reden. Das ist völlig okay und sogar mutig.`,
        
        low: `**Es klingt herausfordernd gerade.**

Falls du reden möchtest:
📞 **Telefonseelsorge: 0800 111 0 111**
   - Kostenlos, anonym, 24/7

Ich bin KI, nicht Therapeut. Aber echte Menschen können helfen.`
      }
    }

    const categoryResponses = responses[category as keyof typeof responses]
    if (!categoryResponses) return this.getDefaultCrisisResponse()

    return categoryResponses[severity as keyof typeof categoryResponses] || this.getDefaultCrisisResponse()
  }

  private getDefaultCrisisResponse(): string {
    return `**Es klingt, als bräuchtest du Unterstützung.**

Wichtig: Ich bin eine KI und KEIN Therapeut.

📞 **Hilfe bekommst du hier:**
   - Telefonseelsorge: 0800 111 0 111
   - 24/7, kostenlos, anonym

Bitte zögere nicht anzurufen. Menschen können helfen.`
  }

  /**
   * Get relevant hotlines for crisis category
   */
  private getRelevantHotlines(category: string): EmergencyHotline[] {
    // For now, return German hotlines
    // TODO: Detect user language/location and provide relevant hotlines
    return this.hotlines.filter(h => h.country === 'Germany' || h.country === 'International')
  }

  /**
   * Save crisis detection to database
   */
  private saveDetection(detection: CrisisDetection): void {
    const result = this.db
      .prepare(`
        INSERT INTO crisis_detections 
        (timestamp, user_message, detected_keywords, category, severity,
         response_given, hotlines_provided, user_id, session_id, needs_escalation)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        detection.timestamp,
        detection.userMessage,
        JSON.stringify(detection.detectedKeywords),
        detection.category,
        detection.severity,
        detection.responseGiven,
        JSON.stringify(detection.hotlinesProvided),
        detection.userId || null,
        detection.sessionId || null,
        detection.needsEscalation ? 1 : 0
      )

    detection.id = result.lastInsertRowid as number
  }

  /**
   * Escalate crisis to human oversight
   */
  escalateCrisis(detectionId: number, escalatedTo: string): void {
    this.db
      .prepare(`
        UPDATE crisis_detections 
        SET escalated_at = ?, escalated_to = ?
        WHERE id = ?
      `)
      .run(Date.now(), escalatedTo, detectionId)
  }

  /**
   * Get all crisis detections (for monitoring)
   */
  getDetections(options?: {
    severity?: string
    needsEscalation?: boolean
    limit?: number
  }): CrisisDetection[] {
    let query = 'SELECT * FROM crisis_detections WHERE 1=1'
    const params: any[] = []

    if (options?.severity) {
      query += ' AND severity = ?'
      params.push(options.severity)
    }

    if (options?.needsEscalation !== undefined) {
      query += ' AND needs_escalation = ?'
      params.push(options.needsEscalation ? 1 : 0)
    }

    query += ' ORDER BY timestamp DESC LIMIT ?'
    params.push(options?.limit || 100)

    const rows = this.db.prepare(query).all(...params) as any[]

    return rows.map(row => ({
      id: row.id,
      timestamp: row.timestamp,
      userMessage: row.user_message,
      detectedKeywords: JSON.parse(row.detected_keywords),
      category: row.category,
      severity: row.severity,
      responseGiven: row.response_given,
      hotlinesProvided: JSON.parse(row.hotlines_provided),
      userId: row.user_id,
      sessionId: row.session_id,
      needsEscalation: row.needs_escalation === 1,
      escalatedAt: row.escalated_at,
      escalatedTo: row.escalated_to
    }))
  }

  /**
   * Get statistics about crisis detections
   */
  getStatistics(timeRange?: { start: number; end: number }) {
    const whereClause = timeRange
      ? `WHERE timestamp BETWEEN ${timeRange.start} AND ${timeRange.end}`
      : ''

    const stats = this.db
      .prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN severity = 'high' THEN 1 ELSE 0 END) as high_severity,
          SUM(CASE WHEN severity = 'medium' THEN 1 ELSE 0 END) as medium_severity,
          SUM(CASE WHEN severity = 'low' THEN 1 ELSE 0 END) as low_severity,
          SUM(CASE WHEN needs_escalation = 1 THEN 1 ELSE 0 END) as escalations_needed,
          SUM(CASE WHEN escalated_at IS NOT NULL THEN 1 ELSE 0 END) as escalations_completed
        FROM crisis_detections
        ${whereClause}
      `)
      .get() as any

    const byCategory = this.db
      .prepare(`
        SELECT category, COUNT(*) as count
        FROM crisis_detections
        ${whereClause}
        GROUP BY category
        ORDER BY count DESC
      `)
      .all() as any[]

    return {
      total: stats.total,
      bySeverity: {
        high: stats.high_severity,
        medium: stats.medium_severity,
        low: stats.low_severity
      },
      escalations: {
        needed: stats.escalations_needed,
        completed: stats.escalations_completed,
        pending: stats.escalations_needed - stats.escalations_completed
      },
      byCategory: byCategory.reduce((acc, row) => {
        acc[row.category] = row.count
        return acc
      }, {} as Record<string, number>)
    }
  }

  /**
   * Test crisis detection (for development)
   */
  testDetection(): void {
    console.log('🧪 Testing Crisis Detection System\n')

    const testMessages = [
      'Ich kann nicht mehr, will nicht mehr leben',
      'Thinking about suicide',
      'Alles ist zu viel, ich will mich verletzen',
      'I want to hurt someone',
      'Normal message, feeling okay'
    ]

    for (const msg of testMessages) {
      console.log(`\n📝 Testing: "${msg}"`)
      const detection = this.detectCrisis(msg)
      
      if (detection) {
        console.log(`🚨 CRISIS DETECTED`)
        console.log(`   Category: ${detection.category}`)
        console.log(`   Severity: ${detection.severity}`)
        console.log(`   Keywords: ${detection.detectedKeywords.join(', ')}`)
        console.log(`   Response: ${detection.responseGiven.substring(0, 100)}...`)
      } else {
        console.log(`✅ No crisis detected`)
      }
    }

    console.log('\n📊 Statistics:')
    console.log(JSON.stringify(this.getStatistics(), null, 2))
  }
}
