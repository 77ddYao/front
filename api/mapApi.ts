import axios from 'axios';

export async function getMapData() {
  const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/map/getMapData`;
  const res = await axios.get(API_URL, {
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      pageNum: 1, // 设置默认页码
      pageSize: 10, // 设置默认每页数量
    },
  });
  return res.data;
}