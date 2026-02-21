import { CONSTANTS } from './constants';

export class RingController {
  private rotation: number = 0;
  private targetRotation: number = 0;
  private animStartRotation: number = 0;
  private animProgress: number = 1;
  private segments: number = CONSTANTS.INITIAL_RING_SEGMENTS;

  reset(): void {
    this.rotation = 0;
    this.targetRotation = 0;
    this.animProgress = 1;
    this.segments = CONSTANTS.INITIAL_RING_SEGMENTS;
  }

  setSegments(count: number): void {
    this.segments = Math.max(1, Math.min(count, CONSTANTS.RING_SEGMENTS));
  }

  getSegments(): number { return this.segments; }

  rotate(direction: 1 | -1): void {
    const step = (Math.PI * 2) / this.segments;
    this.animStartRotation = this.rotation;
    this.targetRotation += direction * step;
    this.animProgress = 0;
  }

  update(dt: number): void {
    if (this.animProgress < 1) {
      this.animProgress = Math.min(1, this.animProgress + dt * 1000 / CONSTANTS.ROTATION_DURATION);
      const t = easeOutCubic(this.animProgress);
      this.rotation = this.animStartRotation + (this.targetRotation - this.animStartRotation) * t;
    }
  }

  getRotation(): number { return this.rotation; }

  // Returns segment index for a given world angle
  getSegmentAtAngle(angle: number): number {
    const segAngle = (Math.PI * 2) / this.segments;
    // Normalize angle relative to ring rotation
    const normalized = ((angle - this.rotation) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    return Math.floor(normalized / segAngle) % this.segments;
  }

  getSegmentColor(index: number): string {
    return CONSTANTS.SEGMENT_COLORS[index % this.segments];
  }
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
