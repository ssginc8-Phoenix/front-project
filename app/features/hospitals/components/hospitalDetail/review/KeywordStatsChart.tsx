// src/features/hospitals/components/hospitalDetail/review/KeywordStatsChart.tsx
import React from 'react';
import styled from 'styled-components';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
  Cell,
} from 'recharts';
import type { KeywordType, Review } from '~/features/hospitals/types/review';

const Card = styled.div`
  width: 94%;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
`;

const Title = styled.h3`
  grid-column: 1 / -1;
  margin: 0 0 1rem;
  font-size: 1.5rem;
  color: #222;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ChartWrapper = styled.div`
  background: #f3f4f6;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
`;

const COLORS = [
  '#2563eb',
  '#3b82f6',
  '#60a5fa',
  '#93c5fd',
  '#bfdbfe',
  '#10b981',
  '#34d399',
  '#6ee7b7',
  '#d1fae5',
  '#facc15',
];

const keywordLabelMap: Record<KeywordType, string> = {
  THOROUGH: '진료가 꼼꼼',
  FRIENDLY_DOCTOR: '친절한 의사',
  FAST: '진료가 빨라요',
  SHORT_WAIT: '대기 짧아요',
  PROFESSIONAL: '전문성 높아요',
  SENIOR_FRIENDLY: '노인 배려',
  CLEAN_HOSPITAL: '청결해요',
  NICE_FACILITY: '좋은 시설',
  EASY_PARKING: '주차 편해요',
  GOOD_LOCATION: '위치 좋음',
  COMFORTABLE_ATMOS: '분위기 편안',
  FAIR_PRICE: '합리적 비용',
  EASY_INSURANCE: '보험 편해요',
  FAST_RESULTS: '빠른 결과',
  ENOUGH_CONSULT: '충분한 상담',
  WANT_RETURN: '재방문 의향',
  FAST_PAYMENT: '빠른 수납',
  UNFRIENDLY_EXAM: '불친절해요',
  LACK_EXPLANATION: '설명 부족',
  POOR_COMMUNICATION: '소통 부족',
  NO_EFFECT_TREAT: '효과 없음',
  LONG_WAIT: '기다림 길어요',
  WAIT_AFTER_BOOK: '예약 후 대기',
  LACK_GUIDE: '안내 부족',
  COMPLEX_PAYMENT: '수납 복잡',
  DIRTY_HOSPITAL: '지저분해요',
  WORRY_CLEAN: '청결 걱정',
  TIGHT_WAIT_AREA: '대기실 좁아요',
  NO_PARKING_SPACE: '주차 부족',
  CONFUSING_SIGNAGE: '표지판 헷갈림',
  NO_WHEELCHAIR_ACCESS: '휠체어 불편',
  NO_GUARDIAN_SPACE: '보호자 공간 부족',
  EXPENSIVE: '비싸요',
  PUSH_UNNECESSARY: '과잉 권유',
  LACK_FEE_EXPLAN: '비용 설명 부족',
  INSURANCE_BUREAUCRACY: '보험 번거로워요',
  LATE_RECEIPT: '영수증 지연',
};

const keywordWeightMap: Record<KeywordType, number> = {
  THOROUGH: 5,
  FRIENDLY_DOCTOR: 5,
  FAST: 3,
  SHORT_WAIT: 4,
  PROFESSIONAL: 5,
  SENIOR_FRIENDLY: 4,
  CLEAN_HOSPITAL: 5,
  NICE_FACILITY: 3,
  EASY_PARKING: 4,
  GOOD_LOCATION: 3,
  COMFORTABLE_ATMOS: 4,
  FAIR_PRICE: 5,
  EASY_INSURANCE: 4,
  FAST_RESULTS: 4,
  ENOUGH_CONSULT: 5,
  WANT_RETURN: 5,
  FAST_PAYMENT: 3,
  UNFRIENDLY_EXAM: 5,
  LACK_EXPLANATION: 5,
  POOR_COMMUNICATION: 5,
  NO_EFFECT_TREAT: 5,
  LONG_WAIT: 4,
  WAIT_AFTER_BOOK: 4,
  LACK_GUIDE: 3,
  COMPLEX_PAYMENT: 4,
  DIRTY_HOSPITAL: 5,
  WORRY_CLEAN: 5,
  TIGHT_WAIT_AREA: 4,
  NO_PARKING_SPACE: 3,
  CONFUSING_SIGNAGE: 3,
  NO_WHEELCHAIR_ACCESS: 4,
  NO_GUARDIAN_SPACE: 3,
  EXPENSIVE: 5,
  PUSH_UNNECESSARY: 5,
  LACK_FEE_EXPLAN: 4,
  INSURANCE_BUREAUCRACY: 4,
  LATE_RECEIPT: 3,
};

interface KeywordStat {
  keyword: KeywordType;
  label: string;
  weightSum: number;
}

function calculateKeywordStats(reviews: Review[]): KeywordStat[] {
  const map = new Map<KeywordType, number>();
  reviews.forEach(({ keywords }) =>
    keywords.forEach((kw) => map.set(kw, (map.get(kw) || 0) + (keywordWeightMap[kw] || 1))),
  );

  return Array.from(map.entries())
    .map(([keyword, weightSum]) => ({ keyword, label: keywordLabelMap[keyword], weightSum }))
    .sort((a, b) => b.weightSum - a.weightSum)
    .slice(0, 8);
}

interface Props {
  reviews: Review[];
}

const KeywordStatsChart: React.FC<Props> = ({ reviews }) => {
  const data = calculateKeywordStats(reviews);
  if (!data.length) return <p>키워드가 없습니다.</p>;

  return (
    <Card>
      {/* Pie Chart */}
      <ChartWrapper>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="weightSum"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              cornerRadius={6}
              paddingAngle={2}
              label={({ payload }) => payload.label}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip formatter={(val) => [val, '합계']} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Bar Chart */}
      <ChartWrapper>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis dataKey="label" type="category" width={120} tickLine={false} />
            <Tooltip formatter={(val) => [val, '합계']} />
            <Bar dataKey="weightSum" radius={[4, 4, 4, 4]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </Card>
  );
};

export default KeywordStatsChart;
