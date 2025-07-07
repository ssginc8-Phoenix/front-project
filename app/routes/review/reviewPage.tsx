import LoginStore from '~/features/user/stores/LoginStore';
import ReviewMyListPage from '~/features/reviews/pages/ReviewMyListPage';
import ReviewHospitalPage from '~/features/reviews/pages/ReviewHospitalPage';
import AuthGuard from '~/components/AuthGuard';
import { routeAuthMap } from '~/config/routeAuthMap';

export default function ReviewPage() {
  const role = LoginStore().user?.role;

  return (
    <AuthGuard allowedRoles={routeAuthMap['/myPage/review']}>
      {role === 'DOCTOR' || role === 'HOSPITAL_ADMIN' ? (
        <ReviewHospitalPage />
      ) : (
        <ReviewMyListPage />
      )}
    </AuthGuard>
  );
}
