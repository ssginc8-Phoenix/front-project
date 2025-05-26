import styled from 'styled-components';
import PatientCard from '~/features/appointment/components/PatientCard';
import { useState } from 'react';
import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';

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
    id: 1,
    name: '홍길동',
    birth: '1980-01-01',
    imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 2,
    name: '김철수',
    birth: '1990-05-23',
    imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: 3,
    name: '이영희',
    birth: '1985-12-12',
    imageUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
];

const PatientSelector = () => {
  // const { data: patients, loading, error } = usePatientList();

  /* 디자인을 위해 더미데이터 넣은것들 나중에 여기 삭제하고 위에 주석 풀면됨 */
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
            key={patient.id}
            name={patient.name}
            birth={patient.birth}
            imageUrl={patient.imageUrl}
            isSelected={selectedId === patient.id}
            onSelect={() => setSelectedId(patient.id)}
          />
        ))}
      </CardList>
    </Wrapper>
  );
};

export default PatientSelector;
