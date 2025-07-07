import axios from 'axios';

export async function loginAPI(credentials: { username: string; password: string }) {
  const res = await axios.post('/api/users/login', credentials, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return res.data;
}
