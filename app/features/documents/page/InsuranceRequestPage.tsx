// src/pages/InsuranceRequestPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useLoginStore from '~/features/user/stores/LoginStore';

import DocumentRequestForm from '~/features/documents/components/DocumentRequestForm';
import { downloadDocument } from '~/features/documents/api/insuranceAPI';

import type { Appointment } from '~/types/appointment';
import { useMyDocumentRequests } from '~/features/documents/hooks/useDocumentRequests';

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
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;
const Card = styled.button<{ active?: boolean }>`
  padding: 16px;
  border-radius: 0.75rem;
  border: 2px solid ${({ active }) => (active ? '#2980b9' : '#bdc3c7')};
  background: ${({ active }) => (active ? '#ecf6fc' : '#f7f9fa')};
  font-size: 0.95rem;
  font-weight: 500;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  &:hover {
    border-color: #2980b9;
    background: #f0f8ff;
  }
`;
const DocTypeGrid = styled(Grid)`
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 16px;
`;
const Loading = styled.div`
  text-align: center;
  color: #2980b9;
  font-size: 1.1rem;
  padding: 60px 0;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;
const Th = styled.th`
  text-align: left;
  border-bottom: 2px solid #bdc3c7;
  padding: 8px;
`;
const Td = styled.td`
  padding: 8px;
  border-bottom: 1px solid #eaeaea;
`;
const DownloadButton = styled.button`
  padding: 6px 12px;
  font-size: 0.9rem;
  color: #fff;
  background: #2980b9;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;
const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  margin-bottom: 1rem;
`;

const Selected = styled.button`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  border: 2px solid #bdc3c7;
  border-radius: 0.75rem;
  background: #f7f9fa;
  text-align: left;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.2s;
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

const Option = styled.div<{ selected: boolean }>`
  padding: 0.75rem;
  background: ${({ selected }) => (selected ? '#ecf6fc' : '#fff')};
  color: ${({ selected }) => (selected ? '#2980b9' : '#2c3e50')};
  cursor: pointer;
  &:hover {
    background: #f0f8ff;
  }
`;
const AppointmentWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  margin-bottom: 1rem;
`;

const AppointmentDropdown = styled.div`
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

const AppointmentOption = styled.div<{ selected: boolean }>`
  padding: 0.75rem;
  background: ${({ selected }) => (selected ? '#ecf6fc' : '#fff')};
  color: ${({ selected }) => (selected ? '#2980b9' : '#2c3e50')};
  cursor: pointer;
  &:hover {
    background: #f0f8ff;
  }
`;
const fetchAppointments = async (): Promise<Appointment[]> => {
  const res = await axios.get('/api/v1/users/me/appointments', {
    params: { page: 0, size: 100 },
    withCredentials: true,
  });
  return res.data.content;
};

const statusLabelMap: Record<string, string> = {
  REQUESTED: '요청됨',
  APPROVED: '승인됨',
  REJECTED: '반려됨',
};
const documentTypes = [
  { value: 'MEDICAL_REPORT', label: '진료기록지' },
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

  const documentTypeLabels: Record<string, string> = {
    MEDICAL_REPORT: '진료기록지',
    LAB_RESULT: '검사 결과지',
    PRESCRIPTION: '처방전',
    CLAIM_FORM: '보험 청구서',
    OTHER: '기타',
  };
  const userId = user?.userId;

  // 예약 리스트
  const apptQuery = useQuery({ queryKey: ['appointments'], queryFn: fetchAppointments });
  const appointments = apptQuery.data ?? [];

  // 병원 중복 제거
  const hospitals = useMemo(() => {
    const map = new Map<number, string>();
    appointments.forEach((a) => map.set(a.hospitalId, a.hospitalName));
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [appointments]);
  if (userId === undefined) {
    return <p>사용자 정보를 불러오는 중입니다...</p>;
  }
  // 상태탭: 내 문서 요청 목록 조회
  const { data: requestPage, isLoading: isRequestLoading } = useMyDocumentRequests(
    userId,
    page,
    10,
  );

  // 병원 변경 시 진료 초기화
  useEffect(() => setSelectedAppointmentId(null), [selectedHospitalId]);

  if (apptQuery.isLoading) return <Loading>진료내역 불러오는 중…</Loading>;

  return (
    <Wrapper>
      <Title>진료 서류 관리</Title>
      <TabBar>
        <Tab active={activeTab === 'request'} onClick={() => setActiveTab('request')} type="button">
          요청하기
        </Tab>
        <Tab active={activeTab === 'status'} onClick={() => setActiveTab('status')} type="button">
          상태보기
        </Tab>
      </TabBar>

      {activeTab === 'request' && (
        <Section>
          <SectionLabel>1. 병원 선택</SectionLabel>
          <SelectWrapper>
            <Selected onClick={() => setHospitalDropdownOpen((prev) => !prev)}>
              {selectedHospitalId
                ? hospitals.find((h) => h.id === selectedHospitalId)?.name
                : '병원을 선택하세요'}
            </Selected>

            {hospitalDropdownOpen && (
              <Dropdown>
                {hospitals.map((h) => (
                  <Option
                    key={h.id}
                    selected={selectedHospitalId === h.id}
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
          {selectedHospitalId ? (
            <AppointmentWrapper>
              <Selected onClick={() => setAppointmentDropdownOpen((prev) => !prev)}>
                {selectedAppointmentId
                  ? (() => {
                      const appt = appointments.find(
                        (a) => a.appointmentId === selectedAppointmentId,
                      );
                      return appt
                        ? `${new Date(appt.appointmentTime).toLocaleString('ko-KR', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })} / ${appt.doctorName}`
                        : '진료를 선택하세요';
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
                        selected={selectedAppointmentId === a.appointmentId}
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
          ) : (
            <AppointmentWrapper>
              <Selected
                disabled
                style={{ background: '#f7f9fa', color: '#7f8c8d', cursor: 'not-allowed' }}
              >
                먼저 병원을 선택해주세요
              </Selected>
            </AppointmentWrapper>
          )}

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
            documentType={selectedDocumentType} // ← 여기에 MEDICAL_REPORT 등 enum 문자열 전달됨
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
                    requestPage?.content.map((doc) => (
                      <tr key={doc.documentId}>
                        <Td>{doc.documentId}</Td>
                        <Td>{documentTypeLabels[doc.type] || doc.type}</Td>
                        <Td>{statusLabelMap[doc.status] || doc.status}</Td>
                        <Td>
                          {doc.status === 'REJECTED' ? doc.rejectionReason || '사유 없음' : '-'}
                        </Td>
                        <Td>
                          <DownloadButton
                            disabled={doc.status !== 'APPROVED'}
                            onClick={async () => {
                              const blob = await downloadDocument(doc.documentId);
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = doc.downloadUrl ?? `document-${doc.documentId}.pdf`;
                              document.body.appendChild(a);
                              a.click();
                              a.remove();
                            }}
                          >
                            다운로드
                          </DownloadButton>
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
            </>
          )}
        </Section>
      )}
    </Wrapper>
  );
};

export default InsuranceRequestPage;
