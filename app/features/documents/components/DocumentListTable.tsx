import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import type { DocumentResponseDTO } from '~/features/documents/types/insurance';

import { getMyHospital } from '~/features/hospitals/api/hospitalAPI';
import { useAdminDocumentList, useApprove, useAttachFile } from '../hooks/useDocumentRequests';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  data: DocumentResponseDTO[];
  onAttach: (id: number, file: File) => void;
  onApprove: (id: number, approved: boolean, reason?: string) => void;
}

// --- Styled Components ---
const Container = styled.div`
  width: 100%;
  overflow-x: auto;
`;
const TabBar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;
const Tab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ active }) => (active ? '#fff' : '#34495e')};
  background: ${({ active }) => (active ? '#2980b9' : 'transparent')};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${({ active }) => (active ? '#1c5983' : '#ecf0f1')};
  }
`;
const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 12px;
`;
const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-size: 0.95rem;
  color: #34495e;
`;
const Tr = styled.tr`
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border-radius: 0.75rem;
`;
const Td = styled.td`
  padding: 12px 16px;
  font-size: 0.95rem;
  color: #2c3e50;
  vertical-align: middle;
  &:first-child {
    border-top-left-radius: 0.75rem;
    border-bottom-left-radius: 0.75rem;
  }
  &:last-child {
    border-top-right-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
  }
`;
const FileInput = styled.input`
  font-size: 0.9rem;
`;
const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 8px 14px;
  margin-right: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  color: #fff;
  background-color: ${({ variant }) => (variant === 'danger' ? '#c0392b' : '#2980b9')};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;
  &:hover {
    background-color: ${({ variant }) => (variant === 'danger' ? '#992d22' : '#1c5983')};
  }
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;
const ActionContainer = styled.div`
  display: flex;
  align-items: center;
`;
// ----------------------------

const DocumentListTable: React.FC<Props> = ({ data, onAttach, onApprove }) => {
  const [selectedFiles, setSelectedFiles] = useState<Record<number, File>>({});
  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'rejected' | 'requested'>(
    'requested',
  );
  const [hospitalId, setHospitalId] = useState<number | null>(null);
  const attachMutation = useAttachFile();
  const approveMutation = useApprove();
  const qc = useQueryClient();
  useEffect(() => {
    (async () => {
      const res = await getMyHospital(); // 현재 관리자 병원 조회
      setHospitalId(res.hospitalId);
    })();
  }, []);

  const { data: docs = [] } = useAdminDocumentList(hospitalId ?? undefined);

  const statusLabelMap: Record<string, string> = {
    REQUESTED: '요청됨',
    APPROVED: '승인됨',
    REJECTED: '반려됨',
  };
  // sort by documentId
  const sorted = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return [...data].sort((a, b) => a.documentId - b.documentId);
  }, [data]);

  // filter by tab
  const filtered = useMemo(() => {
    if (activeTab === 'all') return sorted;
    if (activeTab === 'approved') return sorted.filter((d) => d.status === 'APPROVED');
    if (activeTab === 'rejected') return sorted.filter((d) => d.status === 'REJECTED');
    // requested
    return sorted.filter((d) => d.status === 'REQUESTED');
  }, [sorted, activeTab]);

  const handleFileChange = (id: number, file: File) => {
    setSelectedFiles((prev) => ({ ...prev, [id]: file }));
  };
  const handleApprove = (id: number, approved: boolean, reason?: string) => {
    approveMutation.mutate(
      { id, dto: { approved, reason } },
      {
        onSuccess: (data) => {
          alert(approved ? '문서가 승인되었습니다.' : '문서가 반려되었습니다.');
        },
        onError: (err: Error) => {
          alert(`처리에 실패했습니다: ${err.message}`);
        },
      },
    );
  };
  const handleUploadClick = (id: number) => {
    const file = selectedFiles[id];
    if (!file) {
      alert('먼저 파일을 선택해주세요.');
      return;
    }
    attachMutation.mutate(
      { id, file },
      {
        onSuccess: () => {
          alert('파일이 업로드되었습니다.');
          qc.invalidateQueries(['adminDocs', hospitalId]);
          setSelectedFiles((prev) => {
            const p = { ...prev };
            delete p[id];
            return p;
          });
        },
        onError: (err: Error) => {
          alert(`업로드에 실패했습니다: ${err.message}`);
        },
      },
    );
  };

  return (
    <Container>
      <TabBar>
        <Tab active={activeTab === 'requested'} onClick={() => setActiveTab('requested')}>
          {' '}
          요청{' '}
        </Tab>
        <Tab active={activeTab === 'approved'} onClick={() => setActiveTab('approved')}>
          {' '}
          승인{' '}
        </Tab>
        <Tab active={activeTab === 'rejected'} onClick={() => setActiveTab('rejected')}>
          {' '}
          반려{' '}
        </Tab>
        <Tab active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
          {' '}
          전체{' '}
        </Tab>
      </TabBar>
      <Table>
        <thead>
          <Tr>
            <Th>ID</Th>
            <Th>상태</Th>
            <Th>사유</Th>
            <Th>첨부</Th>
            <Th>업로드</Th>
            <Th>액션</Th>
          </Tr>
        </thead>
        <tbody>
          {filtered.map((doc) => (
            <Tr key={doc.documentId}>
              <Td>{doc.documentId}</Td>
              <Td>{statusLabelMap[doc.status] || doc.status}</Td>
              <Td>{doc.rejectionReason || '-'}</Td>
              <Td>
                <FileInput
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileChange(doc.documentId, file);
                  }}
                  disabled={doc.status !== 'REQUESTED'}
                />
              </Td>
              <Td>
                <Button
                  variant="primary"
                  onClick={() => handleUploadClick(doc.documentId)}
                  disabled={!selectedFiles[doc.documentId] || doc.status !== 'REQUESTED'}
                >
                  {' '}
                  업로드{' '}
                </Button>
              </Td>
              <Td>
                <ActionContainer>
                  <Button
                    variant="primary"
                    disabled={doc.status !== 'REQUESTED'}
                    onClick={() => handleApprove(doc.documentId, true)}
                  >
                    승인
                  </Button>
                  <Button
                    variant="danger"
                    disabled={doc.status !== 'REQUESTED'}
                    onClick={() => {
                      const reason = window.prompt('반려 사유를 입력하세요:');
                      if (reason) handleApprove(doc.documentId, false, reason.trim());
                    }}
                  >
                    반려
                  </Button>
                </ActionContainer>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default DocumentListTable;
