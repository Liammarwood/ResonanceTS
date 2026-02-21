import { describe, it, expect, beforeEach } from 'vitest';
import { LevelManager } from '../LevelManager';
import { CONSTANTS } from '../constants';

describe('LevelManager', () => {
  let lm: LevelManager;

  beforeEach(() => {
    lm = new LevelManager();
  });

  it('starts at level 1', () => {
    expect(lm.getLevel()).toBe(1);
  });

  it('level 1 has INITIAL_RING_SEGMENTS segments', () => {
    expect(lm.getSegmentCount()).toBe(CONSTANTS.INITIAL_RING_SEGMENTS);
  });

  it('level 1 has no speed boost', () => {
    expect(lm.getLevelSpeedBoost()).toBe(0);
  });

  it('checkLevelUp returns false below threshold', () => {
    expect(lm.checkLevelUp(CONSTANTS.POINTS_PER_LEVEL - 1)).toBe(false);
    expect(lm.getLevel()).toBe(1);
  });

  it('checkLevelUp returns true when score reaches threshold', () => {
    expect(lm.checkLevelUp(CONSTANTS.POINTS_PER_LEVEL)).toBe(true);
    expect(lm.getLevel()).toBe(2);
  });

  it('level 2 adds LEVEL_SEGMENT_STEP segments', () => {
    lm.checkLevelUp(CONSTANTS.POINTS_PER_LEVEL);
    expect(lm.getSegmentCount()).toBe(CONSTANTS.INITIAL_RING_SEGMENTS + CONSTANTS.LEVEL_SEGMENT_STEP);
  });

  it('segment count is capped at RING_SEGMENTS', () => {
    // Advance many levels
    for (let i = 0; i < 20; i++) {
      lm.checkLevelUp((i + 1) * CONSTANTS.POINTS_PER_LEVEL);
    }
    expect(lm.getSegmentCount()).toBeLessThanOrEqual(CONSTANTS.RING_SEGMENTS);
  });

  it('level speed boost increases with each level', () => {
    lm.checkLevelUp(CONSTANTS.POINTS_PER_LEVEL);
    const boost1 = lm.getLevelSpeedBoost();
    lm.checkLevelUp(CONSTANTS.POINTS_PER_LEVEL * 2);
    const boost2 = lm.getLevelSpeedBoost();
    expect(boost2).toBeGreaterThan(boost1);
  });

  it('reset() restores level 1 and initial segment count', () => {
    lm.checkLevelUp(CONSTANTS.POINTS_PER_LEVEL * 3);
    lm.reset();
    expect(lm.getLevel()).toBe(1);
    expect(lm.getSegmentCount()).toBe(CONSTANTS.INITIAL_RING_SEGMENTS);
    expect(lm.getLevelSpeedBoost()).toBe(0);
  });

  it('checkLevelUp allows multiple consecutive level-ups when score jumps', () => {
    // Score is already above two thresholds
    const score = CONSTANTS.POINTS_PER_LEVEL * 3;
    let levelled = 0;
    while (lm.checkLevelUp(score)) levelled++;
    expect(levelled).toBe(3);
    expect(lm.getLevel()).toBe(4);
  });
});
