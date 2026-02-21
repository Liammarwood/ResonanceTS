import { describe, it, expect, beforeEach } from 'vitest';
import { RingController } from '../RingController';
import { CONSTANTS } from '../constants';

describe('RingController', () => {
  let ring: RingController;

  beforeEach(() => {
    ring = new RingController();
  });

  it('initial rotation is 0', () => {
    expect(ring.getRotation()).toBe(0);
  });

  it('reset() restores rotation to 0', () => {
    ring.rotate(1);
    ring.update(1); // complete animation instantly
    ring.reset();
    expect(ring.getRotation()).toBe(0);
  });

  it('getSegmentColor returns a color from SEGMENT_COLORS', () => {
    for (let i = 0; i < CONSTANTS.RING_SEGMENTS; i++) {
      expect(CONSTANTS.SEGMENT_COLORS).toContain(ring.getSegmentColor(i));
    }
  });

  it('getSegmentColor wraps around via modulo', () => {
    expect(ring.getSegmentColor(0)).toBe(ring.getSegmentColor(CONSTANTS.RING_SEGMENTS));
  });

  describe('getSegmentAtAngle', () => {
    it('angle 0 maps to segment 0', () => {
      expect(ring.getSegmentAtAngle(0)).toBe(0);
    });

    it('angle just below first boundary stays in segment 0', () => {
      const justBefore = CONSTANTS.ROTATION_STEP - 0.001;
      expect(ring.getSegmentAtAngle(justBefore)).toBe(0);
    });

    it('angle at first boundary transitions to segment 1', () => {
      expect(ring.getSegmentAtAngle(CONSTANTS.ROTATION_STEP)).toBe(1);
    });

    it('each segment covers exactly one ROTATION_STEP', () => {
      for (let i = 0; i < CONSTANTS.RING_SEGMENTS; i++) {
        const midAngle = i * CONSTANTS.ROTATION_STEP + CONSTANTS.ROTATION_STEP / 2;
        expect(ring.getSegmentAtAngle(midAngle)).toBe(i);
      }
    });

    it('full rotation (2π) wraps back to segment 0', () => {
      expect(ring.getSegmentAtAngle(Math.PI * 2)).toBe(0);
    });

    it('negative angles are normalised correctly', () => {
      const seg = ring.getSegmentAtAngle(-CONSTANTS.ROTATION_STEP / 2);
      expect(seg).toBe(CONSTANTS.RING_SEGMENTS - 1);
    });
  });

  describe('rotation animation', () => {
    it('rotate(1) advances targetRotation by ROTATION_STEP', () => {
      ring.rotate(1);
      // After completing the animation the visual rotation reaches the target
      ring.update(1); // 1 second >> ROTATION_DURATION
      expect(ring.getRotation()).toBeCloseTo(CONSTANTS.ROTATION_STEP);
    });

    it('rotate(-1) retreats targetRotation by ROTATION_STEP', () => {
      ring.rotate(-1);
      ring.update(1);
      expect(ring.getRotation()).toBeCloseTo(-CONSTANTS.ROTATION_STEP);
    });

    it('multiple rotations accumulate', () => {
      ring.rotate(1);
      ring.update(1);
      ring.rotate(1);
      ring.update(1);
      expect(ring.getRotation()).toBeCloseTo(CONSTANTS.ROTATION_STEP * 2);
    });
  });
});
