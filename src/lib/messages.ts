import get from 'lodash/get';

export const messages = {
  error: 'Terjadi kesalahan. Silahkan coba kembali atau hubungi administrator.',
  error_download_template: 'Tidak dapat mengunduh template.',
  login: {
    error: 'Terjadi kesalahan. Periksa kembali nama pengguna dan kata sandi Anda.',
  },
  roles: {
    index_failed: 'Tidak bisa mendapatkan Role pengguna.',
  },
  data: {
    saved: ':name sudah disimpan.',
    deleted: ':name terpilih sudah dihapus.',
    imported: ':value data berhasil diimpor.',
  },
  validation: {
    required: ':field wajib diisi.',
    invalid: ':field tidak valid.',
    min: {
      string: ':field minimal :value karakter.',
      number: ':field harus sama dengan atau lebih besar dari :value.',
    },
  },
};

export type Messages = typeof messages;

export interface MessageOptions {
  fallback?: string;
  [key: string]: string;
}

export function __(key: Leaves<Messages>, options?: MessageOptions): string;
export function __<K1 extends keyof Messages, K2 extends keyof Messages[K1]>(
  key: [K1, K2],
  options?: MessageOptions
): string;
export function __<
  K1 extends keyof Messages,
  K2 extends keyof Messages[K1],
  K3 extends keyof Messages[K1][K2],
>(key: [K1, K2, K3], options?: MessageOptions): string;
export function __<
  K1 extends keyof Messages,
  K2 extends keyof Messages[K1],
  K3 extends keyof Messages[K1][K2],
  K4 extends keyof Messages[K1][K2][K3],
>(key: [K1, K2, K3, K4], options?: MessageOptions): string;
export function __(key: string | string[], options?: MessageOptions): string;
export function __(key: string | string[], options: MessageOptions = {}) {
  const { fallback = '', ...args } = options;
  let msg = get(messages, key, fallback) as string;
  if (args && msg) {
    for (const key in args) {
      const value = args[key];
      msg = msg.replace(new RegExp(`:${key}`, 'g'), value);
    }
  }
  return msg;
}

export default __;
