export interface User {
  userId: number; // 기본키
  uuid: string; // 고유 식별자
  email: string; // 이메일
  password: string; // 해시된 비밀번호
  name: string; // 사용자 이름
  phone: string; // 전화번호
  address: string; // 주소
  loginType: 'LOCAL' | 'KAKAO' | 'GOOGLE'; // 로그인 방식 (enum처럼 사용)
  role: 'USER' | 'ADMIN' | 'DOCTOR'; // 역할 (enum처럼 사용)
  penalty: number; // 누적 패널티 점수
  suspended: boolean; // 정지 여부
  suspendedAt: string | null; // 정지 시작 시간 (ISO 날짜 문자열)
  suspensionExpiresAt: string | null; // 정지 만료 시간 (ISO 날짜 문자열)
  createdAt: string; // 생성 일시 (ISO 날짜 문자열)
  updatedAt: string; // 수정 일시 (ISO 날짜 문자열)
}
