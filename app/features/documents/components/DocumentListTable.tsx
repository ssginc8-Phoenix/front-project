import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import type { DocumentResponseDTO } from '~/features/documents/types/insurance';
import { getMyHospital } from '~/features/hospitals/api/hospitalAPI';
import { useApprove, useAttachFile } from '../hooks/useDocumentRequests';
import { useQueryClient } from '@tanstack/react-query';
import { showErrorAlert, showInfoAlert, showSuccessAlert } from '~/components/common/alert';

interface Props {
  data: DocumentResponseDTO[];
  onAttach: (id: number, file: File) => void;
  onApprove: (id: number, approved: boolean, reason?: string) => void;
}

// ─── 데스크탑 전용 스타일 ─────────────────────────────────────────────────
const Container = styled.div`
  width: 100%;
  overflow-x: auto;
`;
const TabBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-bottom: 30px;
`;
const Tab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ active }) => (active ? '#fff' : '#34495e')};
  background: ${({ active }) => (active ? '#007bff' : 'transparent')};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${({ active }) => (active ? '#007bff' : '#ecf0f1')};
  }
`;
const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 12px;
`;
const Th = styled.th`
  text-align: center;
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
  text-align: center;
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
  display: none;
`;
const FileLabel = styled.label`
  display: inline-block;
  padding: 6px 12px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
  background-color: #7f8c8d;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #616a6b;
  }
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
const FileName = styled.span`
  margin-left: 8px;
  font-size: 0.9rem;
  color: #2c3e50;
`;
const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 0.5rem;
`;

// ─── 모바일 전용 스타일 ─────────────────────────────────────────────────
const ResponsiveTable = styled(Table)`
  @media (max-width: 768px) {
    display: none;
  }
`;
const CardList = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;
const Card = styled.div`
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border-radius: 0.75rem;
  padding: 1rem;
  display: grid;
  grid-template-columns: auto 1fr;
  row-gap: 0.75rem;
  column-gap: 1rem;
