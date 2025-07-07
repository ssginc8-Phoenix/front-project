import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useQnAchat } from '~/features/qna/hooks/useQnAchat';

interface Props {
  qnaId: number;
  onClose: () => void;
  onChange?: () => void;
  showInput?: boolean;
  isDoctor?: boolean;
}

export default function QaChatModal({
  qnaId,
  onClose,
  onChange,
  showInput = false,
  isDoctor = false,
}: Props) {
  const {
    detail,
    comments,
    draft,
    setDraft,
    submit,
    update,
    remove,
    refetchComments,
    isDetailLoading,
    isCommentsLoading,
    isDetailError,
    isCommentsError,
    isSubmitting,
  } = useQnAchat(qnaId, onClose);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (editingCommentId !== null) {
      const target = comments?.find((c) => c.commentId === editingCommentId);
      setEditValue(target?.content ?? '');
    }
  }, [editingCommentId]);

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Close onClick={onClose}>×</Close>
        <Header>💬 Q&A</Header>
        <Body>
          {isDetailLoading || isCommentsLoading ? <p>로딩 중…</p> : null}
          {isDetailError && <p>질문을 불러오지 못했습니다.</p>}
          {isCommentsError && <p>답변을 불러오지 못했습니다.</p>}

          {detail && (
            <>
              <InfoBox>
                <InfoRow>
                  <strong>보호자</strong>: {detail.guardianName} 님
                </InfoRow>
                <InfoRow>
                  <strong>환자</strong>: {detail.patientName} 님
                </InfoRow>
                <InfoRow>
                  <strong>증상</strong>: {detail.symptom}
                </InfoRow>
                <InfoRow>
                  <strong>예약일</strong>: {detail.appointmentTime}
                </InfoRow>
              </InfoBox>

              <MessageRow isDoctor={false}>
                <Bubble isDoctor={false}>{detail.content}</Bubble>
              </MessageRow>
            </>
          )}

          {comments?.map((c) => (
            <MessageRow key={c.commentId} isDoctor>
              <Bubble isDoctor>
                {editingCommentId === c.commentId ? (
                  <>
                    <EditTextarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                    <EditButtonRow>
                      <EditButton
                        onClick={async () => {
                          await update(c.commentId, editValue);
                          setEditingCommentId(null);
                          await refetchComments();
                        }}
                      >
                        저장
                      </EditButton>
                      <EditButton onClick={() => setEditingCommentId(null)}>취소</EditButton>
                    </EditButtonRow>
                  </>
                ) : (
                  <>
                    <span>{c.content}</span>
                    {isDoctor && !showInput && (
                      <EditButtonRow>
                        <EditButton onClick={() => setEditingCommentId(c.commentId)}>
                          수정
                        </EditButton>
                        <EditButton
                          onClick={() =>
                            remove(c.commentId).then(() => {
                              onClose();
                            })
                          }
                        >
                          삭제
                        </EditButton>
                      </EditButtonRow>
                    )}
                  </>
                )}
              </Bubble>
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
                disabled={isSubmitting}
              />
              <SendButton type="submit" disabled={isSubmitting || !draft.trim()}>
                {isSubmitting ? '등록 중…' : '전송'}
              </SendButton>
            </Form>
          )}
        </Body>
      </Modal>
    </Overlay>
  );
}

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
  justify-content: ${(p) => (p.isDoctor ? 'flex-end' : 'flex-start')};
`;

const Bubble = styled.div<{ isDoctor?: boolean }>`
  max-width: 70%;
  padding: 0.75rem 1rem;
  background: ${(p) => (p.isDoctor ? '#daf1ff' : '#f0f0f0')};
  border-radius: 12px;
  position: relative;
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

const EditTextarea = styled.textarea`
  width: 100%;
  resize: vertical;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
`;

const EditButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const EditButton = styled.button`
  font-size: 0.75rem;
  background: #e0eaff;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
`;

// 예약 상세 정보 박스
const InfoBox = styled.div`
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #333;
`;

const InfoRow = styled.div`
  margin-bottom: 0.4rem;
`;
