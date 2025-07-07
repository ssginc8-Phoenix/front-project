import PaymentHisToryPage from '~/features/payments/pages/PaymentHisToryPage';
import AuthGuard from '~/components/AuthGuard';
import { routeAuthMap } from '~/config/routeAuthMap';

export default function PaymentHistory() {
  return (
    <AuthGuard allowedRoles={routeAuthMap['/payments/history']}>
      <PaymentHisToryPage />
    </AuthGuard>
  );
}
