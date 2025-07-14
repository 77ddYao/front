import axios from 'axios';

export async function getMapData() {
  const res = await axios.get('/api/map/getMapData', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return res.data;
}