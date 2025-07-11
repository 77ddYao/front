import axios from 'axios';

export async function loginAPI(credentials: { username: string; password: string }) {
  const res = await axios.post('/api/users/login', credentials, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return res.data;
}

export async function userProfileAPI(token: string) {
  const res = await axios.get('/api/users/profile', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // 添加授权头
    }
  });
  return res.data;
}
