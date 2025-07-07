import useLoginStore from '~/features/user/stores/LoginStore';
import { Navigate, Outlet } from 'react-router';
import type { UserRole } from '~/types/user';
import type { ReactNode } from 'react';

interface AuthGuardProps {
  allowedRoles: UserRole[];
  children?: ReactNode;
}

const AuthGuard = ({ allowedRoles, children }: AuthGuardProps) => {
  const user = useLoginStore((state) => state.user); // 현재 로그인된 사용자 정보 가져오기
  const isAuthenticated = !!user; // 사용자가 로그인했는지 여부
  const userRole = user?.role; // 로그인된 사용자의 역할

  /**
   * 1. 로그인 여부 확인
   */
  if (!isAuthenticated) {
    // 로그인 되어있지 않았다면 로그인 페이지로 리다이렉트
    // `replace` prop은 현재 히스토리 스택의 엔트리를 대체하여 뒤로가기 버튼으로 로그인 페이지로 다시 돌아가는 것을 방지
    return <Navigate to="/login" replace />;
  }

  /**
   * 역할 기반 접근 권한 확인
   */
  if (userRole && allowedRoles.includes(userRole)) {
    return children || <Outlet />;
  }

  return <Navigate to="/unauthorized" replace />;
};

export default AuthGuard;
