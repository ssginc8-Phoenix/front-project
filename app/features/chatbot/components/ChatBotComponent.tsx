import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import ChatContainer from '~/features/chatbot/components/common/ChatContainer';
import ChatInput from '~/features/chatbot/components/common/ChatInput';
import { useChatBotStore } from '~/features/chatbot/stores/ChatBotStore';

const ChatBotComponent = () => {
  const { messages, addMessage } = useChatBotStore();
  const hasInit = useRef(false);

  useEffect(() => {
    if (!hasInit.current && messages.length === 0) {
      addMessage({
        id: Date.now(),
        sender: 'bot',
        message:
          '안녕하세요 😊 저는 증상을 분석해 진료과를 분류하고, 가까운 병원을 추천해드리는 챗봇이에요.\n' +
          '아프신 부위나 증상을 편하게 입력해 주세요. 함께 도와드릴게요!🤝',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      hasInit.current = true;
    }
  }, [addMessage, messages]);

  return (
    <Wrapper>
      <Header>DOCTO CHATBOT</Header>
      <Body>
        <ChatSection>
          <ChatContainer />
        </ChatSection>
        <InputSection>
          <ChatInput />
        </InputSection>
      </Body>
    </Wrapper>
  );
};

export default ChatBotComponent;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  width: 100%;
  max-width: 480px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  padding: 14px 0;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const ChatSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 6px 0;
`;

const InputSection = styled.div`
  border-top: 1px solid #eee;
  padding: 8px;
  background-color: #fff;
`;
