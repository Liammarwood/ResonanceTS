export const CONSTANTS = {
  RING_SEGMENTS: 8,
  SEGMENT_COLORS: ['#FF4B4B', '#FF9F45', '#FFE045', '#4BFF91', '#45C8FF', '#4B6BFF', '#C445FF', '#FF45C8'],
  RING_RADIUS_RATIO: 0.35,      // fraction of min(width, height) / 2
  RING_WIDTH_RATIO: 0.06,       // fraction of ring radius
  PULSE_START_RADIUS: 20,
  PULSE_RADIUS: 10,
  INITIAL_PULSE_SPEED: 180,     // px/sec
  INITIAL_SPAWN_INTERVAL: 1800, // ms
  SPEED_INCREMENT: 8,           // px/sec per difficulty tick
  SPAWN_DECREMENT: 50,          // ms per difficulty tick
  DIFFICULTY_INTERVAL: 8000,    // ms between difficulty increases
  MIN_SPAWN_INTERVAL: 500,
  MAX_PULSE_SPEED: 500,
  ROTATION_STEP: Math.PI / 4,   // 45 deg = one segment
  ROTATION_DURATION: 150,       // ms for animation
  PARTICLE_COUNT: 12,
  PARTICLE_LIFETIME: 600,       // ms
  PARTICLE_SPEED: 80,
  GLOW_BLUR: 18,
  HIGHSCORE_KEY: 'resonance_highscore',
  BG_COLOR: '#0A0A0F',
  RING_GAP: 0.04,               // radians gap between segments
} as const;
