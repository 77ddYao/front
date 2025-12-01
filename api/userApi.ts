import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function loginAPI(credentials: { username: string; password: string }) {
  const res = await axios.post(`${API_BASE_URL}/api/users/login`, credentials, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

export async function userProfileAPI(token: string) {
  const res = await axios.get(`${API_BASE_URL}/api/users/profile`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // 添加授权头
    },
  });
  return res.data;
}

export async function registerAPI(credentials: { username: string; password: string; avatar: File }) {
  const formData = new FormData();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);
  formData.append('avatar', credentials.avatar);

  const res = await axios.post(`${API_BASE_URL}/api/users/register`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}