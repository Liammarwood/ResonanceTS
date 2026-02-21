export type InputAction = 'rotateLeft' | 'rotateRight' | 'confirm';

export class InputManager {
  private callbacks: Map<InputAction, () => void> = new Map();
  private canvas: HTMLCanvasElement;
  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundMouseDown: (e: MouseEvent) => void;
  private boundTouchStart: (e: TouchEvent) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.boundKeyDown = this.onKeyDown.bind(this);
    this.boundMouseDown = this.onMouseDown.bind(this);
    this.boundTouchStart = this.onTouchStart.bind(this);
    window.addEventListener('keydown', this.boundKeyDown);
    canvas.addEventListener('mousedown', this.boundMouseDown);
    canvas.addEventListener('touchstart', this.boundTouchStart, { passive: false });
  }

  on(action: InputAction, cb: () => void): void {
    this.callbacks.set(action, cb);
  }

  private fire(action: InputAction): void {
    this.callbacks.get(action)?.();
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.fire('rotateLeft');
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.fire('rotateRight');
    else if (e.key === ' ' || e.key === 'Enter') this.fire('confirm');
  }

  private onMouseDown(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) this.fire('rotateLeft');
    else this.fire('rotateRight');
    this.fire('confirm');
  }

  private onTouchStart(e: TouchEvent): void {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    if (x < rect.width / 2) this.fire('rotateLeft');
    else this.fire('rotateRight');
    this.fire('confirm');
  }

  destroy(): void {
    window.removeEventListener('keydown', this.boundKeyDown);
    this.canvas.removeEventListener('mousedown', this.boundMouseDown);
    this.canvas.removeEventListener('touchstart', this.boundTouchStart);
  }
}
