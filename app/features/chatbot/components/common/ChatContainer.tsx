import styled from 'styled-components';
import { useChatBotStore } from '../../stores/ChatBotStore';
import ChatMessage from './ChatMessage';

const ChatContainer = () => {
  const { messages } = useChatBotStore();

  return (
    <Wrapper>
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          sender={msg.sender}
          message={msg.message}
          timestamp={msg.timestamp}
          data={msg.data}
        />
      ))}
    </Wrapper>
  );
};

export default ChatContainer;

const Wrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 12px;
  background-color: #fff;
`;
