import { useState } from 'react';
import styled from 'styled-components';
import { useDoctorSchedule } from '~/features/doctor/hooks/useDoctorSchedule';
import dayjs from 'dayjs';
import { useTimeSlots } from '~/features/appointment/hooks/useTimeSlots';
import Calendar from 'react-calendar';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #00499e;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
`;

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
`;

const TimeButton = styled.button<{ selected: boolean }>`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background-color: ${({ selected }) => (selected ? '#3b82f6' : '#f9fafb')};
  color: ${({ selected }) => (selected ? '#fff' : '#1f2937')};
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: ${({ selected }) => (selected ? '#2563eb' : '#e5e7eb')};
  }
`;

const weekdayMap: Record<string, string> = {
  Sunday: 'SUNDAY',
  Monday: 'MONDAY',
  Tuesday: 'TUESDAY',
  Wednesday: 'WEDNESDAY',
  Thursday: 'THURSDAY',
  Friday: 'FRIDAY',
  Saturday: 'SATURDAY',
};

interface DateTimeSelectorProps {
  doctorId: number;
}

const DateTimeSelector = ({ doctorId }: DateTimeSelectorProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const { data: schedules, loading } = useDoctorSchedule(doctorId);

  const selectedDay = selectedDate ? weekdayMap[dayjs(selectedDate).format('dddd')] : null;
  console.log('selectedDay: ', selectedDay);

  const timeSlots = useTimeSlots({
    schedules,
    dayOfWeek: selectedDay ?? '',
  });

  const getWeekRange = (date: Date) => {
    const start = dayjs(date).startOf('week');
    const end = dayjs(date).endOf('week');
    return { start, end };
  };

  const isSameWeek = (date: Date, selected: Date) => {
    const { start, end } = getWeekRange(selected);
    return dayjs(date).isAfter(start.subtract(1, 'day')) && dayjs(date).isBefore(end.add(1, 'day'));
  };

  return (
    <Wrapper>
      <div>
        <Title>일정 선택</Title>
        <SectionTitle>날짜 선택</SectionTitle>
        <Calendar
          onChange={(date) => {
            setSelectedDate(date as Date);
            setSelectedTime('');
          }}
          value={selectedDate}
          minDate={new Date()}
          calendarType="gregory"
          tileClassName={({ date, view }) => {
            if (view === 'month') {
              if (selectedDate && isSameWeek(date, selectedDate)) {
                return 'highlight-week';
              }
              if (dayjs(date).isSame(selectedDate, 'day')) {
                return 'selected-day';
              }
            }
            return '';
          }}
        />
      </div>

      {selectedDate && (
        <div>
          <SectionTitle>시간 선택</SectionTitle>
          {loading ? (
            <p>시간 정보를 불러오는 중...</p>
          ) : timeSlots.length === 0 ? (
            <p>해당 날짜에 예약 가능한 시간이 없습니다.</p>
          ) : (
            <TimeGrid>
              {timeSlots.map((slot) => (
                <TimeButton
                  key={slot.start}
                  selected={selectedTime === slot.start}
                  onClick={() => setSelectedTime(slot.start)}
                >
                  {slot.start}
                </TimeButton>
              ))}
            </TimeGrid>
          )}
        </div>
      )}

      {selectedDate && selectedTime && (
        <div>
          <p>
            선택된 예약:{' '}
            <strong>
              {dayjs(selectedDate).format('YYYY.MM.DD')} {selectedTime}
            </strong>
          </p>
        </div>
      )}
    </Wrapper>
  );
};

export default DateTimeSelector;
