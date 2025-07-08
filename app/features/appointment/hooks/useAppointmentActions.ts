import { useState } from 'react';
import {
  changeStatus,
  reschedule,
  cancelAppointment as cancelAppointmentAPI,
} from '~/features/appointment/api/appointmentAPI';
import {
  showConfirmAlert,
  showErrorAlert,
  showInfoAlert,
  showSuccessAlert,
} from '~/components/common/alert';

export const useAppointmentActions = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cancelAppointment = async (appointmentId: number) => {
    // 1. 커스텀 showConfirmedAlert 함수 사용
    const confirmResult = await showConfirmAlert(
      '정말 예약을 취소하시겠습니까?',
      '취소하면 되돌릴 수 없습니다!',
      'warning',
    );

    if (confirmResult.isConfirmed) {
      setLoading(true);
      setError(null);

      try {
        await cancelAppointmentAPI(appointmentId);
        await showSuccessAlert('취소 완료!', '선택한 예약이 성공적으로 취소되었습니다.');
        return true;
      } catch (err: any) {
        setError(err);
        await showErrorAlert('오류 발생', '예약 취소 중 오류가 발생했습니다. 다시 시도해주세요.');
        console.error(err);
        return false;
      } finally {
        setLoading(false);
      }
    } else if (confirmResult.isDismissed) {
      await showInfoAlert('취소됨', '예약 취소 작업이 취소되었습니다.');
      return false;
    }
    return false;
  };

  const rescheduleAppointment = async (appointmentId: number, newTime: string) => {
    setLoading(true);
    setError(null);

    try {
      await reschedule(appointmentId, newTime);
      await showSuccessAlert('재예약 완료!', '예약이 성공적으로 변경되었습니다.');
      return true;
    } catch (err: any) {
      setError(err);
      await showErrorAlert('오류 발생', '재예약 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: number, status: string) => {
    setLoading(true);
    setError(null);

    try {
      await changeStatus(appointmentId, status);
      await showSuccessAlert(
        '상태 변경 완료!',
        `예약 상태가 '${statusInKorean(status)}'(으)로 변경되었습니다.`,
      );
      return true;
    } catch (err: any) {
      setError(err);
      await showErrorAlert(
        '오류 발생',
        '예약 상태 변경 중 오류가 발생했습니다. 다시 시도해주세요.',
      );
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

const statusInKorean = (status: string) => {
  switch (status) {
    case 'REQUESTED':
      return '요청';
    case 'CONFIRMED':
      return '승인';
    case 'CANCELED':
      return '취소';
    case 'COMPLETED':
      return '완료';
    default:
      return status;
  }
};
