import axios from 'axios';

const HOST = 'http://localhost:8080/api/v1';

/**
 * 환자 캘린더 조회
 */
export const getPatientCalendar = async (year: number, month: number) => {
  const res = await axios.get(`${HOST}/calendar/patient`, {
    params: { year, month },
    withCredentials: true,
  });

  console.log(res.data); // 응답 데이터 확인용
  return res.data;
};
