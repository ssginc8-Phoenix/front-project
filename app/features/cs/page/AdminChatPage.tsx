import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Client, type Message, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import styled, { css } from 'styled-components';

import ChatRoomList from '~/features/cs/components/admin/ChatRoomList';
import ChatWindow from '~/features/cs/components/admin/ChatWindow';
import ConsultationPanel from '~/features/cs/components/admin/ConsultationPanel';
import useLoginStore from '~/features/user/stores/LoginStore';

import type { CsMessageResponse, CsRoomResponse } from '~/features/cs/api/csAPI';
import {
  fetchAdminCsRooms,
  fetchCsMessagesByCustomer,
  updateCsRoomStatus,
  assignAgentToRoom,
} from '~/features/cs/api/csAPI';
import { showErrorAlert } from '~/components/common/alert';

// Hook: 간단한 미디어 쿼리
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

// Styled Containers
const DesktopContainer = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr 300px;
  height: 100vh;
`;

const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MobileContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const EmptyMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
  font-size: 1.1rem;
`;

const BackButton = styled.button`
  padding: 8px 16px;
  background: transparent;
  border: none;
  font-size: 1rem;
  cursor: pointer;
`;

export default function AdminChatPage() {
  const loginUser = useLoginStore((s) => s.user)!;
  const [rooms, setRooms] = useState<CsRoomResponse[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [messages, setMessages] = useState<CsMessageResponse[]>([]);
  const [historyMap, setHistoryMap] = useState<Record<number, { date: string; content: string }[]>>(
    {},
  );
  const clientRef = useRef<Client>();
  const subRef = useRef<StompSubscription>();

  const isMobile = useMediaQuery('(max-width: 768px)');

  // STOMP 클라이언트
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-chat'),
      reconnectDelay: 5000,
      onConnect: () => console.log('STOMP connected'),
    });
    client.activate();
    clientRef.current = client;
    return () => client.deactivate();
  }, []);

  // 채팅방 목록
  useEffect(() => {
    fetchAdminCsRooms(0, 50)
      .then(async (p) => {
        const list = p.content;
        const withLast = await Promise.all(
          list.map(async (r) => {
            const msgs = await fetchCsMessagesByCustomer(r.customerId, undefined, 1);
            const last = msgs[0];
            return {
              ...r,
              lastMessage: last?.content ?? '아직 대화가 없어요',
              lastTime: last
                ? new Date(last.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '',
            };
          }),
        );
        setRooms(withLast);
      })
      .catch(console.error);
  }, []);

  // 중복 제거
  const list = useMemo(() => {
    const map = new Map<number, CsRoomResponse>();
    rooms.forEach((r) => {
      const prev = map.get(r.customerId);
      if (!prev || r.csRoomId > prev.csRoomId) map.set(r.customerId, r);
    });
    return Array.from(map.values());
  }, [rooms]);

  const selectedRoom =
    selectedCustomerId != null ? list.find((r) => r.customerId === selectedCustomerId) : null;

  // 방 선택
  const handleSelectRoom = async (customerId: number) => {
    const room = list.find((r) => r.customerId === customerId);
    if (!room) return;
    if (!room.agentId) {
      if (!window.confirm('상담사로 배정받으시겠습니까?')) return;
      try {
        await assignAgentToRoom(room.csRoomId, loginUser.userId);
        setRooms((rs) =>
          rs.map((r) =>
            r.csRoomId === room.csRoomId ? { ...r, agentId: loginUser.userId, status: 'OPEN' } : r,
          ),
        );
        clientRef.current?.publish({
          destination: '/app/chat.sendMessage',
          body: JSON.stringify({
            csRoomId: room.csRoomId,
            content: '상담사가 배정되었습니다.',
            system: true,
            agentName: loginUser.name,
            agentAvatarUrl: loginUser.profileImageUrl,
          }),
        });
      } catch {
        await showErrorAlert('상담사 배정 실패', '상담사 배정에 실패했습니다. 다시 시도해주세요.');
        return;
      }
    }
    setSelectedCustomerId(customerId);
  };

  // 메시지 & 구독 관리
  useEffect(() => {
    if (!selectedRoom) return;
    fetchCsMessagesByCustomer(selectedRoom.customerId).then((data) =>
      setMessages(
        data.map((m) => ({
          ...m,
          system: (m as any).system ?? m.content === '상담사가 배정되었습니다.',
        })),
      ),
    );
    subRef.current?.unsubscribe();
    const doSubscribe = () => {
      subRef.current = clientRef.current!.subscribe(
        `/topic/rooms/${selectedRoom.csRoomId}`,
        (msg: Message) => {
          const body = JSON.parse(msg.body) as CsMessageResponse & { system?: boolean };
          setMessages((prev) => [...prev, { ...body, system: body.system ?? false }]);
        },
      );
    };
    if (clientRef.current!.connected) doSubscribe();
    else {
      const prev = clientRef.current!.onConnect;
      clientRef.current!.onConnect = (frame) => {
        prev?.(frame);
        doSubscribe();
      };
    }
  }, [selectedRoom]);

  const handleSend = (text: string) => {
    if (!selectedRoom) return;
    clientRef.current?.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({ csRoomId: selectedRoom.csRoomId, content: text }),
    });
  };

  const handleStatusChange = (roomId: number, newStatus: string) => {
    setRooms((rs) => rs.map((r) => (r.csRoomId === roomId ? { ...r, status: newStatus } : r)));
  };

  const handleSaveHistory = (content: string) => {
    if (!selectedCustomerId) return;
    const entry = { date: new Date().toLocaleString(), content };
    setHistoryMap((h) => ({
      ...h,
      [selectedCustomerId]: [entry, ...(h[selectedCustomerId] || [])],
    }));
  };

  // 렌더링: 모바일 / 데스크탑 분기
  if (isMobile) {
    return (
      <MobileContainer>
        {!selectedRoom ? (
          <ChatRoomList
            rooms={list
              .filter((r) => r.status !== 'CLOSED')
              .map((r) => ({
                customerid: r.customerId,
                customername: r.customerName,
                lastMessage: r.lastMessage,
                lastTime: r.lastTime,
                csRoomId: r.csRoomId,
                status: r.status,
              }))}
            activeId={selectedCustomerId || -1}
            onSelect={handleSelectRoom}
          />
        ) : (
          <MobileContent>
            <ChatWindow
              roomId={selectedRoom.csRoomId}
              roomName={selectedRoom.customerName}
              myName={loginUser.name}
              userAvatar={loginUser.profileImageUrl}
              messages={messages.map((m) => ({
                sender: m.userId === loginUser.userId ? loginUser.name : selectedRoom.customerName,
                avatar:
                  m.userId === loginUser.userId
                    ? loginUser.profileImageUrl
                    : selectedRoom.customerAvatarUrl,
                text: m.content,
                date: new Date(m.createdAt),
                system: (m as any).system ?? false,
              }))}
              onSend={handleSend}
              disabled={selectedRoom.status === 'CLOSED'}
              onBack={() => setSelectedCustomerId(null)}
            />
            <ConsultationPanel
              csRoomId={selectedRoom.csRoomId}
              userName={selectedRoom.customerName}
              userAvatar={selectedRoom.customerAvatarUrl}
              status={selectedRoom.status}
              onStatusChange={handleStatusChange}
              onSave={handleSaveHistory}
              history={historyMap[selectedCustomerId!] || []}
            />
          </MobileContent>
        )}
      </MobileContainer>
    );
  }

  // Desktop View
  return (
    <DesktopContainer>
      <ChatRoomList
        rooms={list
          .filter((r) => r.status !== 'CLOSED')
          .map((r) => ({
            customerid: r.customerId,
            customername: r.customerName,
            lastMessage: r.lastMessage,
            lastTime: r.lastTime,
            csRoomId: r.csRoomId,
            status: r.status,
          }))}
        activeId={selectedCustomerId || -1}
        onSelect={handleSelectRoom}
      />

      {selectedRoom ? (
        <ChatWindow
          roomId={selectedRoom.csRoomId}
          roomName={selectedRoom.customerName}
          myName={loginUser.name}
          userAvatar={loginUser.profileImageUrl}
          messages={messages.map((m) => ({
            sender: m.userId === loginUser.userId ? loginUser.name : selectedRoom.customerName,
            avatar:
              m.userId === loginUser.userId
                ? loginUser.profileImageUrl
                : selectedRoom.customerAvatarUrl,
            text: m.content,
            date: new Date(m.createdAt),
            system: (m as any).system ?? false,
          }))}
          onSend={handleSend}
          disabled={selectedRoom.status === 'CLOSED'}
        />
      ) : (
        <EmptyMessage>왼쪽 채팅방을 선택해 상담을 시작해보세요!</EmptyMessage>
      )}

      {selectedRoom && (
        <ConsultationPanel
          csRoomId={selectedRoom.csRoomId}
          userName={selectedRoom.customerName}
          userAvatar={selectedRoom.customerAvatarUrl}
          status={selectedRoom.status}
          onStatusChange={handleStatusChange}
          onSave={handleSaveHistory}
          history={historyMap[selectedCustomerId!] || []}
        />
      )}
    </DesktopContainer>
  );
}
