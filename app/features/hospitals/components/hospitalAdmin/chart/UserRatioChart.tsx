import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useUserRoleRatio } from '~/features/hospitals/hooks/hospitalAdmin/useUserRoleRatio';

const COLORS = ['#4e73df', '#1cc88a', '#f6c23e'];

const UserRatioChart = () => {
  const { data, loading } = useUserRoleRatio();

  if (loading) return <p>🔄 사용자 비율을 불러오는 중입니다...</p>;
  if (!data) return <p>데이터가 없습니다.</p>;

  const chartData = [
    { name: '환자', value: data.patient },
    { name: '보호자', value: data.guardian },
    { name: '의사', value: data.doctor },
  ];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h2 className="text-lg font-bold mb-3">회원 역할 비율</h2>
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
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value}명`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserRatioChart;
