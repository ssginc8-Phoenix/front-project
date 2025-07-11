export interface AppointmentRequest {
  userId: number;
  patientId: number;
  hospitalId: number;
  doctorId: number;
  symptom: string;
  question: string | null;
  appointmentType: string;
  paymentType: string;
  appointmentTime: string;
}

export interface Appointment {
  appointmentId: number;
  hospitalId: number;
  doctorId: number;
  patientId: number;

  hospitalName: string;
  doctorName: string;
  patientName: string;

  symptom: string;
  question: string | null;

  appointmentTime: string;
  appointmentType: string;
  paymentType: string;
  status: string;

  createdAt: string;
}

export interface AppointmentList {
  appointmentId: number;
  hospitalId: number;
  doctorId: number;
  patientGuardianId: number;

  hospitalName: string;
  doctorName: string;
  patientName: string;

  appointmentTime: string;
  appointmentType: string;
  status: string;

  hasReview?: boolean;
}

export type AppointmentListPage = Page<AppointmentList>;

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}
