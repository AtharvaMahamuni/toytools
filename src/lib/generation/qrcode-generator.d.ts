// Minimal ambient types for `qrcode-generator` (MIT, ships no bundled .d.ts).
// Only the surface we use is declared. See https://github.com/kazuhikoarase/qrcode-generator.

declare module 'qrcode-generator' {
  type TypeNumber = number; // 0 = auto-detect the smallest fitting version
  type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

  interface QRCode {
    addData(data: string): void;
    make(): void;
    getModuleCount(): number;
    isDark(row: number, col: number): boolean;
  }

  function qrcode(typeNumber: TypeNumber, errorCorrectionLevel: ErrorCorrectionLevel): QRCode;
  export default qrcode;
}
