export function formatNumber(
  num: number,
  maximumFractionDigits = 0,
  locale: string | string[] = 'en-US',
  currency?: Intl.NumberFormatOptions['currency']
) {
  const options: Intl.NumberFormatOptions = { maximumFractionDigits };
  if (currency) {
    options.style = 'currency';
    options.currency = currency;
  }
  return new Intl.NumberFormat(locale, options).format(num);
}

export function formatSize(bytes: number, dm = 2) {
  if (bytes === 0) {
    return '0 B';
  }

  const k = 1000,
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function degreeToRadian(num: number) {
  return (num * Math.PI) / 180;
}

export function radianToDegree(num: number) {
  return (num * 180) / Math.PI;
}

export function isNumberNear(a: number, b: number, epsilon = Number.EPSILON) {
  const diff = a - b;
  return diff > -epsilon && diff <= epsilon;
}

export function roundNumber(value: number, precision = 2) {
  const n = Math.pow(10, precision);
  return Math.round(value * n) / n;
}
