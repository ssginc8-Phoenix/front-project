import HospitalAdminChartPage from '~/features/hospitals/pages/HospitalAdminChartPage';
import AuthGuard from '~/components/AuthGuard';
import { routeAuthMap } from '~/config/routeAuthMap';

export default function HospitalAdmin() {
  return (
    <AuthGuard allowedRoles={routeAuthMap['/myPage/chart']}>
      <HospitalAdminChartPage />
    </AuthGuard>
  );
}
