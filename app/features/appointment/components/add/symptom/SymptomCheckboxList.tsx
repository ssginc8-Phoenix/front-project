import styled from 'styled-components';
import { useEffect } from 'react';
import { media } from '~/components/styled/GlobalStyle';

const CheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;

  ${media.mobile} {
    gap: 0.4rem;
    margin-bottom: 0;
  }
`;

const Label = styled.label.withConfig({
  shouldForwardProp: (prop) => prop !== 'isChecked',
})<{ isChecked: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ isChecked }) => (isChecked ? '#3b82f6' : '#d1d5db')};
  border-radius: 9999px;
  background-color: ${({ isChecked }) => (isChecked ? '#dbeafe' : '#f9fafb')};
  background-color: ${({ isChecked }) => (isChecked ? '#dbeafe' : '#f9fafb')};
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
  user-select: none;

  &:hover {
    background-color: ${({ isChecked }) => (isChecked ? '#bfdbfe' : '#f3f4f6')};
  }

  ${media.mobile} {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
`;

const Checkbox = styled.input`
  display: none;
`;

interface SymptomCheckboxProps {
  selected: string[];
  onChange: (value: string[]) => void;
}

const symptoms = ['기침', '발열', '두통', '복통', '설사', '직접 입력'];

const SymptomCheckboxList = ({ selected, onChange }: SymptomCheckboxProps) => {
  const toggleSymptom = (symptom: string) => {
    if (selected.includes(symptom)) {
      onChange(selected.filter((s) => s !== symptom));
    } else {
      onChange([...selected, symptom]);
    }
  };

  useEffect(() => {}, [selected]);

  return (
    <CheckboxContainer>
      {symptoms.map((symptom) => {
        const isChecked = selected.includes(symptom);
        return (
          <Label key={symptom} isChecked={isChecked}>
            <Checkbox type="checkbox" checked={isChecked} onChange={() => toggleSymptom(symptom)} />
            {symptom}
          </Label>
        );
      })}
    </CheckboxContainer>
  );
};

export default SymptomCheckboxList;
