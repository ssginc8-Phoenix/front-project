import { useState } from 'react';
import { changeStatus, reschedule } from '~/features/appointment/api/appointmentAPI';

export const useAppointmentActions = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cancelAppointment = async (appointmentId: number) => {
    const confirmCancel = window.confirm('정말 예약을 취소하시겠습니까?');
    if (!confirmCancel) return false;

    setLoading(true);
    setError(null);

    try {
      await cancelAppointment(appointmentId);
      alert('에약이 취소되었습니다.');
      return true;
    } catch (err: any) {
      setError(err);
      alert('예약 취소 중 오류가 발생했습니다.');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rescheduleAppointment = async (appointmentId: number, newTime: string) => {
    setLoading(true);
    setError(null);

    try {
      await reschedule(appointmentId, newTime);
      alert('재예약이 완료되었습니다.');
      return true;
    } catch (err: any) {
      setError(err);
      alert('재예약 중 오류가 발생했습ㄴ디ㅏ.');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: number, status: string) => {
    setLoading(true);
    setError(null);

    try {
      await changeStatus(appointmentId, status);
      alert(`예약 상태가 '${status}'(으)로 변경되었습니다.`);
      return true;
    } catch (err: any) {
      setError(err);
      alert('예약 상태 변경 중 오류가 발생했습니다.');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    cancelAppointment,
    rescheduleAppointment,
    updateAppointmentStatus,
    isLoading,
    error,
  };
};
