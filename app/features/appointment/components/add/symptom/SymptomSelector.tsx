import styled from 'styled-components';
import { useState } from 'react';
import SymptomCheckboxList from '~/features/appointment/components/add/symptom/SymptomCheckboxList';
import Textarea from '~/components/Textarea';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TitleBox = styled.div`
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #00499e;
`;

const Description = styled.p`
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const SymptomSelector = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [extraInput, setExtraInput] = useState('');

  const hasExtraInput = selectedSymptoms.includes('직접 입력');

  return (
    <Wrapper>
      <TitleBox>
        <Title>증상 선택</Title>
        <Description>현재 느끼는 증상이나 불편한 점을 입력해주세요.</Description>
      </TitleBox>

      <SymptomCheckboxList selected={selectedSymptoms} onChange={setSelectedSymptoms} />

      {hasExtraInput && (
        <Textarea
          placeholder="직접 입력"
          value={extraInput}
          onChange={(e) => setExtraInput(e.target.value)}
        />
      )}
    </Wrapper>
  );
};

export default SymptomSelector;
