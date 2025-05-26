import axios from 'axios';

const HOST = 'http://localhost:8080/api/v1/patients';

export const getPatientList = async () => {
  const res = await axios.get(HOST);
  return res.data;
};
