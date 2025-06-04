// src/hooks/useAsync.ts
import { useEffect, useState, useCallback } from 'react';

export const useAsync = <T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList = [], // React.DependencyList로 타입 명확화
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // execute 함수를 useCallback으로 감싸서 asyncFn과 외부 deps가 변경될 때만 재생성되도록 합니다.
  // 이렇게 하면 asyncFn이 불필요하게 재생성될 때마다 execute가 다시 생성되는 것을 방지합니다.
  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    setData(null); // 새로운 실행 시 이전 데이터를 지우고 싶다면 추가

    try {
      const result = await asyncFn();
      setData(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('데이터를 불러오는 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  }, [asyncFn, ...deps]); // asyncFn과 외부에서 받은 deps에 의존

  // 훅이 마운트될 때 (또는 execute 함수가 변경될 때) execute를 호출합니다.
  // execute가 useCallback으로 감싸져 있기 때문에, asyncFn이나 deps가 실제로 변경되지 않는 한
  // execute는 다시 생성되지 않으므로 이 useEffect도 불필요하게 다시 실행되지 않습니다.
  useEffect(() => {
    execute();
  }, [execute]); // execute 함수가 변경될 때만 이 useEffect가 실행됩니다.

  // data, loading, error 상태와 execute 함수를 반환하여 외부에서 수동으로 호출할 수 있도록 합니다.
  return { data, loading, error, execute };
};
