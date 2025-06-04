export interface HospitalSchedule {
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  openTime: string; // 예: "08:30"
  closeTime: string; // 예: "18:00"
  lunchStart: string; // 예: "12:30"
  lunchEnd: string; // 예: "13:30"
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
