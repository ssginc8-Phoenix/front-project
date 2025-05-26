import { useEffect, useState } from 'react';

export const useAsync = <T>(asyncFn: () => Promise<T>, deps: any[] = []) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await asyncFn();
        setData(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('데이터를 불러오는 중 오류가 발생햇습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, deps); // 의존성 배열 외부에서 받음

  return { data, loading, error };
};
