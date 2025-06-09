import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-bottom: 20px;
`;

interface DatePickerSectionProps {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
}

const DatePickerSection = ({ selectedDate, onChangeDate }: DatePickerSectionProps) => {
  return (
    <Wrapper>
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => {
          if (date) onChangeDate(date);
        }}
        dateFormat="yyyy-MM-dd"
        isClearable={false}
        placeholderText="날짜 선택"
      />
    </Wrapper>
  );
};

export default DatePickerSection;
