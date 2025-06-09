import React from 'react';
import { Modal } from '~/features/reviews/component/common/Modal';
import { Button } from '~/features/reviews/component/common/Button';

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
          <Button variant="destructive" onClick={onConfirm}>
            삭제하기
          </Button>
        </>
      }
    />
  );
}
