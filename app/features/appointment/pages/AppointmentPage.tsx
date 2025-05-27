import DoctorSelector from '~/features/appointment/components/add/doctor/DoctorSelector';
import PatientSelector from '~/features/appointment/components/add/patient/PatientSelector';
import SymptomSelector from '~/features/appointment/components/add/symptom/SymptomSelector';
import DateTimeSelector from '~/features/appointment/components/add/dateTime/DateTimeSelector';
import QuestionInput from '~/features/appointment/components/add/question/QuestionInput';
import PaymentMethodSelector from '~/features/appointment/components/add/payment/PaymentMethodSelector';
import Button from '~/components/Button';
import styled from 'styled-components';

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

interface AppointmentPageProps {
  hospitalId: number;
}

const AppointmentPage = ({ hospitalId }: AppointmentPageProps) => {
  return (
    <>
      <PatientSelector />
      <DoctorSelector hospitalId={1} />
      <SymptomSelector />
      <DateTimeSelector doctorId={1} />
      <QuestionInput />
      <PaymentMethodSelector />

      <ButtonGroup>
        <Button variant={'secondary'} onClick={() => console.log('취소')}>
          취소
        </Button>

        <Button variant="primary" onClick={() => console.log('접수')}>
          접수
        </Button>
      </ButtonGroup>
    </>
  );
};

export default AppointmentPage;
