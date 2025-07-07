import SymptomCheckboxList from '~/features/appointment/components/add/symptom/SymptomCheckboxList';
import Textarea from '~/components/styled/Textarea';
import useAppointmentStore from '~/features/appointment/state/useAppointmentStore';
import { Description, Title, TitleBox, Wrapper } from '../Selector.styles';

const SymptomSelector = () => {
  const { selectedSymptoms, setSelectedSymptoms, extraSymptom, setExtraSymptom } =
    useAppointmentStore();

  const hasExtraInput = selectedSymptoms.includes('직접 입력');

  return (
    <Wrapper>
      <TitleBox>
        <Title>증상 선택</Title>
        <Description>현재 느끼는 증상이나 불편한 점을 입력해주세요. (필수 항목)</Description>
      </TitleBox>

      <SymptomCheckboxList selected={selectedSymptoms} onChange={setSelectedSymptoms} />

      {hasExtraInput && (
        <Textarea
          placeholder="직접 입력"
          value={extraSymptom}
          onChange={(e) => setExtraSymptom(e.target.value)}
        />
      )}
    </Wrapper>
  );
};

export default SymptomSelector;
