import axios from 'axios';

const HOST = 'http://localhost:8080/api/v1';

/**
 * 결제 정보 조회 API
 */
export const getPaymentInfo = async (paymentRequestId: number) => {
  const res = await axios.get(`${HOST}/payment-history/${paymentRequestId}`, {
    withCredentials: true,
  });

  return res.data;
};

/**
 * 결제 금액 저장 API
 */
export const createPaymentRequest = async (appointmentId: number, amount: number) => {
  const res = await axios.post(
    `${HOST}/appointments/${appointmentId}/payment-request`,
    { amount },
    { withCredentials: true },
  );

  return res.data;
};

/**
 * 결제 정보 수정 API
 */
export const updatePaymentRequestInfo = async (payload: {
  paymentRequestId: number;
  orderId: string;
  clientKey: string;
}) => {
  const res = await axios.patch(`${HOST}/payments/init`, payload, {
    withCredentials: true,
  });
  return res.data;
};
