// Reusable physics kernels shared across simulations (Problem 16): 1D collision resolution and
// energy terms. Pure and DOM-free so models stay unit-testable. Subject-specific but domain-shared;
// a future non-physics domain simply would not import this module.

/**
 * Resolve a 1D collision between two bodies with a coefficient of restitution e in [0, 1]
 * (1 = perfectly elastic, 0 = perfectly inelastic). Returns the post-collision velocities.
 * Conserves momentum for any e; conserves kinetic energy only when e = 1.
 */
export function resolveCollision1D(
  m1: number,
  u1: number,
  m2: number,
  u2: number,
  e: number,
): [number, number] {
  const total = m1 + m2;
  const v1 = (m1 * u1 + m2 * u2 + m2 * e * (u2 - u1)) / total;
  const v2 = (m1 * u1 + m2 * u2 + m1 * e * (u1 - u2)) / total;
  return [v1, v2];
}

/** Translational kinetic energy: KE = 1/2 m v^2. */
export const kineticEnergy = (mass: number, velocity: number): number =>
  0.5 * mass * velocity * velocity;

/** Gravitational potential energy relative to a reference height: PE = m g h. */
export const gravitationalPotential = (mass: number, gravity: number, height: number): number =>
  mass * gravity * height;

/** Elastic (spring) potential energy: PE = 1/2 k x^2. */
export const springPotential = (springConstant: number, displacement: number): number =>
  0.5 * springConstant * displacement * displacement;
