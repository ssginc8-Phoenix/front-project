import axios from 'axios';

const HOST = 'https://beanstalk.docto.click/api/v1';

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
 * 결제 정보 확인 API
 */
export const confirmPaymentRequest = async (payload: {
  paymentKey: string | null;
  orderId: string | null;
  amount: string | null;
}) => {
  const res = await axios.post(`${HOST}/payments/confirm`, payload, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * 결제 정보 수정 API
 */
export const updatePaymentRequestInfo = async (payload: {
  paymentRequestId: number;
  orderId: string;
  customerKey: string;
}) => {
  const res = await axios.patch(`${HOST}/payments/init`, payload, {
    withCredentials: true,
  });
  return res.data;
};
