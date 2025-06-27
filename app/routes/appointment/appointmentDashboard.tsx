import LoginStore from '~/features/user/stores/LoginStore';
import AppointmentDashboardPage from '~/features/appointment/pages/AppointmentDashboardPage';
import DoctorAppointmentDashboardPage from '~/features/appointment/pages/DoctorAppointmentDashboardPage';
import AuthGuard from '~/components/AuthGuard';
import { routeAuthMap } from '~/config/routeAuthMap';

export default function appointmentDashboard() {
  const role = LoginStore().user?.role;

  return (
    <AuthGuard allowedRoles={routeAuthMap['/appointments']}>
      {role === 'HOSPITAL_ADMIN' && <AppointmentDashboardPage />}
      {role === 'DOCTOR' && <DoctorAppointmentDashboardPage />}
    </AuthGuard>
  );
}
