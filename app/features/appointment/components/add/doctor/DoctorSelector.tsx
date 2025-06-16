import styled from 'styled-components';
import { useEffect } from 'react';
import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';
import DoctorCard from '~/features/appointment/components/add/doctor/DoctorCard';
import { useDoctorList } from '~/features/doctor/hooks/useDoctorList';
import useAppointmentStore from '~/features/appointment/state/useAppointmentStore';

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

interface DoctorSelectorProps {
  hospitalId: number;
}

const DoctorSelector = ({ hospitalId }: DoctorSelectorProps) => {
  const { data: doctors, loading, error } = useDoctorList(hospitalId);

  const { doctorId, setDoctorId, doctorName, setDoctorName } = useAppointmentStore();

  /* 디버깅용 코드 추후 삭제 예정 */
  useEffect(() => {}, [doctorId]);

  return (
    <Wrapper>
      <TitleBox>
        <Title>의사 선택</Title>
      </TitleBox>

      {loading && <LoadingIndicator />}
      {error && <ErrorMessage message={error} />}

      <CardList>
        {doctors?.map((doctor) => (
          <DoctorCard
            key={doctor.doctorId}
            username={doctor.name}
            specialization={doctor.specialization}
            imageUrl={doctor.imageUrl}
            isSelected={doctorId === doctor.doctorId}
            onSelect={() => {
              if (doctorId === doctor.doctorId) {
                setDoctorId(null);
                setDoctorName(null);
              } else {
                setDoctorId(doctor.doctorId);
                setDoctorName(doctor.name);
              }
            }}
          />
        ))}
      </CardList>
    </Wrapper>
  );
};

export default DoctorSelector;
