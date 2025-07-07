import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import Pagination from '~/components/common/Pagination';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Sidebar = styled.div`
  padding: 16px;
  background: #f7faff;
  overflow-y: auto;
  flex: 1;
`;

const RoomCard = styled.div<{ active?: boolean }>`
  position: relative;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
  max-height: 100px;
  padding: 12px;
  cursor: pointer;
  transition:
    background-color 0.2s,
    border-color 0.2s;
  border: 1px solid transparent;
  display: flex;
  flex-direction: column;

  &:hover {
    background-color: #f0f8ff;
  }

  ${({ active }) =>
    active &&
    css`
      background-color: #e6f7ff;
      border-color: #91d5ff;
    `}
`;

const RoomName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RoomPreview = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RoomTime = styled.div`
  font-size: 0.75rem;
  color: #999;
  text-align: right;
`;

// 상태 배지 컴포넌트
const StatusBadge = styled.div<{ status: string }>`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  color: #fff;
  ${({ status }) => {
    switch (status) {
      case 'OPEN':
        return css`
          background-color: #52c41a;
        `;
      case 'WAITING':
        return css`
          background-color: #faad14;
        `;
      case 'CLOSED':
        return css`
          background-color: #f5222d;
        `;
      default:
        return css`
          background-color: #d9d9d9;
        `;
    }
  }}
`;

export interface ChatRoomListProps {
  rooms: {
    customerid: number;
    customername: string;
    lastMessage: string;
    lastTime: string;
    csRoomId: number;
    status: string; // 상태 필드 추가
  }[];
  activeId: number;
  onSelect: (id: number) => void;
  pageSize?: number;
}

/**
 * 페이지네이션이 적용된 채팅방 사이드바 리스트
 */
const ChatRoomList: React.FC<ChatRoomListProps> = ({
  rooms,
  activeId,
  onSelect,
  pageSize = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  // 1) customerid 기준으로 중복 제거 (가장 큰 csRoomId 선택)
  const dedupedRooms = React.useMemo(() => {
    const map = new Map<number, ChatRoomListProps['rooms'][0]>();
    rooms.forEach((room) => {
      const prev = map.get(room.customerid);
      if (!prev || room.csRoomId > prev.csRoomId) {
        map.set(room.customerid, room);
      }
    });
    return Array.from(map.values());
  }, [rooms]);

  // 2) 위에서 만든 dedupedRooms 로 페이징
  const totalPages = Math.ceil(dedupedRooms.length / pageSize);
  const pagedRooms = dedupedRooms.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  return (
    <Wrapper>
      <Sidebar>
        {pagedRooms.map((room) => (
          <RoomCard
            key={room.customerid}
            active={room.customerid === activeId}
            onClick={() => {
              console.log(`Room ${room.csRoomId} status: ${room.status}`);
              onSelect(room.customerid);
            }}
          >
            <StatusBadge status={room.status}>{room.status}</StatusBadge>
            <RoomName>{room.customername}</RoomName>
            <RoomPreview>{room.lastMessage}</RoomPreview>
            <RoomTime>{room.lastTime}</RoomTime>
          </RoomCard>
        ))}
      </Sidebar>
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </Wrapper>
  );
};

export default ChatRoomList;
