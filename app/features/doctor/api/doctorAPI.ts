import axios from 'axios';
import type { CalendarRequest, DoctorCalendarResponse } from '~/features/doctor/types/calendar';

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

export const getDoctorCalendar = async (
  params: CalendarRequest,
): Promise<DoctorCalendarResponse> => {
  const res = await axios.get(`http://localhost:8080/api/v1/calendar/doctor`, {
    params,
    withCredentials: true, // 로그인 인증 쿠키 포함
  });
  return res.data;
};
