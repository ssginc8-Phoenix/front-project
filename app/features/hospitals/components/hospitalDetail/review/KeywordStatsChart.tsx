import React, { useEffect } from 'react';
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
import { BAD_OPTIONS, GOOD_OPTIONS } from '~/features/reviews/constants/keywordOptions';

// 카드 컨테이너: 타이틀 + 두 차트 가로 배치
const Card = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 2rem;
  margin-top: 2rem;
`;

// 타이틀: 두 열(span) 가로로 걸침
const Title = styled.h3`
  grid-column: 1 / -1;
  margin: 0;
  font-size: 1.75rem;
  color: #222;
  text-align: center;
`;

const ChartWrapper = styled.div`
  background: #f3f4f6;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 350px;
`;

// 색 정의
const GOOD_COLOR = '#ECF2FE';
const BAD_COLOR = '#F1A89E';
const NEUTRAL_COLOR = '#9ca3af';

// 옵션 맵 생성 (value → label)
import type { KeywordOption } from '~/features/reviews/constants/keywordOptions';
const ALL_OPTIONS: KeywordOption[] = [...GOOD_OPTIONS, ...BAD_OPTIONS];
const OPTION_MAP = new Map<string, KeywordOption>(ALL_OPTIONS.map((o) => [o.value, o]));

// GOOD/BAD 값 집합
const GOOD_VALUES = new Set<string>(GOOD_OPTIONS.map((o) => o.value));
const BAD_VALUES = new Set<string>(BAD_OPTIONS.map((o) => o.value));

interface KeywordStat {
  keyword: KeywordType;
  label: string;
  count: number;
}

function calculateKeywordStats(reviews: Review[], limit: number): KeywordStat[] {
  const countMap = new Map<KeywordType, number>();
  reviews.forEach(({ keywords }) =>
    keywords.forEach((kw) => countMap.set(kw, (countMap.get(kw) || 0) + 1)),
  );

  return Array.from(countMap.entries())
    .map(([keyword, count]) => ({
      keyword,
      label: OPTION_MAP.get(keyword)?.label ?? String(keyword),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

interface Props {
  reviews: Review[];
  topN?: number;
}

const KeywordStatsChart: React.FC<Props> = ({ reviews, topN = 8 }) => {
  useEffect(() => {
    console.log('reviews:', reviews);
    console.log('keyword stats:', calculateKeywordStats(reviews, topN));
  }, [reviews, topN]);

  const data = calculateKeywordStats(reviews, topN);
  if (!data.length) return <p>키워드가 없습니다.</p>;

  // x축 5단위 눈금
  const counts = data.map((d) => d.count);
  const maxCount = Math.max(...counts);
  const tickMax = Math.ceil(maxCount / 5) * 5;
  const ticks = Array.from({ length: tickMax / 5 + 1 }, (_, i) => i * 5);

  return (
    <Card>
      <Title>키워드 통계 (Top {topN})</Title>

      {/* Pie Chart */}
      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              cornerRadius={4}
              labelLine={false}
              label={({ percent, payload }) => `${payload.label} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((entry, i) => {
                const color = GOOD_VALUES.has(entry.keyword)
                  ? GOOD_COLOR
                  : BAD_VALUES.has(entry.keyword)
                    ? BAD_COLOR
                    : NEUTRAL_COLOR;
                return <Cell key={i} fill={color} />;
              })}
            </Pie>
            <Tooltip formatter={(val) => [val, '개수']} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Bar Chart */}
      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              domain={[0, tickMax]}
              ticks={ticks}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              dataKey="label"
              type="category"
              width={140}
              tickLine={false}
              tick={{ fontSize: 14 }}
            />
            <Tooltip formatter={(val) => [val, '개수']} />
            <Bar dataKey="count" radius={[4, 4, 4, 4]} barSize={14}>
              {data.map((entry, i) => {
                const color = GOOD_VALUES.has(entry.keyword)
                  ? GOOD_COLOR
                  : BAD_VALUES.has(entry.keyword)
                    ? BAD_COLOR
                    : NEUTRAL_COLOR;
                return <Cell key={i} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </Card>
  );
};

export default KeywordStatsChart;
