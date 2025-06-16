import type { RegisterTokenRequest } from '~/types/token';
import axios from 'axios';

const HOST = 'http://localhost:8080/api/v1/fcm';

/**
 * 토큰 등록
 * @param data - userId + FCM token
 */
export const registerToken = async (data: RegisterTokenRequest) => {
  const res = await axios.put(`${HOST}/token`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  return res.data;
};
