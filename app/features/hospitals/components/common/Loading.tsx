// components/common/LoadingOverlay.tsx
import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const Text = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: #00499e;
`;

const Loading = () => {
  return (
    <Overlay>
      <Text>로딩 중...</Text>
    </Overlay>
  );
};

export default Loading;
