import { CONSTANTS } from './constants';

export class RingController {
  private rotation: number = 0;
  private targetRotation: number = 0;
  private animStartRotation: number = 0;
  private animProgress: number = 1;

  reset(): void {
    this.rotation = 0;
    this.targetRotation = 0;
    this.animProgress = 1;
  }

  rotate(direction: 1 | -1): void {
    this.animStartRotation = this.rotation;
    this.targetRotation += direction * CONSTANTS.ROTATION_STEP;
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

  // Returns segment index (0-7) for a given world angle
  getSegmentAtAngle(angle: number): number {
    const segAngle = (Math.PI * 2) / CONSTANTS.RING_SEGMENTS;
    // Normalize angle relative to ring rotation
    const normalized = ((angle - this.rotation) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    return Math.floor(normalized / segAngle) % CONSTANTS.RING_SEGMENTS;
  }

  getSegmentColor(index: number): string {
    return CONSTANTS.SEGMENT_COLORS[index % CONSTANTS.RING_SEGMENTS];
  }
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
