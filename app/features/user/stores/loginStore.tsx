import { create } from 'zustand';
import type { UserRequest } from '~/types/user';
import { login, logout } from '~/features/user/api/UserAPI';

export interface LoginState {
  login: (data: UserRequest) => Promise<void>;
  logout: () => void;
}

const useLoginStore = create<LoginState>(() => ({
  login: async ({ email, password }: UserRequest) => {
    try {
      const result = await login({ email, password });
      console.log('로그인 성공:', result);
    } catch (err) {
      console.error('로그인 실패:', err);
      throw err;
    }
  },

  logout: async () => {
    try {
      await logout();
    } catch (err) {
      console.error('로그아웃 실패:', err);
      throw err;
    }
  },
}));

export default useLoginStore;
