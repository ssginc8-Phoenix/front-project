// src/features/patient/components/PasswordModal.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ReusableModal from './ReusableModal';

interface PasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const Input = styled.input`
  width: 100%;
  font-size: 1.05rem;
  padding: 13px;
  border: 1.5px solid #e3e3e3;
  border-radius: 6px;
  margin-bottom: 26px;
  &:focus {
    border-color: #326ee8;
  }
`;

const ConfirmButton = styled.button`
  padding: 10px 36px;
  border-radius: 22px;
  background: #ffd6d6;
  color: #ff4646;
  font-weight: 600;
  border: none;
  font-size: 1.08rem;
  box-shadow: 0 2px 12px rgba(255, 70, 70, 0.07);
  cursor: pointer;
  margin: 0 auto;
  display: block;
  &:hover {
    background: #ffb9b9;
  }
`;

const ErrorText = styled.div`
  color: #e94a4a;
  margin-bottom: 16px;
`;

export const PasswordModal: React.FC<PasswordModalProps> = ({ open, onClose, onSuccess }) => {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    // TODO: 나중에 API 요청으로 교체
    if (pw === '1234') {
      setError('');
      onSuccess();
      setPw('');
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  };

  useEffect(() => {
    if (!open) setPw('');
  }, [open]);

  if (!open) return null;

  return (
    <ReusableModal open={open} onClose={onClose} title="비밀번호 확인">
      <Input
        type="password"
        value={pw}
        placeholder="비밀번호"
        onChange={(e) => setPw(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleConfirm();
        }}
        autoFocus
      />
      {error && <ErrorText>{error}</ErrorText>}
      <ConfirmButton onClick={handleConfirm}>확인</ConfirmButton>
    </ReusableModal>
  );
};
