import LoginStore from '~/features/user/stores/LoginStore';
import DoctorQnaListPage from '~/features/qna/pages/DoctorQnaListPage';
import QnAListPage from '~/features/qna/pages/QnAListPage';

export default function QnAList() {
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
