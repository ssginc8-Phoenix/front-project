import LoginStore from '~/features/user/stores/LoginStore';
import AppointmentListPage from '~/features/appointment/pages/AppointmentListPage';
import AuthGuard from '~/components/AuthGuard';
import { routeAuthMap } from '~/config/routeAuthMap';

export default function appointmentDashboard() {
  const role = LoginStore().user?.role;

  return (
    <AuthGuard allowedRoles={routeAuthMap['/myPage/appointments']}>
      {(role === 'PATIENT' || role === 'GUARDIAN') && <AppointmentListPage />}
    </AuthGuard>
  );
}
