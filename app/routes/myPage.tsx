import LoginStore from '~/features/user/stores/LoginStore';
import PatientManagementPage from '~/features/guardian/pages/PatientManagementPage';
import DoctorInfoPage from '~/features/doctor/page/DoctorInfoPage';
import HospitalAdminDashboardPage from '~/features/hospitals/pages/HospitalAdminDashboardPage';
import GuardianManagementPage from '~/features/patient/pages/GuardianManagementPage';
import AuthGuard from '~/components/AuthGuard';
import { routeAuthMap } from '~/config/routeAuthMap';

export default function myPage() {
  const role = LoginStore().user?.role;

  return (
    <AuthGuard allowedRoles={routeAuthMap['/myPage']}>
      {role === 'PATIENT' && <GuardianManagementPage />}
      {role === 'GUARDIAN' && <PatientManagementPage />}
      {role === 'DOCTOR' && <DoctorInfoPage />}
      {role === 'HOSPITAL_ADMIN' && <HospitalAdminDashboardPage />}
    </AuthGuard>
  );
}
