import styled from 'styled-components';
import PatientCard from '~/features/appointment/components/add/patient/PatientCard';
import { useEffect } from 'react';
import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';
import useAppointmentStore from '~/features/appointment/state/useAppointmentStore';
import { usePatientListByGuardian } from '~/features/guardian/hooks/usePatientListByGuardian';
import { CardList, Description, Title, TitleBox, Wrapper } from '../Selector.styles';

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
        <Description>실제 진료받으실 환자를 선택해주세요. (필수 항목)</Description>
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
