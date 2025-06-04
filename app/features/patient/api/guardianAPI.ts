// src/features/patient/api/guardianAPI.ts
import axios from 'axios';

export interface Guardian {
  name: string;
}

interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

const BASE_URL = 'http://localhost:8080';

export const inviteGuardian = async (patientId: number, guardianEmail: string) => {
  const response = await axios.post(
    `http://localhost:8080/api/v1/guardians/${patientId}/invite`,
    {
      guardianEmail,
    },
    { withCredentials: true },
  );
  return response.data;
};

export const getGuardians = async (): Promise<Guardian[]> => {
  const response = await axios.get<Page<Guardian>>(`${BASE_URL}/api/v1/admin/users`, {
    params: {
      role: 'GUARDIAN', // role 쿼리 파라미터 추가
      size: 100, // 한 번에 100명씩 가져오기
    },
    withCredentials: true, // CORS + 쿠키 세션 위해 필요
  });
  return response.data.content; // content만 리턴
};
