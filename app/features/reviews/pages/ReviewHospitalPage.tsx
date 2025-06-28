import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Pagination from '~/components/common/Pagination';
import { useHospitalReviews } from '~/features/reviews/hooks/useHospitalReviews';
import type { HospitalReviewResponse } from '~/features/reviews/types/review';
import { reportReview } from '~/features/reviews/api/reviewAPI';
import { HospitalReviewCard } from '~/features/reviews/component/list/HospitalReviewCard';
import { ReportModal } from '~/features/reviews/component/update/ReportModal';
import { getMyHospital } from '~/features/hospitals/api/hospitalAPI';

export default function ReviewHospitalPage() {
  const [hospitalId, setHospitalId] = useState<number | null>(null);
  const [hospitalName, setHospitalName] = useState<string>('');
  const [page, setPage] = useState(0);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ─── 병원 ID 및 이름 조회 ─── */
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

  /* ─── 리뷰 목록 조회 ─── */
  const { reviews, pagination, loading, error } = useHospitalReviews(hospitalId ?? -1, page, 5);

  /* ─── 신고 핸들러 ─── */
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

  /* ─── 렌더링 분기 ─── */
  if (!hospitalId) return <Centered>병원 정보 로딩 중…</Centered>;
  if (loading) return <Centered>리뷰 로딩 중…</Centered>;
  if (error) return <ErrorText>{error}</ErrorText>;

  return (
    <Layout>
      <Content>
        <Header>
          <Title>📋 {hospitalName} 리뷰 목록</Title>
        </Header>
        <Divider />

        {reviews.length === 0 ? (
          <EmptyMessage>아직 등록된 리뷰가 없습니다.</EmptyMessage>
        ) : (
          reviews.map((r: HospitalReviewResponse) => (
            <CardWrapper key={r.reviewId}>
              <HospitalReviewCard review={r} onReport={handleReport} />
            </CardWrapper>
          ))
        )}

        {pagination.totalPages > 1 && (
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
      </Content>
    </Layout>
  );
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

const EmptyMessage = styled.p`
  text-align: center;
  color: #6b7280;
  margin-top: 2rem;
`;

const ErrorText = styled.div`
  color: red;
  text-align: center;
`;

const CardWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const Centered = styled.div`
  text-align: center;
  padding: 2rem;
`;
