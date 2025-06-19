import styled from 'styled-components';
import PatientCard from '~/features/appointment/components/add/patient/PatientCard';
import { useEffect } from 'react';
import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';
import useAppointmentStore from '~/features/appointment/state/useAppointmentStore';
import { usePatientListByGuardian } from '~/features/guardian/hooks/usePatientListByGuardian';
import { data } from 'react-router';

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

const PatientSelector = () => {
  const { data: patients, loading, error } = usePatientListByGuardian();

  const { patientId, setPatientId, patientName, setPatientName, rrn, setRrn } =
    useAppointmentStore();

  /** 디버깅용 코드 추후 삭제 예정 */
  useEffect(() => {}, [patientId]);

  return (
    <Wrapper>
      <TitleBox>
        <Title>진료대상 선택</Title>
        <Description>실제 진료받으실 환자를 선택해주세요.</Description>
      </TitleBox>

      {loading && <LoadingIndicator />}
      {error && <ErrorMessage message={error} />}

      <CardList>
        {patients?.map((patient) => (
          <PatientCard
            key={patient.patientId}
            name={patient.name}
            residentRegistrationNumber={patient.residentRegistrationNumber}
            imageUrl={patient.profileImageUrl}
            isSelected={patientId === patient.patientId}
            onSelect={() => {
              if (patientId === patient.patientId) {
                setPatientId(null);
                setPatientName(null);
                setRrn(null);
              } else {
                setPatientId(patient.patientId);
                setPatientName(patient.name);
                setRrn(patient.residentRegistrationNumber);
              }
            }}
          />
        ))}
      </CardList>
    </Wrapper>
  );
};

export default PatientSelector;
