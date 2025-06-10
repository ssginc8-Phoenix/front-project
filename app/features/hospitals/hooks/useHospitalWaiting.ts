import { useState, useCallback } from 'react';
import { useAsync } from '~/hooks/useAsync';
import { createWaiting, getWaiting, updateWaiting } from '../api/hospitalAPI';

export const useHospitalWaiting = (hospitalId: number) => {
  // 1. 초기 데이터 fetch
  const {
    data: waitingData,
    loading,
    error,
  } = useAsync(() => getWaiting(hospitalId), [hospitalId]);

  // 2. 로컬 상태 관리
  const [waiting, setWaiting] = useState<number | null>(null);

  // 3. API 호출 - 등록
  const registerWaiting = useCallback(
    async (value: number) => {
      const result = await createWaiting(hospitalId, value);
      setWaiting(result.waiting);
      return result;
    },
    [hospitalId],
  );

  // 4. API 호출 - 수정
  const modifyWaiting = useCallback(
    async (value: number) => {
      const result = await updateWaiting(hospitalId, value);
      setWaiting(result.waiting);
      return result;
    },
    [hospitalId],
  );

  return {
    waiting: waiting ?? waitingData?.waiting ?? 0,
    setWaiting,
    loading,
    error,
    registerWaiting,
    modifyWaiting,
  };
};
