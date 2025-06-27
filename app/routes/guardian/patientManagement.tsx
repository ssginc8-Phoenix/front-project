import PatientManagementPage from '~/features/guardian/pages/PatientManagementPage';
import { routeAuthMap } from '~/config/routeAuthMap';
import AuthGuard from '~/components/AuthGuard';

export default function patientManagement() {
  return (
    <AuthGuard allowedRoles={routeAuthMap['/myPage/patient']}>
      <PatientManagementPage />
    </AuthGuard>
  );
}
