import axios, { AxiosHeaders } from 'axios';
import type { Hospital, HospitalPage, CreateScheduleRequest } from '../types/hospital';
import type { HospitalSchedule } from '~/features/hospitals/types/hospitalSchedule';

// Axios 인스턴스 생성 및 설정
const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // 실제 API 서버 주소
  withCredentials: true, // 쿠키 기반 인증 사용 시
});

// 요청 인터셉터: 로컬 스토리지에 저장된 JWT 토큰을 Authorization 헤더에 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Axios v1 이상에서 AxiosHeaders 사용
      const headers = new AxiosHeaders(config.headers);
      headers.set('Authorization', `Bearer ${token}`);
      config.headers = headers;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 병원 단건 조회
export const getHospital = async (hospitalId: number): Promise<Hospital> => {
  const res = await apiClient.get(`/api/v1/hospitals/${hospitalId}`);
  return res.data;
};

// 관리자용 병원 목록 조회
export const hospitalAPI = async (): Promise<HospitalPage> => {
  const res = await apiClient.get('/api/v1/admin/hospitals');
  return res.data;
};

// 의사 목록 조회 (쿼리 매개변수로 병원 ID 전달)
export const getDoctor = async (hospitalId: number) => {
  const res = await apiClient.get('/api/v1/doctors', { params: { hospitalId } });
  return res.data;
};

// 병원 스케줄 목록 조회
export const getHospitalSchedules = async (hospitalId: number): Promise<HospitalSchedule[]> => {
  const res = await apiClient.get<HospitalSchedule[]>(`/api/v1/hospitals/${hospitalId}/schedules`);
  return res.data;
};

// 병원 리뷰 목록 조회
export const getReview = async (hospitalId: number) => {
  const res = await apiClient.get(`/api/v1/hospitals/${hospitalId}/reviews`);
  // 페이징된 리뷰 데이터의 content 배열만 반환
  return res.data.content;
};

// 사용자 목록 조회 (관리자용)
export const getUser = async () => {
  const res = await apiClient.get('/api/v1/admin/users');
  return res.data;
};

// 병원 등록
export const registerHospital = async (data: {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  introduction: string;
  notice: string;
  businessRegistrationNumber: string;
  serviceNames: string[];
}) => {
  const res = await apiClient.post('/api/v1/hospitals', data);
  return res.data;
};

// 병원 정보 수정
export const updateHospital = async (
  hospitalId: number,
  data: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
    introduction: string;
    notice: string;
    businessRegistrationNumber: string;
    serviceNames: string[];
  },
) => {
  const res = await apiClient.patch(`/api/v1/hospitals/${hospitalId}`, data);
  return res.data;
};

// 단일 스케줄 수정
export const updateHospitalSchedule = async (
  hospitalId: number,
  scheduleId: number,
  data: CreateScheduleRequest,
) => {
  const res = await apiClient.patch(
    `/api/v1/hospitals/${hospitalId}/schedules/${scheduleId}`,
    data,
  );
  return res.data;
};

// 스케줄 생성
export const createHospitalSchedule = async (hospitalId: number, data: CreateScheduleRequest) => {
  const res = await apiClient.post(`/api/v1/hospitals/${hospitalId}/schedules`, data);
  return res.data;
};

// 내 병원 정보 조회
export const getMyHospital = async (): Promise<Hospital> => {
  const res = await apiClient.get('/api/v1/hospitals/me');
  return res.data;
};

// 병원 웨이팅 등록
export const createWaiting = async (hospitalId: number, waiting: number): Promise<Hospital> => {
  const res = await apiClient.post(
    `/api/v1/hospitals/${hospitalId}/waiting`,
    { waiting }, // 여기 키 이름을 서버가 기대하는 'waiting' 으로 맞춤
  );
  return res.data;
};
