import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { X, Send } from 'lucide-react';
import {
  fetchCsMessages,
  deleteCsRoom,
  fetchCsRoomDetail,
  updateCsRoomStatus,
} from '~/features/cs/api/csAPI';
import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// --- Styled Components ---
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5); /* 반투명 검정으로 뒤를 가립니다 */
  display: flex; /* 자식인 Modal을 중앙정렬 하기 위해 flex */
  justify-content: center;
  align-items: center;
  z-index: 1000;
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
const DateSeparator = styled.div`
  align-self: center;
  color: #888;
  font-size: 0.85rem;
  margin: 12px 0;
`;
const Modal = styled.div`
  width: 600px;
  max-width: 95%;
  height: 80vh;
  max-height: 90vh;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* 모바일에서 풀스크린 처리 */
  @media (max-width: 768px) {
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
  }
`;
const WindowHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f5f5f5;
  padding: 8px 16px;
  border-bottom: 1px solid #ccc;
  flex-shrink: 0;
`;
const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const ExitButton = styled.button`
  all: unset;
  cursor: pointer;
  color: #1890ff;
  font-size: 0.875rem;
  padding: 4px 8px;
  border-radius: 4px;
  &:hover {
    background: rgba(24, 144, 255, 0.1);
  }
`;
const CloseWindowButton = styled.button`
  all: unset;
  cursor: pointer;
  padding: 4px;
  &:hover {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
  }
`;
const MessagesContainer = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const MessageItem = styled.div<{ isMine?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex-direction: ${({ isMine }) => (isMine ? 'row-reverse' : 'row')};
`;
const MessageAvatarSmall = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;
const MessageContent = styled.div<{ isMine?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ isMine }) => (isMine ? 'flex-end' : 'flex-start')};
`;
const SenderName = styled.div`
  font-size: 0.75rem;
  color: #555;
  margin-bottom: 4px;
`;
const MessageText = styled.span<{ isMine?: boolean }>`
  background: ${({ isMine }) => (isMine ? '#1890ff' : '#f1f1f1')};
  color: ${({ isMine }) => (isMine ? '#fff' : '#000')};
  padding: 8px 12px;
  border-radius: 16px;
  word-break: break-word;
`;
const MessageDate = styled.span`
  font-size: 0.75rem;
  color: #888;
`;
const InputContainer = styled.div`
  display: flex;
  padding: 16px;
  border-top: 1px solid #ddd;
`;
const TextInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 1rem;
  outline: none;
`;
const SendButton = styled.button`
  all: unset;
  margin-left: 12px;
  cursor: pointer;
`;

// --- Props & Types ---
export interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExit: () => void;
  userId: number;
  userName: string;
  userAvatar: string;
  agentName: string;
  agentAvatar: string;
  csRoomId: number;
}
interface ChatMessage {
  id: number;
  text: string;
  date: Date;
  isMine: boolean;
  system?: boolean;
}

