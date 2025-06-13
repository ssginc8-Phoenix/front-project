import axios from 'axios';
import type { AppointmentRequest } from '~/types/appointment';

const HOST = 'http://localhost:8080/api/v1/appointments';

/**
 * 예약 요청
 */
export const createAppointment = async (data: AppointmentRequest) => {
  const res = await axios.post(HOST, data, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  return res.data;
};

/**
 * 예약 단건 조회
 */
export const getAppointment = async (appointmentId: number) => {
  const res = await axios.get(`${HOST}/${appointmentId}`, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * 예약 리스트 조회 (로그인한 유저의)
 */
export const getAppointmentList = async (page: number, size: number, date?: string) => {
  const res = await axios.get(`http://localhost:8080/api/v1/users/me/appointments`, {
    withCredentials: true,
    params: { page, size, date },
  });

  return res.data;
};

/**
 * 예약 가능한 시간 슬롯 리스트 조회 (로그인한 유저의)
 */
export const getAvailableTimeSlots = async (doctorId: number, date: string) => {
  const res = await axios.get(`${HOST}/available-time-slots`, {
    params: { doctorId, date },
    withCredentials: true,
  });

  return res.data;
};

/**
 * 예약의 상태 변경 요청
 */
export const changeStatus = async (appointmentId: number, status: string) => {
  const res = await axios.patch(
    `${HOST}/${appointmentId}/status`,
    {
      status: status,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    },
  );

  return res.data;
};

/**
 * 재예약
 */
export const reschedule = async (appointmentId: number, newTime: string) => {
  const res = await axios.post(
    `${HOST}/${appointmentId}/reschedule`,
    {
      newTime: newTime,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    },
  );

  return res.data;
};
