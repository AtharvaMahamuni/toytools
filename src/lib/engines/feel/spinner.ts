// Spinner rest + tick detection. Widget owns the disc; this decides when to stop and when to tick.

export const SPINNER_REST = 0.12;
export const SPINNER_ARM_COUNT = 3;
export const SPINNER_TICK_STEP = (Math.PI * 2) / SPINNER_ARM_COUNT;
export const SPINNER_FRICTION = 0.985;
export const SPINNER_MAX_OMEGA = 52;
export const SPINNER_FLICK_BOOST = 2.4;

export function isAtRest(omega: number, rest = SPINNER_REST): boolean {
  return !Number.isFinite(omega) || Math.abs(omega) < rest;
}

export function wrapAngle(angle: number): number {
  if (!Number.isFinite(angle)) return 0;
  const tau = Math.PI * 2;
  let a = angle % tau;
  if (a < 0) a += tau;
  return a;
}

/** True when an arm has crossed 12 o'clock between prev and next (radians, increasing or decreasing). */
export function crossedTick(prevAngle: number, nextAngle: number, step = SPINNER_TICK_STEP): boolean {
  const prev = Math.floor(wrapAngle(prevAngle) / step);
  const next = Math.floor(wrapAngle(nextAngle) / step);
  return prev !== next;
}

export function restOmega(omega: number, rest = SPINNER_REST): number {
  return isAtRest(omega, rest) ? 0 : omega;
}

export const spinnerApi = {
  isAtRest,
  wrapAngle,
  crossedTick,
  restOmega,
  SPINNER_REST,
  SPINNER_ARM_COUNT,
  SPINNER_FRICTION,
  SPINNER_MAX_OMEGA,
  SPINNER_FLICK_BOOST,
};
