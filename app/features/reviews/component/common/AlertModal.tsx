import React from 'react';
import Button from '~/components/styled/Button';
import { Modal } from '~/features/reviews/component/common/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export function AlertModal({ isOpen, onClose, message }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={message}
      actions={<Button onClick={onClose}>확인</Button>}
    />
  );
}
