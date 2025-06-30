import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Pagination from '~/components/common/Pagination';
import { useHospitalReviews } from '~/features/reviews/hooks/useHospitalReviews';
import type { HospitalReviewResponse } from '~/features/reviews/types/review';
import { reportReview } from '~/features/reviews/api/reviewAPI';
import { HospitalReviewCard } from '~/features/reviews/component/list/HospitalReviewCard';
import { ReportModal } from '~/features/reviews/component/update/ReportModal';
import { getMyHospital } from '~/features/hospitals/api/hospitalAPI';

import {
  Wrapper,
  Title as StyledTitle,
  ContentBody,
  PaginationWrapper,
} from '~/components/styled/MyPage.styles';

export default function ReviewHospitalPage() {
  const [hospitalId, setHospitalId] = useState<number | null>(null);
  const [hospitalName, setHospitalName] = useState<string>('');
  const [page, setPage] = useState(0);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const hospital = await getMyHospital();
        setHospitalId(hospital.hospitalId);
        setHospitalName(hospital.name);
      } catch (err) {
        console.error('병원 정보 조회 실패:', err);
      }
    })();
  }, []);

  const { reviews, pagination, loading, error } = useHospitalReviews(hospitalId ?? -1, page, 5);

  const handleReport = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setIsModalOpen(true);
  };

  const handleConfirmReport = async (reason: string) => {
    if (selectedReviewId === null) return;
    try {
      await reportReview(selectedReviewId, reason);
      alert('신고가 완료되었습니다.');
      setIsModalOpen(false);
      setPage(0);
    } catch {
      alert('신고 처리 중 오류가 발생했습니다.');
    }
  };

  if (!hospitalId) return <Centered>병원 정보 로딩 중…</Centered>;
  if (loading) return <Centered>리뷰 로딩 중…</Centered>;
  if (error) return <ErrorText>{error}</ErrorText>;

  return (
    <Wrapper>
      <StyledTitle>
        <Emoji>📋</Emoji> {hospitalName} 리뷰 목록
      </StyledTitle>

      <ContentBody>
        {reviews.length === 0 ? (
          <EmptyMessage>아직 등록된 리뷰가 없습니다.</EmptyMessage>
        ) : (
          reviews.map((r: HospitalReviewResponse) => (
            <CardWrapper key={r.reviewId}>
              <HospitalReviewCard review={r} onReport={handleReport} />
            </CardWrapper>
          ))
        )}

        {pagination.totalPages > 0 && (
          <PaginationWrapper>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </PaginationWrapper>
        )}

        {isModalOpen && selectedReviewId !== null && (
          <ReportModal
            reviewId={selectedReviewId}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmReport}
          />
        )}
      </ContentBody>
    </Wrapper>
  );
}

const Emoji = styled.span`
  display: none;

  @media (max-width: 768px) {
    display: inline;
  }
`;

const CardWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #6b7280;
  margin-top: 2rem;
`;

const ErrorText = styled.div`
  color: red;
  text-align: center;
`;

const Centered = styled.div`
  text-align: center;
  padding: 2rem;
`;
