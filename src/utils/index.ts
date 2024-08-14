import type { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';
import { format } from 'date-fns';
import { enUS, id } from 'date-fns/locale';
import { defaultInputRanges, defaultStaticRanges } from 'react-date-range';

import colors from './colors';

import type { ObjectSchema } from 'yup';

export * from './coercion';
export * from './number';
export * from './random';
export * from './string';

export function stableSort<T = any, K extends keyof T = keyof T>(
  array: T[],
  orderBy?: K,
  order: 'asc' | 'desc' = 'asc'
) {
  return array
    .map((el, idx) => [el, idx] as [T, number])
    .sort((a, b) => {
      const valA = orderBy ? a[0][orderBy] : a[0];
      const valB = orderBy ? b[0][orderBy] : b[0];
      if (order === 'asc') {
        return valA > valB ? 1 : valA < valB ? -1 : a[1] - b[1];
      }
      return valA > valB ? -1 : valA < valB ? 1 : b[1] - a[1];
    })
    .map(el => el[0]);
}

export function getServerUrl() {
  let serverUrl = import.meta.env.VITE_SERVER_URL;
  if (!serverUrl.endsWith('/')) serverUrl += '/';
  return serverUrl;
}

export function normalizeUrl(url: string, trailingSlash = true) {
  url = url.replace(/(?<!:)\/+/g, '/').replace(/\/$/, '');
  return trailingSlash ? url + '/' : url;
}

export function getQueryParams(search: string) {
  return new URLSearchParams(search);
}

export function storageSet(key: string, value: string) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

export function storageGet(key: string, defaultValue?: string) {
  let value = defaultValue;
  if (typeof localStorage !== 'undefined') {
    value = localStorage.getItem(key);
  }
  return value;
}

export function storageRemove(key: string) {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
  }
}

export function formatDate(
  date: string | Date = new Date(),
  formatString = 'Pp',
  locale: 'en' | 'id' = 'en'
) {
  if (typeof date === 'string') date = new Date(date);
  return format(date, formatString, { locale: locale === 'id' ? id : enUS });
}

export function normalizeInputValues<T = Record<string, any>>(values: T) {
  const result: Partial<Record<keyof T, any>> = {};
  for (const k in values) {
    const v = values[k];
    result[k] = v === null ? '' : v;
  }

  return result;
}

export function isEmpty(obj?: object) {
  if (!obj) return true;
  const arr = Array.isArray(obj) ? obj : Object.keys(obj);
  return arr.length < 1;
}

export function testLonLat(val?: number[]) {
  if (!val) return true;
  const [x, y] = val;
  let retval = true;
  if (typeof x === 'number') retval = retval && x <= 180 && x >= -180;
  if (typeof y === 'number') retval = retval && y <= 90 && y >= -90;
  return retval;
}

export function copyToClipboard(text: string) {
  navigator.clipboard?.writeText(text);
}

export function getSuggestedFilename(
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders,
  defaultValue: string = ''
) {
  const contentDisposition: string =
    headers['content-disposition'] ?? headers['Content-Disposition'];
  if (!contentDisposition) return defaultValue;
  const match = contentDisposition.match(/filename="?(.+?)"?(;|$)/);
  return match[1] ?? defaultValue;
}

export function nullToEmpty<T = unknown>(value: T) {
  return value === null || value === undefined ? '' : value;
}

export function getDefaultValues<T = unknown>(
  schema: ObjectSchema<T>,
  defaultValue: any = null,
  overrides?: Record<keyof T, any>
) {
  const result: Partial<Record<keyof T, any>> = {};
  for (const key in schema.fields) result[key] = defaultValue;
  return { ...result, ...overrides };
}

const staticRangeLabels: Record<string, string> = {
  Today: 'Hari Ini',
  Yesterday: 'Kemarin',
  'This Week': 'Minggu Ini',
  'Last Week': 'Minggu Lalu',
  'This Month': 'Bulan Ini',
  'Last Month': 'Bulan Lalu',
};

const inputRangeLabels: Record<string, string> = {
  'days up to today': 'hari sampai hari ini',
  'days starting today': 'hari mulai hari ini',
};

export const localizedStaticRanges = defaultStaticRanges.map(({ label, ...rest }) => ({
  label: staticRangeLabels[label] ?? label,
  ...rest,
}));

export const localizedInputRanges = defaultInputRanges.map(({ label, ...rest }) => ({
  label: inputRangeLabels[label] ?? label,
  ...rest,
}));

export const dateRangeColors = [colors.primary[700]];

export const nullableNumberTransformer = (v: any, o: any) => (o === '' ? null : v);

export const testNumberArray =
  (length: number, required = false) =>
  (val?: any | any[]) => {
    if (!required && !val) return true;
    return (
      Array.isArray(val) &&
      val.length === length &&
      val.reduce((p, c) => p && typeof c === 'number', true)
    );
  };
