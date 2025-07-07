// types/hospital.ts (예시)
export interface Hospital {
  schedules: HospitalSchedules;
  imageUrls?: string[];
  name: string;
  waiting: number;
  hospitalId: number;
  hospitalName: string;
  address: string;
  phone: string;
  specialization: string;
  businessRegistrationNumber: string;
  latitude: number;
  longitude: number;
  distance?: number;
  rating?: number;
  reviewCount?: number;
  serviceNames: string[];
  notice: string;
  introduction: string;
  fileIds?: number[];
}

export interface HospitalPage {
  content: Hospital[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface CreateHospitalRequest {
  userId: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  introduction: string;
  notice: string;
  businessRegistrationNumber: string;
  serviceNames: string[]; // ex: ["주차 가능", "야간 진료"]
  file?: File;
}

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

// 스케줄 생성/수정을 위한 요청 DTO
export interface CreateScheduleRequest {
  hospitalScheduleId?: number | undefined;
  dayOfWeek: DayOfWeek;
  openTime: string | null; // "HH:mm:ss" 포맷 (예: "09:00:00")
  closeTime: string | null; // "HH:mm:ss"
  lunchStart: string | null; // "HH:mm:ss"
  lunchEnd: string | null; // "HH:mm:ss"
}
export interface HospitalForm {
  name: string;
  businessNumber: string;
  address: string;
  phoneNumber: string;
  // 필요하다면 다른 필드도 추가…
}
