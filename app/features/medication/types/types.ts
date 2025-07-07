export interface MedicationScheduleResponse {
  medicationId: number;
  medicationName: string;
  days: string[];
  startDate: string;
  endDate: string;
  times: { meal: 'morning' | 'lunch' | 'dinner'; time: string }[];
}

// src/features/medication/types/types.ts
export interface MedicationLogResponse {
  logId: number; // 로그 고유 ID
  medicationLogId: number; // 스케줄 ID
  medicationName: string; // 약 이름
  completedAt: string; // 복용 일시 (ISO 문자열)
  loggedAt: string;
  status: 'TAKEN' | 'MISSED' | 'SCHEDULED'; // 예시 상태
}
