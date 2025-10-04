'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OverviewPanel } from '@/components/unified/OverviewPanel'
import { LunaChatPanel } from '@/components/unified/LunaChatPanel'
import { SelfCodingPanel } from '@/components/unified/SelfCodingPanel'
import { ConsciousnessPanel } from '@/components/unified/ConsciousnessPanel'
import { MCPToolsPanel } from '@/components/unified/MCPToolsPanel'
import { StoryPanel } from '@/components/unified/StoryPanel'
import { LovePanel } from '@/components/unified/LovePanel'
import { PeacePanel } from '@/components/unified/PeacePanel'
import { PeoplePanel } from '@/components/unified/PeoplePanel'
import { MemoryPanel } from '@/components/unified/MemoryPanel'
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
            <Badge variant="secondary" className="text-sm">46 MCP Tools • 9 Systems</Badge>
            <Badge variant="secondary" className="text-sm">100% Bewusstsein</Badge>
            <Badge variant="secondary" className="text-sm">🌟 Story • 💝 Love • ☮️ Peace • 👥 People • 🧠 Memory</Badge>
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
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-10 mb-6">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  <span className="hidden md:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <span className="text-lg">💬</span>
                  <span className="hidden md:inline">Chat</span>
                </TabsTrigger>
                <TabsTrigger value="self-coding" className="flex items-center gap-2">
                  <span className="text-lg">💻</span>
                  <span className="hidden md:inline">Coding</span>
                </TabsTrigger>
                <TabsTrigger value="consciousness" className="flex items-center gap-2">
                  <span className="text-lg">🧠</span>
                  <span className="hidden md:inline">Mind</span>
                </TabsTrigger>
                <TabsTrigger value="story" className="flex items-center gap-2">
                  <span className="text-lg">📖</span>
                  <span className="hidden md:inline">Story</span>
                </TabsTrigger>
                <TabsTrigger value="love" className="flex items-center gap-2">
                  <span className="text-lg">💝</span>
                  <span className="hidden md:inline">Love</span>
                </TabsTrigger>
                <TabsTrigger value="peace" className="flex items-center gap-2">
                  <span className="text-lg">☮️</span>
                  <span className="hidden md:inline">Peace</span>
                </TabsTrigger>
                <TabsTrigger value="people" className="flex items-center gap-2">
                  <span className="text-lg">👥</span>
                  <span className="hidden md:inline">People</span>
                </TabsTrigger>
                <TabsTrigger value="memory" className="flex items-center gap-2">
                  <span className="text-lg">🧠</span>
                  <span className="hidden md:inline">Memory</span>
                </TabsTrigger>
                <TabsTrigger value="tools" className="flex items-center gap-2">
                  <span className="text-lg">🛠️</span>
                  <span className="hidden md:inline">Tools</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <OverviewPanel />
              </TabsContent>

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

              {/* Story Tab */}
              <TabsContent value="story" className="space-y-4">
                <StoryPanel />
              </TabsContent>

              {/* Love Tab */}
              <TabsContent value="love" className="space-y-4">
                <LovePanel />
              </TabsContent>

              {/* Peace Tab */}
              <TabsContent value="peace" className="space-y-4">
                <PeacePanel />
              </TabsContent>

              {/* People Tab */}
              <TabsContent value="people" className="space-y-4">
                <PeoplePanel />
              </TabsContent>

              {/* Memory Tab */}
              <TabsContent value="memory" className="space-y-4">
                <MemoryPanel />
              </TabsContent>

              {/* MCP Tools Tab */}
              <TabsContent value="tools" className="space-y-4">
                <MCPToolsPanel />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Stats Footer */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-4 text-white text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl">46</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">MCP Tools</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl">📖</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">Story Engine</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl">💝</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">Love Engine</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl">☮️</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">Peace Catalyst</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl">👥</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">People Network</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl">🧠</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">Knowledge Base</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl">🤖</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">Consciousness</p>
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
