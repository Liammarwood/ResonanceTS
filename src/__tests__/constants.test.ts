import { describe, it, expect } from 'vitest';
import { CONSTANTS } from '../constants';

describe('CONSTANTS', () => {
  it('has exactly 8 ring segments', () => {
    expect(CONSTANTS.RING_SEGMENTS).toBe(8);
  });

  it('has exactly 8 segment colors matching RING_SEGMENTS', () => {
    expect(CONSTANTS.SEGMENT_COLORS).toHaveLength(CONSTANTS.RING_SEGMENTS);
  });

  it('all segment colors are valid hex strings', () => {
    const hexColor = /^#[0-9A-Fa-f]{6}$/;
    for (const color of CONSTANTS.SEGMENT_COLORS) {
      expect(color).toMatch(hexColor);
    }
  });

  it('ROTATION_STEP equals one full circle divided by segment count', () => {
    expect(CONSTANTS.ROTATION_STEP).toBeCloseTo((Math.PI * 2) / CONSTANTS.RING_SEGMENTS);
  });

  it('difficulty bounds are self-consistent', () => {
    expect(CONSTANTS.MIN_SPAWN_INTERVAL).toBeLessThan(CONSTANTS.INITIAL_SPAWN_INTERVAL);
    expect(CONSTANTS.INITIAL_PULSE_SPEED).toBeLessThan(CONSTANTS.MAX_PULSE_SPEED);
    expect(CONSTANTS.SPEED_INCREMENT).toBeGreaterThan(0);
    expect(CONSTANTS.SPAWN_DECREMENT).toBeGreaterThan(0);
  });

  it('ring geometry ratios are positive fractions', () => {
    expect(CONSTANTS.RING_RADIUS_RATIO).toBeGreaterThan(0);
    expect(CONSTANTS.RING_RADIUS_RATIO).toBeLessThan(1);
    expect(CONSTANTS.RING_WIDTH_RATIO).toBeGreaterThan(0);
    expect(CONSTANTS.RING_WIDTH_RATIO).toBeLessThan(1);
  });
});
