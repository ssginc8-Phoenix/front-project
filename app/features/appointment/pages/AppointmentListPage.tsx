import { useState } from 'react';
import AppointmentDetailModal from '~/features/appointment/components/detail/AppointmentDetailModal';
import AppointmentListComponent from '~/features/appointment/components/list/AppointmentList';
import { useAppointmentActions } from '~/features/appointment/hooks/useAppointmentActions';
import useAppointmentStore from '~/features/appointment/state/useAppointmentStore';
import DateTimeSelectorModal from '../components/detail/DateTimeSelectorModal';
import dayjs from 'dayjs';

const AppointmentListPage = () => {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [refreshListTrigger, setRefreshListTrigger] = useState(false);

  // DateTimeSelectorModal 관련 상태
  const [isDateTimeSelectorModalOpen, setIsDateTimeSelectorModalOpen] = useState(false);
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState<number | null>(null);
  const [rescheduleDoctorId, setRescheduleDoctorId] = useState<number | null>(null);
  const [reschedulePatientId, setReschedulePatientId] = useState<number | null>(null);

  const { rescheduleAppointment } = useAppointmentActions();
  const { date, time, setDate, setTime } = useAppointmentStore();

  const handleRefreshList = () => {
    setRefreshListTrigger((prev) => !prev);
  };

  // 재예약 버튼 클릭 시 호출될 핸들러
  const handleInitiateReschedule = (appId: number, docId: number, patId: number) => {
    setSelectedAppointmentId(null); // AppointmentDetailModal 닫기
    setRescheduleAppointmentId(appId);
    setRescheduleDoctorId(docId);
    setReschedulePatientId(patId);
    setIsDateTimeSelectorModalOpen(true); // DateTimeSelectorModal 열기
  };

  // DateTimeSelectorModal에서 '재예약 확정' 시 호출될 핸들러
  const handleConfirmReschedule = async () => {
    if (!rescheduleAppointmentId || !date || !time) {
      alert('재예약 정보를 찾을 수 없습니다. 날짜와 시간을 선택했는지 확인해주세요.');
      return;
    }

    const newDateTime = dayjs(
      `${dayjs(date).format('YYYY-MM-DD')} ${time}`,
      'YYYY-MM-DD HH:mm:ss',
    ).format('YYYY-MM-DDTHH:mm:ss');

    const success = await rescheduleAppointment(rescheduleAppointmentId, newDateTime);
    if (success) {
      alert('재예약이 성공적으로 완료되었습니다.');
      setIsDateTimeSelectorModalOpen(false); // DateTimeSelectorModal 닫기
      setRescheduleAppointmentId(null);
      setRescheduleDoctorId(null);
      setReschedulePatientId(null);
      handleRefreshList(); // 목록 새로고침
      setDate(null); // 날짜/시간 선택 상태 초기화
      setTime(''); // 날짜/시간 선택 상태 초기화
    } else {
      alert('재예약에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // DateTimeSelectorModal이 취소되거나 닫힐 때 호출될 핸들러
  const handleDateTimeSelectorClose = () => {
    setIsDateTimeSelectorModalOpen(false);
    setRescheduleAppointmentId(null);
    setRescheduleDoctorId(null);
    setReschedulePatientId(null);
    setDate(null); // 날짜/시간 선택 상태 초기화
    setTime(''); // 날짜/시간 선택 상태 초기화
  };

  return (
    <>
      <AppointmentListComponent
        onSelectAppointment={(id) => setSelectedAppointmentId(id)}
        refreshTrigger={refreshListTrigger}
      />

      {selectedAppointmentId !== null && (
        <AppointmentDetailModal
          appointmentId={selectedAppointmentId}
          isOpen={true}
          onClose={() => setSelectedAppointmentId(null)}
          onRefreshList={handleRefreshList}
          onRescheduleInitiated={handleInitiateReschedule}
        />
      )}

      {/* DateTimeSelectorModal은 isDateTimeSelectorModalOpen이 true 이고 필요한 ID가 있을 때만 렌더링 */}
      {isDateTimeSelectorModalOpen &&
        rescheduleDoctorId !== null &&
        reschedulePatientId !== null && (
          <DateTimeSelectorModal
            isOpen={isDateTimeSelectorModalOpen}
            onClose={handleDateTimeSelectorClose}
            doctorId={rescheduleDoctorId}
            patientId={reschedulePatientId}
            onConfirm={handleConfirmReschedule} // 재예약 확정 핸들러 전달
            appointmentId={rescheduleAppointmentId as number} // 재예약할 예약 ID 전달
          />
        )}
    </>
  );
};

export default AppointmentListPage;
