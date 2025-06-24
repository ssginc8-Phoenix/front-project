import React, { useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useReviews } from '~/features/hospitals/hooks/hospitalAdmin/useReviews';
import type { KeywordType } from '~/features/hospitals/types/review';

interface Props {
  hospitalId: number;
}

const COLORS = {
  POSITIVE: '#4caf50',
  NEGATIVE: '#f44336',
};

// 키워드 메타 정보
export const KeywordTypeMap: Record<
  KeywordType,
  { label: string; category: string; polarity: 'POSITIVE' | 'NEGATIVE' }
> = {
  THOROUGH: { label: '진료가 꼼꼼해요', category: 'MEDICAL_SERVICE', polarity: 'POSITIVE' },
  FRIENDLY_DOCTOR: { label: '의사가 친절해요', category: 'MEDICAL_SERVICE', polarity: 'POSITIVE' },
  FAST: { label: '진료가 빨라요', category: 'MEDICAL_SERVICE', polarity: 'POSITIVE' },
  SHORT_WAIT: { label: '대기 시간이 짧아요', category: 'MEDICAL_SERVICE', polarity: 'POSITIVE' },
  PROFESSIONAL: { label: '전문성이 느껴져요', category: 'MEDICAL_SERVICE', polarity: 'POSITIVE' },
  SENIOR_FRIENDLY: {
    label: '노인 환자에게 배려가 있어요',
    category: 'MEDICAL_SERVICE',
    polarity: 'POSITIVE',
  },

  CLEAN_HOSPITAL: { label: '위생이 청결해요', category: 'FACILITY_ENV', polarity: 'POSITIVE' },
  NICE_FACILITY: { label: '시설이 좋아요', category: 'FACILITY_ENV', polarity: 'POSITIVE' },
  EASY_PARKING: { label: '주차가 편해요', category: 'FACILITY_ENV', polarity: 'POSITIVE' },
  GOOD_LOCATION: { label: '위치가 좋아요', category: 'FACILITY_ENV', polarity: 'POSITIVE' },
  COMFORTABLE_ATMOS: { label: '분위기가 편안해요', category: 'FACILITY_ENV', polarity: 'POSITIVE' },

  FAIR_PRICE: { label: '진료비가 합리적이에요', category: 'COST_ADMIN', polarity: 'POSITIVE' },
  EASY_INSURANCE: { label: '보험 처리가 편해요', category: 'COST_ADMIN', polarity: 'POSITIVE' },
  FAST_RESULTS: { label: '검사 결과가 빨리 나와요', category: 'COST_ADMIN', polarity: 'POSITIVE' },
  ENOUGH_CONSULT: { label: '상담 시간이 충분해요', category: 'COST_ADMIN', polarity: 'POSITIVE' },
  WANT_RETURN: { label: '재방문하고 싶어요', category: 'COST_ADMIN', polarity: 'POSITIVE' },
  FAST_PAYMENT: { label: '수납이 빠르고 편해요', category: 'COST_ADMIN', polarity: 'POSITIVE' },

  UNFRIENDLY_EXAM: {
    label: '진료가 불친절해요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
  },
  LACK_EXPLANATION: { label: '설명이 부족해요', category: 'MEDICAL_SERVICE', polarity: 'NEGATIVE' },
  POOR_COMMUNICATION: {
    label: '환자 말을 잘 안 들어줘요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
  },
  NO_EFFECT_TREAT: {
    label: '치료 효과가 없었어요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
  },
  LONG_WAIT: {
    label: '대기 시간이 너무 길어요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
  },
  WAIT_AFTER_BOOK: {
    label: '예약해도 오래 기다렸어요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
  },
  LACK_GUIDE: { label: '안내가 부족했어요', category: 'MEDICAL_SERVICE', polarity: 'NEGATIVE' },
  COMPLEX_PAYMENT: {
    label: '접수/수납 과정이 복잡해요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
  },

  DIRTY_HOSPITAL: { label: '병원이 지저분해요', category: 'FACILITY_ENV', polarity: 'NEGATIVE' },
  WORRY_CLEAN: { label: '소독/청결이 걱정돼요', category: 'FACILITY_ENV', polarity: 'NEGATIVE' },
  TIGHT_WAIT_AREA: {
    label: '대기실이 좁고 불편해요',
    category: 'FACILITY_ENV',
    polarity: 'NEGATIVE',
  },
  NO_PARKING_SPACE: {
    label: '주차 공간이 부족해요',
    category: 'FACILITY_ENV',
    polarity: 'NEGATIVE',
  },
  CONFUSING_SIGNAGE: {
    label: '안내 표지가 헷갈려요',
    category: 'FACILITY_ENV',
    polarity: 'NEGATIVE',
  },
  NO_WHEELCHAIR_ACCESS: {
    label: '휠체어 접근이 어려워요',
    category: 'FACILITY_ENV',
    polarity: 'NEGATIVE',
  },
  NO_GUARDIAN_SPACE: {
    label: '보호자 공간이 부족해요',
    category: 'FACILITY_ENV',
    polarity: 'NEGATIVE',
  },

  EXPENSIVE: { label: '진료비가 너무 비싸요', category: 'COST_ADMIN', polarity: 'NEGATIVE' },
  PUSH_UNNECESSARY: {
    label: '불필요한 시술을 권유해요',
    category: 'COST_ADMIN',
    polarity: 'NEGATIVE',
  },
  LACK_FEE_EXPLAN: { label: '비용 설명이 부족해요', category: 'COST_ADMIN', polarity: 'NEGATIVE' },
  INSURANCE_BUREAUCRACY: {
    label: '보험 처리가 번거로워요',
    category: 'COST_ADMIN',
    polarity: 'NEGATIVE',
  },
  LATE_RECEIPT: { label: '영수증/서류 처리 지연', category: 'COST_ADMIN', polarity: 'NEGATIVE' },
};

