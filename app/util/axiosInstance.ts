// app/util/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http:/localhost:8080/api/v1', // API 도메인으로 수정
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;
