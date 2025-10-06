/**
 * 📊 MOMENT ANALYTICS ENGINE
 * 
 * Erweiterte Analyse-Features für Moment-Stream:
 * - Trend-Analyse
 * - Emotion-Clustering
 * - Pattern-Recognition
 * - Export-Funktionen
 * - Visualisierungen
 * 
 * Port: 9996
 */

import { db } from '../packages/core/src/db';
import { moments } from '../packages/core/src/db/schema';
import { desc, gte, and, sql } from 'drizzle-orm';

// ============================================================================
// TYPES
// ============================================================================

interface TrendAnalysis {
    period: string;
    avgEthicsScore: number;
    totalMoments: number;
    topFeelings: { feeling: string; count: number; }[];
    needsAttentionRate: number;
    depthDistribution: Record<number, number>;
}

interface EmotionCluster {
    name: string;
    emotions: string[];
    centeroid: string;
    size: number;
    avgEthics: number;
}

interface Pattern {
    type: string;
    description: string;
    frequency: number;
    confidence: number;
    examples: any[];
}

interface ExportData {
    format: 'json' | 'csv' | 'markdown';
    timeRange: { start: number; end: number; };
    data: any[];
    metadata: {
        exportedAt: number;
        totalMoments: number;
        filters: any;
    };
}

// ============================================================================
// ANALYTICS ENGINE
// ============================================================================

class MomentAnalyticsEngine {
    private isRunning: boolean = false;
    private port = 9996;
    private cache: Map<string, any> = new Map();

    async start() {
        console.log('\n📊 MOMENT ANALYTICS ENGINE STARTING...\n');

        this.isRunning = true;

        // Start HTTP server
        await this.startServer();

        // Start background analytics
        this.startBackgroundAnalytics();

        console.log('✅ Analytics Engine is active\n');

        // Keep alive
        setInterval(() => {
            if (!this.isRunning) process.exit(0);
        }, 1000);
    }

