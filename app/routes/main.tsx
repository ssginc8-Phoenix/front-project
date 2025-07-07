// src/pages/Main.tsx

import MainPage from '~/components/MainPage';
import LoginStore from '~/features/user/stores/LoginStore';
import HospitalMainPage from '~/components/HospitalMainPage';

export default function Main() {
  const user = LoginStore().user;
  const role = LoginStore().user?.role;

  return (
    <>
      {/* 로그인 여부와 관계없이 항상 기본 MainPage를 렌더링 */}
      {(user === null || role === 'PATIENT' || role === 'GUARDIAN' || role === 'SYSTEM_ADMIN') && (
        <MainPage />
      )}
      {role && (
        <>
          {role === 'DOCTOR' && <HospitalMainPage />}
          {role === 'HOSPITAL_ADMIN' && <HospitalMainPage />}
        </>
      )}
    </>
  );
}
