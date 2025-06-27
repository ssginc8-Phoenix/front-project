import LoginStore from '~/features/user/stores/LoginStore';
import DoctorQnaListPage from '~/features/qna/pages/DoctorQnaListPage';
import QnAListPage from '~/features/qna/pages/QnAListPage';
import AuthGuard from '~/components/AuthGuard';
import { routeAuthMap } from '~/config/routeAuthMap';

export default function QnAList() {
  const role = LoginStore().user?.role;

  return (
    <AuthGuard allowedRoles={routeAuthMap['/myPage/qna']}>
      {role && (
        <>
          {role === 'DOCTOR' && <DoctorQnaListPage />}
          {role !== 'DOCTOR' && <QnAListPage />}
        </>
      )}
    </AuthGuard>
  );
}
