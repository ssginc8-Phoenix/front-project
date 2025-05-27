import axios from 'axios';

const HOST = 'http://localhost:8080/api/v1/doctors';

/**
 * 병원에 속한 의사 조회
 */
export const getDoctorList = async (hospitalId: number) => {
  const res = await axios.get(`${HOST}/hospitalId`, {
    params: { hospitalId },
  });
  return res.data;
};

/**
 *  의사 영업시간 조회
 */
export const getDoctorSchedules = async (doctorId: number) => {
  const res = await axios.get(`${HOST}/${doctorId}/schedules`);
  console.log(res.data);
  return res.data;
};
