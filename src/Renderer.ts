import { CONSTANTS } from './constants';
import { RingController } from './RingController';
import { Pulse } from './Pulse';
import type { GameState } from './GameStateManager';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  radius: number;
}

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private particles: Particle[] = [];
  private levelUpFlash: number = 0;   // ms remaining for level-up overlay
  private levelUpNumber: number = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  triggerLevelUp(level: number): void {
    this.levelUpFlash = 900;
    this.levelUpNumber = level;
  }

  spawnParticles(x: number, y: number, color: string): void {
    for (let i = 0; i < CONSTANTS.PARTICLE_COUNT; i++) {
      const angle = (i / CONSTANTS.PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.5;
      const speed = CONSTANTS.PARTICLE_SPEED * (0.5 + Math.random() * 0.5);
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        life: CONSTANTS.PARTICLE_LIFETIME,
        maxLife: CONSTANTS.PARTICLE_LIFETIME,
        radius: 3 + Math.random() * 3,
      });
    }
  }

  update(dt: number): void {
    this.levelUpFlash = Math.max(0, this.levelUpFlash - dt * 1000);
    this.particles = this.particles.filter(p => {
      p.life -= dt * 1000;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.95;
      p.vy *= 0.95;
      return p.life > 0;
    });
  }

  render(
    state: GameState,
    ring: RingController,
    pulses: Pulse[],
    score: number,
    combo: number,
    highScore: number,
    level: number,
  ): void {
    const { ctx, canvas } = this;
    const w = canvas.width, h = canvas.height;
    const cx = w / 2, cy = h / 2;
    const ringRadius = Math.min(w, h) / 2 * CONSTANTS.RING_RADIUS_RATIO;
    const ringWidth = ringRadius * CONSTANTS.RING_WIDTH_RATIO;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = CONSTANTS.BG_COLOR;
    ctx.fillRect(0, 0, w, h);

    if (state === 'start') {
      this.drawStartScreen(cx, cy, w, h);
      return;
    }

    // Draw ring
    this.drawRing(ring, cx, cy, ringRadius, ringWidth);

    // Draw pulses
    for (const p of pulses) {
      this.drawPulse(p);
    }

    // Draw particles
    this.drawParticles();

    // Draw UI
    this.drawScore(score, combo, level, w);

    // Level-up flash
    if (this.levelUpFlash > 0) {
      this.drawLevelUpFlash(cx, cy, w, h, this.levelUpNumber, this.levelUpFlash);
    }

    if (state === 'gameover') {
      this.drawGameOver(cx, cy, w, h, score, highScore);
    }
  }

  private drawRing(ring: RingController, cx: number, cy: number, radius: number, width: number): void {
    const { ctx } = this;
    const segCount = ring.getSegments();
    const segAngle = (Math.PI * 2) / segCount;
    const gap = CONSTANTS.RING_GAP;
    const rotation = ring.getRotation();

    for (let i = 0; i < segCount; i++) {
      const startAngle = rotation + i * segAngle + gap / 2;
      const endAngle = rotation + (i + 1) * segAngle - gap / 2;
      const color = ring.getSegmentColor(i);

      ctx.save();
      ctx.shadowBlur = CONSTANTS.GLOW_BLUR;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.stroke();
      ctx.restore();
    }
  }

  private drawPulse(p: Pulse): void {
    const { ctx } = this;
    ctx.save();
    ctx.shadowBlur = CONSTANTS.GLOW_BLUR;
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawParticles(): void {
    const { ctx } = this;
    for (const p of this.particles) {
      const alpha = p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * alpha, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private drawScore(score: number, combo: number, level: number, w: number): void {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(String(score), w / 2, 48);
    if (combo > 1) {
      ctx.fillStyle = '#FFE045';
      ctx.font = '18px "Courier New", monospace';
      ctx.fillText(`x${combo} COMBO`, w / 2, 74);
    }
    ctx.fillStyle = '#45C8FF';
    ctx.font = '16px "Courier New", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`LVL ${level}`, w - 16, 30);
    ctx.restore();
  }

  private drawLevelUpFlash(cx: number, cy: number, w: number, h: number, level: number, remaining: number): void {
    const { ctx } = this;
    const alpha = Math.min(1, remaining / 300) * 0.55;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#45C8FF';
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = Math.min(1, remaining / 300);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#45C8FF';
    ctx.fillText(`LEVEL ${level}`, cx, cy);
    ctx.restore();
  }

  private drawStartScreen(cx: number, cy: number, _w: number, _h: number): void {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#45C8FF';
    ctx.fillText('RESONANCE', cx, cy - 60);
    ctx.shadowBlur = 0;
    ctx.font = '20px "Courier New", monospace';
    ctx.fillStyle = '#AAAAAA';
    ctx.fillText('Rotate the ring to match', cx, cy + 10);
    ctx.fillText('the incoming pulses', cx, cy + 36);
    ctx.fillStyle = '#45C8FF';
    ctx.font = '22px "Courier New", monospace';
    ctx.fillText('TAP / CLICK TO START', cx, cy + 90);
    ctx.restore();
  }

  private drawGameOver(cx: number, cy: number, w: number, h: number, score: number, highScore: number): void {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = 'rgba(10, 10, 15, 0.7)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#FF4B4B';
    ctx.font = 'bold 40px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#FF4B4B';
    ctx.fillText('GAME OVER', cx, cy - 70);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '26px "Courier New", monospace';
    ctx.fillText(`Score: ${score}`, cx, cy - 20);
    ctx.fillStyle = '#FFE045';
    ctx.fillText(`Best: ${highScore}`, cx, cy + 20);
    ctx.fillStyle = '#45C8FF';
    ctx.font = '22px "Courier New", monospace';
    ctx.fillText('TAP / CLICK TO RESTART', cx, cy + 80);
    ctx.restore();
  }
}
