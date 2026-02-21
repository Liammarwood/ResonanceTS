import { describe, it, expect, beforeEach } from 'vitest';
import { ScoreManager } from '../ScoreManager';
import { CONSTANTS } from '../constants';

describe('ScoreManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with score 0 and combo 0', () => {
    const sm = new ScoreManager();
    expect(sm.getScore()).toBe(0);
    expect(sm.getCombo()).toBe(0);
  });

  it('reads existing high score from localStorage', () => {
    localStorage.setItem(CONSTANTS.HIGHSCORE_KEY, '42');
    const sm = new ScoreManager();
    expect(sm.getHighScore()).toBe(42);
  });

  it('defaults high score to 0 when localStorage is empty', () => {
    const sm = new ScoreManager();
    expect(sm.getHighScore()).toBe(0);
  });

  describe('absorb()', () => {
    it('increments combo by 1 on each call', () => {
      const sm = new ScoreManager();
      sm.absorb();
      expect(sm.getCombo()).toBe(1);
      sm.absorb();
      expect(sm.getCombo()).toBe(2);
    });

    it('adds combo value to score (1+2+3=6 after three absorbs)', () => {
      const sm = new ScoreManager();
      sm.absorb(); // score += 1
      sm.absorb(); // score += 2
      sm.absorb(); // score += 3
      expect(sm.getScore()).toBe(6);
    });

    it('updates high score and persists to localStorage when score exceeds it', () => {
      const sm = new ScoreManager();
      sm.absorb(); // score = 1, highscore = 1
      expect(sm.getHighScore()).toBe(1);
      expect(localStorage.getItem(CONSTANTS.HIGHSCORE_KEY)).toBe('1');
    });

    it('does not lower high score when new score is less', () => {
      localStorage.setItem(CONSTANTS.HIGHSCORE_KEY, '100');
      const sm = new ScoreManager();
      sm.absorb(); // score = 1, below highscore of 100
      expect(sm.getHighScore()).toBe(100);
    });
  });

  describe('reset()', () => {
    it('resets score and combo to 0', () => {
      const sm = new ScoreManager();
      sm.absorb();
      sm.absorb();
      sm.reset();
      expect(sm.getScore()).toBe(0);
      expect(sm.getCombo()).toBe(0);
    });

    it('does not reset the high score', () => {
      const sm = new ScoreManager();
      sm.absorb();
      const hs = sm.getHighScore();
      sm.reset();
      expect(sm.getHighScore()).toBe(hs);
    });
  });

  describe('breakCombo()', () => {
    it('resets combo to 0 without changing score', () => {
      const sm = new ScoreManager();
      sm.absorb();
      sm.absorb(); // score = 3, combo = 2
      sm.breakCombo();
      expect(sm.getCombo()).toBe(0);
      expect(sm.getScore()).toBe(3);
    });
  });
});
