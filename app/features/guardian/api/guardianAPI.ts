import axios from 'axios';

const HOST = 'http://localhost:8080/api/v1/guardians';

/**
 * 보호자가 가진 환자 목록 조회 API
 */
export const getPatientListByGuardian = async () => {
  const res = await axios.get(`${HOST}/me/patients`);
  return res.data;
};
