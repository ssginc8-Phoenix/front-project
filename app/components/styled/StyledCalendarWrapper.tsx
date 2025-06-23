import styled from 'styled-components';

export const StyledCalendarWrapper = styled.div`
  .react-calendar {
    width: 100%;
    border: none;
    border-radius: 1rem;
    padding: 1rem;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .react-calendar__navigation {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .react-calendar__navigation button {
    background: none;
    border: none;
    font-weight: bold;
    color: #1f2937;
    font-size: 1rem;
    padding: 0.5rem;
    cursor: pointer;
  }

  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  .react-calendar__tile {
    border: none;
    padding: 0.75rem 0.5rem;
    text-align: center;
    background: none;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .react-calendar__tile:hover {
    background-color: #f3f4f6;
  }

  .react-calendar__tile--now {
    background: #e0f2fe;
    color: #0284c7;
    font-weight: 600;
  }

  .react-calendar__tile--active,
  .selected-day {
    background-color: #3b82f6 !important;
    color: white !important;
    font-weight: 700;
  }

  .react-calendar__tile.non-working-day-calendar {
    background-color: transparent;
    color: #c0c0c0;
    pointer-events: none;
    cursor: not-allowed;
  }

  /* 선택된 날짜와 휴진일 스타일이 겹칠 경우를 대비 (필요시) */
  /* 예를 들어, 휴진일인데 실수로 클릭해서 selected-day 클래스가 붙더라도 휴진일 스타일이 우선하도록 */
  .react-calendar__tile.non-working-day-calendar.selected-day {
    background-color: #e0e0e0 !important; /* 다른 색상으로 변경하여 구별 */
    color: #808080 !important;
    text-decoration: line-through !important;
  }
`;
