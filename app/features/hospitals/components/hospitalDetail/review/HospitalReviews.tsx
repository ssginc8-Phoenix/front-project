import styled from 'styled-components';

import { useHospitalReviews } from '../../../hooks/useHospitalReviews';
import KeywordStatsChart from './KeywordStatsChart';

const SectionTitle = styled.h3`
  margin-top: 2rem;
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
`;

const KeywordTag = styled.span`
  display: inline-block;
  background-color: #3b82f6; // 파란 배경 (Tailwind의 blue-500)
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-right: 6px;
  margin-bottom: 6px;
  user-select: none;
`;

const TabContent = styled.div`
  padding-top: 0.5rem;
`;

interface HospitalReviewsProps {
  hospitalId: number;
}

const HospitalReviews = ({ hospitalId }: HospitalReviewsProps) => {
  const {
    reviews,
    page,
    totalPages,
    loading: reviewLoading,
    error: reviewError,
    setPage,
  } = useHospitalReviews(hospitalId, 0, 5); // Assuming 5 reviews per page

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const keywordLabelMap: Record<string, string> = {
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

  return (
    <TabContent>
      <SectionTitle>리뷰</SectionTitle>

      {reviewLoading && <p>리뷰 로딩 중...</p>}
      {reviewError && <p style={{ color: 'red' }}>{reviewError}</p>}

      {!reviewLoading && reviews.length === 0 && <p>등록된 리뷰가 없습니다.</p>}

      <ul>
        {reviews.map((review) => (
          <li key={review.reviewId} style={{ marginBottom: '1rem' }}>
            ({new Date(review.createdAt).toLocaleDateString()})
            <br />
            {review.contents}
            <br />
            <div style={{ marginTop: '0.5rem' }}>
              {review.keywords.map((kw: string) => (
                <KeywordTag key={kw}>{keywordLabelMap[kw] || kw}</KeywordTag>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <KeywordStatsChart reviews={reviews} />
      {/* 페이징 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={handlePrevPage} disabled={page === 0}>
          이전
        </button>
        <span>
          {page + 1} / {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={page >= totalPages - 1}>
          다음
        </button>
      </div>
    </TabContent>
  );
};

export default HospitalReviews;
