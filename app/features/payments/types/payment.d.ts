interface PaymentInfo {
  appointmentId: number;
  hospitalName: string;
  doctorName: string;
  patientName: string;
  guardianName: string;
  guardianEmail: string;
  paymentAmount: number;
  requestStatus: REQUESTED | COMPLETED;
  appointmentTime: string;
  createdAt: string;
}
