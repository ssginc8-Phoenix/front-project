import axios from 'axios';
import type { AddDoctorListRequest, PatientRequest, UserRequest } from '~/types/user';

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

/**
 * 내 정보 조회
 */
export const getMyInfo = async () => {
  const res = await axios.get(`${HOST}/users/me`, {
    withCredentials: true,
  });

  return res.data;
};

/**
 * 소셜 로그인 사용자의 providerId 조회
 */
export const getProviderId = async () => {
  const res = await axios.get(`${HOST}/auth/session/provider-id`, {
    withCredentials: true,
  });

  return res.data.providerId;
};

/**
 * 소셜 로그인 폼 제출
 */
export const submitSocialSignup = async (data: FormData) => {
  const res = await axios.post(`${HOST}/users/social`, data, {
    withCredentials: true,
  });

  console.log(res.data);

  return res.data;
};

/**
 * 환자 주민번호 등록
 */
export const submitPatientInfo = async (data: PatientRequest) => {
  const res = await axios.post(`${HOST}/patients`, data, {
    withCredentials: true,
  });

  console.log(res.data);

  return res.data;
};

/**
 * 의사 등록
 */
export const submitDoctorsInfo = async (data: AddDoctorListRequest) => {
  const res = await axios.post(`${HOST}/users/doctors`, data, {
    withCredentials: true,
  });

  console.log(res.data);

  return res.data;
};
