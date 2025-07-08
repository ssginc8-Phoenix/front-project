import axios from 'axios';
import type { MedicationScheduleResponse } from '~/features/medication/types/types';

const HOST = 'https://beanstalk.docto.click/api/v1';

/**
 * 보호자가 약 복용 스케줄을 등록
 */
export const postMedicationSchedule = async (data: {
  userId: number;
  patientGuardianId: number;
  medicationName: string;
  timeToTake: string; // "HH:mm:ss" 형식
  days: string[]; // ["MONDAY", "WEDNESDAY"]
}) => {
  const res = await axios.post(`${HOST}/medications`, data, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * 특정 복약 스케줄 단건 조회
 */
export const getMedicationSchedule = async (medicationId: number) => {
  const res = await axios.get<MedicationScheduleResponse>(`${HOST}/medications/${medicationId}`, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * 현재 로그인한 유저의 복약 스케줄 조회 (GET /me/schedules)
 */
export const getMyMedicationSchedules = async () => {
  const res = await axios.get(`${HOST}/medications/me/schedules`, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * 현재 로그인한 유저의 복약 로그 조회 (GET /me/logs)
 */
export const getMyMedicationLogs = async (page: number = 0, size: number = 10) => {
  const res = await axios.get(`${HOST}/medications/me/logs`, {
    params: { page, size },
    withCredentials: true,
  });
  return res.data;
};

/**
 * 복약 완료 처리
 */
export const completeMedication = async (
  medicationId: number,
  medicationAlertTimeId: number,
  completedAt: string,
) => {
  const body = {
    medicationAlertTimeId: medicationAlertTimeId,
    completedAt: completedAt,
  };

  const res = await axios.post(`${HOST}/medications/${medicationId}/taken`, body, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * 복약 시간 및 요일 수정
 */
export const updateMedicationSchedule = async (
  medicationId: number,
  data: {
    newTimes?: { meal: 'morning' | 'lunch' | 'dinner'; time: string }[];
    newDays?: string[];
    newStartDate?: string;
    newEndDate?: string;
  },
) => {
  // 새로운 페이로드를 만듭니다. undefined 인 필드는 보내지 않아요.
  const payload: Record<string, any> = {};
  if (data.newTimes !== undefined) payload.newTimes = data.newTimes;
  if (data.newDays !== undefined) payload.newDays = data.newDays;
  if (data.newStartDate !== undefined) payload.newStartDate = data.newStartDate;
  if (data.newEndDate !== undefined) payload.newEndDate = data.newEndDate;

  const res = await axios.patch(`${HOST}/medications/${medicationId}`, payload, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * 복약 스케줄 삭제
 */
export const deleteMedicationSchedule = async (medicationId: number) => {
  const res = await axios.delete(`${HOST}/medications/${medicationId}`, {
    withCredentials: true,
  });
  return res.data;
};
