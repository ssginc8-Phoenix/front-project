import LoginStore from '~/features/user/stores/LoginStore';
import { DoctorQnaListPage } from '~/features/qna/pages/DoctorQnaListPage';

export default function QnAListPage() {
  const role = LoginStore().user?.role;

  return (
    <>
      {role && (
        <>
          {role === 'DOCTOR' && <DoctorQnaListPage />}
          {role !== 'DOCTOR' && <QnAListPage />}
        </>
      )}
    </>
  );
}
