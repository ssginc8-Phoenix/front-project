import React from 'react';
import styled from 'styled-components';
import { useDoctor } from '../../../hooks/useDoctor';
import type { Doctor } from '../../../types/doctor.d';

const TabContent = styled.div`
  padding-top: 0.5rem;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DoctorCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f3f4f6;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const LeftInfo = styled.div`
  display: flex;
  align-items: center;
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
  flex-direction: column;
  margin-left: 1rem;
`;

const NameSpec = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Name = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;

const Specialization = styled.span`
  font-size: 0.875rem;
  color: #4b5563;
`;

const Capacity = styled.span`
  background-color: #eef2ff;
  color: #4338ca;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
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
              <LeftInfo>
                <ProfileImage src={doctor.imageUrl || '/default-avatar.png'} alt={doctor.name} />
                <Info>
                  <NameSpec>
                    <Name>{doctor.name}</Name>
                    <Specialization>{doctor.specialization}</Specialization>
                  </NameSpec>
                </Info>
              </LeftInfo>
              <Capacity>대기 {doctor.capacityPerHalfHour}명</Capacity>
            </DoctorCard>
          ))}
        </List>
      )}
    </TabContent>
  );
};

export default HospitalDoctor;
