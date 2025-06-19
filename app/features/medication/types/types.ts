export interface MedicationScheduleResponse {
  medicationId: number;
  medicationName: string;
  days: string[];
  startDate: string;
  endDate: string;
  times: { meal: 'morning' | 'lunch' | 'dinner'; time: string }[];
}
