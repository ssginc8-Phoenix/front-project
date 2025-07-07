import styled from 'styled-components';
import { useEffect } from 'react';
import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';
import DoctorCard from '~/features/appointment/components/add/doctor/DoctorCard';
import { useDoctorList } from '~/features/doctor/hooks/useDoctorList';
import useAppointmentStore from '~/features/appointment/state/useAppointmentStore';
import { CardList, Description, Title, TitleBox, Wrapper } from '../Selector.styles';

interface DoctorSelectorProps {
  hospitalId: number;
}

const DoctorSelector = ({ hospitalId }: DoctorSelectorProps) => {
  const { data: doctors, loading, error } = useDoctorList(hospitalId);

  const { doctorId, setDoctorId, doctorName, setDoctorName } = useAppointmentStore();

  /* 디버깅용 코드 추후 삭제 예정 */
  useEffect(() => {}, []);

  return (
    <Wrapper>
      <TitleBox>
        <Title>의사 선택</Title>
        <Description>진료받으실 의사를 선택해주세요. (필수 항목)</Description>
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
