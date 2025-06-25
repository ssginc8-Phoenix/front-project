import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components';

import Sidebar from '~/common/Sidebar'; // ← 사이드바
import { useReviewList } from '~/features/reviews/hooks/useReviewList';
import * as reviewAPI from '~/features/reviews/api/reviewAPI';
import { getAppointment } from '~/features/appointment/api/appointmentAPI';
import type { Appointment } from '~/types/appointment';

import { ReviewMyListComponent } from '~/features/reviews/component/list/ReviewMyList';
import ReviewCreateModal from '~/features/reviews/component/add/ReviewCreateModal';
import { ReviewEditModal } from '~/features/reviews/component/update/ReviewEditModal';
import { ReviewDeleteModal } from '~/features/reviews/component/update/ReviewDeleteModal';
import { ReviewDetailModal } from '~/features/reviews/component/detail/ReviewDetailModal';
import { AlertModal } from '~/features/reviews/component/common/AlertModal';

import type { ReviewMyListResponse } from '~/features/reviews/types/review';
import useLoginStore from '~/features/user/stores/LoginStore';
import { BAD_OPTIONS, GOOD_OPTIONS } from '~/features/reviews/constants/keywordOptions';

type LocationState = { appointmentId: number };

export default function ReviewMyListPage() {
  /* ─── 기본 준비 ─────────────────────────────── */
  const { state } = useLocation();
  const { appointmentId } = (state as LocationState) || { appointmentId: 0 };

  const user = useLoginStore((s) => s.user);
  if (!user) return <CenteredText>로그인 후 이용해주세요.</CenteredText>;

  /* ─── 리뷰 목록 ─────────────────────────────── */
  const [page, setPage] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { reviews, totalPages, loading, error } = useReviewList(page, 5, refreshTrigger);

  /* ─── 예약(appointment) 정보 (리뷰 작성용) ─── */
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  useEffect(() => {
    if (appointmentId) getAppointment(appointmentId).then(setAppointment);
  }, [appointmentId]);

  /* ─── 모달 상태 ─────────────────────────────── */
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [createDone, setCreateDone] = useState(false);

  const [selectedReview, setSelectedReview] = useState<ReviewMyListResponse | null>(null);
  const [isDetailOpen, setDetailOpen] = useState(false);

  const [isEditOpen, setEditOpen] = useState(false);
  const [editDone, setEditDone] = useState(false);

  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [deleteDone, setDeleteDone] = useState(false);

  /* ─── 핸들러 ─────────────────────────────────── */
  const handleCreateDone = () => {
    setCreateOpen(false);
    setCreateDone(true);
    setPage(0);
    setRefreshTrigger((t) => t + 1);
  };

  const openDetail = (r: ReviewMyListResponse) => {
    setSelectedReview(r);
    setDetailOpen(true);
  };

  const openEdit = (r: ReviewMyListResponse) => {
    setSelectedReview(r);
    setEditOpen(true);
  };
  const handleEditDone = () => {
    setEditOpen(false);
    setEditDone(true);
    setRefreshTrigger((t) => t + 1);
  };

  const openDelete = (r: ReviewMyListResponse) => {
    setSelectedReview(r);
    setDeleteOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (!selectedReview) return;
    await reviewAPI.deleteReview(selectedReview.reviewId);
    setDeleteOpen(false);
    setDeleteDone(true);
    setRefreshTrigger((t) => t + 1);
  };

  /* ─── 렌더링 ─────────────────────────────────── */
  return (
    <Layout>
      <Sidebar />

      <Content>
        <Header>
          <Title>✏️ 나의 리뷰 관리</Title>
        </Header>
        <Divider />

        {loading && <InfoText>로딩 중…</InfoText>}
        {error && <ErrorText>{error}</ErrorText>}

        {!loading && !error && (
          <ReviewMyListComponent
            reviews={reviews}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onDetailReview={openDetail}
            onEditReview={openEdit}
            onDeleteReview={openDelete}
          />
        )}
      </Content>

      {/* ─── 모달들 ─────────────────────────────── */}
      {isCreateOpen && appointment && (
        <ReviewCreateModal
          isOpen={isCreateOpen}
          onClose={() => setCreateOpen(false)}
          onSaved={handleCreateDone}
          appointmentId={appointment.appointmentId}
          userId={user.userId}
          hospitalId={appointment.hospitalId}
          doctorId={appointment.doctorId}
          hospitalName={appointment.hospitalName}
          doctorName={appointment.doctorName}
        />
      )}
      <AlertModal
        isOpen={createDone}
        onClose={() => setCreateDone(false)}
        message="리뷰가 작성되었습니다!"
      />

      {selectedReview && (
        <ReviewDetailModal
          isOpen={isDetailOpen}
          onClose={() => setDetailOpen(false)}
          review={selectedReview}
        />
      )}

      {selectedReview && (
        <ReviewEditModal
          isOpen={isEditOpen}
          onClose={() => setEditOpen(false)}
          onSaved={handleEditDone}
          reviewId={selectedReview.reviewId}
          hospitalName={selectedReview.hospitalName}
          doctorName={selectedReview.doctorName}
          initialGood={selectedReview.keywords.filter((kw) =>
            GOOD_OPTIONS.some((o) => o.value === kw),
          )}
          initialBad={selectedReview.keywords.filter((kw) =>
            BAD_OPTIONS.some((o) => o.value === kw),
          )}
          initialContents={selectedReview.contents}
        />
      )}
      <AlertModal
        isOpen={editDone}
        onClose={() => setEditDone(false)}
        message="리뷰가 수정되었습니다!"
      />

      {selectedReview && (
        <ReviewDeleteModal
          isOpen={isDeleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
      <AlertModal
        isOpen={deleteDone}
        onClose={() => setDeleteDone(false)}
        message="리뷰가 삭제되었습니다!"
      />
    </Layout>
  );
}

/* ─── styled-components ───────────────────────── */

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

const InfoText = styled.p`
  text-align: center;
`;

const ErrorText = styled.p`
  text-align: center;
  color: red;
`;

const CenteredText = styled.p`
  width: 100%;
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
`;
