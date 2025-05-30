import axios from 'axios';
import type { UserRequest } from '~/types/user';

const HOST = 'http://localhost:8080/api/v1';

/**
 * 로그인 요청
 */
export const login = async (data: UserRequest) => {
  const res = await axios.post(`${HOST}/auth/login`, data, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });

  return res.data;
};

/**
 * 로그아웃 요청
 */
export const logout = async () => {
  const res = await axios.post(`${HOST}/auth/logout`, null, {
    withCredentials: true,
  });

  return res.data;
};
