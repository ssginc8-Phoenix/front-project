import axios from 'axios';
import type { Hospital, HospitalPage } from '../types/hospital';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // 실제 API 서버 주소로 변경하세요
});

export const getHospital = async (hospitalId: number) => {
  const res = await apiClient.get(`/api/v1/hospitals/${hospitalId}`);
  return res.data;
};

export async function getHospitals(): Promise<HospitalPage> {
  const response = await fetch('/api/v1/admin/hospitals');
  if (!response.ok) throw new Error('Failed to fetch hospitals');
  const data = await response.json();
  return data; // data가 HospitalPage 형태여야 함
}
export const getDoctor = async (hospitalId: number) => {
  const res = await axios.get('/api/v1/doctors', {
    params: { hospitalId }, // 쿼리스트링에 hospitalId=값 으로 붙음
  });
  return res.data;
};
export const getHospitalSchedules = async (hospitalId: number) => {
  const res = await axios.get(`/api/v1/hospitals/${hospitalId}/schedules`);
  return res.data;
};
export const getReview = async (hospitalId: number) => {
  const res = await axios.get(`/api/v1/hospitals/${hospitalId}/reviews`);
  console.log('리뷰 응답 데이터:', res.data);
  return res.data.content;
};

export const getUser = async () => {
  const res = await axios.get('api/v1/admin/users');
  console.log('유저 데이터', res.data);
  return res.data;
};
