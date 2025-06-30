// src/pages/InsuranceRequestPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useLoginStore from '~/features/user/stores/LoginStore';
import { Download as DownloadIcon, AlertCircle as AlertIcon } from 'lucide-react';
import DocumentRequestForm from '~/features/documents/components/DocumentRequestForm';
import { downloadDocument } from '~/features/documents/api/insuranceAPI';
import { useMyDocumentRequests } from '~/features/documents/hooks/useDocumentRequests';

import type { Appointment } from '~/types/appointment';
import type { DocumentResponseDTO } from '~/features/documents/types/insurance';

// --- Styled Components ---
const Wrapper = styled.div`
  width: 100%;
  padding: 2rem;
`;
const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 24px;
  color: #2c3e50;
  text-align: center;
`;
const TabBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;
const Tab = styled.button<{ active: boolean }>`
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  color: ${({ active }) => (active ? '#fff' : '#34495e')};
  background: ${({ active }) => (active ? '#2980b9' : '#ecf0f1')};
  transition: background 0.2s;
  &:hover {
    background: ${({ active }) => (active ? '#1c5983' : '#d0d7de')};
  }
`;
const Section = styled.div`
  margin-bottom: 32px;
`;
const SectionLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #34495e;
  margin-bottom: 12px;
`;

const DocTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: stretch;
  grid-auto-rows: 1fr;
`;

// 2) 카드: 그리드 셀 높이를 100%로 채우고, 콘텐츠는 가운데 정렬
const Card = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  height: 100%; /* 그리드 셀 높이에 맞춤 */
  border-radius: 0.75rem;
  border: 2px solid ${({ active }) => (active ? '#2980b9' : '#bdc3c7')};
  background: ${({ active }) => (active ? '#ecf6fc' : '#f7f9fa')};
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center; /* 한글도 가운데로 */
  line-height: 1.3;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s;

  &:hover {
    border-color: #2980b9;
    background: #f0f8ff;
  }
`;

const Loading = styled.div`
  text-align: center;
  color: #2980b9;
  font-size: 1.1rem;
  padding: 60px 0;
`;
const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  /* 4,5번째 열(사유/다운로드) 폭 고정 */
  th:nth-child(4),
  td:nth-child(4),
  th:nth-child(5),
  td:nth-child(5) {
    width: 48px;
  }
`;
const Th = styled.th`
  text-align: left;
  border-bottom: 2px solid #bdc3c7;
  padding: 8px 12px; /* 위아래 8px, 좌우 12px */
  font-size: 0.85rem; /* 폰트도 살짝 작게 */
  overflow: hidden;
  word-break: keep-all;
`;
const Td = styled.td`
  padding: 6px 10px;
  font-size: 0.9rem;
  line-height: 1.3;
  white-space: normal;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;
const IconButton = styled.button<{ disabled?: boolean }>`
  width: 32px;
  height: 32px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${({ disabled }) => (disabled ? '#95a5a6' : '#2980b9')};
  transition: background 0.2s;
  border-radius: 4px;

  &:hover {
    background: ${({ disabled }) => (disabled ? 'transparent' : 'rgba(41, 128, 185, 0.1)')};
  }
`;

// --- Selection UI Styled ---
const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  margin-bottom: 16px;
`;
const Selected = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  border: 2px solid #bdc3c7;
  border-radius: 0.75rem;
  background: #f7f9fa;
  text-align: left;
  color: #2c3e50;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    border-color: #2980b9;
    background: #ecf6fc;
  }
`;
const Dropdown = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #bdc3c7;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
`;
const CenteredTd = styled(Td)`
  text-align: center;
  vertical-align: middle;
`;
const Option = styled.div<{ selected: boolean }>`
  padding: 0.75rem 1rem;
  background: ${({ selected }) => (selected ? '#ecf6fc' : '#fff')};
  color: ${({ selected }) => (selected ? '#2980b9' : '#2c3e50')};
  cursor: pointer;
  &:hover {
    background: #f0f8ff;
  }
`;
const AppointmentWrapper = styled(SelectWrapper)``;
const AppointmentDropdown = styled(Dropdown)``;
const AppointmentOption = styled(Option)``;

// --- Modal 스타일 ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const ModalContent = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.75rem;
  max-width: 90%;
  width: 400px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;
const CloseButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
`;

