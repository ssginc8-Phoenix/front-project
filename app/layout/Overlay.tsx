import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2000; /* 캘린더(보통 1xxx)보다 크게 */
  display: flex;
  align-items: center;
  justify-content: center;
`;
