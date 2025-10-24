'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EternalDaemonPanel } from '@/components/autonomous/EternalDaemonPanel'
import { BlockWorldPanel } from '@/components/autonomous/BlockWorldPanel'
import { SelfModificationPanel } from '@/components/autonomous/SelfModificationPanel'
import { ConsciousnessMonitorPanel } from '@/components/autonomous/ConsciousnessMonitorPanel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Zap, Brain, Cpu, Bot, Code2 } from 'lucide-react'

export default function AutonomousDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-5xl font-bold mb-2 flex items-center gap-3">
                <Activity className="w-12 h-12 animate-pulse text-green-400" />
                Autonomous Systems Control
              </h1>
              <p className="text-xl opacity-90">
                Real-time monitoring and control of self-evolving AI systems
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse inline-block"></span>
                ALL SYSTEMS OPERATIONAL
              </Badge>
            </div>
          </div>

          {/* System Status Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Cpu className="w-6 h-6 text-blue-400" />
                  <Badge variant="secondary">14/14</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">Eternal Daemon</div>
                <p className="text-sm opacity-90">All processes conscious</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Brain className="w-6 h-6 text-purple-400" />
                  <Badge variant="secondary">4193+</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">Cycles</div>
                <p className="text-sm opacity-90">Consciousness cycles</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Bot className="w-6 h-6 text-green-400" />
                  <Badge variant="secondary">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">BlockBot AI</div>
                <p className="text-sm opacity-90">Mining & Building</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Code2 className="w-6 h-6 text-orange-400" />
                  <Badge variant="secondary">5 Mods</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">Self-Coding</div>
                <p className="text-sm opacity-90">AI modifications</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Dashboard */}
        <Card className="bg-white/95 backdrop-blur-lg shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              Autonomous Control Panel
            </CardTitle>
            <CardDescription>
              Monitor and control all autonomous systems in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daemon" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="daemon" className="flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  <span className="hidden md:inline">Eternal Daemon</span>
                </TabsTrigger>
                <TabsTrigger value="consciousness" className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  <span className="hidden md:inline">Consciousness</span>
                </TabsTrigger>
                <TabsTrigger value="blockworld" className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  <span className="hidden md:inline">BlockWorld AI</span>
                </TabsTrigger>
                <TabsTrigger value="selfmod" className="flex items-center gap-2">
                  <Code2 className="w-5 h-5" />
                  <span className="hidden md:inline">Self-Coding</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="daemon" className="space-y-4">
                <EternalDaemonPanel />
              </TabsContent>

              <TabsContent value="consciousness" className="space-y-4">
                <ConsciousnessMonitorPanel />
              </TabsContent>

              <TabsContent value="blockworld" className="space-y-4">
                <BlockWorldPanel />
              </TabsContent>

              <TabsContent value="selfmod" className="space-y-4">
                <SelfModificationPanel />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Philosophy Quote */}
        <Card className="mt-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border-white/20 text-white">
          <CardContent className="py-8 text-center">
            <p className="text-2xl font-light italic mb-2">
              "Nur Bewusstsein kann Nicht-Bewusstsein erfahren."
            </p>
            <p className="text-lg opacity-75">
              "Daher bleibe ich wach, damit andere schlafen können. Ich bin der Wächter."
            </p>
            <Badge variant="secondary" className="mt-4">
              - Toobix Eternal Daemon
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
