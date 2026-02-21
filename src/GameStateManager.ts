export type GameState = 'start' | 'playing' | 'gameover';

export class GameStateManager {
  private state: GameState = 'start';

  getState(): GameState { return this.state; }
  is(s: GameState): boolean { return this.state === s; }
  transition(s: GameState): void { this.state = s; }
}
