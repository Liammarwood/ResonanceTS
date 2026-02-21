import { CONSTANTS } from './constants';

export class LevelManager {
  private level: number = 1;
  private nextLevelScore: number = CONSTANTS.POINTS_PER_LEVEL;

  reset(): void {
    this.level = 1;
    this.nextLevelScore = CONSTANTS.POINTS_PER_LEVEL;
  }

  getLevel(): number { return this.level; }

  /** Segment count for the current level (4 at level 1, +2 per level, capped at RING_SEGMENTS). */
  getSegmentCount(): number {
    return Math.min(
      CONSTANTS.INITIAL_RING_SEGMENTS + (this.level - 1) * CONSTANTS.LEVEL_SEGMENT_STEP,
      CONSTANTS.RING_SEGMENTS,
    );
  }

  /** Pulse speed offset from levelling up (added on top of difficulty-based speed). */
  getLevelSpeedBoost(): number {
    return (this.level - 1) * CONSTANTS.SPEED_PER_LEVEL;
  }

  /**
   * Check whether the given score triggers a level-up.
   * Returns true if a level was advanced (can be called multiple times per absorb
   * to handle rare multi-level jumps).
   */
  checkLevelUp(score: number): boolean {
    if (score >= this.nextLevelScore) {
      this.level++;
      this.nextLevelScore += CONSTANTS.POINTS_PER_LEVEL;
      return true;
    }
    return false;
  }
}
