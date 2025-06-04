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
`;
