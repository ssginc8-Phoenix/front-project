import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import styled from 'styled-components';

import { useMyAppointmentList } from '../hooks/useMyAppointmentList';
import type { AppointmentList, Appointment } from '~/types/appointment';
import QaChatModal from '~/features/qna/component/QaChatModal';
import CommonModal from '~/components/common/CommonModal';
import { deleteQaPost } from '~/features/qna/api/qnaAPI';

export default function QnAListPage() {
  const [page, setPage] = useState(0);
  const size = 4;

  const {
    data: listPage,
    isLoading: listLoading,
    isError: listError,
    refetch,
  } = useMyAppointmentList(page, size);

  const [items, setItems] = useState<Appointment[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const [openId, setOpenId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  useEffect(() => {
    if (!listPage) return;
    setLoadingDetails(true);
    setErrorDetails(null);

    Promise.all(
      listPage.content.map((appt: AppointmentList) =>
        axios
          .get<Appointment>(`/api/v1/appointments/${appt.appointmentId}`, { withCredentials: true })
          .then((res) => res.data),
      ),
    )
      .then((results) => setItems(results))
      .catch((e) => {
        console.error(e);
        setErrorDetails('세부 정보 로드 중 오류가 발생했습니다.');
      })
      .finally(() => setLoadingDetails(false));
  }, [listPage]);

  const handleDelete = async (qnaId: number) => {
    try {
      await deleteQaPost(qnaId);
      await refetch(); // 삭제 후 목록 갱신
    } catch (e) {
      console.error('질문 삭제 실패:', e);
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
    <PageWrapper>
      <Header>
        <Title>💬Q&A</Title>
      </Header>
      <Divider />

      {items.length > 0 ? (
        <List>
          {items.map((appt) =>
            appt.question ? (
              <Card key={appt.appointmentId} onClick={() => setOpenId(appt.appointmentId)}>
                <DeleteBtn
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmId(appt.appointmentId);
                  }}
                  title="질문 삭제"
                >
                  🗑️
                </DeleteBtn>

                <HospitalName>{appt.hospitalName}</HospitalName>
                <DoctorName>{appt.doctorName} 의사</DoctorName>
                <MetaInfo>
                  {format(new Date(appt.appointmentTime), 'yyyy.MM.dd')}{' '}
                  {maskName(appt.patientName)} 방문
                </MetaInfo>
                <QuestionText>{appt.question}</QuestionText>
              </Card>
            ) : null,
          )}
        </List>
      ) : (
        <CenterText>질문이 없습니다.</CenterText>
      )}

      <Pagination>
        <PageButton disabled={listPage.first} onClick={() => setPage((p) => Math.max(p - 1, 0))}>
          이전
        </PageButton>
        <PageInfo>
          {listPage.number + 1} / {listPage.totalPages}
        </PageInfo>
        <PageButton
          disabled={listPage.last}
          onClick={() => setPage((p) => (p + 1 < listPage.totalPages ? p + 1 : p))}
        >
          다음
        </PageButton>
      </Pagination>

      {/* 질문/답변 모달 */}
      {openId !== null && (
        <QaChatModal qnaId={openId} onClose={() => setOpenId(null)} showInput={false} />
      )}

      {/* 삭제 확인 모달 */}
      {confirmId !== null && (
        <CommonModal title="질문 삭제" buttonText="삭제" onClose={handleAndCloseDelete}>
          이 질문을 정말 삭제하시겠습니까?
        </CommonModal>
      )}
    </PageWrapper>
  );
}

function maskName(name: string) {
  if (!name || name.length < 2) return name;
  return name[0] + '*'.repeat(name.length - 1);
}

const PageWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #00499e;
  text-align: center;
`;

const CenterText = styled.p`
  text-align: center;
  color: #6b7280;
  margin: 2rem 0;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Card = styled.button`
  position: relative;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`;

const HospitalName = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const DoctorName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin: 0.25rem 0;
`;

const MetaInfo = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 0.75rem;
`;

const QuestionText = styled.p`
  font-size: 1rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
`;

const PageInfo = styled.span`
  align-self: center;
`;

const Divider = styled.hr`
  margin: 1rem 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;
