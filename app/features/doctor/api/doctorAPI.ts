import axios from 'axios';
import type { DoctorSaveRequest } from '~/types/doctor';
import type { DoctorScheduleRequest } from '~/features/hospitals/types/doctor';

const HOST = 'http://localhost:8080/api/v1/doctors';

/**
 * 병원에 속한 의사 조회
 */
export const getDoctorList = async (hospitalId: number) => {
  const res = await axios.get(`${HOST}`, {
    params: { hospitalId },
    withCredentials: true,
  });
  return res.data;
};

/**
 *  의사 영업시간 조회
 */
export const getDoctorSchedules = async (doctorId: number) => {
  const res = await axios.get(`${HOST}/${doctorId}/schedules`, {
    withCredentials: true,
  });
  return res.data;
};

export const getMyDoctorInfo = async () => {
  const res = await axios.get(`${HOST}/me`, {
    withCredentials: true,
  });
  return res.data;
};

// 👉 30분당 진료 가능 인원 수 수정
export const updateDoctorCapacity = async (doctorId: number, capacity: number) => {
  return await axios.patch(`/api/v1/doctors/${doctorId}/capacity`, capacity, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const createDoctor = async (data: DoctorSaveRequest): Promise<number> => {
  const response = await axios.post('/api/v1/doctors', data, {
    withCredentials: true,
  });
  return response.data; // doctorId
};
/**
 * 의사 진료시간 등록 (POST)
 */
export const createDoctorSchedules = async (
  doctorId: number,
  schedules: DoctorScheduleRequest[],
): Promise<void> => {
  console.log('[API] createDoctorSchedules →', JSON.stringify(schedules, null, 2));
  await axios.post(`/api/v1/doctors/${doctorId}/schedules`, schedules);
};

/**
 * 의사 진료시간 수정 (PATCH)
 */
export const updateDoctorSchedule = async (
  doctorId: number,
  scheduleId: number,
  schedule: DoctorScheduleRequest,
): Promise<DoctorScheduleRequest> => {
  const res = await axios.patch(`/api/v1/doctors/${doctorId}/schedules/${scheduleId}`, schedule);
  return res.data;
};

/**
 * 의사 진료시간 삭제 (DELETE)
 */
export const deleteDoctorSchedule = async (doctorId: number, scheduleId: number): Promise<void> => {
  await axios.delete(`/api/v1/doctors/${doctorId}/schedules/${scheduleId}`);
};

export const updateDoctorProfile = async (doctorId: number, formData: FormData) => {
  return await axios.patch(`/api/v1/doctors/${doctorId}/profile`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
