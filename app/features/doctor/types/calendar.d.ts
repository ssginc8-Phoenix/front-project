export interface CalendarRequest {
  startDate?: string; // 예: '2025-06-01'
  endDate?: string; // 예: '2025-06-30'
}

export interface Appointment {
  appointmentId: number;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface DoctorCalendarResponse {
  doctorId: number;
  appointments: Appointment[];
}
