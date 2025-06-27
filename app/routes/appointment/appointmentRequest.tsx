import AppointmentRequestPage from '~/features/appointment/pages/AppointmentRequestPage';
import AuthGuard from '~/components/AuthGuard';
import { routeAuthMap } from '~/config/routeAuthMap';

export default function AppointmentRequest() {
  return (
    <AuthGuard allowedRoles={routeAuthMap['/appointment']}>
      <AppointmentRequestPage />
    </AuthGuard>
  );
}
