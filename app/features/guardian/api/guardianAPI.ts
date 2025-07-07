// src/features/guardian/api/guardianAPI.ts

import axios from 'axios';

export interface Guardian {
  userId: number;
  name: string;
}

export interface PendingInvite {
  mappingId: number;
  name: string;
  email: string;
  inviteCode: string;
}

export interface PatientSummary {
  patientId: number;
  name: string;
  residentRegistrationNumber: string;
  patientGuardianId: number;
  address: string;
}

const HOST = 'http://localhost:8080/api/v1/guardians';

/**
 * 보호자 초대 API
 */
export const inviteGuardian = async (patientId: number, guardianEmail: string) => {
  const response = await axios.post(
    `${HOST}/${patientId}/invite`,
    { guardianEmail },
    { withCredentials: true }, // 세션 쿠키 필요
  );
  return response.data;
};

/**
 * 환자별 “초대중” 보호자 목록 조회
 * GET /api/v1/guardians/{patientId}/pending-invites
 */
export const getPendingGuardianInvites = async (patientId: number): Promise<PendingInvite[]> => {
  const { data } = await axios.get<PendingInvite[]>(`${HOST}/${patientId}/pending-invites`, {
    withCredentials: true,
  });
  return data;
};

/**
 * 환자별 보호자 목록 조회 API
 */
export const getGuardians = async (patientId: number): Promise<Guardian[]> => {
  const response = await axios.get<Guardian[]>(
    `http://localhost:8080/api/v1/patients/${patientId}/guardians`,
    { withCredentials: true },
  );
  return response.data;
};

export const acceptGuardianInvite = async (inviteCode: string) => {
  const response = await axios.patch(
    `http://localhost:8080/api/v1/guardians/respond`, // ✅ URL 변경
    {
      inviteCode: inviteCode,
      status: 'ACCEPTED',
    },
    { withCredentials: true },
  );
  return response.data;
};

/**
 * 보호자 본인(로그인된 유저)이 가진 환자 목록 조회 API
 */
export const getGuardianPatients = async (): Promise<PatientSummary[]> => {
  const res = await axios.get<PatientSummary[]>(`${HOST}/me/patients`, { withCredentials: true });
  return res.data;
};

// /**
//  * 보호자 본인(로그인된 유저)이 특정 환자 연결 해제 (soft‑delete) API
//  */
// export const deleteGuardianPatient = async (patientId: number): Promise<void> => {
//   await axios.delete(`${HOST}/me/patients/${patientId}`, { withCredentials: true });
// };

/**
 * 초대 코드로 수락/거절 API
 */
export const respondToInvite = async (
  inviteCode: string,
  status: 'ACCEPTED' | 'REJECTED',
): Promise<void> => {
  await axios.patch(`${HOST}/respond`, { inviteCode, status }, { withCredentials: true });
};

/**
 * 내 보호자 정보 조회 API
 */
export const getMyGuardianInfo = async (): Promise<{
  guardianId: number;
  name: string;
  email: string;
  role: string;
}> => {
  const res = await axios.get(`${HOST}/me`, {
    withCredentials: true,
  });
  return res.data;
};

export const deleteGuardianPatient = async (patientId: number): Promise<void> => {
  await axios.delete(`${HOST}/me/patients/${patientId}`, { withCredentials: true });
};