// --- ChatModal Component ---
const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  onExit,
  userId,
  userName,
  userAvatar,
  agentName: initialAgentName,
  agentAvatar: initialAgentAvatar,
  csRoomId,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<Client | null>(null);
  const [agentName, setAgentName] = useState(initialAgentName);
  const [agentAvatar, setAgentAvatar] = useState(initialAgentAvatar);

  // 1) 초기 메시지 로드
  useEffect(() => {
    if (!isOpen) return;
    fetchCsMessages(csRoomId)
      .then((data) =>
        setMessages(
          data.map((m) => ({
            id: m.csMessageId,
            text: m.content,
            date: new Date(m.createdAt),
            isMine: m.userId === userId,
            system: (m as any).system ?? m.content === '상담사가 배정되었습니다.',
          })),
        ),
      )
      .catch(console.error);
  }, [isOpen, csRoomId, userId]);

  // 2) STOMP 구독
  useEffect(() => {
    if (!isOpen) return;
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-chat'),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/rooms/${csRoomId}`, (msg: IMessage) => {
          const body = JSON.parse(msg.body) as {
            csMessageId: number;
            userId: number;
            content: string;
            createdAt: string;
            system?: boolean;
            agentName?: string;
            agentAvatarUrl?: string;
          };
          if (!body.system && body.userId === userId) {
            return;
          }
          if (body.system || (!body.system && body.userId !== userId)) {
            fetchCsRoomDetail(csRoomId)
              .then((res) => {
                setAgentName(res.data.agentName ?? '');
                setAgentAvatar(res.data.agentAvatarUrl ?? '');
              })
              .catch((err) => console.error('상세조회 실패', err));
          }
          setMessages((prev) => [
            ...prev,
            {
              id: body.csMessageId,
              text: body.content,
              date: new Date(body.createdAt),
              isMine: body.userId === userId,
              system: body.system ?? body.content === '상담사가 배정되었습니다.',
            },
          ]);
        });
      },
    });
    client.activate();
    clientRef.current = client;
    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [isOpen, csRoomId, userId]);

  // 3) 히스토리 REST만 제거 후 날짜 순 정렬
  const displayMessages = useMemo(() => {
    return [...messages]
      .filter((m) => !(m.text === '상담사가 배정되었습니다.' && m.system === false))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [messages]);

  // 4) 날짜 구분선 & 메시지 렌더링
  const rendered = useMemo<React.ReactNode[]>(() => {
    const elems: React.ReactNode[] = [];
    let lastDate: string | null = null;
    displayMessages.forEach((msg, idx) => {
      const dateStr = msg.date.toLocaleDateString();
      if (dateStr !== lastDate) {
        elems.push(<DateSeparator key={`date-${idx}`}>{dateStr}</DateSeparator>);
        lastDate = dateStr;
      }
      if (msg.system) {
        elems.push(<SystemMessage key={`sys-${idx}`}>{msg.text}</SystemMessage>);
      } else {
        // 상대방 정보
        const avatar = msg.isMine ? userAvatar : agentAvatar;
        const name = msg.isMine ? userName : agentName;
        elems.push(
          <MessageItem key={`msg-${idx}`} isMine={msg.isMine}>
            <MessageAvatarSmall src={avatar || undefined} alt={name} />
            <MessageContent isMine={msg.isMine}>
              <SenderName>{name}</SenderName>
              <MessageText isMine={msg.isMine}>{msg.text}</MessageText>
              <MessageDate>
                {msg.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </MessageDate>
            </MessageContent>
          </MessageItem>,
        );
      }
    });
    return elems;
  }, [displayMessages, userAvatar, userName, agentAvatar, agentName]);

  // 5) 자동 스크롤
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [rendered]);

  // 6) 메시지 전송
  const handleSend = () => {
    if (!input.trim()) return;
    const tempId = -Date.now();
    setMessages((prev) => [
      ...prev,
      { id: tempId, text: input.trim(), date: new Date(), isMine: true, system: false },
    ]);
    clientRef.current?.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({ csRoomId, content: input.trim() }),
    });
    setInput('');
  };

  // 7) 방 나가기
  const handleExit = async () => {
    if (!window.confirm('이전 대화는 사라집니다. 괜찮으시겠습니까?')) return;

    // 1) 시스템 메시지 발행 (관리자에게 알려주기)
    clientRef.current?.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({
        csRoomId,
        content: '고객님이 상담을 종료하였습니다.',
        system: true,
      }),
    });

    try {
      await updateCsRoomStatus(csRoomId, 'CLOSED');

      await deleteCsRoom(csRoomId);
    } catch (e) {
      console.error(e);
    }
    onExit();
  };

  if (!isOpen) return null;
  return (
    <Overlay>
      <Modal>
        <WindowHeader>
          <span>고객센터</span>
          <HeaderActions>
            <ExitButton onClick={handleExit}>방 나가기</ExitButton>
            <CloseWindowButton onClick={onClose}>
              <X size={20} />
            </CloseWindowButton>
          </HeaderActions>
        </WindowHeader>
        <MessagesContainer>
          {rendered}
          <div ref={endRef} />
        </MessagesContainer>
        <InputContainer>
          <TextInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="메시지를 입력하세요..."
          />
          <SendButton onClick={handleSend}>
            <Send size={24} />
          </SendButton>
        </InputContainer>
      </Modal>
    </Overlay>
  );
};

export default ChatModal;
