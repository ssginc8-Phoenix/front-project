import { useMemo } from 'react';
import type { DoctorSchedule } from '~/types/doctor';
import dayjs from 'dayjs';

interface TimeSlot {
  start: string;
  end: string;
}

interface UseTimeSlotsParams {
  schedules: DoctorSchedule[];
  dayOfWeek: string; // 예: 'MONDAY', 'TUESDAY'
  slotMinutes?: number;
}

export const useTimeSlots = ({
  schedules,
  dayOfWeek,
  slotMinutes = 30,
}: UseTimeSlotsParams): TimeSlot[] => {
  return useMemo(() => {
    console.log('useMemo called with dayOfWeek: ', dayOfWeek);
    console.log('전체 스케쥴 목록: ', schedules);

    const schedule = schedules.find((s) => s.dayOfWeek === dayOfWeek);
    console.log('선택된 스케쥴: ', schedule);

    if (!schedule) {
      console.log('일치하는 스케쥴이 없습니다:', dayOfWeek);
      return [];
    }

    const { startTime, endTime, lunchStart, lunchEnd } = schedule;

    const toTime = (t: string) => dayjs(`1970-01-01T${t}`);

    let current = toTime(startTime);
    const end = toTime(endTime);
    const lunchStartTime = toTime(lunchStart);
    const lunchEndTime = toTime(lunchEnd);

    const slots: TimeSlot[] = [];

    console.log(current.isBefore(end));

    while (current.isBefore(end)) {
      const next = current.add(slotMinutes, 'minute');

      console.log('next: ', next);

      if (next.isAfter(end)) break;

      // 점심시간 제외: 단 lunchStart == lunchEnd일 경우 생략
      const isLunchTime =
        lunchStart !== lunchEnd && next.isAfter(lunchStartTime) && current.isBefore(lunchEndTime);

      console.log(
        `🕒 ${current.format('HH:mm')} ~ ${next.format('HH:mm')} | 점심시간 여부: ${isLunchTime}`,
      );

      if (!isLunchTime) {
        slots.push({
          start: current.format('HH:mm'),
          end: next.format('HH:mm'),
        });
      }

      current = next;
      console.log(
        `현재: ${current.format('HH:mm')}, 다음: ${next.format('HH:mm')}, 점심시간 여부: ${isLunchTime}`,
      );
    }

    return slots;
  }, [schedules, dayOfWeek, slotMinutes]);
};
