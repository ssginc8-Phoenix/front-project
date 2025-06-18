import axios from 'axios';

const HOST = 'http://localhost:8080/api/v1/appointments';

/**
 * 결제 금액 저장 API
 */
export const createPaymentRequest = async (appointmentId: number, amount: number) => {
  const res = await axios.post(
    `${HOST}/${appointmentId}/payment-request`,
    { amount },
    { withCredentials: true },
  );

  return res.data;
};