// --- Global Style ---
const GlobalStyle = createGlobalStyle`
  html, body { margin: 0; padding: 0; overflow-x: hidden; }
`;

const fetchAppointments = async (): Promise<Appointment[]> => {
  const res = await axios.get('/api/v1/users/me/appointments', {
    params: { page: 0, size: 100 },
    withCredentials: true,
  });
  return res.data.content;
};

const statusLabelMap: Record<string, string> = {
  REQUESTED: '요청',
  APPROVED: '승인',
  REJECTED: '반려',
};
const documentTypeLabels: Record<string, string> = {
  MEDICAL_REPORT: '진료 기록지',
  LAB_RESULT: '검사 결과지',
  PRESCRIPTION: '처방전',
  CLAIM_FORM: '보험 청구서',
  OTHER: '기타',
};
const documentTypes = [
  { value: 'MEDICAL_REPORT', label: '진료 기록지' },
  { value: 'LAB_RESULT', label: '검사 결과지' },
  { value: 'PRESCRIPTION', label: '처방전' },
  { value: 'CLAIM_FORM', label: '보험 청구서' },
  { value: 'OTHER', label: '기타' },
];

const InsuranceRequestPage: React.FC = () => {
  const { user } = useLoginStore();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'request' | 'status'>('request');
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('MEDICAL_REPORT');
  const [hospitalDropdownOpen, setHospitalDropdownOpen] = useState(false);
  const [appointmentDropdownOpen, setAppointmentDropdownOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [modalReason, setModalReason] = useState<string | null>(null);

  const userId = user?.userId;
  const apptQuery = useQuery({ queryKey: ['appointments'], queryFn: fetchAppointments });
  const appointments = apptQuery.data ?? [];
  const { data: requestPage, isLoading: isRequestLoading } = useMyDocumentRequests(
    userId!,
    page,
    10,
  );

  const hospitals = useMemo(() => {
    const map = new Map<number, string>();
    appointments.forEach((a) => map.set(a.hospitalId, a.hospitalName));
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [appointments]);

  useEffect(() => setSelectedAppointmentId(null), [selectedHospitalId]);
  if (!userId) return <Loading>사용자 정보를 불러오는 중…</Loading>;
  if (apptQuery.isLoading) return <Loading>진료내역 불러오는 중…</Loading>;
  const handleDownload = async (doc: DocumentResponseDTO) => {
    // 1) blob만 받아오기
    const { blob } = await downloadDocument(doc.documentId);

    // 2) downloadUrl에서 마지막 세그먼트 추출
    const urlStr = doc.downloadUrl || '';
    const segments = urlStr.split('/');
    const lastSeg = segments[segments.length - 1] || ''; // e.g. "c5786ba8_…_진단서 (1)"

    // 3) URL 디코딩
    const decoded = decodeURIComponent(lastSeg);

    // 4) "_"로 나눠서 맨 뒤 부분만 가져오기
    const parts = decoded.split('_');
    const rawName = parts[parts.length - 1]; // "진단서 (1)"

    // 5) 확장자가 없는 경우 ".pdf" 붙이기 (필요시)
    const filename = rawName.includes('.') ? rawName : `${rawName}.pdf`;

    // 6) Blob → ObjectURL → 다운로드
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  };
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <Title>진료 서류 관리</Title>
        <TabBar>
          <Tab active={activeTab === 'request'} onClick={() => setActiveTab('request')}>
            요청하기
          </Tab>
          <Tab active={activeTab === 'status'} onClick={() => setActiveTab('status')}>
            상태보기
          </Tab>
        </TabBar>

        {activeTab === 'request' && (
          <Section>
            <SectionLabel>1. 병원 선택</SectionLabel>
            <SelectWrapper>
              <Selected onClick={() => setHospitalDropdownOpen((p) => !p)}>
                {selectedHospitalId
                  ? hospitals.find((h) => h.id === selectedHospitalId)?.name
                  : '병원을 선택하세요'}
              </Selected>
              {hospitalDropdownOpen && (
                <Dropdown>
                  {hospitals.map((h) => (
                    <Option
                      key={h.id}
                      selected={h.id === selectedHospitalId}
                      onClick={() => {
                        setSelectedHospitalId(h.id);
                        setHospitalDropdownOpen(false);
                      }}
                    >
                      {h.name}
                    </Option>
                  ))}
                </Dropdown>
              )}
            </SelectWrapper>

            <SectionLabel>2. 진료 선택</SectionLabel>
            <AppointmentWrapper>
              <Selected
                disabled={!selectedHospitalId}
                onClick={() => selectedHospitalId && setAppointmentDropdownOpen((p) => !p)}
              >
                {selectedAppointmentId
                  ? (() => {
                      const a = appointments.find(
                        (x) => x.appointmentId === selectedAppointmentId,
                      )!;
                      return `${new Date(a.appointmentTime).toLocaleString('ko-KR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })} / ${a.doctorName}`;
                    })()
                  : '진료를 선택하세요'}
              </Selected>
              {appointmentDropdownOpen && (
                <AppointmentDropdown>
                  {appointments
                    .filter((a) => a.hospitalId === selectedHospitalId)
                    .map((a) => (
                      <AppointmentOption
                        key={a.appointmentId}
                        selected={a.appointmentId === selectedAppointmentId!}
                        onClick={() => {
                          setSelectedAppointmentId(a.appointmentId);
                          setAppointmentDropdownOpen(false);
                        }}
                      >
                        {new Date(a.appointmentTime).toLocaleString('ko-KR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}{' '}
                        / {a.doctorName}
                      </AppointmentOption>
                    ))}
                </AppointmentDropdown>
              )}
            </AppointmentWrapper>

            <SectionLabel>3. 서류 종류</SectionLabel>
            <DocTypeGrid>
              {documentTypes.map((dt) => (
                <Card
                  key={dt.value}
                  active={selectedDocumentType === dt.value}
                  onClick={() => setSelectedDocumentType(dt.value)}
                  type="button"
                >
                  {dt.label}
                </Card>
              ))}
            </DocTypeGrid>

            <DocumentRequestForm
              hospitalId={selectedHospitalId}
              appointmentId={selectedAppointmentId ?? 0}
              documentType={selectedDocumentType}
              onSuccess={() => {
                setActiveTab('status');
                queryClient.invalidateQueries({ queryKey: ['myDocumentRequests', userId] });
              }}
            />
          </Section>
        )}

        {activeTab === 'status' && (
          <Section>
            {isRequestLoading ? (
              <Loading>서류 요청 목록 불러오는 중…</Loading>
            ) : (
              <>
                <Table>
                  <thead>
                    <tr>
                      <Th>ID</Th>
                      <Th>문서 종류</Th>
                      <Th>상태</Th>
                      <Th>사유</Th>
                      <Th>파일</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {requestPage?.content.length === 0 ? (
                      <tr>
                        <Td colSpan={5}>요청된 문서가 없습니다.</Td>
                      </tr>
                    ) : (
                      requestPage?.content.map((doc: DocumentResponseDTO) => (
                        <tr key={doc.documentId}>
                          <Td>{doc.documentId}</Td>
                          <Td>{documentTypeLabels[doc.type] || doc.type}</Td>
                          <Td>{statusLabelMap[doc.status]}</Td>
                          <CenteredTd>
                            {doc.status === 'REJECTED' ? (
                              <IconButton
                                onClick={() => setModalReason(doc.rejectionReason ?? null)}
                              >
                                <AlertIcon size={18} />
                              </IconButton>
                            ) : (
                              '-'
                            )}
                          </CenteredTd>
                          <Td>
                            {doc.status === 'APPROVED' && (
                              <IconButton onClick={() => handleDownload(doc)}>
                                <DownloadIcon size={18} />
                              </IconButton>
                            )}
                          </Td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>

                {/* 페이지 네비게이션 */}
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  {Array.from({ length: requestPage?.totalPages ?? 1 }, (_, idx) => (
                    <button
                      key={idx}
                      style={{
                        margin: '0 4px',
                        padding: '6px 10px',
                        background: idx === page ? '#2980b9' : '#ecf0f1',
                        color: idx === page ? '#fff' : '#2c3e50',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => setPage(idx)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                {modalReason !== null && (
                  <ModalOverlay onClick={() => setModalReason(null)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                      <CloseButton onClick={() => setModalReason(null)}>&times;</CloseButton>
                      <h3>반려 사유</h3>
                      <p>{modalReason}</p>
                    </ModalContent>
                  </ModalOverlay>
                )}
              </>
            )}
          </Section>
        )}
      </Wrapper>
    </>
  );
};

export default InsuranceRequestPage;
