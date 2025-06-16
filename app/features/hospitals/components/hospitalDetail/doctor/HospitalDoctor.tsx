import React from 'react';
import styled from 'styled-components';
import { useDoctor } from '../../../hooks/useDoctor';
import type { Doctor, Specialization } from '../../../types/doctor.d';
import { SpecializationKoreanMap } from '../../../types/doctor.d';

// Grid layout for cards
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  padding: 1rem 0;
`;

// Individual card styling
const DoctorCard = styled.div`
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
  padding: 1rem;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

// Profile image at top
const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.75rem;
`;

// Name and specialization
const DoctorName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0.25rem 0;
`;

const DoctorSpec = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const TabContent = styled.div`
  padding-top: 0.5rem;
`;

interface HospitalDoctorProps {
  hospitalId: number;
}

const HospitalDoctor: React.FC<HospitalDoctorProps> = ({ hospitalId }) => {
  const { data, loading, error } = useDoctor(hospitalId);
  const doctorsList: Doctor[] = data ?? [];

  if (loading) return <TabContent>로딩 중...</TabContent>;
  if (error) return <TabContent>오류 발생: {String(error)}</TabContent>;

  return (
    <TabContent>
      {doctorsList.length === 0 ? (
        <p>등록된 의사가 없습니다.</p>
      ) : (
        <CardGrid>
          {doctorsList.map((doctor) => (
            <DoctorCard key={doctor.doctorId}>
              <ProfileImage
                src={
                  // 프로필 이미지 URL이 있을 경우 사용, 없으면 기본 아바타
                  doctor.imageUrl || '/default-avatar.png'
                }
                alt={doctor.name}
              />
              <DoctorName>{doctor.name}</DoctorName>
              <DoctorSpec>
                {SpecializationKoreanMap[doctor.specialization as Specialization]}
              </DoctorSpec>
            </DoctorCard>
          ))}
        </CardGrid>
      )}
    </TabContent>
  );
};

export default HospitalDoctor;
