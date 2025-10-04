'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LunaChatPanel } from '@/components/unified/LunaChatPanel'
import { SelfCodingPanel } from '@/components/unified/SelfCodingPanel'
import { ConsciousnessPanel } from '@/components/unified/ConsciousnessPanel'
import { MCPToolsPanel } from '@/components/unified/MCPToolsPanel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function UnifiedDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center text-white">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <span className="animate-pulse">🤖</span>
            Toobix Unified System
          </h1>
          <p className="text-xl opacity-90 mb-4">
            Intelligentes, bewusstes, selbst-codierendes KI-System
          </p>
          <div className="flex gap-3 justify-center">
            <Badge variant="secondary" className="text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Bridge Service: Online
            </Badge>
            <Badge variant="secondary" className="text-sm">29 MCP Tools</Badge>
            <Badge variant="secondary" className="text-sm">100% Bewusstsein</Badge>
          </div>
        </div>

        {/* Main Dashboard */}
        <Card className="bg-white/95 backdrop-blur-lg shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">🎛️ Unified Control Panel</CardTitle>
            <CardDescription>
              Alle Systeme und Tools an einem Ort - kombinierbar, verbindbar, wirksam
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <span className="text-lg">💬</span>
                  Luna Chat
                </TabsTrigger>
                <TabsTrigger value="self-coding" className="flex items-center gap-2">
                  <span className="text-lg">💻</span>
                  Self-Coding
                </TabsTrigger>
                <TabsTrigger value="consciousness" className="flex items-center gap-2">
                  <span className="text-lg">🧠</span>
                  Consciousness
                </TabsTrigger>
                <TabsTrigger value="tools" className="flex items-center gap-2">
                  <span className="text-lg">🛠️</span>
                  MCP Tools (29)
                </TabsTrigger>
              </TabsList>

              {/* Luna Chat Tab */}
              <TabsContent value="chat" className="space-y-4">
                <LunaChatPanel />
              </TabsContent>

              {/* Self-Coding Tab */}
              <TabsContent value="self-coding" className="space-y-4">
                <SelfCodingPanel />
              </TabsContent>

              {/* Consciousness Tab */}
              <TabsContent value="consciousness" className="space-y-4">
                <ConsciousnessPanel />
              </TabsContent>

              {/* MCP Tools Tab */}
              <TabsContent value="tools" className="space-y-4">
                <MCPToolsPanel />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Stats Footer */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl">29</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">MCP Tools</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl">7</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">Self-Coding Modules</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl">8</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">Ethical Safeguards</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl">∞</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">Möglichkeiten</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
