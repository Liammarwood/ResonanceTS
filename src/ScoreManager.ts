import { CONSTANTS } from './constants';

export class ScoreManager {
  private score: number = 0;
  private combo: number = 0;
  private highScore: number = 0;

  constructor() {
    this.highScore = parseInt(localStorage.getItem(CONSTANTS.HIGHSCORE_KEY) || '0', 10) || 0;
  }

  reset(): void {
    this.score = 0;
    this.combo = 0;
  }

  absorb(): void {
    this.combo++;
    this.score += this.combo;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem(CONSTANTS.HIGHSCORE_KEY, String(this.highScore));
    }
  }

  breakCombo(): void {
    this.combo = 0;
  }

  getScore(): number { return this.score; }
  getCombo(): number { return this.combo; }
  getHighScore(): number { return this.highScore; }
}
