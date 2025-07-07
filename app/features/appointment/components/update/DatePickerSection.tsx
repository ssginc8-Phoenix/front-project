import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { media } from '~/components/styled/GlobalStyle';

const StyledDatePicker = styled(DatePicker)`
  padding: 10px 15px;
  border: 1px solid #dcdcdc; /* 옅은 회색 테두리 */
  border-radius: 8px; /* 둥근 모서리 */
  font-size: 1rem;
  color: #333;
  outline: none; /* 포커스 시 기본 아웃라인 제거 */
  transition:
    border-color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out; /* 부드러운 전환 효과 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); /* 은은한 그림자 */
  text-align: center; /* 날짜 텍스트 중앙 정렬 */
  cursor: pointer;

  &:hover {
    border-color: #a0a0a0; /* 호버 시 테두리 색상 진하게 */
  }

  &:focus {
    border-color: #007bff; /* 포커스 시 파란색 테두리 */
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2); /* 포커스 시 은은한 그림자 */
  }

  /* react-datepicker 내부 요소 스타일링 오버라이드 */
  /* .react-datepicker-wrapper는 DatePicker input을 감싸는 div입니다. */
  &.react-datepicker-wrapper {
    display: inline-block; /* 너비가 자동으로 조절되도록 */
    width: auto; /* 기본 너비를 유연하게 설정 */

    ${media.mobile} {
      width: 100%; /* 모바일에서 너비 꽉 채움 */
    }
  }

  ${media.mobile} {
    padding: 12px 15px; /* 모바일에서 패딩 줄임 */
    font-size: 0.95rem; /* 모바일에서 폰트 크기 줄임 */
    width: 75%;
  }

  /* 팝업 달력 자체 스타일 (모바일 반응형) */
  .react-datepicker {
    font-family: 'Noto Sans KR', sans-serif; /* 폰트 일관성 유지 */
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    ${media.mobile} {
      width: 100%; /* 모바일에서 달력 팝업 너비 꽉 채움 */
      max-width: 320px; /* 너무 커지지 않도록 최대 너비 설정 */
      font-size: 0.9rem; /* 폰트 크기 조정 */
    }
  }

  /* 팝업 달력의 헤더 (월, 연도 네비게이션) */
  .react-datepicker__header {
    background-color: #f8f8f8; /* 옅은 회색 배경 */
    border-bottom: 1px solid #e0e0e0;
    padding-top: 10px;

    ${media.mobile} {
      padding-top: 8px; /* 모바일에서 패딩 줄임 */
    }
  }

  /* 요일 이름 */
  .react-datepicker__day-name {
    color: #555;
    ${media.mobile} {
      font-size: 0.8rem; /* 모바일에서 폰트 크기 줄임 */
    }
  }

  /* 선택된 날짜 */
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: #007bff;
    color: white;
    border-radius: 50%; /* 동그란 선택 표시 */
  }

  /* hover 시 날짜 */
  .react-datepicker__day:not(.react-datepicker__day--selected):hover {
    background-color: #e0e0e0; /* 옅은 회색 배경 */
    border-radius: 50%;
  }

  /* 오늘 날짜 */
  .react-datepicker__day--today {
    font-weight: bold;
    color: #007bff; /* 오늘 날짜 색상 강조 */
  }

  /* 특정 월에 속하지 않는 날짜 */
  .react-datepicker__day--outside-month {
    color: #ccc; /* 흐릿하게 표시 */
  }

  /* 월/연도 드롭다운 */
  .react-datepicker__month-dropdown,
  .react-datepicker__year-dropdown {
    border: 1px solid #dcdcdc;
    border-radius: 4px;

    ${media.mobile} {
      font-size: 0.85rem; /* 모바일에서 폰트 크기 줄임 */
    }
  }

  /* 날짜 셀 자체 (일) */
  .react-datepicker__day {
    ${media.mobile} {
      width: 1.8rem; /* 모바일에서 날짜 셀 너비 조정 */
      height: 1.8rem; /* 모바일에서 날짜 셀 높이 조정 */
      line-height: 1.8rem; /* 텍스트 세로 중앙 정렬 */
      font-size: 0.85rem; /* 모바일에서 폰트 크기 줄임 */
    }
  }
`;

interface DatePickerSectionProps {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
}

const DatePickerSection = ({ selectedDate, onChangeDate }: DatePickerSectionProps) => {
  return (
    <StyledDatePicker
      selected={selectedDate}
      onChange={(date: Date | null) => {
        if (date) onChangeDate(date);
      }}
      dateFormat="yyyy-MM-dd"
      isClearable={false}
      placeholderText="날짜 선택"
      popperPlacement="bottom-end"
    />
  );
};

export default DatePickerSection;
