import styled from 'styled-components';
import PatientCard from '~/features/appointment/components/add/patient/PatientCard';
import { useState } from 'react';
import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';
import { usePatientList } from '~/features/patient/hooks/usePatientList';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TitleBox = styled.div`
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #00499e;
`;

const Description = styled.p`
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const CardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

// 환자 더미 데이터
const dummyPatients = [
  {
    patientId: 1,
    name: '홍길동',
    residentRegistrationNumber: '800101-1******',
    imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    patientId: 2,
    name: '김철수',
    residentRegistrationNumber: '900523-1******',
    imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    patientId: 3,
    name: '이영희',
    residentRegistrationNumber: '851212-2******',
    imageUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
];

const PatientSelector = () => {
  // const { data: patients, loading, error } = usePatientList();

  const patients = dummyPatients;
  const loading = false;
  const error = null;

  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <Wrapper>
      <TitleBox>
        <Title>진료대상 선택</Title>
        <Description>실제 진료받으실 환자를 선택해주세요.</Description>
      </TitleBox>

      {loading && <LoadingIndicator />}
      {error && <ErrorMessage message={error} />}

      <CardList>
        {patients.map((patient) => (
          <PatientCard
            key={patient.patientId}
            name={patient.name}
            residentRegistrationNumber={patient.residentRegistrationNumber}
            imageUrl={patient.imageUrl}
            isSelected={selectedId === patient.patientId}
            onSelect={() => setSelectedId(patient.patientId)}
          />
        ))}
      </CardList>
    </Wrapper>
  );
};

export default PatientSelector;
