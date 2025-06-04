import axios from 'axios';

const HOST = 'http://localhost:8080/api/v1/doctors';

/**
 * 병원에 속한 의사 조회
 */
export const getDoctorList = async (hospitalId: number) => {
  const res = await axios.get(`${HOST}`, {
    params: { hospitalId },
    withCredentials: true,
  });
  return res.data;
};

/**
 *  의사 영업시간 조회
 */
export const getDoctorSchedules = async (doctorId: number) => {
  const res = await axios.get(`${HOST}/${doctorId}/schedules`, {
    withCredentials: true,
  });
  return res.data;
};
