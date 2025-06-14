import axios from 'axios';

export interface Guardian {
  name: string;
}

export interface PatientSummary {
  patientId: number;
  name: string;
  residentRegistrationNumber: string;
  patientGuardianId: number;
}

const HOST = 'http://localhost:8080/api/v1/guardians';

/**
 * 보호자 초대 API
 */
export const inviteGuardian = async (patientId: number, guardianEmail: string) => {
  const response = await axios.post(
    `${HOST}/api/v1/guardians/${patientId}/invite`,
    { guardianEmail },
    { withCredentials: true }, // 세션 쿠키 필요
  );
  return response.data;
};

/**
 * 환자별 보호자 목록 조회 API
 */
export const getGuardians = async (patientId: number): Promise<Guardian[]> => {
  const response = await axios.get<Guardian[]>(
    `${HOST}/api/v1/patients/${patientId}/guardians`,
    { withCredentials: true }, // 세션 쿠키 필요
  );
  return response.data; // 배열 그대로
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
 * 보호자가 가진 환자 목록 조회 API
 */
export const getGuardianPatients = async () => {
  const res = await axios.get(`${HOST}/me/patients`, {
    withCredentials: true,
  });
  return res.data;
};

export const getMyGuardianInfo = async () => {
  const res = await axios.get(`${HOST}/me`, {
    withCredentials: true,
  });
  return res.data; // { guardianId, name, email, role }
};

export const deleteGuardianPatient = async (patientId: number): Promise<void> => {
  await axios.delete(`${HOST}/me/patients/${patientId}`, { withCredentials: true });
};
