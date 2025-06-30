import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components';

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

import {
  Wrapper,
  Title as StyledTitle,
  ContentBody,
  PaginationWrapper,
} from '~/components/styled/MyPage.styles';

type LocationState = { appointmentId: number };

export default function ReviewMyListPage() {
  const { state } = useLocation();
  const { appointmentId } = (state as LocationState) || { appointmentId: 0 };

  const user = useLoginStore((s) => s.user);
  if (!user) return <CenteredText>로그인 후 이용해주세요.</CenteredText>;

  const [page, setPage] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { reviews, totalPages, loading, error } = useReviewList(page, 5, refreshTrigger);

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  useEffect(() => {
    if (appointmentId) getAppointment(appointmentId).then(setAppointment);
  }, [appointmentId]);

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [createDone, setCreateDone] = useState(false);

  const [selectedReview, setSelectedReview] = useState<ReviewMyListResponse | null>(null);
  const [isDetailOpen, setDetailOpen] = useState(false);

  const [isEditOpen, setEditOpen] = useState(false);
  const [editDone, setEditDone] = useState(false);

  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [deleteDone, setDeleteDone] = useState(false);

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

  return (
    <Wrapper>
      <StyledTitle>
        <Emoji>✏️</Emoji> 리뷰 관리
      </StyledTitle>

      <ContentBody>
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

        <PaginationWrapper />
      </ContentBody>

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
    </Wrapper>
  );
}

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

const Emoji = styled.span`
  display: none;

  @media (max-width: 768px) {
    display: inline;
  }
`;
