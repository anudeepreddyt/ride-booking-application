
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: baseURL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cab_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function saveSession(data) {
  localStorage.setItem('cab_token', data.token);
  localStorage.setItem(
      'cab_user',
      JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      })
  );
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('cab_user') || 'null');
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem('cab_token');
  localStorage.removeItem('cab_user');
}
