import styled from 'styled-components';
import Textarea from '~/components/styled/Textarea';
import useAppointmentStore from '~/features/appointment/state/useAppointmentStore';

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

const QuestionInput = () => {
  const { question, setQuestion } = useAppointmentStore();

  return (
    <Wrapper>
      <TitleBox>
        <Title>원장님께 하고 싶은 말</Title>
      </TitleBox>

      <Textarea
        placeholder="원장님께 질문사항이 있으면 입력해주세요."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
    </Wrapper>
  );
};

export default QuestionInput;
