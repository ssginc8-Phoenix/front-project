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
