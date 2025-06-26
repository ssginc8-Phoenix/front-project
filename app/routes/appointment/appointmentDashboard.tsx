import LoginStore from '~/features/user/stores/LoginStore';
import AppointmentDashboardPage from '~/features/appointment/pages/AppointmentDashboardPage';
import DoctorAppointmentDashboardPage from '~/features/appointment/pages/DoctorAppointmentDashboardPage';

export default function appointmentDashboard() {
  const role = LoginStore().user?.role;

  return (
    <>
      {role === 'HOSPITAL_ADMIN' && <AppointmentDashboardPage />}
      {role === 'DOCTOR' && <DoctorAppointmentDashboardPage />}
    </>
  );
}
