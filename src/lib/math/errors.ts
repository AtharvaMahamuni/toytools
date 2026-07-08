// A distinct error type for expected, user-facing math problems (bad syntax, domain errors).
// evaluate() surfaces a MathError's message verbatim to the student, but reports any other
// (unexpected) throw as a generic "Invalid expression" so internals never leak into the UI.

export class MathError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MathError';
  }
}
