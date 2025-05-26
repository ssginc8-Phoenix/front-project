import styled from 'styled-components';
import { useState } from 'react';
import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';
import DoctorCard from '~/features/appointment/components/DoctorCard';
import { useDoctorList } from '~/features/doctor/hooks/useDoctorList';

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

const CardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

// 의사 더미 데이터
const dummyDoctors = [
  {
    id: 1,
    name: '홍길동',
    imageUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
  {
    id: 2,
    name: '김철수',
    imageUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
];

interface DoctorSelectorProps {
  hospitalId: number;
}

const DoctorSelector = ({ hospitalId }: DoctorSelectorProps) => {
  const { data: doctors, loading, error } = useDoctorList(hospitalId);

  /* 디자인을 위해 더미데이터 넣은것들 나중에 여기 삭제하고 위에 주석 풀면됨 */
  // const doctors = dummyDoctors;
  // const loading = false;
  // const error = null;

  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <Wrapper>
      <TitleBox>
        <Title>의사 선택</Title>
      </TitleBox>

      {loading && <LoadingIndicator />}
      {error && <ErrorMessage message={error} />}

      <CardList>
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            name={doctor.name}
            imageUrl={doctor.imageUrl}
            isSelected={selectedId === doctor.id}
            onSelect={() => setSelectedId(doctor.id)}
          />
        ))}
      </CardList>
    </Wrapper>
  );
};

export default DoctorSelector;
