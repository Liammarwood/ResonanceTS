import { describe, it, expect, beforeEach } from 'vitest';
import { Pulse } from '../Pulse';
import { CONSTANTS } from '../constants';

describe('Pulse', () => {
  let pulse: Pulse;

  beforeEach(() => {
    pulse = new Pulse();
  });

  it('starts inactive', () => {
    expect(pulse.active).toBe(false);
  });

  it('init() activates the pulse with correct properties', () => {
    pulse.init(1.5, '#FF4B4B', 200);

    expect(pulse.active).toBe(true);
    expect(pulse.angle).toBe(1.5);
    expect(pulse.color).toBe('#FF4B4B');
    expect(pulse.speed).toBe(200);
    expect(pulse.distanceTraveled).toBe(0);
    expect(pulse.radius).toBe(CONSTANTS.PULSE_RADIUS);
  });

  it('init() resets distanceTraveled on re-use', () => {
    pulse.init(0, '#FF4B4B', 100);
    pulse.distanceTraveled = 500;
    pulse.init(0, '#FF9F45', 150);
    expect(pulse.distanceTraveled).toBe(0);
  });

  it('deactivate() sets active to false', () => {
    pulse.init(0, '#FF4B4B', 100);
    expect(pulse.active).toBe(true);
    pulse.deactivate();
    expect(pulse.active).toBe(false);
  });
});
