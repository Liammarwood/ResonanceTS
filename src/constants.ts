export const CONSTANTS = {
  RING_SEGMENTS: 16,            // maximum segment count
  INITIAL_RING_SEGMENTS: 4,     // starting segment count
  LEVEL_SEGMENT_STEP: 2,        // segments added per level
  POINTS_PER_LEVEL: 10,         // score points required to advance one level
  SPEED_PER_LEVEL: 15,          // px/sec speed boost applied on each level-up
  SEGMENT_COLORS: [
    '#FF4B4B', '#FF9F45', '#FFE045', '#4BFF91',
    '#45C8FF', '#4B6BFF', '#C445FF', '#FF45C8',
    '#FF6B9D', '#00E5FF', '#B2FF59', '#FF6D00',
    '#EA80FC', '#00BFA5', '#FFD180', '#82B1FF',
  ],
  RING_RADIUS_RATIO: 0.9,       // fraction of min(width, height) / 2
  RING_WIDTH_RATIO: 0.06,       // fraction of ring radius
  PULSE_START_RADIUS: 20,
  PULSE_RADIUS: 10,
  INITIAL_PULSE_SPEED: 100,     // px/sec (slower start)
  INITIAL_SPAWN_INTERVAL: 1800, // ms
  SPEED_INCREMENT: 8,           // px/sec per difficulty tick
  SPAWN_DECREMENT: 50,          // ms per difficulty tick
  DIFFICULTY_INTERVAL: 8000,    // ms between difficulty increases
  MIN_SPAWN_INTERVAL: 500,
  MAX_PULSE_SPEED: 600,
  ROTATION_DURATION: 150,       // ms for animation
  PARTICLE_COUNT: 12,
  PARTICLE_LIFETIME: 600,       // ms
  PARTICLE_SPEED: 80,
  GLOW_BLUR: 18,
  HIGHSCORE_KEY: 'resonance_highscore',
  BG_COLOR: '#0A0A0F',
  RING_GAP: 0.04,               // radians gap between segments
} as const;
