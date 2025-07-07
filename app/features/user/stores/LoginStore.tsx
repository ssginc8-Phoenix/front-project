import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRequest } from '~/types/user';
import { getMyInfo, login, logout } from '~/features/user/api/UserAPI';
import { requestPermissionAndRegisterToken } from '~/features/fcm/util/fcm';

export interface LoginState {
  user: User | null;
  login: (data: UserRequest) => Promise<void>;
  logout: () => Promise<void>;
  fetchMyInfo: () => Promise<void>;
}

const useLoginStore = create<LoginState>()(
  persist(
    (set) => ({
      user: null,

      login: async ({ email, password }: UserRequest) => {
        await login({ email, password });
        const myInfo = await getMyInfo();

        set({
          user: {
            userId: myInfo.userId,
            name: myInfo.name,
            profileImageUrl: myInfo.profileImageUrl,
            isSuspended: myInfo.isSuspended,
            role: myInfo.role,
          },
        });

        console.log('requestPermissionAndRegisterToken 호출 전');
        requestPermissionAndRegisterToken(myInfo.userId).catch((err) => {
          console.error('FCM 등록 실패: ', err);
        });

        console.log('requestPermissionAndRegisterToken 호출 후');
      },

      logout: async () => {
        await logout();
        set({ user: null });
      },

      fetchMyInfo: async () => {
        try {
          const myInfo = await getMyInfo();
          set({
            user: {
              userId: myInfo.userId,
              name: myInfo.name,
              profileImageUrl: myInfo.profileImageUrl,
              isSuspended: myInfo.isSuspended,
              role: myInfo.role,
            },
          });
        } catch {
          set({ user: null });
        }
      },
    }),
    {
      name: 'login-storage',
      partialize: (state) => ({ user: state.user }), // 저장할 필드 제한
    },
  ),
);

export default useLoginStore;
