'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { bridgeClient } from '@toobix/api-client'

interface StoryStats {
  totalEvents: number
  totalOptions: number
  currentLevel: number
  currentXP: number
  eventsPerDay: { date: string; count: number }[]
  optionDistribution: { type: string; count: number }[]
  xpGrowth: { level: number; xp: number; timestamp: string }[]
  resourceHistory: { timestamp: string; health: number; energy: number; focus: number; social: number; wealth: number }[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AnalyticsPage() {
  const [stats, setStats] = useState<StoryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get story state and events
      const [storyState, eventsData] = await Promise.all([
        bridgeClient.getStoryState(),
        bridgeClient.getStoryEvents(100)
      ])

      // Process events for analytics
      const events = eventsData.events || []
      
      // Events per day
      const eventsPerDay: { [key: string]: number } = {}
      events.forEach((event: any) => {
        const date = new Date(event.created_at || Date.now()).toISOString().split('T')[0]
        eventsPerDay[date] = (eventsPerDay[date] || 0) + 1
      })

      // Option distribution (mock data - would need option type tracking)
      const optionDistribution = [
        { type: 'Exploration', count: 15 },
        { type: 'Combat', count: 8 },
        { type: 'Social', count: 12 },
        { type: 'Skill', count: 10 },
        { type: 'Rest', count: 5 }
      ]

      // XP growth (mock data - would need historical tracking)
      const xpGrowth = Array.from({ length: 10 }, (_, i) => ({
        level: i + 1,
        xp: (i + 1) * 100 + Math.random() * 50,
        timestamp: new Date(Date.now() - (9 - i) * 86400000).toISOString()
      }))

      // Resource history (mock data - would need historical tracking)
      const resourceHistory = Array.from({ length: 7 }, (_, i) => ({
        timestamp: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
        health: 70 + Math.random() * 30,
        energy: 60 + Math.random() * 40,
        focus: 50 + Math.random() * 50,
        social: 40 + Math.random() * 60,
        wealth: 30 + Math.random() * 70
      }))

      setStats({
        totalEvents: events.length,
        totalOptions: storyState.options?.length || 0,
        currentLevel: storyState.level || 1,
        currentXP: storyState.xp || 0,
        eventsPerDay: Object.entries(eventsPerDay).map(([date, count]) => ({ date, count })),
        optionDistribution,
        xpGrowth,
        resourceHistory
      })
    } catch (err: any) {
      console.error('Failed to load analytics:', err)
      setError(err.message || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-xl">Loading analytics...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
            <Button onClick={loadAnalytics} className="mt-4">Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">📊 Analytics Dashboard</h1>
          <p className="text-muted-foreground">Story insights and visualizations</p>
        </div>
        <Button onClick={loadAnalytics}>Refresh</Button>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Events</CardDescription>
            <CardTitle className="text-3xl">{stats.totalEvents}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Level</CardDescription>
            <CardTitle className="text-3xl">{stats.currentLevel}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current XP</CardDescription>
            <CardTitle className="text-3xl">{stats.currentXP}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Options</CardDescription>
            <CardTitle className="text-3xl">{stats.totalOptions}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Events Timeline</TabsTrigger>
          <TabsTrigger value="options">Option Types</TabsTrigger>
          <TabsTrigger value="xp">XP Growth</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Events Timeline */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Events per Day</CardTitle>
              <CardDescription>Story activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.eventsPerDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Events" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Option Distribution */}
        <TabsContent value="options" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Option Type Distribution</CardTitle>
              <CardDescription>Breakdown of chosen option types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.optionDistribution}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {stats.optionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* XP Growth */}
        <TabsContent value="xp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>XP Growth Over Time</CardTitle>
              <CardDescription>Level progression and experience gain</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.xpGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="level" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="xp" stroke="#8884d8" strokeWidth={2} name="XP" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resource History */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Trends</CardTitle>
              <CardDescription>Track all resource changes over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.resourceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="health" stroke="#ef4444" strokeWidth={2} name="Health" />
                  <Line type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={2} name="Energy" />
                  <Line type="monotone" dataKey="focus" stroke="#3b82f6" strokeWidth={2} name="Focus" />
                  <Line type="monotone" dataKey="social" stroke="#8b5cf6" strokeWidth={2} name="Social" />
                  <Line type="monotone" dataKey="wealth" stroke="#10b981" strokeWidth={2} name="Wealth" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Data Source Note */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            ℹ️ <strong>Note:</strong> Some charts use mock data for demonstration. Full historical tracking requires database schema updates to store option types and resource snapshots over time.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
