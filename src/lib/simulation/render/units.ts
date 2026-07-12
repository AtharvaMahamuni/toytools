// Unit conversions shared across simulations (thermodynamics, gas law, etc.). Pure.

export const GAS_CONSTANT_R = 8.314; // J / (mol K)

export const celsiusToKelvin = (c: number): number => c + 273.15;
export const kelvinToCelsius = (k: number): number => k - 273.15;

export const litersToCubicMeters = (l: number): number => l / 1000;
export const cubicMetersToLiters = (m3: number): number => m3 * 1000;

export const pascalsToKilopascals = (pa: number): number => pa / 1000;
export const kilopascalsToPascals = (kpa: number): number => kpa * 1000;
