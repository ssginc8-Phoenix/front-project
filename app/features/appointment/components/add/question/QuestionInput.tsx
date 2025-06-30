import Textarea from '~/components/styled/Textarea';
import useAppointmentStore from '~/features/appointment/state/useAppointmentStore';
import { Wrapper, TitleBox, Title } from '../Selector.styles';

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
