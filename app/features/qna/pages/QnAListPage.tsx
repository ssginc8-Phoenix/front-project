import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import styled from 'styled-components';

import Sidebar from '~/common/Sidebar';
import Pagination from '~/components/common/Pagination';
import { useMyAppointmentList } from '../hooks/useMyAppointmentList';
import type { AppointmentList, Appointment } from '~/types/appointment';
import QaChatModal from '~/features/qna/component/QaChatModal';
import CommonModal from '~/components/common/CommonModal';
import { deleteQaPost } from '~/features/qna/api/qnaAPI';

interface AppointmentWithQna extends Appointment {
  qnaStatus: 'PENDING' | 'COMPLETED';
}

const QnAListPage = () => {
  const [page, setPage] = useState(0);
  const size = 4;

  const {
    data: listPage,
    isLoading: listLoading,
    isError: listError,
    refetch,
  } = useMyAppointmentList(page, size);

  const [items, setItems] = useState<AppointmentWithQna[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const [openId, setOpenId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  useEffect(() => {
    if (!listPage) return;

    setLoadingDetails(true);
    setErrorDetails(null);

    Promise.all(
      listPage.content.map(async (appt: AppointmentList) => {
        try {
          const appointment = await axios
            .get<Appointment>(`/api/v1/appointments/${appt.appointmentId}`, {
              withCredentials: true,
            })
            .then((res) => res.data);

          let qnaStatus: 'PENDING' | 'COMPLETED' = 'PENDING';
          try {
            const qna = await axios
              .get(`/api/v1/qnas/appointment/${appt.appointmentId}`, {
                withCredentials: true,
              })
              .then((res) => res.data);

            if (qna?.status === 'COMPLETED') qnaStatus = 'COMPLETED';
          } catch {}

          return { ...appointment, qnaStatus };
        } catch (err) {
          console.error('상세 조회 실패:', err);
          return null;
        }
      }),
    )
      .then((results) => setItems(results.filter(Boolean) as AppointmentWithQna[]))
      .catch((err) => {
        console.error(err);
        setErrorDetails('세부 정보 로드 중 오류가 발생했습니다.');
      })
      .finally(() => setLoadingDetails(false));
  }, [listPage]);

  const handleDelete = async (qnaId: number) => {
    try {
      await deleteQaPost(qnaId);
      await refetch();
    } catch (err) {
      console.error('질문 삭제 실패:', err);
    }
  };
  const handleAndCloseDelete = async () => {
    if (confirmId === null) return;
    await handleDelete(confirmId);
    setConfirmId(null);
  };

  if (listLoading) return <CenterText>로딩 중…</CenterText>;
  if (listError || !listPage) return <CenterText>불러오는 중 오류가 발생했습니다.</CenterText>;
  if (loadingDetails) return <CenterText>세부 정보 로딩 중…</CenterText>;
  if (errorDetails) return <CenterText>{errorDetails}</CenterText>;

  return (
    <Layout>
      <Sidebar />

      {/* 오른쪽 본문 */}
      <Content>
        <Header>
          <Title>💬 Q&A</Title>
        </Header>
        <Divider />

        {items.length > 0 ? (
          <List>
            {items.map((appt) => {
              if (!appt.question) return null;

              const qnaStatus = appt.qnaStatus === 'COMPLETED' ? '답변완료' : '대기중';
              return (
                <Card key={appt.appointmentId} onClick={() => setOpenId(appt.appointmentId)}>
                  <DeleteBtn
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmId(appt.appointmentId);
                    }}
                    title="질문 삭제"
                  >
                    ×
                  </DeleteBtn>

                  <HospitalName>{appt.hospitalName}</HospitalName>
                  <DoctorName>{appt.doctorName} 의사</DoctorName>
                  <MetaInfo>
                    {format(new Date(appt.appointmentTime), 'yyyy.MM.dd')}{' '}
                    {maskName(appt.patientName)} 방문
                  </MetaInfo>
                  <Badge $status={qnaStatus}>{qnaStatus}</Badge>
                  <QuestionText>{appt.question}</QuestionText>
                </Card>
              );
            })}
          </List>
        ) : (
          <CenterText>질문이 없습니다.</CenterText>
        )}

        <PaginationContainer>
          <Pagination
            currentPage={page}
            totalPages={listPage.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </PaginationContainer>
      </Content>

      {/* 모달들 */}
      {openId !== null && (
        <QaChatModal qnaId={openId} onClose={() => setOpenId(null)} showInput={false} />
      )}
      {confirmId !== null && (
        <CommonModal title="질문 삭제" buttonText="삭제" onClose={handleAndCloseDelete}>
          이 질문을 정말 삭제하시겠습니까?
        </CommonModal>
      )}
    </Layout>
  );
};

export default QnAListPage;

function maskName(name: string) {
  if (!name || name.length < 2) return name;
  return name[0] + '*'.repeat(name.length - 1);
}

const Layout = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const Content = styled.main`
  flex: 1;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  color: #00499e;
`;

const Divider = styled.hr`
  margin: 0.75rem 0 2rem;
`;

const List = styled.div`
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Card = styled.div`
  position: relative;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  opacity: 0.65;

  &:hover {
    opacity: 1;
  }
`;

const HospitalName = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
`;

const DoctorName = styled.div`
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0.2rem 0 0.4rem;
`;

const MetaInfo = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
`;

const QuestionText = styled.p`
  font-size: 1rem;
`;

const Badge = styled.span<{ $status: string }>`
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $status }) => ($status === '답변완료' ? '#d1fae5' : '#e0f2fe')};
  color: ${({ $status }) => ($status === '답변완료' ? '#065f46' : '#0369a1')};
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  margin-right: 0.5rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const CenterText = styled.p`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
`;
