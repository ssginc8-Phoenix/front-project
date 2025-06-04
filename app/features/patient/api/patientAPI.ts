import axios from 'axios';

const HOST = 'http://localhost:8080/api/v1/patients';

/**
 * 모든 환자 조회 API
 */
export const getPatientList = async () => {
  const res = await axios.get(HOST);
  return res.data;
};
