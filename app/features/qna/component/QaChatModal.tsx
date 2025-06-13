import React from 'react';
import styled from 'styled-components';
import { useQnAchat } from '~/features/qna/hooks/useQnAchat';

interface Props {
  qnaId: number;
  onClose: () => void;
  showInput?: boolean;
}

export default function QaChatModal({ qnaId, onClose, showInput = false }: Props) {
  const {
    detail,
    isDetailLoading,
    isDetailError,
    comments,
    isCommentsLoading,
    isCommentsError,
    draft,
    setDraft,
    submit,
    isSubmitting,
  } = useQnAchat(qnaId);

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Close onClick={onClose}>×</Close>
        <Header>💬 Q&A</Header>

        <Body>
          {(isDetailLoading || isCommentsLoading) && <p>로딩 중…</p>}
          {isDetailError && <p></p>}
          {isCommentsError && <p></p>}

          {detail && (
            <MessageRow isDoctor={false}>
              <Bubble isDoctor={false}>{detail.content}</Bubble>
            </MessageRow>
          )}

          {comments?.map((c) => (
            <MessageRow key={c.commentId} isDoctor>
              <Bubble isDoctor>{c.content}</Bubble>
            </MessageRow>
          ))}

          {showInput && (
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <TextArea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="여기에 답변을 작성하세요…"
                disabled={Boolean(isSubmitting)}
              />
              <SendButton
                type="submit"
                disabled={Boolean(isSubmitting) || draft.trim().length === 0}
              >
                {isSubmitting ? '등록 중…' : '전송'}
              </SendButton>
            </Form>
          )}
        </Body>
      </Modal>
    </Overlay>
  );
}

// --- styled-components ---
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Modal = styled.div`
  position: relative;
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 480px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const Close = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  color: #999;
  transition: color 0.2s;
  &:hover {
    color: #333;
  }
`;
const Header = styled.h3`
  text-align: center;
  margin: 1rem 0 0.5rem;
  font-size: 1.25rem;
  color: #00499e;
`;
const Body = styled.div`
  flex: 1;
  padding: 0 1rem 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;
const MessageRow = styled.div<{ isDoctor: boolean }>`
  display: flex;
  justify-content: ${({ isDoctor }) => (isDoctor ? 'flex-end' : 'flex-start')};
`;
const Bubble = styled.div<{ isDoctor?: boolean }>`
  max-width: 70%;
  padding: 0.75rem 1rem;
  background: ${({ isDoctor }) => (isDoctor ? '#daf1ff' : '#f0f0f0')};
  border-radius: 12px;
`;
const Form = styled.form`
  display: flex;
  padding: 0.75rem;
  border-top: 1px solid #e5e5e5;
`;
const TextArea = styled.textarea`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  height: 60px;
`;
const SendButton = styled.button`
  margin-left: 0.5rem;
  padding: 0 0.75rem;
  background: #00499e;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;
