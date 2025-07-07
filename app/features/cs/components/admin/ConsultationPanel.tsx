import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { updateCsRoomStatus } from '~/features/cs/api/csAPI';
import { useCsNotes, useSaveCsNote } from '~/features/cs/hooks/useCsNotes';
import useLoginStore from '~/features/user/stores/LoginStore';

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  width: 320px;
  overflow: hidden;

  background: #fff;
`;

/* 상단 프로필 + 상태 + 새 메모 */
const Top = styled.div`
  padding: 24px 16px;
  background: #f7faff;
  border-bottom: 1px solid #e6e6e6;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const ProfileAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
`;

const ProfileName = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  label {
    font-size: 0.9rem;
    color: #555;
    margin-right: 8px;
  }
`;

const Select = styled.select`
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s;
  &:hover,
  &:focus {
    border-color: #1890ff;
    outline: none;
  }
`;

const SectionTitle = styled.h4`
  margin: 16px 0 8px;
  font-size: 1rem;
  color: #444;
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  resize: none;
  margin-bottom: 12px;
  transition: border-color 0.2s;
  &:focus {
    border-color: #1890ff;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #1890ff;
  color: #fff;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition:
    background-color 0.2s,
    transform 0.1s;
  &:hover:not(:disabled) {
    background-color: #40a9ff;
  }
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  &:disabled {
    background-color: #a0d2ff;
    cursor: not-allowed;
  }
`;

/* 하단 메모 리스트 */
const Bottom = styled.div`
  flex: 1;
  padding: 16px;
  background: #f7faff;
  overflow-y: auto;
`;

const NotesContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NoteItem = styled.li`
  background: #fff;
  padding: 12px 14px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const NoteTime = styled.div`
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 6px;
`;

const NoteContent = styled.div`
  font-size: 0.95rem;
  color: #333;
  line-height: 1.4;
`;

interface ConsultationPanelProps {
  csRoomId: number;
  userName: string;
  userAvatar: string;
  status: string;
  onStatusChange: (status: string) => void;
}

const ConsultationPanel: React.FC<ConsultationPanelProps> = ({
  csRoomId,
  userName,
  userAvatar,
  status,
  onStatusChange,
}) => {
  const [text, setText] = useState('');
  const [newStatus, setNewStatus] = useState(status);
  const [saving, setSaving] = useState(false);
  const agentId = useLoginStore((state) => state.user.userId);

  const { data: notesData, isLoading: loadingNotes, error: notesError } = useCsNotes(csRoomId);
  const { mutate: saveNote, isLoading: savingNote } = useSaveCsNote(csRoomId);

  useEffect(() => {
    setNewStatus(status);
  }, [status]);

  const handleSaveAll = useCallback(async () => {
    setSaving(true);
    if (newStatus !== status) {
      try {
        await updateCsRoomStatus(csRoomId, newStatus);
        onStatusChange(newStatus);
      } catch {
        alert('상태 저장에 실패했습니다.');
        setSaving(false);
        return;
      }
    }
    if (text.trim()) {
      saveNote(
        { agentId, content: text.trim() },
        {
          onSuccess() {
            setText('');
          },
          onError() {
            alert('메모 저장에 실패했습니다.');
          },
        },
      );
    }
    setSaving(false);
  }, [csRoomId, newStatus, status, text, agentId, onStatusChange, saveNote]);

  return (
    <Panel>
      <Top>
        <ProfileHeader>
          <ProfileAvatar src={userAvatar} alt={userName} />
          <ProfileName>{userName}</ProfileName>
        </ProfileHeader>

        <StatusWrapper>
          <label htmlFor="cs-status">상담 상태</label>
          <Select id="cs-status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option value="OPEN">열림</option>
            <option value="WAITING">대기</option>
            <option value="CLOSED">완료</option>
          </Select>
        </StatusWrapper>

        <SectionTitle>새 상담 메모</SectionTitle>
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="상담 요약 또는 메모를 입력하세요."
        />
        <Button onClick={handleSaveAll} disabled={saving || savingNote || agentId === undefined}>
          {saving || savingNote ? '저장중…' : '저장하기'}
        </Button>
      </Top>

      <Bottom>
        <SectionTitle>상담 내역</SectionTitle>
        {loadingNotes ? (
          <p>로딩 중…</p>
        ) : notesError ? (
          <p>메모를 불러오는 중 오류가 발생했습니다.</p>
        ) : (
          <NotesContainer>
            {notesData?.content.map((note) => (
              <NoteItem key={note.csNoteId}>
                <NoteTime>{new Date(note.createdAt).toLocaleString()}</NoteTime>
                <NoteContent>{note.content}</NoteContent>
              </NoteItem>
            ))}
          </NotesContainer>
        )}
      </Bottom>
    </Panel>
  );
};

export default ConsultationPanel;
