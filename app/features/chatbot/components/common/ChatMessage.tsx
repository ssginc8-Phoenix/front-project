import styled from 'styled-components';
import { useNavigate } from 'react-router';

interface Props {
  sender: 'user' | 'bot';
  message: string;
  timestamp: string;
  data?: {
    hospitalId?: number;
  };
}

const ChatMessage = ({ sender, message, timestamp, data }: Props) => {
  const navigate = useNavigate();
  const isUser = sender === 'user';
  const isHospital = !!data?.hospitalId;

  const handleClick = () => {
    if (isHospital && data?.hospitalId) {
      navigate(`/hospital/${data.hospitalId}`);
    }
  };

  return (
    <MessageWrapper isUser={isUser}>
      {!isUser && <BotIcon>🤖</BotIcon>}
      <Bubble isUser={isUser} onClick={isHospital ? handleClick : undefined}>
        <Content>{message}</Content>
        <Time>{timestamp}</Time>
      </Bubble>
    </MessageWrapper>
  );
};

export default ChatMessage;

const MessageWrapper = styled.div<{ isUser: boolean }>`
  display: flex;
  align-items: flex-end;
  justify-content: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  margin: 6px 12px;
`;

const BotIcon = styled.div`
  font-size: 18px;
  margin-right: 6px;
`;

const Bubble = styled.div<{ isUser: boolean }>`
  background-color: ${({ isUser }) => (isUser ? '#C2D7FF' : '#F1F0F0')};
  color: #000;
  padding: 10px 14px;
  border-radius: 20px;
  max-width: 85%;
  width: fit-content;

  @media (min-width: 768px) {
    max-width: 420px;
  }

  white-space: pre-line;
  line-height: 1.5;
  font-size: 14px;
  word-break: break-word;
  cursor: ${({ isUser }) => (isUser ? 'default' : 'pointer')};
`;

const Time = styled.div`
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  text-align: right;
`;

const Content = styled.div``;
