import AdminInsuranceDocumentsPage from '~/features/documents/page/AdminInsuranceDocumentsPage';
import AuthGuard from '~/components/AuthGuard';
import { routeAuthMap } from '~/config/routeAuthMap';

export default function AdminDocumentList() {
  return (
    <AuthGuard allowedRoles={routeAuthMap['/documents/admin']}>
      <AdminInsuranceDocumentsPage />
    </AuthGuard>
  );
}
