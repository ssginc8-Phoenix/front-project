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

const TimeButton = styled.button<{ selected: boolean; disabled: boolean }>`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background-color: ${({ selected, disabled }) =>
    disabled ? '#e5e7eb' : selected ? '#3b82f6' : '#f9fafb'};
  color: ${({ selected, disabled }) => (disabled ? '#9ca3af' : selected ? '#fff' : '#1f2937')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: 0.2s;

  &:hover {
    background-color: ${({ selected, disabled }) =>
      disabled ? '#e5e7eb' : selected ? '#2563eb' : '#e5e7eb'};
  }
`;

interface DateTimeSelectorProps {
  doctorId: number | null;
  patientId: number | null;
}

const DateTimeSelector = ({ doctorId, patientId }: DateTimeSelectorProps) => {
  const { date, setDate, time, setTime } = useAppointmentStore();

  // date를 YYYY-MM-DD 문자열로 변환 (useTimeSlots는 string 타입 date 필요)
  const dateString = date ? dayjs(date).format('YYYY-MM-DD') : null;

  // useTimeSlots 훅으로 가능한 시간대 불러오기
  const { list: timeSlots, loading, error } = useTimeSlots(doctorId, patientId, dateString);

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
          {loading ? (
            <p>시간 정보를 불러오는 중...</p>
          ) : error ? (
            <p>오류가 발생했습니다: {error}</p>
          ) : timeSlots.length === 0 ? (
            <p>해당 날짜에 예약 가능한 시간이 없습니다.</p>
          ) : (
            <TimeGrid>
              {timeSlots.map((slot) => {
                const isSelected = time === slot.start;
                const isDisabled = !slot.available;

                // 날짜가 있는 문자열로 dayjs 생성
                const dateTime = dayjs(`${dateString} ${slot.start}`, 'YYYY-MM-DD HH:mm:ss');
                const formattedTime = dateTime.isValid() ? dateTime.format('HH:mm') : slot.start;

                return (
                  <TimeButton
                    key={slot.start}
                    selected={isSelected}
                    disabled={isDisabled}
                    onClick={() => {
                      if (!isDisabled) setTime(slot.start);
                    }}
                  >
                    {formattedTime}
                  </TimeButton>
                );
              })}
            </TimeGrid>
          )}
        </div>
      )}

      {date && time && (
        <div>
          <p>
            선택된 예약:{' '}
            <strong>
              {dayjs(date).format('YYYY.MM.DD')}{' '}
              {dayjs(`${dateString} ${time}`, 'YYYY-MM-DD HH:mm:ss').isValid()
                ? dayjs(`${dateString} ${time}`, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')
                : time}
            </strong>
          </p>
        </div>
      )}
    </Wrapper>
  );
};

export default DateTimeSelector;
