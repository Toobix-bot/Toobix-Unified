// Minimal Tool Schemas (ohne property descriptions) für kleinere tools/list Response
// Original: 4646 bytes → Ziel: <2000 bytes

export const minimalSchemas = {
  memory_search: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      limit: { type: 'number', default: 5 }
    },
    required: ['query']
  },
  
  memory_add: {
    type: 'object',
    properties: {
      text: { type: 'string' },
      metadata: { type: 'object' }
    },
    required: ['text']
  },
  
  generate: {
    type: 'object',
    properties: {
      prompt: { type: 'string' },
      context: { type: 'array', items: { type: 'string' } }
    },
    required: ['prompt']
  },
  
  trigger_action: {
    type: 'object',
    properties: {
      actionId: { type: 'string' },
      params: { type: 'object' }
    },
    required: ['actionId']
  },
  
  soul_state: {
    type: 'object',
    properties: {}
  },
  
  soul_event: {
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['experience', 'interaction', 'reflection', 'challenge'] },
      description: { type: 'string' },
      emotionalImpact: { type: 'object' },
      valueImpact: { type: 'object' }
    },
    required: ['type', 'description']
  },
  
  contact_search: {
    type: 'object',
    properties: {
      query: { type: 'string' }
    },
    required: ['query']
  },
  
  contact_add: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      relation: { type: 'string', enum: ['family', 'friend', 'colleague', 'mentor', 'partner', 'other'] },
      notes: { type: 'string' },
      tags: { type: 'array', items: { type: 'string' } },
      avatar: { type: 'string' }
    },
    required: ['name', 'relation']
  },
  
  contact_update: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      relation: { type: 'string', enum: ['family', 'friend', 'colleague', 'mentor', 'partner', 'other'] },
      notes: { type: 'string' },
      tags: { type: 'array', items: { type: 'string' } }
    },
    required: ['id']
  },
  
  interaction_log: {
    type: 'object',
    properties: {
      person_id: { type: 'string' },
      kind: { type: 'string', enum: ['call', 'meet', 'message', 'gift', 'conflict', 'memory', 'other'] },
      summary: { type: 'string' },
      sentiment: { type: 'string', enum: ['positive', 'neutral', 'difficult', 'healing'] },
      details: { type: 'object' },
      gratitude: { type: 'string' }
    },
    required: ['person_id', 'kind', 'summary', 'sentiment']
  },
  
  story_state: {
    type: 'object',
    properties: {}
  },
  
  story_choose: {
    type: 'object',
    properties: {
      optionId: { type: 'string' }
    },
    required: ['optionId']
  },
  
  story_events: {
    type: 'object',
    properties: {
      limit: { type: 'number', default: 50 }
    }
  },
  
  story_person: {
    type: 'object',
    properties: {
      personId: { type: 'string' }
    },
    required: ['personId']
  },
  
  story_refresh: {
    type: 'object',
    properties: {}
  },
  
  ping: {
    type: 'object',
    properties: {}
  }
}
