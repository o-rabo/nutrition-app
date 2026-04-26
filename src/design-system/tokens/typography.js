const BASE = 8

export const typography = {

  fontFamily: {
    sans: ['DM Sans', '-apple-system', 'BlinkMacSystemFont',
           'Helvetica Neue', 'sans-serif'].join(', '),
    mono: ['DM Mono', 'SF Mono', 'Fira Code',
           'monospace'].join(', '),
  },

  fontSize: {
    micro:     BASE * 1.25,   // 10 — tab labels, tile labels
    caption:   BASE * 1.5,    // 12 — units, date, overlines
    label:     BASE * 1.75,   // 14 — macro tile values
    bodySmall: BASE * 1.75,   // 14 — subtitles, hints
    base:      BASE * 2,      // 16 — meal names, body text
    h3:        BASE * 2.25,   // 18 — screen titles
    h2:        BASE * 2.75,   // 22 — page headings
    h1:        BASE * 3,       // 24 — quantity picker
    displaySm: BASE * 4,      // 32 — confirmation totals
    display:   BASE * 5.25,   // 42 — calorie ring number
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
    normal:  0,
    wide:    0.3,
    wider:   0.5,
    widest:  1.2,
  },

  textTransform: {
    none:      'none',
    uppercase: 'uppercase',   // overlines only
  },

}

export const textStyles = {
  label: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.base * typography.lineHeight.snug,
  },
  bodyBold: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.fontSize.base * typography.lineHeight.snug,
  },
}
