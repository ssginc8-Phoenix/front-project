import DoctorSelector from '~/features/appointment/components/add/doctor/DoctorSelector';
import PatientSelector from '~/features/appointment/components/add/patient/PatientSelector';
import SymptomSelector from '~/features/appointment/components/add/symptom/SymptomSelector';
import DateTimeSelector from '~/features/appointment/components/add/dateTime/DateTimeSelector';
import QuestionInput from '~/features/appointment/components/add/question/QuestionInput';
import PaymentMethodSelector from '~/features/appointment/components/add/payment/PaymentMethodSelector';
import Button from '~/components/styled/Button';
import styled from 'styled-components';
import useAppointmentStore from '~/features/appointment/state/useAppointmentStore';
import { createAppointment } from '~/features/appointment/api/appointmentAPI';
import AppointmentConfirmationModal from '~/features/appointment/components/add/AppointmentConfirmationModal';
import { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

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
  const {
    patientId,
    patientName,
    rrn,
    doctorId,
    doctorName,
    date,
    time,
    selectedSymptoms,
    extraSymptom,
    question,
    paymentMethod,
    reset,
  } = useAppointmentStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fullSymptom = [...selectedSymptoms, extraSymptom].filter(Boolean).join(', ');

  const formatDateTime = (date: Date | null, time: string) => {
    if (!date || !time) return '';
    return `${dayjs(date).locale('ko').format('YYYY.MM.DD (ddd)')} ${time}`;
  };

  const dateTime = formatDateTime(date, time);

  const handlePreSubmit = () => {
    if (!patientId || !doctorId || !date || !time || !paymentMethod) {
      alert('필수 정보를 모두 입력하세요');
      return;
    }

    if (selectedSymptoms.includes('직접 입력') && !extraSymptom.trim()) {
      alert('증상의 직접 입력 항목에 내용을 작성해주세요.');
      return;
    }

    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const localDateTime = dayjs(date)
      .hour(Number(time.split(':')[0]))
      .minute(Number(time.split(':')[1]))
      .second(0)
      .millisecond(0);

    const appointmentTime = localDateTime.format('YYYY-MM-DDTHH:mm:ss');

    const payload = {
      userId: 2 /* 추후 실제 로그인 유저 ID로 교체 필요 */,
      patientId: patientId!,
      hospitalId: hospitalId!,
      doctorId: doctorId!,
      symptom: fullSymptom,
      question,
      appointmentType: 'SCHEDULED',
      paymentType: paymentMethod,
      appointmentTime,
    };

    try {
      const result = await createAppointment(payload);
      console.log('예약 완료: ', result);
      alert('예약이 접수되었습니다.');

      reset();
    } catch (error) {
      console.error('예약 실패: ', error);
      alert('예약 요청 중 오류가 발생했습니다.');
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <PatientSelector />
      <DoctorSelector hospitalId={1} />
      <SymptomSelector />
      <DateTimeSelector doctorId={doctorId} />
      <QuestionInput />
      <PaymentMethodSelector />

      <ButtonGroup>
        <Button $variant={'secondary'} onClick={() => reset()}>
          취소
        </Button>
        <Button $variant="primary" onClick={handlePreSubmit}>
          접수
        </Button>
      </ButtonGroup>

      <AppointmentConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSubmit}
        dateTime={dateTime ?? ''}
        hospitalName="신세계병원"
        doctorName={doctorName ?? ''}
        patientName={patientName ?? ''}
        residentRegistrationNumber={rrn ?? ''} // TODO: 마스킹 처리 필요
        appointmentType="SCHEDULED"
        symptoms={fullSymptom}
        paymentMethod={paymentMethod}
        question={question}
      />
    </>
  );
};

export default AppointmentPage;
