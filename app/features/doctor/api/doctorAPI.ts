import axios from 'axios';

const HOST = 'http://localhost:8080/api/v1/doctors';

/**
 * 병원에 속한 의사 조회
 */
export const getDoctorList = async (hospitalId: number) => {
  const res = await axios.get(`${HOST}/${hospitalId}`);
  return res.data;
};
