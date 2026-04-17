const BASE = 8

export const typography = {

  fontFamily: {
    sans: ['DM Sans', '-apple-system', 'BlinkMacSystemFont',
           'Helvetica Neue', 'sans-serif'].join(', '),
    mono: ['DM Mono', 'SF Mono', 'Fira Code',
           'monospace'].join(', '),
  },

  fontSize: {
    micro:     `${BASE * 1.25}px`,   // 10px — tab labels, tile labels
    caption:   `${BASE * 1.5}px`,    // 12px — units, date, overlines
    bodySmall: `${BASE * 1.75}px`,   // 14px — subtitles, hints
    base:      `${BASE * 2}px`,      // 16px — meal names, body text
    h3:        `${BASE * 2.25}px`,   // 18px — screen titles
    h2:        `${BASE * 2.75}px`,   // 22px — page headings
    h1:        `${BASE * 3}px`,      // 24px — quantity picker
    displaySm: `${BASE * 4}px`,      // 32px — confirmation totals
    display:   `${BASE * 5.25}px`,   // 42px — calorie ring number
  },

  fontWeight: {
    regular: 400,
    medium:  500,
  },

  lineHeight: {
    tight:   1,      // display numbers, overlines, micro labels
    snug:    1.2,    // headings
    normal:  1.4,    // captions, body
    relaxed: 1.5,    // longer body text
  },

  letterSpacing: {
    normal:  '0',        // most text
    wide:    '0.02em',   // date label
    wider:   '0.04em',   // macro tile labels
    widest:  '0.08em',   // overlines "MEALS", "TODAY'S CALORIES"
  },

  textTransform: {
    none:      'none',
    uppercase: 'uppercase',   // overlines only
  },

}
