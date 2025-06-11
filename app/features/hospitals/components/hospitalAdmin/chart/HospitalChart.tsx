import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

import { Card, CardContent } from '../ui/card';

const HospitalChart = () => {
  const visitData = [
    { day: '월', count: 80 },
    { day: '화', count: 100 },
    { day: '수', count: 75 },
    { day: '목', count: 95 },
    { day: '금', count: 85 },
  ];

  const ageRatioData = [
    { name: '70대', value: 70 },
    { name: '50대', value: 20 },
    { name: '20대', value: 10 },
  ];

  const keywordData = [
    { name: '긍정', value: 32 },
    { name: '중립', value: 50 },
    { name: '부정', value: 18 },
  ];

  const COLORS = ['#ff6384', '#d3d3d3', '#ffcd56'];

  return (
    <div className="p-4 grid grid-cols-2 gap-6">
      <Card className="col-span-2">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">요일별 방문자</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={visitData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6495ed" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">회원 비율</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ageRatioData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {ageRatioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">주요 키워드</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={keywordData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {keywordData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalChart;
