import styled from 'styled-components';

import { useDoctor } from '../../../hooks/useDoctor';
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

interface HospitalMapProps {
  hospitalId: number;
}

const HospitalDoctor = ({ hospitalId }: HospitalMapProps) => {
  const { data: doctorsList = [], loading, error } = useDoctor(hospitalId);

  if (loading) return <TabContent>로딩 중...</TabContent>;
  if (error) return <TabContent>오류 발생: {error}</TabContent>;

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
              {SpecializationKoreanMap[doctor.specialization]})
            </li>
          ))}
        </ul>
      )}
    </TabContent>
  );
};

export default HospitalDoctor;
