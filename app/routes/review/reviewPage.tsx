import LoginStore from '~/features/user/stores/LoginStore';
import ReviewMyListPage from '~/features/reviews/pages/ReviewMyListPage';
import ReviewHospitalPage from '~/features/reviews/pages/ReviewHospitalPage';

export default function ReviewPage() {
  const role = LoginStore().user?.role;

  return role === 'DOCTOR' || role === 'HOSPITAL_ADMIN' ? (
    <ReviewHospitalPage />
  ) : (
    <ReviewMyListPage />
  );
}
