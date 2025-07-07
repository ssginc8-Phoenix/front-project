import React from 'react';
import InsuranceRequestPage from '~/features/documents/page/InsuranceRequestPage';
import AuthGuard from '~/components/AuthGuard';
import { routeAuthMap } from '~/config/routeAuthMap';

export default function DocumentRequest() {
  return (
    <AuthGuard allowedRoles={routeAuthMap['/documents']}>
      <InsuranceRequestPage />
    </AuthGuard>
  );
}
