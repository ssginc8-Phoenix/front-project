// types/hospital.ts (예시)
export interface Hospital {
  schedules: HospitalSchedules;
  imageUrl?: never;
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
  serviceName: string[]; // ex: ["주차 가능", "야간 진료"]
  fileId?: number;
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
  dayOfWeek: DayOfWeek;
  openTime: string; // "HH:mm:ss" 포맷 (예: "09:00:00")
  closeTime: string; // "HH:mm:ss"
  lunchStart: string; // "HH:mm:ss"
  lunchEnd: string; // "HH:mm:ss"
}
