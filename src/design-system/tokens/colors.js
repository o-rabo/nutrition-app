const primitives = {
  green: {
    50: '#e8f5ea',
    100: '#a8e6b4',
    200: '#6acc7e',
    300: '#5bb56e',
    400: '#3b7d4a',
    500: '#2a6338',
    600: '#1e4d2b',
    700: '#132b1a',
    800: '#0d2215',
    900: '#0a2010',
    950: '#0d2b17',
  },
  white: {
    100: 'rgba(255, 255, 255, 1)',
    60: 'rgba(255, 255, 255, 0.6)',
    45: 'rgba(255, 255, 255, 0.45)',
    35: 'rgba(255, 255, 255, 0.35)',
    15: 'rgba(255, 255, 255, 0.15)',
    10: 'rgba(255, 255, 255, 0.10)',
    8: 'rgba(255, 255, 255, 0.08)',
  },
  black: {
    100: 'rgba(0, 0, 0, 1)',
    45: 'rgba(0, 0, 0, 0.45)',
  },
};

export const colors = {
  primitives,
  background: {
    app: primitives.green[950],
    card: primitives.green[700],
    cardDeep: primitives.green[800],
    overlay: primitives.black[45],
    tabBar: primitives.green[900],
  },
  border: {
    subtle: primitives.green[600],
    medium: primitives.green[500],
    strong: primitives.green[400],
  },
  text: {
    primary: primitives.green[50],
    secondary: primitives.white[60],
    muted: primitives.white[45],
    faint: primitives.white[35],
    accent: primitives.green[100],
  },
  accent: {
    default: primitives.green[300],
    strong: primitives.green[400],
    subtle: primitives.green[600],
    glow: primitives.green[200],
  },
  interactive: {
    primary: primitives.green[400],
    primaryLabel: primitives.green[50],
    ghost: 'transparent',
    ghostLabel: primitives.green[200],
    ghostBorder: primitives.green[600],
  },
  state: {
    success: primitives.green[200],
    warning: '#EF9F27',
    error: '#E24B4A',
    info: '#378ADD',
  },
};
