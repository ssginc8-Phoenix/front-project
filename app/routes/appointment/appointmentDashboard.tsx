import LoginStore from '~/features/user/stores/LoginStore';
import AppointmentListPage from '~/features/appointment/pages/AppointmentListPage';
import AppointmentDashboardPage from '~/features/appointment/pages/AppointmentDashboardPage';
import DoctorAppointmentDashboardPage from '~/features/appointment/pages/DoctorAppointmentDashboardPage';

export default function appointmentDashboard() {
  const role = LoginStore().user?.role;

  return (
    <>
      {(role === 'PATIENT' || role === 'GUARDIAN') && <AppointmentListPage />}
      {role === 'HOSPITAL_ADMIN' && <AppointmentDashboardPage />}
      {role === 'DOCTOR' && <DoctorAppointmentDashboardPage />}
    </>
  );
}
