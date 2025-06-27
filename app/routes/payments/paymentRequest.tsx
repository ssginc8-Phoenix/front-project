import PaymentRequestPage from '~/features/payments/pages/PaymentRequestPage';
import AuthGuard from '~/components/AuthGuard';
import { routeAuthMap } from '~/config/routeAuthMap';

export default function PaymentRequest() {
  return (
    <AuthGuard allowedRoles={routeAuthMap['/payments/request']}>
      <PaymentRequestPage />
    </AuthGuard>
  );
}
