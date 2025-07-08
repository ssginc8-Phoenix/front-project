// src/features/cs/page/AdminChatPage.tsx

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Client, type Message, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import styled from 'styled-components';

import ChatRoomList from '~/features/cs/components/admin/ChatRoomList';
import ChatWindow from '~/features/cs/components/admin/ChatWindow';
import ConsultationPanel from '~/features/cs/components/admin/ConsultationPanel';
import useLoginStore from '~/features/user/stores/LoginStore';

import type { CsMessageResponse, CsRoomResponse } from '~/features/cs/api/csAPI';
import {
  fetchAdminCsRooms,
  fetchCsMessagesByCustomer,
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
const ContentWrapper = styled.div`
  position: relative;
  grid-column: 2 / span 2; /* 2번 칼럼(채팅)부터 2칸(span 2) */
  display: grid;
  grid-template-columns: 1fr 300px; /* 채팅창 1fr, 패널 300px */
  height: 100%;
`;
const OverlayBox = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 75vw;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #666;
  z-index: 10;
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

export default function AdminChatPage() {
  const loginUser = useLoginStore((s) => s.user)!;
  const [rooms, setRooms] = useState<CsRoomResponse[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [messages, setMessages] = useState<CsMessageResponse[]>([]);
  const [historyMap, setHistoryMap] = useState<Record<number, { date: string; content: string }[]>>(
    {},
  );
  const clientRef = useRef<Client | null>(null);
  const subRef = useRef<StompSubscription | null>(null);

  const isMobile = useMediaQuery('(max-width: 768px)');

  // STOMP 클라이언트 설정
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('https://beanstalk.docto.click/ws-chat'),
      reconnectDelay: 5000,
      onConnect: () => console.log('STOMP connected'),
    });
    client.activate();
    clientRef.current = client;
    return () => {
      client.deactivate();
    };
  }, []);

  // 채팅방 목록 로드
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

  // 중복 제거 (customerId 기준)
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

  // 방 선택 시 처리
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

    // REST로 기존 메시지 불러오기
    fetchCsMessagesByCustomer(selectedRoom.customerId).then((data) =>
      setMessages(
        data.map((m) => ({
          ...m,
          system: (m as any).system ?? m.content === '상담사가 배정되었습니다.',
        })),
      ),
    );

    // STOMP 구독 재설정
    subRef.current?.unsubscribe();
    const subscribeFn = () => {
      subRef.current = clientRef.current!.subscribe(
        `/topic/rooms/${selectedRoom.csRoomId}`,
        (msg: Message) => {
          const body = JSON.parse(msg.body) as CsMessageResponse & { system?: boolean };
          setMessages((prev) => [...prev, { ...body, system: body.system ?? false }]);
        },
      );
    };
    if (clientRef.current!.connected) subscribeFn();
    else {
      const prev = clientRef.current!.onConnect;
      clientRef.current!.onConnect = (frame) => {
        prev?.(frame);
        subscribeFn();
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
    if (selectedCustomerId == null) return;
    const entry = { date: new Date().toLocaleString(), content };
    setHistoryMap((h) => ({
      ...h,
      [selectedCustomerId]: [entry, ...(h[selectedCustomerId] || [])],
    }));
  };

  // **공통 렌더링**: 모바일/데스크탑 분기
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
            activeId={selectedCustomerId ?? -1}
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
              onStatusChange={(newStatus: string) =>
                handleStatusChange(selectedRoom.csRoomId, newStatus)
              }
              onSave={handleSaveHistory}
              history={historyMap[selectedCustomerId!] ?? []}
            />
          </MobileContent>
        )}
      </MobileContainer>
    );
  }

  // **데스크탑 뷰**: 항상 채팅창 + 패널 보여주되, 빈 상태 처리
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
        activeId={selectedCustomerId ?? -1}
        onSelect={handleSelectRoom}
      />

      <ContentWrapper>
        {/* ChatWindow */}
        <ChatWindow
          roomId={selectedRoom?.csRoomId ?? -1}
          roomName={selectedRoom?.customerName ?? ''}
          myName={loginUser.name}
          userAvatar={loginUser.profileImageUrl}
          messages={
            selectedRoom
              ? messages.map((m) => ({
                  sender:
                    m.userId === loginUser.userId ? loginUser.name : selectedRoom.customerName,
                  avatar:
                    m.userId === loginUser.userId
                      ? loginUser.profileImageUrl
                      : selectedRoom.customerAvatarUrl,
                  text: m.content,
                  date: new Date(m.createdAt),
                  system: (m as any).system ?? false,
                }))
              : []
          }
          onSend={handleSend}
          disabled={!selectedRoom || selectedRoom.status !== 'OPEN'}
        />

        {/* ConsultationPanel */}
        <ConsultationPanel
          csRoomId={selectedRoom?.csRoomId ?? -1}
          userName={selectedRoom?.customerName ?? ''}
          userAvatar={selectedRoom?.customerAvatarUrl ?? '/default-avatar.png'}
          status={selectedRoom?.status ?? 'CLOSED'}
          onStatusChange={(newStatus: string) =>
            handleStatusChange(selectedRoom!.csRoomId, newStatus)
          }
          onSave={handleSaveHistory}
          history={selectedCustomerId != null ? (historyMap[selectedCustomerId] ?? []) : []}
          disabled={!selectedRoom || selectedRoom.status !== 'OPEN'}
        />

        {/* 선택된 방이 없을 때만 보이는 오버레이 */}
        {!selectedRoom && <OverlayBox>왼쪽 채팅방을 선택하여 상담을 시작해보세요!</OverlayBox>}
      </ContentWrapper>
    </DesktopContainer>
  );
}
