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

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #00499e;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
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

  @media (max-width: 480px) {
    padding: 0.4rem;
    font-size: 0.85rem;
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

  // useDoctorSchedule 훅으로 의사의 근무 요일 정보 불러오기
  const { data: doctorScheduleData, isLoading: isScheduleLoading } = useDoctorSchedule(doctorId);
  const workingDays = doctorScheduleData?.workingDays || [];

  // 선택한 날짜가 의사의 근무일인지 확인
  const isDoctorWorkingOnSelectedDate = date ? workingDays.includes(dayjs(date).day()) : false;

  // useTimeSlots 훅으로 가능한 시간대 불러오기
  const {
    list: timeSlots,
    loading,
    error,
  } = useTimeSlots(doctorId, patientId, dateString, {
    enabled: !!doctorId && !!dateString && isDoctorWorkingOnSelectedDate,
  });

  /** 30일 => 30으로 `일`을 없애기 */
  const formatCalendarDay = (locale: string | undefined, date: Date) => {
    // locale은 사용하지 않지만, 타입 시그니처에 맞춰 인자로 받음
    // 날짜(일) 숫자만 문자열로 반환
    return date.getDate().toString();
  };

  return (
    <Wrapper>
      <div>
        <Title>일정 선택</Title>
        <SectionTitle>날짜 선택</SectionTitle>
        <StyledCalendarWrapper>
          <Calendar
            onChange={(selectedDate) => {
              setDate(selectedDate as Date);
              setTime('');
            }}
            value={date}
            minDate={new Date()}
            calendarType="gregory"
            tileClassName={({ date: d, view }) => {
              if (view === 'month') {
                // 1. 현재 선택된 날짜 강조
                if (dayjs(d).isSame(date, 'day')) return 'selected-day';

                if (
                  !isScheduleLoading &&
                  doctorScheduleData &&
                  !workingDays.includes(dayjs(d).day())
                ) {
                  return 'non-working-day-calendar';
                }
              }
              return '';
            }}
            formatDay={formatCalendarDay}
          />
        </StyledCalendarWrapper>
      </div>

      {date && (
        <div>
          <SectionTitle>시간 선택</SectionTitle>
          {!isDoctorWorkingOnSelectedDate ? (
            <p>해당 날자는 휴진일입니다.</p>
          ) : loading ? (
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
