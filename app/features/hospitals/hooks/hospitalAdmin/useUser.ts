import { useCallback } from 'react';
import { useAsync } from '../../../../hooks/useAsync';
import { getUser } from '../../api/hospitalAPI';
import type { User } from '../../types/user';

export const useUser = () => {
  const fetchUsers = useCallback(async () => {
    const res = await getUser();
    return res.content; // content 배열만 반환
  }, []);

  const { data, loading, error } = useAsync<User[]>(fetchUsers, [fetchUsers]);
  return { data, loading, error };
};
