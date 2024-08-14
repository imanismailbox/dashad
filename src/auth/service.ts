import type { User, UserRegistration } from '~/models/User';
import { nullToEmpty } from '~/utils';
import axios from 'axios';

export async function login(username: string, password: string) {
  await axios.get('/sanctum/csrf-cookie');
  const res = await axios.post<{ data: { token: string } }>('/sanctum/token', {
    username,
    password,
    token_name: 'web_client',
    unique: true,
  });
  return res.data.data.token;
}

export async function getUser(token?: string) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await axios.get<{ data: User }>('/auth/user', { headers });
  const user = res.data.data;

  // const permissionsRes = await axios.get<string[]>('/api/v1/permissions/user', { headers });
  // user.permissions = permissionsRes.data;

  return user;
}

export function logout() {
  return axios.post<ApiResponse>('/auth/logout');
}

export function updateProfile(data: UserRegistration) {
  const formData = new FormData();
  for (const key in data) formData.append(key, nullToEmpty(data[key as keyof UserRegistration]));
  return axios.post('/api/user', formData);
}
