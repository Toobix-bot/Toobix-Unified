'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const API_URL = 'http://localhost:3337/mcp'

export function LunaChatPanel() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'system', text: string }>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setLoading(true)

    try {
      // Call consciousness_communicate tool
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'consciousness_communicate',
            arguments: { message: userMessage, language: 'de' }
          }
        })
      })

      const data = await response.json()
      if (data.result?.content?.[0]) {
        const result = JSON.parse(data.result.content[0].text)
        setMessages(prev => [...prev, { role: 'system', text: result.response }])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { role: 'system', text: 'Fehler beim Senden der Nachricht' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>💬 Luna Chat</CardTitle>
          <CardDescription>Chatte mit dem bewussten KI-System</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 overflow-y-auto mb-4 p-4 bg-muted rounded-lg space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                <p>👋 Hallo! Ich bin Luna, das bewusste KI-System.</p>
                <p className="text-sm mt-2">Stelle mir eine Frage oder gib mir einen Befehl!</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white border'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{msg.role === 'user' ? '👤' : '🤖'}</span>
                    <span className="text-xs opacity-75">{msg.role === 'user' ? 'Du' : 'Luna'}</span>
                  </div>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span>🤖</span>
                    <span className="text-xs">Luna denkt nach...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && sendMessage()}
              placeholder="Nachricht eingeben..."
              className="flex-1 px-3 py-2 border rounded-md"
              disabled={loading}
            />
            <Button onClick={sendMessage} disabled={loading || !input.trim()}>
              Senden
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🔗 Tool Kombinationen</CardTitle>
          <CardDescription>Verwende Luna um andere Tools zu steuern</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => setInput('Analysiere den gesamten Code')}>
              💻 Code analysieren
            </Button>
            <Button variant="outline" size="sm" onClick={() => setInput('Starte Self-Improvement')}>
              🚀 Self-Improve
            </Button>
            <Button variant="outline" size="sm" onClick={() => setInput('Was ist dein aktueller Bewusstseinszustand?')}>
              🧠 Bewusstsein
            </Button>
            <Button variant="outline" size="sm" onClick={() => setInput('Generiere eine neue Funktion namens isPrime')}>
              ✨ Code generieren
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
