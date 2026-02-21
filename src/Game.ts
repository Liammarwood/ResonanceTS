import { CONSTANTS } from './constants';
import { GameStateManager } from './GameStateManager';
import { RingController } from './RingController';
import { PulseManager } from './PulseManager';
import { InputManager } from './InputManager';
import { ScoreManager } from './ScoreManager';
import { LevelManager } from './LevelManager';
import { Renderer } from './Renderer';

export class Game {
  private stateManager: GameStateManager;
  private ring: RingController;
  private pulseManager: PulseManager;
  private inputManager: InputManager;
  private scoreManager: ScoreManager;
  private levelManager: LevelManager;
  private renderer: Renderer;
  private lastTime: number = 0;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.stateManager = new GameStateManager();
    this.ring = new RingController();
    this.pulseManager = new PulseManager();
    this.scoreManager = new ScoreManager();
    this.levelManager = new LevelManager();
    this.renderer = new Renderer(canvas);
    this.inputManager = new InputManager(canvas);

    this.setupInput();
    this.setupResize();
    this.resize();
  }

  private setupInput(): void {
    this.inputManager.on('rotateLeft', () => {
      if (this.stateManager.is('playing')) this.ring.rotate(-1);
    });
    this.inputManager.on('rotateRight', () => {
      if (this.stateManager.is('playing')) this.ring.rotate(1);
    });
    this.inputManager.on('confirm', () => {
      if (this.stateManager.is('start')) this.startGame();
      else if (this.stateManager.is('gameover')) this.startGame();
    });
  }

  private setupResize(): void {
    window.addEventListener('resize', () => this.resize());
  }

  private resize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.resize(w, h);
  }

  private startGame(): void {
    this.ring.reset();
    this.pulseManager.reset();
    this.scoreManager.reset();
    this.levelManager.reset();
    this.stateManager.transition('playing');
  }

  start(): void {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  private loop(timestamp: number): void {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    this.update(dt);
    this.draw();

    requestAnimationFrame((t) => this.loop(t));
  }

  private update(dt: number): void {
    if (!this.stateManager.is('playing')) return;

    const w = this.canvas.width, h = this.canvas.height;
    const cx = w / 2, cy = h / 2;
    const ringRadius = Math.min(w, h) / 2 * CONSTANTS.RING_RADIUS_RATIO;

    this.ring.update(dt);
    this.renderer.update(dt);

    // Update pulses
    this.pulseManager.update(dt, cx, cy, ringRadius);

    // Check collision
    const hit = this.pulseManager.checkCollision(ringRadius);
    if (hit) {
      const segIdx = this.ring.getSegmentAtAngle(hit.angle);
      const segColor = this.ring.getSegmentColor(segIdx);
      if (segColor === hit.color) {
        // Correct match
        this.scoreManager.absorb();
        this.renderer.spawnParticles(hit.x, hit.y, hit.color);
        this.playAbsorbSound();
        this.pulseManager.removeActive(hit);

        // Level-up check (loop to handle multi-level jumps)
        const score = this.scoreManager.getScore();
        while (this.levelManager.checkLevelUp(score)) {
          const segCount = this.levelManager.getSegmentCount();
          this.ring.setSegments(segCount);
          this.pulseManager.setSegments(segCount);
          const newSpeed = CONSTANTS.INITIAL_PULSE_SPEED + this.levelManager.getLevelSpeedBoost();
          this.pulseManager.setBaseSpeed(newSpeed);
          this.renderer.triggerLevelUp(this.levelManager.getLevel());
        }
      } else {
        // Wrong match - game over
        this.stateManager.transition('gameover');
        this.playFailSound();
      }
    }
  }

  private draw(): void {
    this.renderer.render(
      this.stateManager.getState(),
      this.ring,
      this.pulseManager.getActivePulses(),
      this.scoreManager.getScore(),
      this.scoreManager.getCombo(),
      this.scoreManager.getHighScore(),
      this.levelManager.getLevel(),
    );
  }

  private audioCtx: AudioContext | null = null;

  private getAudioCtx(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioCtx;
  }

  private playAbsorbSound(): void {
    try {
      const ctx = this.getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440 + this.scoreManager.getCombo() * 20, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (_) {}
  }

  private playFailSound(): void {
    try {
      const ctx = this.getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (_) {}
  }
}
