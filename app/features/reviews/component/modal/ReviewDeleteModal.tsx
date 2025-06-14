import React from 'react';
import { Modal } from '~/features/reviews/component/common/Modal';
import Button from '~/components/styled/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ReviewDeleteModal({ isOpen, onClose, onConfirm }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="리뷰를 삭제하시겠습니까?"
      actions={
        <>
          <Button onClick={onClose}>취소</Button>
          <Button onClick={onConfirm}>삭제하기</Button>
        </>
      }
    />
  );
}
