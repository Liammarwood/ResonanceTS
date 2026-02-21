import { describe, it, expect } from 'vitest';
import { GameStateManager } from '../GameStateManager';

describe('GameStateManager', () => {
  it('starts in the "start" state', () => {
    const sm = new GameStateManager();
    expect(sm.getState()).toBe('start');
  });

  it('is() returns true for the current state', () => {
    const sm = new GameStateManager();
    expect(sm.is('start')).toBe(true);
    expect(sm.is('playing')).toBe(false);
    expect(sm.is('gameover')).toBe(false);
  });

  it('transitions from start to playing', () => {
    const sm = new GameStateManager();
    sm.transition('playing');
    expect(sm.getState()).toBe('playing');
    expect(sm.is('playing')).toBe(true);
    expect(sm.is('start')).toBe(false);
  });

  it('transitions from playing to gameover', () => {
    const sm = new GameStateManager();
    sm.transition('playing');
    sm.transition('gameover');
    expect(sm.getState()).toBe('gameover');
    expect(sm.is('gameover')).toBe(true);
  });

  it('transitions from gameover back to playing (restart)', () => {
    const sm = new GameStateManager();
    sm.transition('playing');
    sm.transition('gameover');
    sm.transition('playing');
    expect(sm.getState()).toBe('playing');
  });
});
