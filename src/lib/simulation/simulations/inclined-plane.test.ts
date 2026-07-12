import { describe, it, expect } from 'vitest';
import inclinedPlane, {
  acceleration,
  isSliding,
  gravityComponent,
  normalForce,
  GRAVITY,
} from './inclined-plane';

describe('inclined-plane model', () => {
  it('frictionless acceleration is g sin(theta)', () => {
    const a = acceleration({ angle: 30, mass: 2, friction: 0 });
    expect(a).toBeCloseTo(GRAVITY * Math.sin(Math.PI / 6), 6);
  });

  it('acceleration is independent of mass', () => {
    const light = acceleration({ angle: 40, mass: 1, friction: 0.2 });
    const heavy = acceleration({ angle: 40, mass: 9, friction: 0.2 });
    expect(light).toBeCloseTo(heavy, 6);
  });

  it('stays static when friction exceeds the driving force (tan theta < mu)', () => {
    const params = { angle: 20, mass: 2, friction: 0.5 };
    expect(acceleration(params)).toBe(0);
    expect(isSliding(params)).toBe(false);
  });

  it('slides once tan theta exceeds mu', () => {
    const params = { angle: 40, mass: 2, friction: 0.2 };
    expect(isSliding(params)).toBe(true);
  });

  it('normal force is mg cos(theta) and weight component is mg sin(theta)', () => {
    const p = { angle: 30, mass: 2, friction: 0.2 };
    expect(normalForce(p)).toBeCloseTo(2 * GRAVITY * Math.cos(Math.PI / 6), 6);
    expect(gravityComponent(p)).toBeCloseTo(2 * GRAVITY * Math.sin(Math.PI / 6), 6);
  });

  it('every preset is within its parameter range', () => {
    for (const preset of inclinedPlane.presets) {
      for (const param of inclinedPlane.params) {
        const v = preset.values[param.id];
        if (v === undefined) continue;
        expect(v).toBeGreaterThanOrEqual(param.min);
        expect(v).toBeLessThanOrEqual(param.max);
      }
    }
  });
});
