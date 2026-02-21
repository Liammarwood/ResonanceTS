export class Pulse {
  active: boolean = false;
  x: number = 0;
  y: number = 0;
  angle: number = 0;
  color: string = '';
  speed: number = 0;
  radius: number = 0;
  distanceTraveled: number = 0;

  init(angle: number, color: string, speed: number): void {
    this.active = true;
    this.angle = angle;
    this.color = color;
    this.speed = speed;
    this.distanceTraveled = 0;
    this.radius = 10;
  }

  deactivate(): void {
    this.active = false;
  }
}
