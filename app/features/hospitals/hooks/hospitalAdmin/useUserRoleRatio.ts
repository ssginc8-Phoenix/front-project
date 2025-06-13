import { useEffect, useState } from 'react';
import axios from 'axios';

export const useUserRoleRatio = () => {
  const [data, setData] = useState<{ patient: number; guardian: number; doctor: number } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/v1/hospitals/me/user-ratio', { withCredentials: true })
      .then((res) => {
        console.log('📡 사용자 비율 데이터 수신:', res.data); // ✅ 로그 위치
        setData(res.data);
      })
      .catch((err) => {
        console.error('❌ 사용자 비율 요청 실패:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { data, loading };
};