const ReviewPolarityChart: React.FC<Props> = ({ hospitalId }) => {
  const { data: reviewsRaw, loading } = useReviews(hospitalId);
  // reviewsRaw가 null일 수도 있으므로 빈 배열을 기본으로
  const reviews = reviewsRaw ?? [];

  // 모든 훅과 연산은 최상위에서
  const allKeywords: KeywordType[] = reviews.flatMap((r) => r.keywords as KeywordType[]);
  const keywordCounts = allKeywords.reduce<Record<KeywordType, number>>(
    (acc, kw) => {
      acc[kw] = (acc[kw] || 0) + 1;
      return acc;
    },
    {} as Record<KeywordType, number>,
  );

  useEffect(() => {
    if (!loading && reviews.length > 0) {
      console.table(keywordCounts);
      console.log('🔍 원본 리뷰 데이터:', reviews);
    }
  }, [loading, reviews.length, keywordCounts]);

  if (loading) {
    return <p>🔄 리뷰 데이터를 불러오는 중...</p>;
  }
  if (reviews.length === 0) {
    return <p>리뷰가 아직 없습니다.</p>;
  }

  const counts = reviews.reduce(
    (acc, review) => {
      const pos = review.keywords.filter((kw) => KeywordTypeMap[kw].polarity === 'POSITIVE').length;
      const neg = review.keywords.filter((kw) => KeywordTypeMap[kw].polarity === 'NEGATIVE').length;
      if (pos >= neg) acc.positive++;
      else acc.negative++;
      return acc;
    },
    { positive: 0, negative: 0 },
  );

  const totalReviews = counts.positive + counts.negative;
  const chartData = [
    { name: '긍정 리뷰', value: counts.positive },
    { name: '부정 리뷰', value: counts.negative },
  ].filter((d) => d.value > 0);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold">리뷰 감정 통계 ({totalReviews}건)</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={COLORS[entry.name === '긍정 리뷰' ? 'POSITIVE' : 'NEGATIVE']}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value}건`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReviewPolarityChart;
