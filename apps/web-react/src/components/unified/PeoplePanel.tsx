'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Users, UserPlus, MessageSquare, Heart, Search, TrendingUp } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const API_URL = 'http://localhost:3337/mcp'

interface Contact {
  id: string
  name: string
  relation: string
  avatar?: string
  notes?: string
  tags?: string[]
  metadata?: any
}

interface Interaction {
  id: string
  person_id: string
  person_name: string
  kind: string
  summary: string
  sentiment: string
  love_points?: number
  gratitude?: string
  timestamp: string
}

interface Relationship {
  person_id: string
  person_name: string
  total_love_points: number
  interaction_count: number
  last_interaction: string
  sentiment_avg: string
}

export function PeoplePanel() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [relationships, setRelationships] = useState<Relationship[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Add Contact Form
  const [newName, setNewName] = useState('')
  const [newRelation, setNewRelation] = useState('friend')
  const [newNotes, setNewNotes] = useState('')
  const [newTags, setNewTags] = useState('')
  
  // Add Interaction Form
  const [interactionKind, setInteractionKind] = useState('meet')
  const [interactionSummary, setInteractionSummary] = useState('')
  const [interactionSentiment, setInteractionSentiment] = useState('positive')
  const [interactionGratitude, setInteractionGratitude] = useState('')
  const [interactionLovePoints, setInteractionLovePoints] = useState(5)

  const fetchData = async () => {
    try {
      // Fetch contacts
      const contactsResp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: { name: 'contact_search', arguments: { query: searchQuery || '' } }
        })
      })
      const contactsData = await contactsResp.json()
      if (contactsData.result?.content?.[0]?.text) {
        const parsed = JSON.parse(contactsData.result.content[0].text)
        setContacts(parsed.contacts || [])
      }

      // Fetch relationships
      const relationshipsResp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now() + 1,
          method: 'tools/call',
          params: { name: 'love_get_relationships', arguments: { limit: 10 } }
        })
      })
      const relationshipsData = await relationshipsResp.json()
      if (relationshipsData.result?.content?.[0]?.text) {
        setRelationships(JSON.parse(relationshipsData.result.content[0].text))
      }

      // Fetch recent interactions (via API endpoint)
      const interactionsResp = await fetch('http://localhost:3337/api/interactions')
      if (interactionsResp.ok) {
        const interactionsData = await interactionsResp.json()
        setInteractions(interactionsData.slice(0, 10))
      }
    } catch (error) {
      console.error('People data fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addContact = async () => {
    if (!newName.trim()) return

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'contact_add',
            arguments: {
              name: newName,
              relation: newRelation,
              notes: newNotes || undefined,
              tags: newTags ? newTags.split(',').map(t => t.trim()) : undefined
            }
          }
        })
      })

      // Reset form
      setNewName('')
      setNewRelation('friend')
      setNewNotes('')
      setNewTags('')

      // Refresh data
      fetchData()
    } catch (error) {
      console.error('Add contact error:', error)
    }
  }

  const logInteraction = async () => {
    if (!selectedContact || !interactionSummary.trim()) return

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'interaction_log',
            arguments: {
              person_id: selectedContact.id,
              kind: interactionKind,
              summary: interactionSummary,
              sentiment: interactionSentiment,
              love_points: interactionLovePoints,
              gratitude: interactionGratitude || undefined
            }
          }
        })
      })

      // Reset form
      setInteractionSummary('')
      setInteractionGratitude('')
      setInteractionLovePoints(5)

      // Refresh data
      fetchData()
    } catch (error) {
      console.error('Log interaction error:', error)
    }
  }

  useEffect(() => {
    fetchData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [searchQuery])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>👥 People Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading people data...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* People Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Users className="w-8 h-8" />
                People Network
              </CardTitle>
              <CardDescription className="text-blue-100 mt-2">
                Manage contacts, relationships, and interactions
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{contacts.length}</div>
              <div className="text-sm text-blue-200">Contacts</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{contacts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{interactions.length}+</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Relationships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500">{relationships.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Love Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-500">
              {relationships.reduce((sum, r) => sum + r.total_love_points, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Add Contact */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Search Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-500" />
              Search Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by name, tags, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Add New Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-500" />
              Add Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Select value={newRelation} onValueChange={setNewRelation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="colleague">Colleague</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Tags (comma-separated)"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
            />
            <Button onClick={addContact} className="w-full" disabled={!newName.trim()}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <CardTitle>All Contacts</CardTitle>
          <CardDescription>{contacts.length} people in your network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedContact?.id === contact.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl">{contact.avatar || '👤'}</div>
                  <div className="flex-1">
                    <div className="font-bold">{contact.name}</div>
                    <Badge variant="secondary" className="text-xs">
                      {contact.relation}
                    </Badge>
                  </div>
                </div>
                {contact.tags && contact.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {contact.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {contact.notes && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {contact.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Log Interaction (if contact selected) */}
      {selectedContact && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-500" />
              Log Interaction with {selectedContact.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Select value={interactionKind} onValueChange={setInteractionKind}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">📞 Call</SelectItem>
                  <SelectItem value="meet">🤝 Meeting</SelectItem>
                  <SelectItem value="message">💬 Message</SelectItem>
                  <SelectItem value="gift">🎁 Gift</SelectItem>
                  <SelectItem value="conflict">⚠️ Conflict</SelectItem>
                  <SelectItem value="memory">💭 Memory</SelectItem>
                </SelectContent>
              </Select>
              <Select value={interactionSentiment} onValueChange={setInteractionSentiment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">😊 Positive</SelectItem>
                  <SelectItem value="neutral">😐 Neutral</SelectItem>
                  <SelectItem value="difficult">😟 Difficult</SelectItem>
                  <SelectItem value="healing">🌱 Healing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="What happened?"
              value={interactionSummary}
              onChange={(e) => setInteractionSummary(e.target.value)}
              rows={3}
            />
            <Textarea
              placeholder="Gratitude (optional)"
              value={interactionGratitude}
              onChange={(e) => setInteractionGratitude(e.target.value)}
              rows={2}
            />
            <div>
              <label className="text-sm font-medium mb-2 block">
                Love Points: {interactionLovePoints}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={interactionLovePoints}
                onChange={(e) => setInteractionLovePoints(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <Button onClick={logInteraction} className="w-full" disabled={!interactionSummary.trim()}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Log Interaction
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Top Relationships */}
      {relationships.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-pink-500" />
              Top Relationships
            </CardTitle>
            <CardDescription>Strongest connections by love points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {relationships.slice(0, 5).map((rel, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{rel.person_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {rel.interaction_count} interactions • Last: {new Date(rel.last_interaction).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-pink-500 flex items-center gap-1">
                      <Heart className="w-5 h-5" />
                      {rel.total_love_points}
                    </div>
                    <div className="text-xs text-muted-foreground">{rel.sentiment_avg}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Interactions */}
      {interactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {interactions.map((interaction) => (
                <div key={interaction.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{interaction.person_name}</span>
                      <Badge variant="secondary" className="text-xs">{interaction.kind}</Badge>
                      <Badge variant="outline" className="text-xs">{interaction.sentiment}</Badge>
                    </div>
                    {interaction.love_points && interaction.love_points > 0 && (
                      <div className="flex items-center gap-1 text-pink-500 text-sm">
                        <Heart className="w-4 h-4" />
                        {interaction.love_points}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{interaction.summary}</p>
                  {interaction.gratitude && (
                    <p className="text-xs italic text-purple-600">💜 {interaction.gratitude}</p>
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    {new Date(interaction.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
