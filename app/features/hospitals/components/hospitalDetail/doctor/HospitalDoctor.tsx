import React from 'react';
import styled from 'styled-components';
import { useDoctor } from '../../../hooks/useDoctor';
import type { Doctor } from '../../../types/doctor.d';

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
`;

const DoctorCard = styled.div`
  display: flex;
  align-items: center;
  background: #f3f4f6; /* 전체 배경 */
  border-radius: 0.75rem;
  padding: 1rem;
`;

const ProfileImage = styled.img`
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  flex: 1;
`;

const Name = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
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
  const doctorsList: Doctor[] = data ?? [];

  if (loading) return <TabContent>로딩 중...</TabContent>;
  if (error) return <TabContent>오류 발생: {String(error)}</TabContent>;

  return (
    <TabContent>
      {doctorsList.length === 0 ? (
        <p>등록된 의사가 없습니다.</p>
      ) : (
        <List>
          {doctorsList.map((doctor) => (
            <DoctorCard key={doctor.doctorId}>
              <ProfileImage src={doctor.imageUrl || '/default-avatar.png'} alt={doctor.name} />
              <Info>
                <Name>{doctor.name}</Name>
              </Info>
            </DoctorCard>
          ))}
        </List>
      )}
    </TabContent>
  );
};

export default HospitalDoctor;
