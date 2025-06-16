export type Specialization =
  | 'CARDIOLOGY' // 심장내과
  | 'NEUROLOGY' // 신경과
  | 'DERMATOLOGY' // 피부과
  | 'PEDIATRICS' // 소아과
  | 'ORTHOPEDICS' // 정형외과
  | 'RADIOLOGY' // 영상의학과
  | 'ONCOLOGY' // 종양내과
  | 'GYNECOLOGY' // 산부인과
  | 'PSYCHIATRY' // 정신과
  | 'GENERAL_SURGERY' // 일반외과
  | 'UROLOGY' // 비뇨기과
  | 'OPHTHALMOLOGY' // 안과
  | 'ENT' // 이비인후과
  | 'INTERNAL_MEDICINE'; // 내과

export interface Doctor {
  name: string;
  doctorId: number;
  hospitalId: number;
  specialization: Specialization;
  imageUrl?: never;
}

export interface PagedDoctorResponse {
  content: Doctor[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export const SpecializationKoreanMap: Record<Specialization, string> = {
  CARDIOLOGY: '심장내과',
  NEUROLOGY: '신경과',
  DERMATOLOGY: '피부과',
  PEDIATRICS: '소아과',
  ORTHOPEDICS: '정형외과',
  RADIOLOGY: '영상의학과',
  ONCOLOGY: '종양내과',
  GYNECOLOGY: '산부인과',
  PSYCHIATRY: '정신과',
  GENERAL_SURGERY: '일반외과',
  UROLOGY: '비뇨기과',
  OPHTHALMOLOGY: '안과',
  ENT: '이비인후과',
  INTERNAL_MEDICINE: '내과',
};
export interface DoctorScheduleRequest {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  lunchStart?: string;
  lunchEnd?: string;
}
export interface DoctorSchedule {
  scheduleId: number;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  lunchStart?: string;
  lunchEnd?: string;
}
