import axios from 'axios';
import type { AppointmentRequest } from '~/types/appointment';

const HOST = 'http://localhost:8080/api/v1/appointments';

/**
 * 예약 요청
 */
export const createAppointment = async (data: AppointmentRequest) => {
  /** 디버깅*/ console.log(data);

  const res = await axios.post(HOST, data, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  return res.data;
};

/**
 * 예약 단건 조회
 */
export const getAppointment = async (appointmentId: number) => {
  const res = await axios.get(`${HOST}/${appointmentId}`, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * 예약 리스트 조회 (로그인한 유저의)
 */
export const getAppointmentList = async (page: number, size: number) => {
  const res = await axios.get(`http://localhost:8080/api/v1/users/me/appointments`, {
    withCredentials: true,
    params: { page, size },
  });
  return res.data;
};
