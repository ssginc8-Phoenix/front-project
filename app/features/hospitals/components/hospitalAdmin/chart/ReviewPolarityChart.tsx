import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useReviews } from '~/features/hospitals/hooks/hospitalAdmin/useReviews';
import type { KeywordType, KeywordTypeInfo } from '~/features/hospitals/types/review';

interface Props {
  hospitalId: number;
}

const COLORS = {
  POSITIVE: '#4caf50',
  NEGATIVE: '#f44336',
};

// 간단한 키워드 맵 (전체는 별도 파일로 분리하는 것을 권장)
export const KeywordTypeMap: Record<KeywordType, KeywordTypeInfo> = {
  THOROUGH: {
    label: '진료가 꼼꼼해요',
    category: 'MEDICAL_SERVICE',
    polarity: 'POSITIVE',
    weight: 5,
  },
  FRIENDLY_DOCTOR: {
    label: '의사가 친절해요',
    category: 'MEDICAL_SERVICE',
    polarity: 'POSITIVE',
    weight: 5,
  },
  FAST: { label: '진료가 빨라요', category: 'MEDICAL_SERVICE', polarity: 'POSITIVE', weight: 3 },
  SHORT_WAIT: {
    label: '대기 시간이 짧아요',
    category: 'MEDICAL_SERVICE',
    polarity: 'POSITIVE',
    weight: 4,
  },
  PROFESSIONAL: {
    label: '전문성이 느껴져요',
    category: 'MEDICAL_SERVICE',
    polarity: 'POSITIVE',
    weight: 5,
  },
  SENIOR_FRIENDLY: {
    label: '노인 환자에게 배려가 있어요',
    category: 'MEDICAL_SERVICE',
    polarity: 'POSITIVE',
    weight: 4,
  },

  CLEAN_HOSPITAL: {
    label: '위생이 청결해요',
    category: 'FACILITY_ENV',
    polarity: 'POSITIVE',
    weight: 5,
  },
  NICE_FACILITY: {
    label: '시설이 좋아요',
    category: 'FACILITY_ENV',
    polarity: 'POSITIVE',
    weight: 3,
  },
  EASY_PARKING: {
    label: '주차가 편해요',
    category: 'FACILITY_ENV',
    polarity: 'POSITIVE',
    weight: 4,
  },
  GOOD_LOCATION: {
    label: '위치가 좋아요',
    category: 'FACILITY_ENV',
    polarity: 'POSITIVE',
    weight: 3,
  },
  COMFORTABLE_ATMOS: {
    label: '분위기가 편안해요',
    category: 'FACILITY_ENV',
    polarity: 'POSITIVE',
    weight: 4,
  },

  FAIR_PRICE: {
    label: '진료비가 합리적이에요',
    category: 'COST_ADMIN',
    polarity: 'POSITIVE',
    weight: 5,
  },
  EASY_INSURANCE: {
    label: '보험 처리가 편해요',
    category: 'COST_ADMIN',
    polarity: 'POSITIVE',
    weight: 4,
  },
  FAST_RESULTS: {
    label: '검사 결과가 빨리 나와요',
    category: 'COST_ADMIN',
    polarity: 'POSITIVE',
    weight: 4,
  },
  ENOUGH_CONSULT: {
    label: '상담 시간이 충분해요',
    category: 'COST_ADMIN',
    polarity: 'POSITIVE',
    weight: 5,
  },
  WANT_RETURN: {
    label: '재방문하고 싶어요',
    category: 'COST_ADMIN',
    polarity: 'POSITIVE',
    weight: 5,
  },
  FAST_PAYMENT: {
    label: '수납이 빠르고 편해요',
    category: 'COST_ADMIN',
    polarity: 'POSITIVE',
    weight: 3,
  },

  UNFRIENDLY_EXAM: {
    label: '진료가 불친절해요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
    weight: 5,
  },
  LACK_EXPLANATION: {
    label: '설명이 부족해요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
    weight: 5,
  },
  POOR_COMMUNICATION: {
    label: '환자 말을 잘 안 들어줘요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
    weight: 5,
  },
  NO_EFFECT_TREAT: {
    label: '치료 효과가 없었어요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
    weight: 5,
  },
  LONG_WAIT: {
    label: '대기 시간이 너무 길어요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
    weight: 4,
  },
  WAIT_AFTER_BOOK: {
    label: '예약해도 오래 기다렸어요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
    weight: 4,
  },
  LACK_GUIDE: {
    label: '안내가 부족했어요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
    weight: 3,
  },
  COMPLEX_PAYMENT: {
    label: '접수/수납 과정이 복잡해요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
    weight: 4,
  },

  DIRTY_HOSPITAL: {
    label: '병원이 지저분해요',
    category: 'FACILITY_ENV',
    polarity: 'NEGATIVE',
    weight: 5,
  },
  WORRY_CLEAN: {
    label: '소독/청결이 걱정돼요',
    category: 'FACILITY_ENV',
    polarity: 'NEGATIVE',
    weight: 5,
  },
  TIGHT_WAIT_AREA: {
    label: '대기실이 좁고 불편해요',
    category: 'FACILITY_ENV',
    polarity: 'NEGATIVE',
    weight: 4,
  },
  NO_PARKING_SPACE: {
    label: '주차 공간이 부족해요',
    category: 'FACILITY_ENV',
    polarity: 'NEGATIVE',
    weight: 3,
  },
  CONFUSING_SIGNAGE: {
    label: '안내 표지가 헷갈려요',
    category: 'FACILITY_ENV',
    polarity: 'NEGATIVE',
    weight: 3,
  },
  NO_WHEELCHAIR_ACCESS: {
    label: '휠체어 접근이 어려워요',
    category: 'FACILITY_ENV',
    polarity: 'NEGATIVE',
    weight: 4,
  },
  NO_GUARDIAN_SPACE: {
    label: '보호자 공간이 부족해요',
    category: 'FACILITY_ENV',
    polarity: 'NEGATIVE',
    weight: 3,
  },

  EXPENSIVE: {
    label: '진료비가 너무 비싸요',
    category: 'COST_ADMIN',
    polarity: 'NEGATIVE',
    weight: 5,
  },
  PUSH_UNNECESSARY: {
    label: '불필요한 시술을 권유해요',
    category: 'COST_ADMIN',
    polarity: 'NEGATIVE',
    weight: 5,
  },
  LACK_FEE_EXPLAN: {
    label: '비용 설명이 부족해요',
    category: 'COST_ADMIN',
    polarity: 'NEGATIVE',
    weight: 4,
  },
  INSURANCE_BUREAUCRACY: {
    label: '보험 처리가 번거로워요',
    category: 'COST_ADMIN',
    polarity: 'NEGATIVE',
    weight: 4,
  },
  LATE_RECEIPT: {
    label: '영수증/서류 처리 지연',
    category: 'COST_ADMIN',
    polarity: 'NEGATIVE',
    weight: 3,
  },
};

