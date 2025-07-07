import { useEffect, useState, useCallback } from 'react';

export const useHospitalAsync = <T>(asyncFn: () => Promise<T>, deps: any[] = []) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFn();
      setData(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  useEffect(() => {
    execute();
  }, deps);

  return { data, loading, error, execute };
};
