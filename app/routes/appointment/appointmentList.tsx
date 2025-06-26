import LoginStore from '~/features/user/stores/LoginStore';
import AppointmentListPage from '~/features/appointment/pages/AppointmentListPage';

export default function appointmentDashboard() {
  const role = LoginStore().user?.role;

  return <>{(role === 'PATIENT' || role === 'GUARDIAN') && <AppointmentListPage />}</>;
}
