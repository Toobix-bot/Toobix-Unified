import { useState, useRef, useEffect } from 'react'
import { Send, Trash2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'luna'
  content: string
  timestamp: Date
}

export default function LunaChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'luna',
      content: 'Hi! I\'m Luna, your AI companion. How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    // Simulate Luna response (TODO: Connect to Groq API)
    setTimeout(() => {
      const lunaMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'luna',
        content: `I understand you said: "${input}". I'm working on connecting to the full AI system!`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, lunaMessage])
    }, 500)
  }

  const handleClear = () => {
    setMessages([
      {
        id: '1',
        role: 'luna',
        content: 'Hi! I\'m Luna, your AI companion. How can I help you today?',
        timestamp: new Date()
      }
    ])
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="glass p-6 border-b border-white/10 flex justify-between items-center">
        <h1 className="text-3xl font-bold">🌙 Luna Chat</h1>
        <button onClick={handleClear} className="btn-secondary flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-consciousness to-luna'
                  : 'glass'
              }`}
            >
              <p className="text-white">{message.content}</p>
              <p className="text-xs text-white/40 mt-2">
                {message.timestamp.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass p-6 border-t border-white/10">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="input-glass"
          />
          <button onClick={handleSend} className="btn-primary flex items-center gap-2">
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
