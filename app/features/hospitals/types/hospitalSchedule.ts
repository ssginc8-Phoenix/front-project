import type { CreateScheduleRequest } from '~/features/hospitals/types/hospital';

export interface HospitalSchedule {
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  openTime: string; // 예: "08:30"
  closeTime: string; // 예: "18:00"
  lunchStart: string; // 예: "12:30"
  lunchEnd: string; // 예: "13:30"
  hospitalScheduleId: number;
}

export interface ScheduleDTO {
  hospitalScheduleId: number;
  dayOfWeek: CreateScheduleRequest['dayOfWeek'];
  openTime: string; // "10:30:00"
  closeTime: string; // "20:00:00"
  lunchStart?: string | null;
  lunchEnd?: string | null;
}

export type HospitalSchedules = HospitalSchedule[];
export const DAY_OF_WEEK_KR: Record<HospitalSchedule['dayOfWeek'], string> = {
  MONDAY: '월요일',
  TUESDAY: '화요일',
  WEDNESDAY: '수요일',
  THURSDAY: '목요일',
  FRIDAY: '금요일',
  SATURDAY: '토요일',
  SUNDAY: '일요일',
};
