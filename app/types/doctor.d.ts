export interface Doctor {
  doctorId: number;
  name: string;
  specialization: string;
  hospitalName: number;
  capacityPerHalfHour: string;
  imageUrl: string;
}

export interface DoctorSchedule {
  scheduleId: number;
  doctorId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  lunchStart: string;
  lunchEnd: string;
}

export interface DoctorSaveRequest {
  hospitalId: number;
  specialization: string;
  userId: number;
}
