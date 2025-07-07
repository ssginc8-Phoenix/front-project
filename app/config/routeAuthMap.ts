import type { UserRole } from '~/types/user';

/**
 * 경로에 따라 필요한 역할들을 매핑하는 객체
 * 키는 `route.ts`에 정의된 정확한 경로여야 함
 * 중첩된 라우트의 경우, 해당 부모 라우트의 시작 경로를 기준으로 함
 */
export const routeAuthMap: { [path: string]: UserRole[] } = {
  /**
   * 병원 생성
   */
  '/hospital/create': ['HOSPITAL_ADMIN'],

  /**
   * 마이페이지 전체 (myPage 하위의 모든 라우트에 적용)
   */
  '/myPage': ['PATIENT', 'GUARDIAN', 'DOCTOR', 'HOSPITAL_ADMIN', 'ADMIN'],
  '/myPage/guardian': ['PATIENT'], // 보호자 관리 페이지 (환자 입장)
  '/myPage/patient': ['GUARDIAN'], // 환자 관리 페이지 (보호자 입장)
  '/myPage/appointments': ['PATIENT', 'GUARDIAN', 'DOCTOR', 'HOSPITAL_ADMIN', 'ADMIN'],
  '/myPage/calendar': ['PATIENT', 'GUARDIAN', 'DOCTOR', 'HOSPITAL_ADMIN', 'ADMIN'],
  '/myPage/review': ['PATIENT', 'GUARDIAN', 'DOCTOR', 'HOSPITAL_ADMIN', 'ADMIN'],
  '/myPage/qna': ['PATIENT', 'GUARDIAN', 'DOCTOR', 'HOSPITAL_ADMIN', 'ADMIN'],
  '/myPage/info': ['PATIENT', 'GUARDIAN', 'DOCTOR', 'HOSPITAL_ADMIN', 'ADMIN'],
  '/myPage/schedule': ['DOCTOR'],
  '/myPage/chart': ['HOSPITAL_ADMIN'],

  /**
   * 결제
   */
  '/payments/request': ['HOSPITAL_ADMIN'],
  '/payments/history': ['GUARDIAN', 'HOSPITAL_ADMIN'],

  /**
   * 서류
   */
  '/documents': ['GUARDIAN'],
  '/documents/admin': ['HOSPITAL_ADMIN'],

  /**
   * 예약 요청 및 대시보드
   */
  '/appointment': ['GUARDIAN'], // 예약 요청
  '/appointments': ['DOCTOR', 'HOSPITAL_ADMIN'],
};

// 모든 로그인된 사용자에게 허용되는 페이지 (로그인만 하면 접속 가능한 페이지)
export const authenticatedOnlyPaths: string[] = [];
