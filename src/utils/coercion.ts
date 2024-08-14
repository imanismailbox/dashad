/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/** Wraps the provided value in an array, unless the provided value is an array. */
export function coerceArray<T>(value: T | T[]) {
  return Array.isArray(value) ? value : [value];
}

/**
 * Type describing the allowed values for a boolean input.
 * @docs-private
 */
export function coerceBoolean(value: any) {
  return value != null && `${value}` !== 'false';
}

/** Coerces a data-bound value (typically a string) to a number. */
export function coerceNumber(value: any, fallbackValue = 0) {
  return _isNumberValue(value) ? Number(value) : fallbackValue;
}

/**
 * Whether the provided value is considered a number.
 * @docs-private
 */
export function _isNumberValue(value: any) {
  // parseFloat(value) handles most of the cases we're interested in (it treats null, empty string,
  // and other non-number values as NaN, where Number just uses 0) but it considers the string
  // '123hello' to be a valid number. Therefore we also check if Number(value) is NaN.
  return !isNaN(parseFloat(value)) && !isNaN(Number(value));
}
