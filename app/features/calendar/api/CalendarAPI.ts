import axios from 'axios';

const HOST = 'https://beanstalk.docto.click/api/v1';

/**
 * 환자 캘린더 조회
 */
export const getPatientCalendar = async (year: number, month: number) => {
  const res = await axios.get(`${HOST}/calendar/patient`, {
    params: { year, month },
    withCredentials: true,
  });

  return res.data;
};

/**
 * 보호자 캘린더 조회
 */
export const getGuardianCalendar = async (year: number, month: number) => {
  const res = await axios.get(`${HOST}/calendar/guardian`, {
    params: { year, month },
    withCredentials: true,
  });

  return res.data;
};

/**
 * 의사 캘린더 조회
 */
export const getDoctorCalendar = async (year: number, month: number) => {
  const res = await axios.get(`${HOST}/calendar/doctor`, {
    params: { year, month },
    withCredentials: true,
  });

  return res.data;
};

/**
 * 병원관리자 캘린더 조회
 */
export const getHospitalCalendar = async (year: number, month: number) => {
  const res = await axios.get(`${HOST}/calendar/hospital`, {
    params: { year, month },
    withCredentials: true,
  });

  return res.data;
};

/**
 * 예약 상세 내역 조회
 */
export const getAppointmentDetail = async (appointmentId: number) => {
  const res = await axios.get(`${HOST}/appointments/${appointmentId}`, {
    withCredentials: true,
  });

  return res.data;
};
