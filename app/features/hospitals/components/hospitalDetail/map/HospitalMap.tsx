import React from 'react';
import styled from 'styled-components';
import { useHospitalDetail } from '../../../hooks/useHospitalDetail';
import KakaoMap from '~/features/hospitals/components/hospitalDetail/map/KakaoMap';
import type { HospitalSchedule } from '~/features/hospitals/types/hospitalSchedule';

const TabContent = styled.div`
  padding-top: 0.5rem;
`;

const MapContainer = styled.div`
  margin-top: 2rem;
`;

const ScheduleSection = styled.div`
  margin-top: 2rem;
`;

const SectionLabel = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const ScheduleList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const ScheduleItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const DayLabel = styled.span`
  color: #374151;
  font-weight: 500;
`;

const TimeLabel = styled.span`
  color: #6b7280;
`;

interface HospitalMapProps {
  hospitalId: number;
}

const dayKorMap: Record<string, string> = {
  MONDAY: '월요일',
  TUESDAY: '화요일',
  WEDNESDAY: '수요일',
  THURSDAY: '목요일',
  FRIDAY: '금요일',
  SATURDAY: '토요일',
  SUNDAY: '일요일',
};

const dayOrder: Array<keyof typeof dayKorMap> = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

const HospitalMap: React.FC<HospitalMapProps> = ({ hospitalId }) => {
  const { data: hospital, loading, error } = useHospitalDetail(hospitalId);

  if (loading) return <p style={{ textAlign: 'center' }}>로딩 중...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{String(error)}</p>;
  if (!hospital) return <p style={{ textAlign: 'center' }}>병원 정보를 찾을 수 없습니다.</p>;

  const { latitude: lat, longitude: lon, schedules = [] } = hospital;

  // 시간 포맷 헬퍼
  const fmt = (t: string) => t.slice(0, 5);

  return (
    <TabContent>
      <ScheduleSection>
        <SectionLabel>📋 진료시간</SectionLabel>
        <ScheduleList>
          {dayOrder.map((dayKey) => {
            const sch = schedules.find((s: HospitalSchedule) => s.dayOfWeek === dayKey);
            const korDay = dayKorMap[dayKey];
            if (!sch) {
              return (
                <ScheduleItem key={dayKey}>
                  <DayLabel>{korDay}</DayLabel>
                  <TimeLabel>정보 없음</TimeLabel>
                </ScheduleItem>
              );
            }
            const open = fmt(sch.openTime);
            const close = fmt(sch.closeTime);
            const lunchStart = sch.lunchStart?.slice(0, 5);
            const lunchEnd = sch.lunchEnd?.slice(0, 5);

            return (
              <ScheduleItem key={sch.hospitalScheduleId}>
                <DayLabel>{korDay}</DayLabel>
                <TimeLabel>
                  {open} – {close}
                  {lunchStart && lunchEnd && (
                    <>
                      {' '}
                      (점심 {lunchStart}–{lunchEnd})
                    </>
                  )}
                </TimeLabel>
              </ScheduleItem>
            );
          })}
        </ScheduleList>
      </ScheduleSection>

      <MapContainer>
        {lat != null && lon != null ? (
          <KakaoMap lat={lat} lng={lon} />
        ) : (
          <p style={{ color: '#9ca3af' }}>지도 정보를 찾을 수 없습니다.</p>
        )}
      </MapContainer>
    </TabContent>
  );
};

export default HospitalMap;
