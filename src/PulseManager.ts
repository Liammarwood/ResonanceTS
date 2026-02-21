import { CONSTANTS } from './constants';
import { Pulse } from './Pulse';

export class PulseManager {
  private pool: Pulse[] = [];
  private activePulses: Pulse[] = [];
  private spawnTimer: number = 0;
  private difficultyTimer: number = 0;
  private currentSpeed: number = CONSTANTS.INITIAL_PULSE_SPEED;
  private currentInterval: number = CONSTANTS.INITIAL_SPAWN_INTERVAL;
  private currentSegments: number = CONSTANTS.INITIAL_RING_SEGMENTS;

  constructor(poolSize: number = 30) {
    for (let i = 0; i < poolSize; i++) {
      this.pool.push(new Pulse());
    }
  }

  reset(): void {
    for (const p of this.activePulses) p.deactivate();
    this.activePulses = [];
    this.spawnTimer = 0;
    this.difficultyTimer = 0;
    this.currentSpeed = CONSTANTS.INITIAL_PULSE_SPEED;
    this.currentInterval = CONSTANTS.INITIAL_SPAWN_INTERVAL;
    this.currentSegments = CONSTANTS.INITIAL_RING_SEGMENTS;
  }

  setSegments(count: number): void {
    this.currentSegments = Math.max(1, Math.min(count, CONSTANTS.RING_SEGMENTS));
  }

  setBaseSpeed(speed: number): void {
    this.currentSpeed = Math.min(CONSTANTS.MAX_PULSE_SPEED, speed);
  }

  private acquire(): Pulse {
    for (const p of this.pool) {
      if (!p.active) return p;
    }
    const p = new Pulse();
    this.pool.push(p);
    return p;
  }

  spawn(): void {
    const angle = Math.random() * Math.PI * 2;
    const colorIndex = Math.floor(Math.random() * this.currentSegments);
    const color = CONSTANTS.SEGMENT_COLORS[colorIndex];
    const p = this.acquire();
    p.init(angle, color, this.currentSpeed);
    this.activePulses.push(p);
  }

  update(dt: number, cx: number, cy: number, ringRadius: number): { hit: Pulse | null; missed: Pulse | null } {
    this.spawnTimer += dt * 1000;
    this.difficultyTimer += dt * 1000;

    if (this.spawnTimer >= this.currentInterval) {
      this.spawnTimer = 0;
      this.spawn();
    }

    if (this.difficultyTimer >= CONSTANTS.DIFFICULTY_INTERVAL) {
      this.difficultyTimer = 0;
      this.currentSpeed = Math.min(CONSTANTS.MAX_PULSE_SPEED, this.currentSpeed + CONSTANTS.SPEED_INCREMENT);
      this.currentInterval = Math.max(CONSTANTS.MIN_SPAWN_INTERVAL, this.currentInterval - CONSTANTS.SPAWN_DECREMENT);
    }

    let hit: Pulse | null = null;
    let missed: Pulse | null = null;

    for (const p of this.activePulses) {
      if (!p.active) continue;
      p.distanceTraveled += p.speed * dt;
      p.x = cx + Math.cos(p.angle) * p.distanceTraveled;
      p.y = cy + Math.sin(p.angle) * p.distanceTraveled;

      if (p.distanceTraveled >= ringRadius - p.radius / 2) {
        missed = p;
        break;
      }
    }

    return { hit, missed };
  }

  checkCollision(ringRadius: number): Pulse | null {
    for (const p of this.activePulses) {
      if (!p.active) continue;
      if (p.distanceTraveled >= ringRadius - p.radius / 2) {
        return p;
      }
    }
    return null;
  }

  removeActive(p: Pulse): void {
    p.deactivate();
    const idx = this.activePulses.indexOf(p);
    if (idx !== -1) this.activePulses.splice(idx, 1);
  }

  getActivePulses(): Pulse[] {
    return this.activePulses.filter(p => p.active);
  }
}
