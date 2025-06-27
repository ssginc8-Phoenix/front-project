import GuardianManagementPage from '~/features/patient/pages/GuardianManagementPage';
import AuthGuard from '~/components/AuthGuard';
import { routeAuthMap } from '~/config/routeAuthMap';

export default function guardianInvite() {
  return (
    <AuthGuard allowedRoles={routeAuthMap['/myPage/guardian']}>
      <GuardianManagementPage />;
    </AuthGuard>
  );
}
