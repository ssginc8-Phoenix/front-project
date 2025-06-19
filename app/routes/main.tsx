// src/pages/Main.tsx

import MainPage from '~/components/MainPage';
import LoginStore from '~/features/user/stores/LoginStore';
import HospitalMainPage from '~/components/HospitalMainPage';

export default function Main() {
  const role = LoginStore().user?.role;

  return (
    <>
      {/* 로그인 여부와 관계없이 항상 기본 MainPage를 렌더링 */}
      <MainPage />

      {role && (
        <>
          {role === 'DOCTOR' && <HospitalMainPage />}
          {role === 'HOSPITAL_ADMIN' && <HospitalMainPage />}
        </>
      )}
    </>
  );
}
