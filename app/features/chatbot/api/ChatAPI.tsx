import axios from 'axios';
import type { Hospital } from '../../../types/chatbot';

const HOST = 'http://localhost:8080/api/v1/chatbot';

export const classifySymptom = async (symptom: string): Promise<string> => {
  const res = await axios.post(
    `${HOST}/classify`,
    { symptom },
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    },
  );
  return res.data.specialization;
};

export const getHospitalRecommendations = async (specialization: string): Promise<Hospital[]> => {
  const res = await axios.get(`${HOST}/recommend`, {
    params: { specialization },
    withCredentials: true,
  });
  return res.data;
};
