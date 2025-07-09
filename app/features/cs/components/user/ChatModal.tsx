import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { X, Send } from 'lucide-react';
import {
  fetchCsMessages,
  deleteCsRoom,
  fetchCsRoomDetail,
  updateCsRoomStatus,
  fetchCsMessagesByCustomer,
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
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
  @media (max-width: 768px) {
    width: 100vw;
    height: 100vh;
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
  const [agentAvatar, setAgentAvatar] = useState<string | null>(initialAgentAvatar || null);

  // Load history & refresh agent info on open or csRoomId change
  useEffect(() => {
    if (!isOpen) return;

    fetchCsMessagesByCustomer(userId)
      .then((custMsgs) => {
        const lastRoomId = custMsgs.length > 0 ? custMsgs[0].csRoomId : csRoomId;
        const nowIso = new Date().toISOString();
        console.log('[ChatModal] 요청하는 before:', nowIso);
        return fetchCsMessages(lastRoomId, nowIso, 9999);
      })
      .then((msgs) => {
        const systemPhrases = ['상담사가 배정되었습니다', '고객님이 상담을 종료하였습니다'];

        setMessages(
          msgs.map((m) => ({
            id: m.csMessageId!,
            text: m.content,
            date: new Date(m.createdAt),
            isMine: m.userId === userId,
            system:
              Boolean((m as any).system) ||
              systemPhrases.some((phrase) => m.content.includes(phrase)),
          })),
        );
      })
      .catch(console.error);

    if (csRoomId) {
      fetchCsRoomDetail(csRoomId)
        .then((res) => {
          setAgentName(res.data.agentName ?? '');
          setAgentAvatar(res.data.agentAvatarUrl ?? '');
        })
        .catch(console.error);
    }
  }, [isOpen, csRoomId, userId]);

  // STOMP subscription
  useEffect(() => {
    if (!isOpen) return;
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-chat'),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/rooms/${csRoomId}`, (msg: IMessage) => {
          const body = JSON.parse(msg.body) as any;
          if (!body.system && body.userId === userId) return;
          // Refresh agent on system or other
          if (body.system || body.userId !== userId) {
            fetchCsRoomDetail(csRoomId)
              .then((res) => {
                setAgentName(res.data.agentName ?? '');
                setAgentAvatar(res.data.agentAvatarUrl ?? '');
              })
              .catch(console.error);
          }
          setMessages((prev) => [
            ...prev,
            {
              id: body.csMessageId,
              text: body.content,
              date: new Date(body.createdAt),
              isMine: body.userId === userId,
              system: body.system ?? false,
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

  const displayMessages = useMemo<ChatMessage[]>(() => {
    return messages
      .filter(
        (m: ChatMessage) =>
          // 시스템 메시지 중 “배정되었습니다”만 남기고 나머지 시스템 메시지는 제거
          !(m.text === '상담사가 배정되었습니다.' && m.system === false),
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [messages]);

  const rendered = useMemo<React.ReactNode[]>(() => {
    const elems: React.ReactNode[] = [];
    let lastDate: string | null = null;
    displayMessages.forEach((msg, idx) => {
      const dateStr = msg.date.toLocaleDateString();
      if (dateStr !== lastDate) {
        elems.push(<DateSeparator key={`d-${idx}`}>{dateStr}</DateSeparator>);
        lastDate = dateStr;
      }
      if (msg.system) {
        elems.push(<SystemMessage key={`s-${idx}`}>{msg.text}</SystemMessage>);
      } else {
        const avatar = msg.isMine ? userAvatar : agentAvatar;
        const name = msg.isMine ? userName : agentName;
        elems.push(
          <MessageItem key={`m-${idx}`} isMine={msg.isMine}>
            <MessageAvatarSmall src={avatar} alt={name} />
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

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [rendered]);

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

  const handleExit = async () => {
    if (!window.confirm('이전 대화는 사라집니다. 괜찮으시겠습니까?')) return;
    clientRef.current?.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({ csRoomId, content: '고객님이 상담을 종료하였습니다.', system: true }),
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
