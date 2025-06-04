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
    const schedule = schedules.find((s) => s.dayOfWeek === dayOfWeek);

    if (!schedule) {
      return [];
    }

    const { startTime, endTime, lunchStart, lunchEnd } = schedule;

    const toTime = (t: string) => dayjs(`1970-01-01T${t}`);

    let current = toTime(startTime);
    const end = toTime(endTime);
    const lunchStartTime = toTime(lunchStart);
    const lunchEndTime = toTime(lunchEnd);

    const slots: TimeSlot[] = [];

    while (current.isBefore(end)) {
      const next = current.add(slotMinutes, 'minute');

      if (next.isAfter(end)) break;

      // 점심시간 제외: 단 lunchStart == lunchEnd일 경우 생략
      const isLunchTime =
        lunchStart !== lunchEnd && next.isAfter(lunchStartTime) && current.isBefore(lunchEndTime);

      if (!isLunchTime) {
        slots.push({
          start: current.format('HH:mm'),
          end: next.format('HH:mm'),
        });
      }

      current = next;
    }

    return slots;
  }, [schedules, dayOfWeek, slotMinutes]);
};
