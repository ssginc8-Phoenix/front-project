import React, { useState } from 'react';
import styled from 'styled-components';

import type { ReviewMyListResponse } from '~/features/reviews/types/review';
import ReviewCreateModal from '~/features/reviews/component/modal/ReviewCreateModal';
import ReviewEditModal from '~/features/reviews/component/modal/ReviewEditModal';

import { ReviewSuccessModal } from '~/features/reviews/component/modal/ReviewCreateSuccessModal';
import ReviewDeleteModal from '~/features/reviews/component/modal/ReviewDeleteModal';
import ReviewDeleteSuccessModal from '~/features/reviews/component/modal/ReviewDeleteSuccessModal';
import { ReviewMyListComponent } from '~/features/reviews/component/ReviewMyList';
import { GOOD_OPTIONS, BAD_OPTIONS } from '~/features/reviews/constants/keywordOptions';
import ReviewEditSuccessModal from '~/features/reviews/component/modal/ReviewEditSuccessModal';

export default function ReviewMyListPage() {
  const [reviews, setReviews] = useState<ReviewMyListResponse[]>([
    {
      // 더미데이터입니다
      reviewId: 101,
      createdAt: '2025-06-01T10:00:00.000Z',
      contents: '의사 선생님이 매우 친절했어요!',
      keywords: ['FRIENDLY_DOCTOR', 'CLEAN_HOSPITAL'],
      reportCount: 0,
    },
    {
      reviewId: 102,
      createdAt: '2025-05-28T14:30:00.000Z',
      contents: '대기 시간이 길었지만, 진료는 만족스러웠습니다.',
      keywords: ['SHORT_WAIT', 'PROFESSIONAL'],
      reportCount: 1,
    },
    {
      reviewId: 103,
      createdAt: '2025-05-20T09:15:00.000Z',
      contents: '시설이 깨끗하고 위치가 좋아요!',
      keywords: ['NICE_FACILITY', 'GOOD_LOCATION'],
      reportCount: 0,
    },
  ]);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const pageSize = 3;
  const totalPages = Math.ceil(reviews.length / pageSize);
  const pagedReviews = reviews.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

  const loading = false;
  const error: string | null = null;

  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  const [isCreateSuccessOpen, setIsCreateSuccessOpen] = useState<boolean>(false);
  const openCreateSuccess = () => setIsCreateSuccessOpen(true);
  const closeCreateSuccess = () => setIsCreateSuccessOpen(false);

  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<ReviewMyListResponse | null>(null);
  const openEdit = () => setIsEditOpen(true);
  const closeEdit = () => setIsEditOpen(false);

  const [isEditSuccessOpen, setIsEditSuccessOpen] = useState<boolean>(false);
  const openEditSuccess = () => setIsEditSuccessOpen(true);
  const closeEditSuccess = () => setIsEditSuccessOpen(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState<boolean>(false);

  const handleCreate = (payload: {
    goodKeywords: string[];
    badKeywords: string[];
    contents: string;
  }) => {
    const newId = Math.max(0, ...reviews.map((r) => r.reviewId)) + 1;
    const newReview: ReviewMyListResponse = {
      reviewId: newId,
      createdAt: new Date().toISOString(),
      contents: payload.contents,
      keywords: [...payload.goodKeywords, ...payload.badKeywords],
      reportCount: 0,
    };
    setReviews([newReview, ...reviews]);
    closeCreate();
    openCreateSuccess();
  };

  const handleEditClick = (review: ReviewMyListResponse) => {
    setSelectedReview(review);
    openEdit();
  };

  const handleEditSubmit = (payload: {
    reviewId: number;
    goodKeywords: string[];
    badKeywords: string[];
    contents: string;
  }) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.reviewId === payload.reviewId
          ? {
              ...r,
              contents: payload.contents,
              keywords: [...payload.goodKeywords, ...payload.badKeywords],
            }
          : r,
      ),
    );
    closeEdit();
    openEditSuccess();
  };

  const openDelete = (id: number) => {
    setSelectedReviewId(id);
    setIsDeleteOpen(true);
  };
  const closeDelete = () => {
    setIsDeleteOpen(false);
    setSelectedReviewId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedReviewId != null) {
      setReviews((prev) => prev.filter((r) => r.reviewId !== selectedReviewId));
    }
    closeDelete();
    setIsDeleteSuccessOpen(true);
  };

  return (
    <PageWrapper>
      <Header>
        <Title>✏️ 리뷰 관리</Title>
        <TopBar>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            리뷰 작성
          </button>
        </TopBar>
      </Header>
      <Divider />

      <ReviewMyListComponent
        reviews={pagedReviews}
        currentPage={currentPage}
        totalPages={totalPages}
        loading={loading}
        error={error}
        onPageChange={(newPage: number) => setCurrentPage(newPage)}
        onDeleteReview={openDelete}
        onEditReview={handleEditClick}
      />

      <ReviewCreateModal
        isOpen={isCreateOpen}
        onClose={closeCreate}
        onSubmit={handleCreate}
        hospitalName="바른 이비인후과"
        doctorName="김현재 원장"
        userId={999}
        doctorId={888}
        appointmentId={777}
      />

      <ReviewSuccessModal isOpen={isCreateSuccessOpen} onClose={closeCreateSuccess} />

      {selectedReview && (
        <ReviewEditModal
          isOpen={isEditOpen}
          onClose={closeEdit}
          onSubmit={handleEditSubmit}
          hospitalName="바른 이비인후과"
          doctorName="김현재 원장"
          userId={999}
          doctorId={888}
          appointmentId={777}
          reviewId={selectedReview.reviewId}
          initialGood={selectedReview.keywords.filter((kw) =>
            GOOD_OPTIONS.map((opt) => opt.value).includes(kw),
          )}
          initialBad={selectedReview.keywords.filter((kw) =>
            BAD_OPTIONS.map((opt) => opt.value).includes(kw),
          )}
          initialContents={selectedReview.contents}
        />
      )}

      <ReviewEditSuccessModal isOpen={isEditSuccessOpen} onClose={closeEditSuccess} />

      <ReviewDeleteModal
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={handleConfirmDelete}
      />

      <ReviewDeleteSuccessModal
        isOpen={isDeleteSuccessOpen}
        onClose={() => setIsDeleteSuccessOpen(false)}
      />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
`;

const TopBar = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #e5e7eb;
  margin: 1rem 0;
`;
