import DoctorSchedulePage from '~/features/doctor/page/DoctorSchedulePage';
import AuthGuard from '~/components/AuthGuard';
import { routeAuthMap } from '~/config/routeAuthMap';

export default function DoctorSchedule() {
  return (
    <AuthGuard allowedRoles={routeAuthMap['/myPage/schedule']}>
      <DoctorSchedulePage />
    </AuthGuard>
  );
}