const ReviewPolarityChart: React.FC<Props> = ({ hospitalId }) => {
  const { data: reviews, loading } = useReviews(hospitalId);

  const keywordList = (reviews ?? []).flatMap((r) => r.keywords);

  const polarityGroups = keywordList.reduce(
    (acc, keyword) => {
      const meta = KeywordTypeMap[keyword as KeywordType];
      if (!meta) return acc;

      if (meta.polarity === 'POSITIVE') acc.positive.push(meta.label);
      else if (meta.polarity === 'NEGATIVE') acc.negative.push(meta.label);
      return acc;
    },
    { positive: [] as string[], negative: [] as string[] },
  );

  const chartData = [
    { name: '긍정', value: polarityGroups.positive.length },
    { name: '부정', value: polarityGroups.negative.length },
  ].filter((d) => d.value > 0);
  // 키워드 수
  const total = polarityGroups.positive.length + polarityGroups.negative.length;
  const positivePercent = total ? Math.round((polarityGroups.positive.length / total) * 100) : 0;
  const negativePercent = total ? Math.round((polarityGroups.negative.length / total) * 100) : 0;

  return (
    <div className="w-full flex gap-6" style={{ minHeight: 300 }}>
      {/* 차트 영역 */}
      <div
        style={{
          flex: 1,
          height: 300,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {loading ? (
          <p>🔄 감정 데이터를 불러오는 중...</p>
        ) : chartData.length === 0 ? (
          <p>리뷰 키워드가 아직 없습니다.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name === '긍정' ? 'POSITIVE' : 'NEGATIVE']}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value}건`} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 키워드 목록 영역 (같은 열에 정렬) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        {/* 긍정 키워드 */}
        <div style={{ flex: 1 }}>
          <h3 className="font-semibold text-green-700 mb-1">
            ✅ 긍정 키워드{' '}
            <span className="text-sm text-gray-500">({polarityGroups.positive.length}개)</span>
          </h3>
          {polarityGroups.positive.length ? (
            polarityGroups.positive.map((label, i) => (
              <p key={i}>
                • {label}{' '}
                <span className="text-sm text-gray-500">
                  ({Math.round((1 / polarityGroups.positive.length) * 100)}
                  %)
                </span>
              </p>
            ))
          ) : (
            <p className="text-gray-500">없음</p>
          )}
        </div>

        {/* 부정 키워드 */}
        <div style={{ flex: 1 }}>
          <h3 className="font-semibold text-red-600 mb-1">
            ⚠️ 부정 키워드{' '}
            <span className="text-sm text-gray-500">({polarityGroups.negative.length}개)</span>
          </h3>
          {polarityGroups.negative.length ? (
            polarityGroups.negative.map((label, i) => (
              <p key={i}>
                • {label}{' '}
                <span className="text-sm text-gray-500">
                  ({Math.round((1 / polarityGroups.negative.length) * 100)}
                  %)
                </span>
              </p>
            ))
          ) : (
            <p className="text-gray-500">없음</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPolarityChart;