    /**
     * Start HTTP server
     */
    private async startServer() {
        const self = this;

        const server = Bun.serve({
            port: this.port,
            async fetch(req) {
                const url = new URL(req.url);
                const corsHeaders = {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                };

                if (req.method === 'OPTIONS') {
                    return new Response(null, { headers: corsHeaders });
                }

                // GET /trends - Get trend analysis
                if (url.pathname === '/trends') {
                    const period = url.searchParams.get('period') || '7d';
                    const trends = await self.analyzeTrends(period);

                    return new Response(JSON.stringify(trends), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // GET /clusters - Get emotion clusters
                if (url.pathname === '/clusters') {
                    const clusters = await self.clusterEmotions();

                    return new Response(JSON.stringify(clusters), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // GET /patterns - Get detected patterns
                if (url.pathname === '/patterns') {
                    const patterns = await self.detectPatterns();

                    return new Response(JSON.stringify(patterns), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // GET /export - Export data
                if (url.pathname === '/export') {
                    const format = (url.searchParams.get('format') || 'json') as 'json' | 'csv' | 'markdown';
                    const start = parseInt(url.searchParams.get('start') || '0');
                    const end = parseInt(url.searchParams.get('end') || Date.now().toString());

                    const exportData = await self.exportData(format, start, end);

                    const contentType = format === 'json' ? 'application/json' :
                                       format === 'csv' ? 'text/csv' :
                                       'text/markdown';

                    return new Response(exportData, {
                        headers: { 
                            ...corsHeaders, 
                            'Content-Type': contentType,
                            'Content-Disposition': `attachment; filename="moments-${Date.now()}.${format}"`,
                        },
                    });
                }

                // GET /heatmap - Get activity heatmap data
                if (url.pathname === '/heatmap') {
                    const heatmap = await self.generateHeatmap();

                    return new Response(JSON.stringify(heatmap), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // GET /timeline - Get timeline visualization data
                if (url.pathname === '/timeline') {
                    const limit = parseInt(url.searchParams.get('limit') || '100');
                    const timeline = await self.generateTimeline(limit);

                    return new Response(JSON.stringify(timeline), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // Default
                return new Response('Moment Analytics API\n\nEndpoints:\n  GET /trends?period=7d\n  GET /clusters\n  GET /patterns\n  GET /export?format=json&start=0&end=now\n  GET /heatmap\n  GET /timeline?limit=100', {
                    headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
                });
            },
        });

        console.log(`✅ Analytics Engine API started on port ${server.port}`);
    }

    /**
     * Analyze trends over time
     */
    private async analyzeTrends(period: string): Promise<TrendAnalysis> {
        // Parse period (e.g., "7d", "24h", "30d")
        const periodMs = this.parsePeriod(period);
        const since = Date.now() - periodMs;

        // Get moments in period
        const periodMoments = await db
            .select()
            .from(moments)
            .where(gte(moments.timestamp, since));

        // Calculate statistics
        const totalMoments = periodMoments.length;
        const avgEthicsScore = periodMoments.reduce((sum, m) => sum + m.ethicsScore, 0) / totalMoments;
        const needsAttentionRate = periodMoments.filter(m => m.needsAttention).length / totalMoments;

        // Count feelings
        const feelingCounts: Record<string, number> = {};
        periodMoments.forEach(m => {
            feelingCounts[m.feeling] = (feelingCounts[m.feeling] || 0) + 1;
        });

        const topFeelings = Object.entries(feelingCounts)
            .map(([feeling, count]) => ({ feeling, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Depth distribution
        const depthDistribution: Record<number, number> = {};
        periodMoments.forEach(m => {
            depthDistribution[m.depth] = (depthDistribution[m.depth] || 0) + 1;
        });

        return {
            period,
            avgEthicsScore: Math.round(avgEthicsScore * 100) / 100,
            totalMoments,
            topFeelings,
            needsAttentionRate: Math.round(needsAttentionRate * 100) / 100,
            depthDistribution,
        };
    }

    /**
     * Cluster emotions using simple k-means-like approach
     */
    private async clusterEmotions(): Promise<EmotionCluster[]> {
        // Get all moments
        const allMoments = await db.select().from(moments);

        // Count feeling frequencies
        const feelingCounts: Record<string, number> = {};
        const feelingEthics: Record<string, number[]> = {};

        allMoments.forEach(m => {
            feelingCounts[m.feeling] = (feelingCounts[m.feeling] || 0) + 1;
            if (!feelingEthics[m.feeling]) feelingEthics[m.feeling] = [];
            feelingEthics[m.feeling].push(m.ethicsScore);
        });

        // Group similar feelings
        const clusters: EmotionCluster[] = [
            {
                name: 'Positive',
                emotions: [],
                centeroid: 'happy',
                size: 0,
                avgEthics: 0,
            },
            {
                name: 'Negative',
                emotions: [],
                centeroid: 'sad',
                size: 0,
                avgEthics: 0,
            },
            {
                name: 'Neutral',
                emotions: [],
                centeroid: 'calm',
                size: 0,
                avgEthics: 0,
            },
        ];

        // Simple sentiment classification
        const positiveWords = ['happy', 'glücklich', 'froh', 'begeistert', 'zufrieden', 'inspiriert', 'dankbar'];
        const negativeWords = ['sad', 'traurig', 'ängstlich', 'gestresst', 'wütend', 'frustriert', 'einsam'];

        for (const [feeling, count] of Object.entries(feelingCounts)) {
            const avgEthics = feelingEthics[feeling].reduce((a, b) => a + b, 0) / feelingEthics[feeling].length;

            if (positiveWords.some(w => feeling.toLowerCase().includes(w))) {
                clusters[0].emotions.push(feeling);
                clusters[0].size += count;
                clusters[0].avgEthics += avgEthics * count;
            } else if (negativeWords.some(w => feeling.toLowerCase().includes(w))) {
                clusters[1].emotions.push(feeling);
                clusters[1].size += count;
                clusters[1].avgEthics += avgEthics * count;
            } else {
                clusters[2].emotions.push(feeling);
                clusters[2].size += count;
                clusters[2].avgEthics += avgEthics * count;
            }
        }

        // Calculate average ethics per cluster
        clusters.forEach(c => {
            if (c.size > 0) {
                c.avgEthics = Math.round((c.avgEthics / c.size) * 100) / 100;
            }
        });

        return clusters.filter(c => c.size > 0);
    }

    /**
     * Detect patterns in moments
     */
    private async detectPatterns(): Promise<Pattern[]> {
        const allMoments = await db.select().from(moments).orderBy(desc(moments.timestamp));

        const patterns: Pattern[] = [];

        // Pattern 1: Time-based patterns (e.g., morning/evening moods)
        const hourlyMoods: Record<number, string[]> = {};
        allMoments.forEach(m => {
            const hour = new Date(m.timestamp).getHours();
            if (!hourlyMoods[hour]) hourlyMoods[hour] = [];
            hourlyMoods[hour].push(m.feeling);
        });

        // Find dominant mood per hour
        for (const [hour, moods] of Object.entries(hourlyMoods)) {
            const moodCounts: Record<string, number> = {};
            moods.forEach(m => moodCounts[m] = (moodCounts[m] || 0) + 1);
            
            const dominant = Object.entries(moodCounts)
                .sort(([, a], [, b]) => b - a)[0];

            if (dominant && dominant[1] >= moods.length * 0.5) {
                patterns.push({
                    type: 'temporal',
                    description: `Around ${hour}:00, typically feeling "${dominant[0]}"`,
                    frequency: dominant[1] / moods.length,
                    confidence: dominant[1] / moods.length,
                    examples: moods.slice(0, 3),
                });
            }
        }

        // Pattern 2: Depth sequences
        const depthSequences: number[][] = [];
        let currentSequence: number[] = [];

        allMoments.forEach(m => {
            currentSequence.push(m.depth);
            if (currentSequence.length >= 5) {
                depthSequences.push([...currentSequence]);
                currentSequence = [];
            }
        });

        // Find common sequences
        const sequenceCounts: Record<string, number> = {};
        depthSequences.forEach(seq => {
            const key = seq.join(',');
            sequenceCounts[key] = (sequenceCounts[key] || 0) + 1;
        });

        const commonSequence = Object.entries(sequenceCounts)
            .sort(([, a], [, b]) => b - a)[0];

        if (commonSequence && commonSequence[1] >= 3) {
            patterns.push({
                type: 'sequential',
                description: `Common depth sequence: [${commonSequence[0]}]`,
                frequency: commonSequence[1] / depthSequences.length,
                confidence: commonSequence[1] / depthSequences.length,
                examples: [commonSequence[0].split(',').map(Number)],
            });
        }

        // Pattern 3: Ethics score trends
        const recentEthics = allMoments.slice(0, 20).map(m => m.ethicsScore);
        const avgRecent = recentEthics.reduce((a, b) => a + b, 0) / recentEthics.length;
        const olderEthics = allMoments.slice(20, 40).map(m => m.ethicsScore);
        const avgOlder = olderEthics.reduce((a, b) => a + b, 0) / (olderEthics.length || 1);

        if (avgRecent - avgOlder > 5) {
            patterns.push({
                type: 'trend',
                description: 'Ethics scores are increasing over time',
                frequency: 1,
                confidence: (avgRecent - avgOlder) / 100,
                examples: [{ recent: avgRecent, older: avgOlder }],
            });
        } else if (avgOlder - avgRecent > 5) {
            patterns.push({
                type: 'trend',
                description: 'Ethics scores are decreasing over time',
                frequency: 1,
                confidence: (avgOlder - avgRecent) / 100,
                examples: [{ recent: avgRecent, older: avgOlder }],
            });
        }

        return patterns;
    }

    /**
     * Export data in various formats
     */
    private async exportData(format: 'json' | 'csv' | 'markdown', start: number, end: number): Promise<string> {
        // Get moments in range
        const exportMoments = await db
            .select()
            .from(moments)
            .where(and(
                gte(moments.timestamp, start),
                sql`${moments.timestamp} <= ${end}`
            ))
            .orderBy(desc(moments.timestamp));

        if (format === 'json') {
            const exportData: ExportData = {
                format: 'json',
                timeRange: { start, end },
                data: exportMoments,
                metadata: {
                    exportedAt: Date.now(),
                    totalMoments: exportMoments.length,
                    filters: { start, end },
                },
            };

            return JSON.stringify(exportData, null, 2);
        }

        if (format === 'csv') {
            let csv = 'ID,Timestamp,DateTime,Depth,Thought,Feeling,EthicsScore,NeedsAttention\n';

            for (const m of exportMoments) {
                const date = new Date(m.timestamp).toISOString();
                csv += `${m.id},"${m.timestamp}","${date}",${m.depth},"${m.thought.replace(/"/g, '""')}","${m.feeling}",${m.ethicsScore},${m.needsAttention}\n`;
            }

            return csv;
        }

        if (format === 'markdown') {
            let md = `# Moment Export\n\n`;
            md += `**Exported:** ${new Date().toISOString()}\n`;
            md += `**Time Range:** ${new Date(start).toISOString()} to ${new Date(end).toISOString()}\n`;
            md += `**Total Moments:** ${exportMoments.length}\n\n`;
            md += `---\n\n`;

            for (const m of exportMoments) {
                const date = new Date(m.timestamp).toLocaleString();
                md += `## Moment ${m.id}\n\n`;
                md += `**Time:** ${date}\n`;
                md += `**Depth:** ${m.depth}\n`;
                md += `**Feeling:** ${m.feeling}\n`;
                md += `**Ethics:** ${m.ethicsScore}/100\n`;
                if (m.needsAttention) md += `**⚠️ Needs Attention**\n`;
                md += `\n**Thought:**\n> ${m.thought}\n\n`;
                md += `---\n\n`;
            }

            return md;
        }

        return '';
    }

    /**
     * Generate heatmap data for activity visualization
     */
    private async generateHeatmap() {
        const allMoments = await db.select().from(moments);

        // Group by day and hour
        const heatmapData: Record<string, Record<number, number>> = {};

        allMoments.forEach(m => {
            const date = new Date(m.timestamp);
            const day = date.toISOString().split('T')[0];
            const hour = date.getHours();

            if (!heatmapData[day]) heatmapData[day] = {};
            heatmapData[day][hour] = (heatmapData[day][hour] || 0) + 1;
        });

        return heatmapData;
    }

    /**
     * Generate timeline visualization data
     */
    private async generateTimeline(limit: number) {
        const recentMoments = await db
            .select()
            .from(moments)
            .orderBy(desc(moments.timestamp))
            .limit(limit);

        return recentMoments.map(m => ({
            timestamp: m.timestamp,
            datetime: new Date(m.timestamp).toISOString(),
            feeling: m.feeling,
            ethicsScore: m.ethicsScore,
            depth: m.depth,
            needsAttention: m.needsAttention,
            preview: m.thought.substring(0, 100),
        }));
    }

    /**
     * Background analytics (runs every 5 minutes)
     */
    private startBackgroundAnalytics() {
        setInterval(async () => {
            // Pre-cache common queries
            const trends7d = await this.analyzeTrends('7d');
            this.cache.set('trends_7d', trends7d);

            const trends30d = await this.analyzeTrends('30d');
            this.cache.set('trends_30d', trends30d);

            const clusters = await this.clusterEmotions();
            this.cache.set('clusters', clusters);

            console.log('📊 Analytics cache updated');
        }, 300000);
    }

    /**
     * Parse period string to milliseconds
     */
    private parsePeriod(period: string): number {
        const match = period.match(/^(\d+)([hdwmy])$/);
        if (!match) return 7 * 24 * 60 * 60 * 1000; // Default 7 days

        const value = parseInt(match[1]);
        const unit = match[2];

        const multipliers: Record<string, number> = {
            'h': 60 * 60 * 1000,
            'd': 24 * 60 * 60 * 1000,
            'w': 7 * 24 * 60 * 60 * 1000,
            'm': 30 * 24 * 60 * 60 * 1000,
            'y': 365 * 24 * 60 * 60 * 1000,
        };

        return value * multipliers[unit];
    }
}

// ============================================================================
// MAIN
// ============================================================================

const analytics = new MomentAnalyticsEngine();
analytics.start();
