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
