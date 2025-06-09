import { useCallback } from 'react';

import { getUser } from '../../api/hospitalAPI';
import type { User } from '../../types/user';
import { useHospitalAsync } from '~/features/hospitals/hooks/useHospitalAsync';

export const useUser = () => {
  const fetchUsers = useCallback(async () => {
    const res = await getUser();
    return res.content; // content 배열만 반환
  }, []);

  const { data, loading, error } = useHospitalAsync<User[]>(fetchUsers, [fetchUsers]);
  return { data, loading, error };
};
