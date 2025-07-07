import LoginStore from '~/features/user/stores/LoginStore';
import PatientInfoPage from '~/features/patient/pages/PatientInfoPage';
import GuardianInfoPage from '~/features/guardian/pages/GuardianInfoPage';
import DoctorInfoPage from '~/features/doctor/page/DoctorInfoPage';
import HospitalAdminDashboardPage from '~/features/hospitals/pages/HospitalAdminDashboardPage';
import AuthGuard from '~/components/AuthGuard';
import { routeAuthMap } from '~/config/routeAuthMap';

export default function myPage() {
  const role = LoginStore().user?.role;

  return (
    <AuthGuard allowedRoles={routeAuthMap['/myPage/info']}>
      {role === 'PATIENT' && <PatientInfoPage />}
      {role === 'GUARDIAN' && <GuardianInfoPage />}
      {role === 'DOCTOR' && <DoctorInfoPage />}
      {role === 'HOSPITAL_ADMIN' && <HospitalAdminDashboardPage />}
    </AuthGuard>
  );
}
