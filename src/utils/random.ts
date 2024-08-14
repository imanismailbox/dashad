export function randomUUID() {
  let d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function')
    d += performance.now();

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function randomNumber(min: number, max: number, roundToDigit?: number) {
  let n = Math.random() * (max - min) + min;
  if (roundToDigit) {
    const m = Math.pow(10, roundToDigit);
    n = Math.round(n * m) / m;
  }
  return n;
}

export function randomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const LOWER_ALPHA = 'abcdefghijklmnopqrstuvwxyz';
export const UPPER_ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const ALPHA = UPPER_ALPHA + LOWER_ALPHA;
export const NUMERIC = '1234567890';
export const ALPHANUMBERIC = ALPHA + NUMERIC;
export function randomChar(chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') {
  return chars[randomInt(0, chars.length - 1)];
}

export function randomColor(alpha = 1) {
  const rgba = new Array(3).fill(0).map(() => randomInt(0, 255));
  rgba.push(alpha);
  return `rgba(${rgba.join(', ')})`;
}
