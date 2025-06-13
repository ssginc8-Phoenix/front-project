// src/features/hospitals/hooks/useMyHospitalId.ts
import { useEffect, useState } from 'react';
import { getMyHospital } from '~/features/hospitals/api/hospitalAPI';

export function useMyHospitalId() {
  const [hospitalId, setHospitalId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyHospital();
        setHospitalId(data.hospitalId);
      } catch (err) {
        console.error('병원 정보 조회 실패', err);
        setError('병원 정보 조회 실패');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { hospitalId, loading, error };
}