`;
const CardAction = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
`;
const Label = styled.span`
  font-size: 0.85rem;
  color: #7f8c8d;
  align-self: center;
`;
const Value = styled.div`
  font-size: 0.95rem;
  color: #2c3e50;
`;
const FileInputMobile = styled(FileInput)`
  display: none;
`;
const ButtonMobile = styled(Button)`
  width: 100%;
  margin: 0;
`;
const FileNameMobile = styled(FileName)`
  display: block;
  word-break: break-all;
  margin-top: 4px;
`;

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────
const DocumentListTable: React.FC<Props> = ({ data }) => {
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
      const res = await getMyHospital();
      setHospitalId(res.hospitalId);
    })();
  }, []);

  const statusLabelMap: Record<string, string> = {
    REQUESTED: '요청',
    APPROVED: '승인',
    REJECTED: '반려',
  };
  const typeLabelMap: Record<string, string> = {
    MEDICAL_REPORT: '진료기록지',
    LAB_RESULT: '검사 결과지',
    PRESCRIPTION: '처방전',
    CLAIM_FORM: '보험 청구서',
    OTHER: '기타',
  };

  const sorted = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return [...data].sort((a, b) => a.documentId - b.documentId);
  }, [data]);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return sorted;
    if (activeTab === 'approved') return sorted.filter((d) => d.status === 'APPROVED');
    if (activeTab === 'rejected') return sorted.filter((d) => d.status === 'REJECTED');
    return sorted.filter((d) => d.status === 'REQUESTED');
  }, [sorted, activeTab]);

  const handleFileChange = (id: number, file: File) => {
    setSelectedFiles((prev) => ({ ...prev, [id]: file }));
  };

  const handleApprove = (id: number, approved: boolean, reason?: string) => {
    approveMutation.mutate(
      { id, dto: { approved, reason } },
      {
        onSuccess: async () => {
          if (approved) {
            await showSuccessAlert('처리 완료', '문서가 승인되었습니다.');
          } else {
            await showInfoAlert('처리 완료', '문서가 반려되었습니다.');
          }
        },
        onError: async (err: Error) => {
          await showErrorAlert('처리 실패', `문서 처리 중 오류가 발생했습니다: ${err.message}`);
        },
      },
    );
  };

  const handleUploadClick = (id: number) => {
    const file = selectedFiles[id];
    if (!file) {
      showErrorAlert('파일 선택 필요', '먼저 업로드할 파일을 선택해주세요.');
      return;
    }
    attachMutation.mutate(
      { id, file },
      {
        onSuccess: async () => {
          await showSuccessAlert('업로드 완료', '파일이 성공적으로 업로드되었습니다.');
          qc.invalidateQueries({ queryKey: ['adminDocs', hospitalId] });
          setSelectedFiles((prev) => {
            const p = { ...prev };
            delete p[id];
            return p;
          });
        },
        onError: async (err: Error) => {
          await showErrorAlert('업로드 실패', `파일 업로드 중 오류가 발생했습니다: ${err.message}`);
        },
      },
    );
  };

  return (
    <Container>
      <TabBar>
        <Tab active={activeTab === 'requested'} onClick={() => setActiveTab('requested')}>
          요청
        </Tab>
        <Tab active={activeTab === 'approved'} onClick={() => setActiveTab('approved')}>
          승인
        </Tab>
        <Tab active={activeTab === 'rejected'} onClick={() => setActiveTab('rejected')}>
          반려
        </Tab>
        <Tab active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
          전체
        </Tab>
      </TabBar>

      <ResponsiveTable>
        <thead>
          <Tr>
            <Th>ID</Th>
            <Th>문서 종류</Th>
            <Th>상태</Th>
            <Th>사유</Th>
            <Th>첨부</Th>
            <Th>파일명</Th>
            <Th>업로드</Th>
            <Th>액션</Th>
          </Tr>
        </thead>
        <tbody>
          {filtered.map((doc) => (
            <Tr key={doc.documentId}>
              <Td>{doc.documentId}</Td>
              <Td>{typeLabelMap[doc.type] || '-'}</Td>
              <Td>{statusLabelMap[doc.status] || doc.status}</Td>
              <Td style={{ textAlign: doc.rejectionReason ? 'left' : 'center' }}>
                {doc.rejectionReason || '-'}
              </Td>
              <Td>
                <FileLabel htmlFor={`file-${doc.documentId}`}>파일 선택</FileLabel>
                <FileInput
                  id={`file-${doc.documentId}`}
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && handleFileChange(doc.documentId, e.target.files[0])
                  }
                  disabled={doc.status !== 'REQUESTED'}
                />
              </Td>
              <Td>
                {selectedFiles[doc.documentId] && (
                  <FileName>{selectedFiles[doc.documentId]!.name}</FileName>
                )}
              </Td>
              <Td>
                <Button
                  variant="primary"
                  onClick={() => handleUploadClick(doc.documentId)}
                  disabled={!selectedFiles[doc.documentId] || doc.status !== 'REQUESTED'}
                >
                  업로드
                </Button>
              </Td>
              <Td>
                <ActionContainer>
                  {doc.status === 'REQUESTED' && (
                    <>
                      <Button variant="primary" onClick={() => handleApprove(doc.documentId, true)}>
                        승인
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          const reason = window.prompt('반려 사유를 입력하세요:');
                          if (reason) handleApprove(doc.documentId, false, reason.trim());
                        }}
                      >
                        반려
                      </Button>
                    </>
                  )}
                </ActionContainer>
              </Td>
            </Tr>
          ))}
        </tbody>
      </ResponsiveTable>

      <CardList>
        {filtered.map((doc) => (
          <Card key={doc.documentId}>
            <Label>ID</Label>
            <Value>{doc.documentId}</Value>
            <Label>문서 종류</Label>
            <Value>{typeLabelMap[doc.type] || '-'}</Value>
            <Label>상태</Label>
            <Value>{statusLabelMap[doc.status] || doc.status}</Value>
            <Label>사유</Label>
            <Value style={{ textAlign: doc.rejectionReason ? 'left' : 'center' }}>
              {doc.rejectionReason || '-'}
            </Value>
            <Label>첨부</Label>
            <Value>
              <FileLabel htmlFor={`file-mobile-${doc.documentId}`}>파일 선택</FileLabel>
              <FileInputMobile
                as="input"
                id={`file-mobile-${doc.documentId}`}
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) =>
                  e.target.files?.[0] && handleFileChange(doc.documentId, e.target.files[0])
                }
                disabled={doc.status !== 'REQUESTED'}
              />
            </Value>
            {selectedFiles[doc.documentId] && (
              <>
                <Label>파일명</Label>
                <Value>
                  <FileNameMobile>{selectedFiles[doc.documentId]!.name}</FileNameMobile>
                </Value>
              </>
            )}
            <Label>업로드</Label>
            <Value>
              <ButtonMobile
                variant="primary"
                onClick={() => handleUploadClick(doc.documentId)}
                disabled={!selectedFiles[doc.documentId] || doc.status !== 'REQUESTED'}
              >
                업로드
              </ButtonMobile>
            </Value>
            <Label>액션</Label>
            <Value>
              {doc.status === 'REQUESTED' && (
                <CardAction>
                  <ButtonMobile
                    variant="primary"
                    onClick={() => handleApprove(doc.documentId, true)}
                  >
                    승인
                  </ButtonMobile>
                  <ButtonMobile
                    variant="danger"
                    onClick={() => {
                      const reason = window.prompt('반려 사유를 입력하세요:');
                      if (reason) handleApprove(doc.documentId, false, reason.trim());
                    }}
                  >
                    반려
                  </ButtonMobile>
                </CardAction>
              )}
            </Value>
          </Card>
        ))}
      </CardList>
    </Container>
  );
};
export default DocumentListTable;
