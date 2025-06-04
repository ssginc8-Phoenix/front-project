import axios from 'axios';

const HOST = 'http://localhost:8080/api/v1/users/me';

/**
 * 유저 정보 조회 API
 */
export const getUserInfo = async (): Promise<{
  userId: number;
  name: string;
  email: string;
  phone: string;
}> => {
  const res = await axios.get(HOST);
  return res.data;
};

/**
 * 유저 정보 수정 API
 */
export const updateUserInfo = async (payload: {
  name: string;
  email: string;
  phone: string;
  address: string;
}) => {
  const res = await axios.patch(HOST, payload);
  return res.data;
};

/**
 * 유저 탈퇴 API
 */
export const deleteAccount = async () => {
  const res = await axios.delete(HOST);
  return res.data;
};

export const getAllUsers = async () => {
  const response = await axios.get('http://localhost:8080/api/v1/admin/users', {
    params: {
      page: 0,
      size: 1000,
    },
    withCredentials: true,
  });
  return response.data.content;
};
