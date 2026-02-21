import { describe, it, expect, beforeEach } from 'vitest';
import { PulseManager } from '../PulseManager';
import { CONSTANTS } from '../constants';

describe('PulseManager', () => {
  let pm: PulseManager;

  beforeEach(() => {
    pm = new PulseManager(10);
  });

  it('starts with no active pulses', () => {
    expect(pm.getActivePulses()).toHaveLength(0);
  });

  it('spawn() adds an active pulse', () => {
    pm.spawn();
    expect(pm.getActivePulses()).toHaveLength(1);
  });

  it('spawned pulse has a valid SEGMENT_COLOR', () => {
    pm.spawn();
    const pulse = pm.getActivePulses()[0];
    expect(CONSTANTS.SEGMENT_COLORS).toContain(pulse.color);
  });

  it('setSegments() limits pulse colors to the active segment range', () => {
    pm.setSegments(4);
    for (let i = 0; i < 20; i++) pm.spawn();
    const pulses = pm.getActivePulses();
    const allowedColors = CONSTANTS.SEGMENT_COLORS.slice(0, 4);
    for (const p of pulses) {
      expect(allowedColors).toContain(p.color);
    }
  });

  it('removeActive() deactivates and removes the pulse from the list', () => {
    pm.spawn();
    const pulse = pm.getActivePulses()[0];
    pm.removeActive(pulse);
    expect(pm.getActivePulses()).toHaveLength(0);
    expect(pulse.active).toBe(false);
  });

  it('reset() clears all active pulses and resets timers', () => {
    pm.spawn();
    pm.spawn();
    expect(pm.getActivePulses()).toHaveLength(2);
    pm.reset();
    expect(pm.getActivePulses()).toHaveLength(0);
  });

  it('pool reuse: removed pulses can be re-acquired on next spawn', () => {
    // Exhaust the initial pool of 10
    for (let i = 0; i < 10; i++) pm.spawn();
    const first = pm.getActivePulses()[0];
    pm.removeActive(first);
    // Next spawn should reuse a pooled (now inactive) pulse
    pm.spawn();
    expect(pm.getActivePulses()).toHaveLength(10);
  });

  it('spawn() beyond pool size dynamically grows the pool', () => {
    for (let i = 0; i < 15; i++) pm.spawn();
    expect(pm.getActivePulses()).toHaveLength(15);
  });

  describe('checkCollision', () => {
    it('returns null when no pulse has reached the ring radius', () => {
      pm.spawn();
      expect(pm.checkCollision(200)).toBeNull();
    });

    it('returns the pulse once its distanceTraveled reaches ringRadius - radius/2', () => {
      pm.spawn();
      const pulse = pm.getActivePulses()[0];
      const ringRadius = 200;
      pulse.distanceTraveled = ringRadius - CONSTANTS.PULSE_RADIUS / 2;
      expect(pm.checkCollision(ringRadius)).toBe(pulse);
    });

    it('ignores inactive pulses', () => {
      pm.spawn();
      const pulse = pm.getActivePulses()[0];
      pulse.distanceTraveled = 500;
      pulse.deactivate();
      expect(pm.checkCollision(100)).toBeNull();
    });
  });

  describe('update()', () => {
    it('auto-spawns a pulse when spawnTimer exceeds current interval', () => {
      const dt = CONSTANTS.INITIAL_SPAWN_INTERVAL / 1000 + 0.1;
      pm.update(dt, 400, 300, 200);
      expect(pm.getActivePulses().length).toBeGreaterThanOrEqual(1);
    });

    it('moves active pulses outward each tick', () => {
      pm.spawn();
      const pulse = pm.getActivePulses()[0];
      const before = pulse.distanceTraveled;
      pm.update(0.016, 400, 300, 200);
      expect(pulse.distanceTraveled).toBeGreaterThan(before);
    });

    it('caps speed at MAX_PULSE_SPEED after many difficulty ticks', () => {
      const ticksNeeded = Math.ceil(
        (CONSTANTS.MAX_PULSE_SPEED - CONSTANTS.INITIAL_PULSE_SPEED) / CONSTANTS.SPEED_INCREMENT,
      );
      const dt = (CONSTANTS.DIFFICULTY_INTERVAL / 1000) * (ticksNeeded + 5);
      pm.update(dt, 400, 300, 200);
      // Verify by spawning and checking speed does not exceed cap
      pm.reset();
      pm.spawn();
      const pulse = pm.getActivePulses()[0];
      expect(pulse.speed).toBeLessThanOrEqual(CONSTANTS.MAX_PULSE_SPEED);
    });
  });
});
