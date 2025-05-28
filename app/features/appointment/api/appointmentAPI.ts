import axios from 'axios';
import type { AppointmentRequest } from '~/types/appointment';

const HOST = 'http://localhost:8080/api/v1/appointments';

/**
 * 예약 요청
 */
export const createAppointment = async (data: AppointmentRequest) => {
  const res = await axios.post(HOST, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

/**
 * 예약 단건 조회
 */
export const getAppointment = async (appointmentId: number) => {
  const res = await axios.get(`${HOST}/${appointmentId}`);
  return res.data;
};
