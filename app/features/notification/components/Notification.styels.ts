import styled, { css, keyframes } from 'styled-components';

export const shakeAnimation = keyframes`
  0% { transform: rotate(0); }
  20% { transform: rotate(-15deg); }
  40% { transform: rotate(15deg); }
  60% { transform: rotate(-10deg); }
  80% { transform: rotate(10deg); }
  100% { transform: rotate(0); }
`;

export const BellWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const BellIcon = styled.div<{ shake: boolean }>`
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #f0f0f0;
  }

  svg {
    color: #333;
    animation: ${(props) =>
      props.shake
        ? css`
            ${shakeAnimation} 0.5s ease-in-out
          `
        : 'none'};
  }
`;

export const RedDot = styled.div`
  position: absolute;
  top: 8px; /* 벨 아이콘 상단에 위치 */
  right: 8px; /* 벨 아이콘 우측에 위치 */
  width: 8px;
  height: 8px;
  background-color: #ff4d4f; /* 빨간색 */
  border-radius: 50%;
  border: 1.5px solid #fff; /* 흰색 테두리로 가독성 높임 */
`;

export const NotificationBox = styled.div`
  position: absolute;
  top: calc(100% + 10px); /* 벨 아이콘 아래로 10px 간격 */
  right: 0;
  width: 320px;
  max-height: 400px; /* 최대 높이 설정 */
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤 */
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 10px 0; /* 상하 패딩 추가 */
  display: flex;
  flex-direction: column;
`;

export const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  margin-bottom: 5px; /* 알림 항목과의 간격 */

  h4 {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
  }
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  &:hover {
    background-color: #ffe8e6; /* 연한 빨간색 */
    color: #ff4d4f; /* 진한 빨간색 */
  }

  svg {
    vertical-align: middle;
  }
`;


export const NotificationItem = styled.div<{ isRead?: boolean }>`
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  background-color: ${props => props.isRead ? '#f8f8f8' : '#ffffff'}; /* 읽음 여부에 따라 배경색 변경 */
  transition: background-color 0.2s ease-in-out;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${props => props.isRead ? '#f0f0f0' : '#f5f5f5'};
  }
`;

export const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Title = styled.h5`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
`;

export const Content = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #555;
  line-height: 1.4;
`;

export const DateTime = styled.span`
  font-size: 0.75rem;
  color: #999;
  align-self: flex-end; /* 시간을 오른쪽 정렬 */
  margin-top: 5px; /* 내용과의 간격 */
`;
