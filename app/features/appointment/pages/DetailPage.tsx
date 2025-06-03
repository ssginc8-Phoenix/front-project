import { useState } from 'react';
import Button from '~/components/styled/Button';
import AppointmentDetailModal from '~/features/appointment/components/detail/AppointmentDetailModal';

const AppointmentDetailPage = () => {
  const [open, setOpen] = useState(false);
  const appointmentId = 1; // 실제 예약 ID

  return (
    <>
      <Button $variant="primary" onClick={() => setOpen(true)}>
        예약 상세보기
      </Button>

      <AppointmentDetailModal
        appointmentId={appointmentId}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default AppointmentDetailPage;
