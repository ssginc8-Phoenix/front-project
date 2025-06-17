import axios from 'axios';
import type { AppointmentRequest } from '~/types/appointment';

const HOST = 'http://localhost:8080/api/v1/appointments';

/**
 * 예약 요청
 */
export const createPaymentRequest = async (data: AppointmentRequest) => {
  const res = await axios.post(`{HOST}/{appointmentId}/payment-request`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  return res.data;
};
