import styled from 'styled-components';
import { useDoctorSchedule } from '~/features/doctor/hooks/useDoctorSchedule';
import dayjs from 'dayjs';
import { useTimeSlots } from '~/features/appointment/hooks/useTimeSlots';
import Calendar from 'react-calendar';
import useAppointmentStore from '~/features/appointment/state/useAppointmentStore';
import { StyledCalendarWrapper } from '~/components/styled/StyledCalendarWrapper';

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
  doctorId: number | null;
}

const DateTimeSelector = ({ doctorId }: DateTimeSelectorProps) => {
  const { date, setDate, time, setTime } = useAppointmentStore();

  const { data: schedules = [], isLoading, isError, error } = useDoctorSchedule(doctorId ?? null);

  const selectedDay = date ? weekdayMap[dayjs(date).format('dddd')] : null;

  const timeSlots = useTimeSlots({
    schedules,
    dayOfWeek: selectedDay ?? '',
  });
  return (
    <Wrapper>
      <div>
        <Title>일정 선택</Title>
        <SectionTitle>날짜 선택</SectionTitle>
        <StyledCalendarWrapper>
          <Calendar
            onChange={(date) => {
              setDate(date as Date);
              setTime('');
            }}
            value={date}
            minDate={new Date()}
            calendarType="gregory"
            tileClassName={({ date: d, view }) => {
              if (view === 'month' && date) {
                if (dayjs(d).isSame(date, 'day')) return 'selected-day';
              }
              return '';
            }}
          />
        </StyledCalendarWrapper>
      </div>

      {date && (
        <div>
          <SectionTitle>시간 선택</SectionTitle>
          {isLoading ? (
            <p>시간 정보를 불러오는 중...</p>
          ) : isError ? (
            <p>오류가 발생했습니다: {(error as Error).message}</p>
          ) : timeSlots.length === 0 ? (
            <p>해당 날짜에 예약 가능한 시간이 없습니다.</p>
          ) : (
            <TimeGrid>
              {timeSlots.map((slot) => (
                <TimeButton
                  key={slot.start}
                  selected={time === slot.start}
                  onClick={() => setTime(slot.start)}
                >
                  {slot.start}
                </TimeButton>
              ))}
            </TimeGrid>
          )}
        </div>
      )}

      {date && time && (
        <div>
          <p>
            선택된 예약:{' '}
            <strong>
              {dayjs(date).format('YYYY.MM.DD')} {time}
            </strong>
          </p>
        </div>
      )}
    </Wrapper>
  );
};

export default DateTimeSelector;
