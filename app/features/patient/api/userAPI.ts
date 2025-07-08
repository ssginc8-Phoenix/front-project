import axios from 'axios';

const HOST = 'https://beanstalk.docto.click/api/v1/users/me';

export interface User {
  userId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImageUrl: string;
}

/**
 * 비밀번호 검증 API
 */
export const verifyPassword = async (password: string) => {
  const response = await axios.post(
    'https://beanstalk.docto.click/api/v1/users/check-password',
    { password },
    { withCredentials: true },
  );
  return response.data;
};

/**
 * 유저 정보 조회 API
 */
export const getUserInfo = async (): Promise<User> => {
  const res = await axios.get(HOST, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * 유저 정보 수정 API
 */
export const updateUserInfo = async (formData: FormData) => {
  const res = await axios.patch(`${HOST}`, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

/**
 * 유저 탈퇴 API
 */
export const deleteAccount = async () => {
  const res = await axios.delete(HOST, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * (관리자용) 전체 유저 조회 API
 */
export const getAllUsers = async () => {
  const response = await axios.get('https://beanstalk.docto.click/api/v1/admin/users', {
    params: {
      page: 0,
      size: 1000,
    },
    withCredentials: true,
  });
  return response.data.content;
};
