/**
 * 환자 엔터티 타입 정의
 */
export interface Patient {
  patientId: number; // 환자 아이디
  userId: number; // 유저 아이디
  residentRegistrationNumber: string; // 주민등록번호
  createdAt: string; // 생성일자 (ISO string)
  updatedAt: string; // 수정일자 (ISO string)
  deletedAt?: string | null; // 탈퇴일자 (nullable)
}

export interface PatientForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}
