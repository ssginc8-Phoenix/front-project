import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { Send } from 'lucide-react';
import useLoginStore from '~/features/user/stores/LoginStore';

// --- Styled Components ---
const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const ChatHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #ddd;
  justify-content: space-between;
  font-weight: bold;
`;
const MessagesContainer = styled.div`
  flex: 1;
  padding: 16px;
  max-height: 600px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const DateSeparator = styled.div`
  text-align: center;
  margin: 12px 0;
  color: #888;
  font-size: 0.85rem;
`;
const SystemMessage = styled.div`
  align-self: center;
  background: #e1ecf4;
  color: #333;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  margin: 8px 0;
`;
const InputWrapper = styled.div`
  display: flex;
  padding: 12px 16px;
  border-top: 1px solid #ddd;
`;
const TextInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 8px;
`;
const SendButton = styled.button`
  padding: 8px 16px;
  background-color: #0056b3;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const MessageItem = styled.div<{ isMine?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-direction: ${({ isMine }) => (isMine ? 'row-reverse' : 'row')};
  margin-left: ${({ isMine }) => (isMine ? 'auto' : '0')};
  max-width: 70%;
`;
const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
`;
const MessageBody = styled.div<{ isMine?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ isMine }) => (isMine ? 'flex-end' : 'flex-start')};
`;
const BackButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1rem;
  cursor: pointer;
`;

// 제목 중앙 정렬을 위해 오른쪽에 빈 공간
const BackPlaceholder = styled.div`
  width: 2rem;
`;
const MessageText = styled.span<{ isMine?: boolean }>`
  background: ${({ isMine }) => (isMine ? '#003f7f' : '#f1f1f1')};
  color: ${({ isMine }) => (isMine ? '#fff' : '#000')};
  padding: 8px 12px;
  border-radius: 16px;
  word-break: break-word;
`;
const MessageDate = styled.span`
  font-size: 0.75rem;
  color: #888;
`;

// --- Types ---
export interface ChatWindowProps {
  roomName: string;
  myName: string;
  messages: Array<{ sender: string; avatar: string; text: string; date: Date; system?: boolean }>;
  onSend: (text: string) => void;
  disabled?: boolean;
  roomId: number; // 새 방 식별용
  onBack?: () => void;
}

// --- Component ---
const ChatWindow: React.FC<ChatWindowProps> = ({
  roomName,
  myName,
  messages,
  onSend,
  disabled = false,
  roomId,
  onBack,
}) => {
  // 로컬 메시지 상태, 방 변경 시 초기화
  const [localMessages, setLocalMessages] = useState(messages);
  useEffect(() => {
    // 시스템 메시지로 취급할 텍스트 목록
    const systemTexts = ['상담사가 배정되었습니다.', '고객님이 상담을 종료하였습니다.'];

    setLocalMessages(
      messages.map((m) => ({
        ...m,
        // 이미 system 플래그가 있으면 그대로, 없으면 텍스트로 판단
        system: m.system ?? systemTexts.includes(m.text),
      })),
    );
  }, [messages, roomId]);

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useLoginStore();
  const isAgent = user?.role === 'SYSTEM_ADMIN';

  // 메시지 정렬 & 필터링
  const filteredMessages = useMemo(() => {
    return [...localMessages]
      .filter((m) => !(isAgent && m.system))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [localMessages, isAgent]);

  // 자동 스크롤
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages]);

  // 렌더링할 JSX
  const rendered = useMemo(() => {
    const elems: React.ReactNode[] = [];
    let lastDate: string | null = null;

    filteredMessages.forEach((msg, idx) => {
      const currentDate = msg.date.toLocaleDateString();
      if (currentDate !== lastDate) {
        elems.push(<DateSeparator key={`date-${idx}`}>{currentDate}</DateSeparator>);
        lastDate = currentDate;
      }
      if (msg.system) {
        elems.push(<SystemMessage key={`sys-${idx}`}>{msg.text}</SystemMessage>);
      } else {
        const isMine = msg.sender === myName;
        elems.push(
          <MessageItem key={`msg-${idx}`} isMine={isMine}>
            <Avatar src={msg.avatar} alt={msg.sender} />
            <MessageBody isMine={isMine}>
              <div style={{ fontSize: '0.8rem', marginBottom: '4px', color: '#555' }}>
                {msg.sender}
              </div>
              <MessageText isMine={isMine}>{msg.text}</MessageText>
              <MessageDate>
                {msg.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </MessageDate>
            </MessageBody>
          </MessageItem>,
        );
      }
    });

    return elems;
  }, [filteredMessages, myName]);

  // 메시지 전송
  const handleSend = () => {
    if (disabled || !input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <Main>
      <ChatHeader>
        {onBack && <BackButton onClick={onBack}>← 뒤로</BackButton>}
        <span>{roomName}</span>

        {onBack && <BackPlaceholder />}
      </ChatHeader>
      <MessagesContainer>
        {rendered}
        <div ref={scrollRef} />
      </MessagesContainer>
      <InputWrapper>
        <TextInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="메시지 입력"
          disabled={disabled}
        />
        <SendButton onClick={handleSend} disabled={disabled || !input.trim()}>
          <Send />
        </SendButton>
      </InputWrapper>
    </Main>
  );
};

export default ChatWindow;
