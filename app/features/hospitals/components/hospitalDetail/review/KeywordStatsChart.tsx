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
  Cell,
} from 'recharts';
import type { Review } from '../../../types/review';

const Card = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  height: 400px;
  margin-top: 2rem;
  padding: 1rem;
  background: white;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const ChartWrapper = styled.div`
  flex: 1;
  height: 100%;
`;

const COLORS = [
  '#3b82f6',
  '#60a5fa',
  '#93c5fd',
  '#bfdbfe',
  '#dbeafe',
  '#2563eb',
  '#1e40af',
  '#1e3a8a',
  '#1e40af',
  '#3b82f6',
];

interface KeywordStat {
  keyword: string;
  weightSum: number;
}

const keywordWeightMap: Record<string, number> = {
  // ... (기존 keywordWeightMap 동일하게 유지)
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

function calculateKeywordStats(reviews: Review[]): KeywordStat[] {
  const statsMap: Record<string, number> = {};

  reviews.forEach(({ keywords }) => {
    keywords.forEach((kw) => {
      const weight = keywordWeightMap[kw] ?? 1;
      statsMap[kw] = (statsMap[kw] || 0) + weight;
    });
  });

  return Object.entries(statsMap)
    .map(([keyword, weightSum]) => ({ keyword, weightSum }))
    .sort((a, b) => b.weightSum - a.weightSum);
}

interface KeywordStatsChartProps {
  reviews: Review[];
}

const KeywordStatsChart: React.FC<KeywordStatsChartProps> = ({ reviews }) => {
  const data = calculateKeywordStats(reviews);

  if (data.length === 0) return <p>통계 낼 리뷰 키워드가 없습니다.</p>;

  return (
    <Card>
      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="weightSum"
              nameKey="keyword"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label={({ keyword }) => keyword}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="keyword"
              type="category"
              interval={0}
              width={150}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Bar dataKey="weightSum" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </Card>
  );
};

export default KeywordStatsChart;
