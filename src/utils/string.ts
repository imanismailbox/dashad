export function toWordCase(text: string) {
  if (text.search('_') !== -1) return text.replace(/_/g, ' ');
  else if (text.search(/\s/) === -1) return text.replace(/([A-Z])/g, ' $1').replace(/^\s/, '');
  return text;
}

export function toTitleCase(text: string) {
  return toWordCase(text)
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function toSnakeCase(text: string) {
  return toWordCase(text).toLowerCase().replace(/\s/g, '_');
}

export function toPascalCase(text: string) {
  return toTitleCase(text).replace(/\s/g, '');
}

export function toCamelCase(text: string) {
  return toPascalCase(text).replace(/^\w/, c => c.toLowerCase());
}
