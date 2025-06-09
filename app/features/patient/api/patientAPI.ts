import axios from 'axios';
import type { Patient } from '~/features/patient/types/patient';

const HOST = 'http://localhost:8080/api/v1/patients';

/**
 * 환자 본인 정보 조회 API
 */
export const getPatientInfo = async (): Promise<{
  patientId: number;
  userId: number;
  residentRegistrationNumber: string;
}> => {
  const res = await axios.get(`${HOST}/me`, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * 환자 목록 조회 API
 */
export const getPatientList = async () => {
  const res = await axios.get(HOST, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * 환자 등록 API
 */
export const createPatient = async (
  payload: Omit<Patient, 'patientId' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
): Promise<Patient> => {
  const res = await axios.post<Patient>(HOST, payload, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * 환자 정보 수정 API
 */
export const updatePatient = async (
  patientId: number,
  payload: Partial<Omit<Patient, 'patientId'>>,
): Promise<Patient> => {
  const res = await axios.patch<Patient>(`${HOST}/${patientId}`, payload, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * 환자 삭제 API
 */
export const deletePatient = async (patientId: number): Promise<void> => {
  await axios.delete(`${HOST}/${patientId}`, {
    withCredentials: true,
  });
};
