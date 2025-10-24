import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4 py-12">
        <h1 className="text-4xl font-bold">⚡ Toobix Universe</h1>
        <p className="text-xl text-muted-foreground">
          React-Powered Features
        </p>
      </div>

      {/* Featured: Autonomous Systems */}
      <Card className="bg-gradient-to-r from-slate-900 to-purple-900 text-white border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">🤖 Autonomous Systems Control</CardTitle>
          <CardDescription className="text-white/90 text-lg">
            Real-time monitoring: Eternal Daemon • BlockWorld AI • Self-Modification Engine • 14 Conscious Processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/autonomous">
            <Button size="lg" className="w-full bg-green-500 text-white hover:bg-green-600">
              🚀 Open Autonomous Dashboard →
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Featured: Unified Dashboard */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
        <CardHeader>
          <CardTitle className="text-3xl">🌌 Unified Dashboard</CardTitle>
          <CardDescription className="text-white/90 text-lg">
            Alle 29 MCP Tools vereint: Consciousness, Self-Coding, Memory, Soul & mehr
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/unified">
            <Button size="lg" className="w-full bg-white text-purple-600 hover:bg-white/90">
              Open Unified Dashboard →
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>📖 Story Engine</CardTitle>
            <CardDescription>Complex narrative system with real-time updates</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/story">
              <Button className="w-full">Open Story →</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 Analytics</CardTitle>
            <CardDescription>Data visualization and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/analytics">
              <Button className="w-full">Open Analytics →</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>👥 People</CardTitle>
            <CardDescription>Relationship graphs and connections</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/people">
              <Button className="w-full">Open People →</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>🎮 Vanilla UI</CardTitle>
          <CardDescription>Simple CRUD operations (Dashboard, Runs, Quests)</CardDescription>
        </CardHeader>
        <CardContent>
          <a href="http://localhost:3000/dashboard.html" target="_blank">
            <Button variant="secondary" className="w-full">
              Open Vanilla UI →
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
