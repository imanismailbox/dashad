export function storageSet(key: string, value: string) {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(key, value);
  }
}

export function storageGet(key: string, defaultValue?: string) {
  let value = defaultValue;
  if (typeof sessionStorage !== 'undefined') {
    value = sessionStorage.getItem(key);
  }
  return value;
}

export function storageRemove(key: string) {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(key);
  }
}
