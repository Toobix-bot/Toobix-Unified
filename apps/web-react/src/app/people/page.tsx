'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { bridgeClient } from '@toobix/api-client'
import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues with canvas
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false })

interface Contact {
  id: string
  name: string
  role?: string
  faction?: string
  relationship_status?: string
  trust?: number
  respect?: number
  fear?: number
  affection?: number
  notes?: string
}

interface GraphNode {
  id: string
  name: string
  val: number
  color: string
  type: 'player' | 'contact'
}

interface GraphLink {
  source: string
  target: string
  value: number
  label: string
}

interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

export default function PeoplePage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] })
  const [selectedNode, setSelectedNode] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const graphRef = useRef<any>()

  const loadPeople = async () => {
    try {
      setLoading(true)
      setError(null)

      // Search for all contacts
      const result = await bridgeClient.searchContacts({ query: '', limit: 100 })
      const contactList = result.contacts || []
      setContacts(contactList)

      // Build graph data
      const nodes: GraphNode[] = [
        {
          id: 'player',
          name: 'You',
          val: 20,
          color: '#8b5cf6',
          type: 'player'
        }
      ]

      const links: GraphLink[] = []

      contactList.forEach((contact: Contact) => {
        // Determine node color based on relationship
        let color = '#6b7280' // default gray
        const status = contact.relationship_status?.toLowerCase() || ''
        if (status.includes('friend')) color = '#10b981' // green
        else if (status.includes('ally')) color = '#3b82f6' // blue
        else if (status.includes('enemy')) color = '#ef4444' // red
        else if (status.includes('neutral')) color = '#f59e0b' // orange

        // Node size based on relationship metrics
        const metrics = [
          contact.trust || 0,
          contact.respect || 0,
          contact.fear || 0,
          contact.affection || 0
        ]
        const avgMetric = metrics.reduce((a, b) => a + b, 0) / metrics.length
        const val = 5 + (avgMetric / 10) // Scale 5-15

        nodes.push({
          id: contact.id,
          name: contact.name,
          val,
          color,
          type: 'contact'
        })

        // Create link to player
        links.push({
          source: 'player',
          target: contact.id,
          value: avgMetric / 20,
          label: contact.relationship_status || 'Unknown'
        })
      })

      setGraphData({ nodes, links })
    } catch (err: any) {
      console.error('Failed to load people:', err)
      setError(err.message || 'Failed to load people')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPeople()
  }, [])

  const handleNodeClick = (node: any) => {
    if (node.id === 'player') {
      setSelectedNode(null)
      return
    }
    const contact = contacts.find(c => c.id === node.id)
    if (contact) {
      setSelectedNode(contact)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-xl">Loading people graph...</div>
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
            <Button onClick={loadPeople} className="mt-4">Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">👥 People Network</h1>
          <p className="text-muted-foreground">
            {contacts.length} contacts • Click nodes for details
          </p>
        </div>
        <Button onClick={loadPeople}>Refresh</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Graph Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Relationship Graph</CardTitle>
            <CardDescription>Interactive network of all contacts</CardDescription>
          </CardHeader>
          <CardContent className="h-[600px]">
            {graphData.nodes.length > 0 ? (
              <ForceGraph2D
                ref={graphRef}
                graphData={graphData}
                nodeLabel="name"
                nodeAutoColorBy="type"
                nodeCanvasObject={(node: any, ctx, globalScale) => {
                  const label = node.name
                  const fontSize = 12 / globalScale
                  ctx.font = `${fontSize}px Sans-Serif`
                  
                  // Draw circle
                  ctx.beginPath()
                  ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false)
                  ctx.fillStyle = node.color
                  ctx.fill()
                  
                  // Draw border for selected node
                  if (selectedNode && node.id === selectedNode.id) {
                    ctx.strokeStyle = '#fff'
                    ctx.lineWidth = 2 / globalScale
                    ctx.stroke()
                  }
                  
                  // Draw label
                  ctx.textAlign = 'center'
                  ctx.textBaseline = 'middle'
                  ctx.fillStyle = '#fff'
                  ctx.fillText(label, node.x, node.y + node.val + 10 / globalScale)
                }}
                onNodeClick={handleNodeClick}
                linkDirectionalParticles={2}
                linkDirectionalParticleWidth={2}
                backgroundColor="#09090b"
                linkColor={() => '#3f3f46'}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No contacts found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Details Panel */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedNode ? selectedNode.name : 'Select a Contact'}
            </CardTitle>
            {selectedNode && (
              <CardDescription>{selectedNode.role || 'Unknown role'}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedNode ? (
              <>
                {/* Faction */}
                {selectedNode.faction && (
                  <div>
                    <div className="text-sm font-medium mb-1">Faction</div>
                    <Badge variant="outline">{selectedNode.faction}</Badge>
                  </div>
                )}

                {/* Relationship Status */}
                {selectedNode.relationship_status && (
                  <div>
                    <div className="text-sm font-medium mb-1">Status</div>
                    <Badge>{selectedNode.relationship_status}</Badge>
                  </div>
                )}

                {/* Metrics */}
                <div className="space-y-3">
                  <div className="text-sm font-medium">Relationship Metrics</div>
                  
                  {selectedNode.trust !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Trust</span>
                        <span>{selectedNode.trust}/100</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500"
                          style={{ width: `${selectedNode.trust}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {selectedNode.respect !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Respect</span>
                        <span>{selectedNode.respect}/100</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500"
                          style={{ width: `${selectedNode.respect}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {selectedNode.fear !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Fear</span>
                        <span>{selectedNode.fear}/100</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500"
                          style={{ width: `${selectedNode.fear}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {selectedNode.affection !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Affection</span>
                        <span>{selectedNode.affection}/100</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-pink-500"
                          style={{ width: `${selectedNode.affection}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {selectedNode.notes && (
                  <div>
                    <div className="text-sm font-medium mb-1">Notes</div>
                    <p className="text-sm text-muted-foreground">{selectedNode.notes}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Click on a node in the graph to view contact details
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contact List */}
      <Card>
        <CardHeader>
          <CardTitle>All Contacts ({contacts.length})</CardTitle>
          <CardDescription>Complete list of known people</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                onClick={() => setSelectedNode(contact)}
              >
                <div className="font-medium">{contact.name}</div>
                {contact.role && (
                  <div className="text-sm text-muted-foreground">{contact.role}</div>
                )}
                {contact.relationship_status && (
                  <Badge variant="outline" className="mt-2">
                    {contact.relationship_status}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
