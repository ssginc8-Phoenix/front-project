import React from 'react';
import styled from 'styled-components';
import { useDoctor } from '../../../hooks/useDoctor';
import type { Doctor, Specialization } from '../../../types/doctor.d';
import { SpecializationKoreanMap } from '../../../types/doctor.d';

const SectionTitle = styled.h3`
  margin-top: 2rem;
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
`;

const TabContent = styled.div`
  padding-top: 0.5rem;
`;

interface HospitalDoctorProps {
  hospitalId: number;
}

const HospitalDoctor: React.FC<HospitalDoctorProps> = ({ hospitalId }) => {
  const { data, loading, error } = useDoctor(hospitalId);

  if (loading) return <TabContent>로딩 중...</TabContent>;
  if (error) return <TabContent>오류 발생: {error}</TabContent>;

  // data?.content가 null인 경우 빈 배열로 초기화
  const doctorsList: Doctor[] = data?.content ?? [];

  return (
    <TabContent>
      <SectionTitle>의사 정보</SectionTitle>
      {doctorsList.length === 0 ? (
        <p>등록된 의사가 없습니다.</p>
      ) : (
        <ul>
          {doctorsList.map((doctor) => (
            <li key={doctor.doctorId} style={{ marginBottom: '1rem' }}>
              👨‍⚕️ <strong>{doctor.username}</strong> (
              {SpecializationKoreanMap[doctor.specialization as Specialization]})
            </li>
          ))}
        </ul>
      )}
    </TabContent>
  );
};

export default HospitalDoctor;
