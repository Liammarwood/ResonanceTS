import { describe, it, expect, beforeEach } from 'vitest';
import { RingController } from '../RingController';
import { CONSTANTS } from '../constants';

describe('RingController', () => {
  let ring: RingController;
  // Initial step for default 4-segment ring
  const INITIAL_STEP = (Math.PI * 2) / CONSTANTS.INITIAL_RING_SEGMENTS;

  beforeEach(() => {
    ring = new RingController();
  });

  it('initial rotation is 0', () => {
    expect(ring.getRotation()).toBe(0);
  });

  it('starts with INITIAL_RING_SEGMENTS segments', () => {
    expect(ring.getSegments()).toBe(CONSTANTS.INITIAL_RING_SEGMENTS);
  });

  it('reset() restores rotation to 0 and resets segments', () => {
    ring.rotate(1);
    ring.update(1); // complete animation instantly
    ring.setSegments(8);
    ring.reset();
    expect(ring.getRotation()).toBe(0);
    expect(ring.getSegments()).toBe(CONSTANTS.INITIAL_RING_SEGMENTS);
  });

  it('setSegments() updates segment count', () => {
    ring.setSegments(8);
    expect(ring.getSegments()).toBe(8);
  });

  it('setSegments() clamps to max RING_SEGMENTS', () => {
    ring.setSegments(100);
    expect(ring.getSegments()).toBe(CONSTANTS.RING_SEGMENTS);
  });

  it('getSegmentColor returns a color from SEGMENT_COLORS', () => {
    for (let i = 0; i < ring.getSegments(); i++) {
      expect(CONSTANTS.SEGMENT_COLORS).toContain(ring.getSegmentColor(i));
    }
  });

  it('getSegmentColor wraps around via modulo', () => {
    expect(ring.getSegmentColor(0)).toBe(ring.getSegmentColor(ring.getSegments()));
  });

  describe('getSegmentAtAngle', () => {
    it('angle 0 maps to segment 0', () => {
      expect(ring.getSegmentAtAngle(0)).toBe(0);
    });

    it('angle just below first boundary stays in segment 0', () => {
      const justBefore = INITIAL_STEP - 0.001;
      expect(ring.getSegmentAtAngle(justBefore)).toBe(0);
    });

    it('angle at first boundary transitions to segment 1', () => {
      expect(ring.getSegmentAtAngle(INITIAL_STEP)).toBe(1);
    });

    it('each segment covers exactly one rotation step', () => {
      const segments = ring.getSegments();
      const step = (Math.PI * 2) / segments;
      for (let i = 0; i < segments; i++) {
        const midAngle = i * step + step / 2;
        expect(ring.getSegmentAtAngle(midAngle)).toBe(i);
      }
    });

    it('full rotation (2π) wraps back to segment 0', () => {
      expect(ring.getSegmentAtAngle(Math.PI * 2)).toBe(0);
    });

    it('negative angles are normalised correctly', () => {
      const seg = ring.getSegmentAtAngle(-INITIAL_STEP / 2);
      expect(seg).toBe(ring.getSegments() - 1);
    });
  });

  describe('rotation animation', () => {
    it('rotate(1) advances targetRotation by one segment step', () => {
      ring.rotate(1);
      // After completing the animation the visual rotation reaches the target
      ring.update(1); // 1 second >> ROTATION_DURATION
      expect(ring.getRotation()).toBeCloseTo(INITIAL_STEP);
    });

    it('rotate(-1) retreats targetRotation by one segment step', () => {
      ring.rotate(-1);
      ring.update(1);
      expect(ring.getRotation()).toBeCloseTo(-INITIAL_STEP);
    });

    it('multiple rotations accumulate', () => {
      ring.rotate(1);
      ring.update(1);
      ring.rotate(1);
      ring.update(1);
      expect(ring.getRotation()).toBeCloseTo(INITIAL_STEP * 2);
    });
  });
});
