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
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import LoginStore from '~/features/user/stores/LoginStore';
import { useNavigate } from 'react-router';
import { media } from '~/components/styled/GlobalStyle';
import { showErrorAlert, showSuccessAlert } from '~/components/common/alert';

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;

  ${media.mobile} {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
`;

const AppointmentRequestPage = () => {
  const {
    patientId,
    patientName,
    rrn,
    hospitalId,
    hospitalName,
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
  const { user } = LoginStore();
  const navigate = useNavigate();

  /**
   * 예약 정지 여부 체크
   */
  const isSuspended = user?.isSuspended;

  useEffect(() => {
    if (isSuspended) {
      showErrorAlert('예약 불가', '정책 위반으로 인해 예약이 불가능합니다.').then(() => {
        navigate('/');
      });
    }
  }, [isSuspended, navigate]);

  if (isSuspended) {
    return null;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredSymptoms = selectedSymptoms.filter((symptom) => symptom !== '직접 입력');
  const fullSymptom = [...filteredSymptoms, extraSymptom].filter(Boolean).join(', ');

  const appointmentType = dayjs(date).isSame(dayjs(), 'day') ? 'IMMEDIATE' : 'SCHEDULED';

  const formatDateTime = (date: Date | null, time: string) => {
    if (!date || !time) return '';
    return `${dayjs(date).locale('ko').format('YYYY.MM.DD (ddd)')} ${time}`;
  };

  const dateTime = formatDateTime(date, time);

  const handleCancel = () => {
    reset();
    navigate('/hospital/search');
  };

  const handlePreSubmit = async () => {
    if (!patientId || !doctorId || !date || !time || !fullSymptom || !paymentMethod) {
      await showErrorAlert('정보 부족', '모든 필수 항목을 입력해주세요.');
      return;
    }

    if (selectedSymptoms.includes('직접 입력') && !extraSymptom.trim()) {
      await showErrorAlert('내용 부족', '"직접 입력" 항목을 선택한 경우 내용을 작성해주세요.');
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
      userId: user!.userId,
      patientId: patientId!,
      hospitalId: hospitalId!,
      doctorId: doctorId!,
      symptom: fullSymptom,
      question,
      appointmentType,
      paymentType: paymentMethod,
      appointmentTime,
    };

    try {
      const result = await createAppointment(payload);
      await showSuccessAlert('예약 접수 완료', '예약이 성공적으로 접수되었습니다.');
      navigate('/mypage/appointments');
      reset();
    } catch (error) {
      console.error('예약 실패: ', error);
      await showErrorAlert('예약 오류', '예약 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <PatientSelector />
      <DoctorSelector hospitalId={hospitalId!} />
      <SymptomSelector />
      <DateTimeSelector doctorId={doctorId} patientId={patientId} />
      <QuestionInput />
      <PaymentMethodSelector />

      <ButtonGroup>
        <Button $variant={'secondary'} onClick={handleCancel}>
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
        hospitalName={hospitalName ?? ''}
        doctorName={doctorName ?? ''}
        patientName={patientName ?? ''}
        residentRegistrationNumber={rrn ?? ''}
        appointmentType={appointmentType}
        symptoms={fullSymptom}
        paymentMethod={paymentMethod}
        question={question}
      />
    </>
  );
};

export default AppointmentRequestPage;
