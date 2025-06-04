import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const Btn = styled.button<{ disabled?: boolean }>`
  padding: 0.5rem 1rem;
  background: #e0e0e0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const Info = styled.span`
  align-self: center;
`;

interface Props {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export function Pagination({ page, totalPages, onPrev, onNext }: Props) {
  return (
    <Container>
      <Btn disabled={page <= 0} onClick={onPrev}>
        이전
      </Btn>
      <Info>
        {page + 1} / {totalPages}
      </Info>
      <Btn disabled={page + 1 >= totalPages} onClick={onNext}>
        다음
      </Btn>
    </Container>
  );
}
