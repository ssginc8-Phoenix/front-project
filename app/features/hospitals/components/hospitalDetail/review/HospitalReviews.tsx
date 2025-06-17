// src/features/hospitals/components/hospitalDetail/review/HospitalReviews.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useHospitalReviews } from '../../../hooks/useHospitalReviews';
import KeywordStatsChart from './KeywordStatsChart';
import Pagination from '~/components/common/Pagination';
import type { KeywordType } from '~/features/hospitals/types/review';

const TabContent = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
`;

const ReviewList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReviewCard = styled.li`
  padding: 1.25rem 1.5rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const ReviewMeta = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const ReviewContent = styled.p`
  font-size: 1rem;
  color: #1f2937;
  margin: 0 0 0.75rem;
  line-height: 1.5;
`;

const KeywordGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const KeywordTag = styled.span`
  background-color: #3b82f6;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
`;
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;
interface HospitalReviewsProps {
  hospitalId: number;
}

const keywordLabelMap: Record<KeywordType, string> = {
  THOROUGH: '진료가 꼼꼼해요',
  FRIENDLY_DOCTOR: '의사가 친절해요',
  FAST: '진료가 빨라요',
  SHORT_WAIT: '대기 시간이 짧아요',
  PROFESSIONAL: '전문성이 느껴져요',
  SENIOR_FRIENDLY: '노인 환자에게 배려가 있어요',
  CLEAN_HOSPITAL: '위생이 청결해요',
  NICE_FACILITY: '시설이 좋아요',
  EASY_PARKING: '주차가 편해요',
  GOOD_LOCATION: '위치가 좋아요',
  COMFORTABLE_ATMOS: '분위기가 편안해요',
  FAIR_PRICE: '진료비가 합리적이에요',
  EASY_INSURANCE: '보험 처리가 편해요',
  FAST_RESULTS: '검사 결과가 빨리 나와요',
  ENOUGH_CONSULT: '상담 시간이 충분해요',
  WANT_RETURN: '재방문하고 싶어요',
  FAST_PAYMENT: '수납이 빠르고 편해요',
  UNFRIENDLY_EXAM: '진료가 불친절해요',
  LACK_EXPLANATION: '설명이 부족해요',
  POOR_COMMUNICATION: '환자 말을 잘 안 들어줘요',
  NO_EFFECT_TREAT: '치료 효과가 없었어요',
  LONG_WAIT: '대기 시간이 너무 길어요',
  WAIT_AFTER_BOOK: '예약해도 오래 기다렸어요',
  LACK_GUIDE: '안내가 부족했어요',
  COMPLEX_PAYMENT: '접수/수납 과정이 복잡해요',
  DIRTY_HOSPITAL: '병원이 지저분해요',
  WORRY_CLEAN: '소독/청결이 걱정돼요',
  TIGHT_WAIT_AREA: '대기실이 좁고 불편해요',
  NO_PARKING_SPACE: '주차 공간이 부족해요',
  CONFUSING_SIGNAGE: '안내 표지가 헷갈려요',
  NO_WHEELCHAIR_ACCESS: '휠체어 접근이 어려워요',
  NO_GUARDIAN_SPACE: '보호자 공간이 부족해요',
  EXPENSIVE: '진료비가 너무 비싸요',
  PUSH_UNNECESSARY: '불필요한 시술을 권유해요',
  LACK_FEE_EXPLAN: '비용 설명이 부족해요',
  INSURANCE_BUREAUCRACY: '보험 처리가 번거로워요',
  LATE_RECEIPT: '영수증/서류 처리 지연',
};

const HospitalReviews: React.FC<HospitalReviewsProps> = ({ hospitalId }) => {
  const [page, setPage] = useState(0);
  const { reviews, totalPages, loading, error } = useHospitalReviews(hospitalId, page, 5);

  // 1) 키워드 통계 섹션
  //    - 로딩 끝, 데이터 있을 때만 렌더
  //    - 데이터 없으면 안내
  //    - 로딩 중엔 텍스트
  const renderStats = () => {
    if (loading) return <SectionTitle>키워드 통계 로딩...</SectionTitle>;
    if (reviews.length === 0) return <SectionTitle>키워드 통계 데이터가 없습니다</SectionTitle>;

    return (
      <>
        <SectionTitle>키워드 통계</SectionTitle>
        <KeywordStatsChart reviews={reviews} />
      </>
    );
  };

  return (
    <TabContent>
      {renderStats()}

      {/* 리뷰 로딩/오류 상태 */}
      {loading && <p>리뷰 로딩 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* 리뷰 목록 */}
      <ReviewList>
        {reviews.map((review) => (
          <ReviewCard key={review.reviewId}>
            <ReviewMeta>
              {new Date(review.createdAt).toLocaleDateString()} / {review.name || '익명'}
            </ReviewMeta>
            <ReviewContent>{review.contents}</ReviewContent>
            <KeywordGroup>
              {review.keywords.map((kw) => (
                <KeywordTag key={kw}>{keywordLabelMap[kw]}</KeywordTag>
              ))}
            </KeywordGroup>
          </ReviewCard>
        ))}
      </ReviewList>

      <PaginationWrapper>
        <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
      </PaginationWrapper>
    </TabContent>
  );
};

export default HospitalReviews;
