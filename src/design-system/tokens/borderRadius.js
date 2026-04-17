const BASE = 8

export const borderRadius = {

  none:   0,
  subtle: BASE * 0.25,
  sm:     BASE * 0.5,
  md:     BASE * 1,
  lg:     BASE * 1.5,
  xl:     BASE * 2,
  '2xl':  BASE * 2.25,
  '3xl':  BASE * 3,
  /** Pill / fully rounded ends (React Native uses a large number, not %). */
  full:   9999,
  /** Circular clips on square views; use with equal width/height. */
  circle: 9999,

}
