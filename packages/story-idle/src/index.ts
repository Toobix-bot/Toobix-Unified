// Story-Idle Game Package - Main Export
export { GameStateManager } from './engine/game-state'
export type { GameState } from './engine/game-state'

export { Luna } from './characters/luna'
export type { LunaState } from './characters/luna'

export { parseCommitMessage, processCommit, detectSpecialCommits } from './events/commit-events'
export type { CommitEvent } from './events/commit-events'

export * from './ui/visual-effects'

export { StoryIdleGame } from './game'
