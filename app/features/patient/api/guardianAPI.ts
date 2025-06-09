import axios from 'axios';

export interface Guardian {
  name: string;
}

const BASE_URL = 'http://localhost:8080';

/**
 * 보호자 초대 API
 */
export const inviteGuardian = async (patientId: number, guardianEmail: string) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/guardians/${patientId}/invite`,
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
    `${BASE_URL}/api/v1/patients/${patientId}/guardians`,
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
