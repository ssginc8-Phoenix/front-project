export interface Doctor {
  doctorId: number;
  specialization: string;
  username: string;
  hospitalId: number;
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
