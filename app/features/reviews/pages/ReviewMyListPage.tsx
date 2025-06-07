// src/features/reviews/pages/ReviewMyListPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';

import { useReviewList } from '~/features/reviews/hooks/useReviewList';
import * as reviewAPI from '~/features/reviews/api/reviewAPI';
import { ReviewMyListComponent } from '~/features/reviews/component/ReviewMyList';
import { ReviewEditModal } from '~/features/reviews/component/modal/ReviewEditModal';
import { ReviewDeleteModal } from '~/features/reviews/component/modal/ReviewDeleteModal';
import { AlertModal } from '~/features/reviews/component/common/AlertModal';

import type { ReviewMyListResponse } from '~/features/reviews/types/review';
import { GOOD_OPTIONS, BAD_OPTIONS } from '~/features/reviews/constants/keywordOptions';
import useLoginStore from '~/features/user/stores/LoginStore';
import ReviewCreateModal from '~/features/reviews/component/modal/ReviewCreateModal';

export default function ReviewMyListPage() {
  // 1) 로그인된 유저 체크
  const user = useLoginStore((state) => state.user);
  if (!user) return <p>로그인 후 이용해주세요.</p>;

  // 2) 페이징 상태
  const [page, setPage] = useState(0);
  const { reviews, totalPages, loading, error } = useReviewList(page, 10);

  // 3) 리뷰 작성 모달 상태
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [createDone, setCreateDone] = useState(false);

  // 4) 수정 모달 상태
  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewMyListResponse | null>(null);
  const [editDone, setEditDone] = useState(false);

  // 5) 삭제 모달 상태
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [deleteDone, setDeleteDone] = useState(false);

  // — 이벤트 핸들러들 —

  // 리뷰 작성 버튼 클릭
  const openCreate = () => setCreateOpen(true);
  const handleCreateDone = () => {
    setCreateOpen(false);
    setCreateDone(true);
    setPage((p) => p); // 목록 다시 불러오기
  };

  // 리뷰 수정 오픈
  const openEdit = (review: ReviewMyListResponse) => {
    setSelectedReview(review);
    setEditOpen(true);
  };
  const handleEditDone = () => {
    setEditOpen(false);
    setEditDone(true);
    setPage((p) => p);
  };

  // 리뷰 삭제 확정
  const confirmDelete = async () => {
    if (!selectedReview) return;
    await reviewAPI.deleteReview(selectedReview.reviewId);
    setDeleteOpen(false);
    setDeleteDone(true);
    setPage((p) => p);
  };

  return (
    <PageWrapper>
      <Header>
        <Title>✏️ 리뷰 관리</Title>
        <CreateButton onClick={openCreate}>리뷰 작성</CreateButton>
      </Header>
      <Divider />

      {loading && <p>로딩 중…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <ReviewMyListComponent
          reviews={reviews}
          currentPage={page}
          totalPages={totalPages}
          loading={loading}
          error={error}
          onPageChange={setPage}
          onEditReview={openEdit}
          onDeleteReview={(review) => {
            setSelectedReview(review);
            setDeleteOpen(true);
          }}
        />
      )}

      {/* — 리뷰 작성 모달 — */}
      {isCreateOpen && (
        <ReviewCreateModal
          isOpen={isCreateOpen}
          onClose={() => setCreateOpen(false)}
          onSaved={handleCreateDone}
          hospitalId={123}
          doctorId={456}
          appointmentId={789}
          userId={Number(user.userId)}
          hospitalName={'부경대학교병원'}
          doctorName={'김의사'}
        />
      )}
      <AlertModal
        isOpen={createDone}
        onClose={() => setCreateDone(false)}
        message="리뷰가 작성되었습니다!"
      />

      {/* — 리뷰 수정 모달 — */}
      {selectedReview && isEditOpen && (
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
        message="수정이 완료되었습니다!"
      />

      {/* — 리뷰 삭제 모달 — */}
      {selectedReview && (
        <ReviewDeleteModal
          isOpen={isDeleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
      <AlertModal
        isOpen={deleteDone}
        onClose={() => setDeleteDone(false)}
        message="리뷰가 삭제되었습니다!"
      />
    </PageWrapper>
  );
}

// ───────── styled ─────────

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

const CreateButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  &:hover {
    background-color: #1d4ed8;
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #e5e7eb;
  margin: 1rem 0;
`;
