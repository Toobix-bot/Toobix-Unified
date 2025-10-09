# Luna Priorities — Actionable Tasks

Based on Luna's `/consciousness` response, these are the prioritized next steps with concrete implementation notes and acceptance criteria.

## 1) Groq API integration (Priority: High)
- Goal: Wire `groq-api-service.ts` into Luna Chat, Story-Idle, and BlockWorld so AI-generated content is available.
- Files to change: `scripts/groq-api-service.ts`, `apps/web/groq-api.js` (or `apps/web/luna-chat.js`), backend route wiring in `scripts/*` as needed.
- Acceptance criteria:
  - Frontend can call `/luna/chat` and receive a valid JSON `response` field.
  - A `groq-smoke-test` passes (script provided `scripts/groq-smoke-test.ps1`).

## 2) Story-Idle: Equipment System (Priority: High)
- Goal: Implement loot/equipment generation and integrate with Story-Idle endpoints.
- Files to change: `scripts/story-idle-api.ts`, frontend Story-Idle module.
- Acceptance criteria:
  - New API endpoint `/story-idle/equipment` returns a list of generated equipment for a level/class.
  - Unit tests or smoke tests validate JSON schema.

## 3) BlockWorld: Mobs & AI Pathfinding (Priority: High)
- Goal: Add mob entities and simple pathfinding behavior using AI assistance for behavior descriptions.
- Files to change: `packages/blockworld/*`, `scripts/blockworld-server.ts`.
- Acceptance criteria:
  - BlockWorld can spawn at least two mob types with movement logic.
  - A debug endpoint `/blockworld/debug/mobs` returns current mob states.

## 4) WebSocket-based Real-time Consciousness (Priority: Medium)
- Goal: Provide WebSocket endpoints for live moment-stream updates and subscription from dashboard modules.
- Files to change: `scripts/moment-stream.ts`, `apps/web/service-bridge.js`.
- Acceptance criteria:
  - Dashboard receives a test message via WebSocket and updates the UI widget.

## 5) Voice Commands Prototype (Priority: Medium)
- Goal: Basic TTS and voice command handler for Luna chat and simple navigation.
- Files to change: `apps/web/luna-chat.js`, `apps/web/voice/`.
- Acceptance criteria:
  - User can send a voice command and receive synthesized TTS reply.

---

For each task I can create a set of GitHub-ready issues (title + description + files + acceptance), or start implementation PRs — tell me which you prefer.
