import HospitalCreatePage from '~/features/hospitals/pages/HospitalCreatePage';
import AuthGuard from '~/components/AuthGuard';
import { routeAuthMap } from '~/config/routeAuthMap';

export default function HospitalCreate() {
  return (
    <AuthGuard allowedRoles={routeAuthMap['/hospital/create']}>
      <HospitalCreatePage />
    </AuthGuard>
  );
}
