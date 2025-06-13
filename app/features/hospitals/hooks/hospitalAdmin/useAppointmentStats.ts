import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

export interface AppointmentStat {
  date: string; // 포맷된 날짜 (예: "06/12")
  count: number; // 해당 날짜의 예약 수
}

/**
 * 진료 건수 통계를 가져오는 커스텀 훅
 * @param start - 시작일 (예: "2025-06-06")
 * @param end - 종료일 (예: "2025-06-12")
 */
export function useAppointmentStats(start: string, end: string) {
  const [data, setData] = useState<AppointmentStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('📡 Fetching appointment stats:', { start, end });

        const response = await axios.get('/api/v1/appointments/daily-count', {
          params: { start, end },
        });

        const transformed: AppointmentStat[] = response.data.map((item: any) => ({
          date: dayjs(item.date).format('MM/DD'), // "2025-06-12T00:00:00" → "06/12"
          count: item.count,
        }));

        console.log('✅ Received appointment stats:', transformed);
        setData(transformed);
      } catch (error) {
        console.error('❌ Failed to fetch appointment stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [start, end]);

  return { data, loading };
}
