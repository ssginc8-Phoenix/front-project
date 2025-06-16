import LoginStore from '~/features/user/stores/LoginStore';
import GuardianPatientPage from '~/features/guardian/pages/GuardianPatientPage';
import DoctorInfoPage from '~/features/doctor/page/DoctorInfoPage';
import HospitalAdminDashboardPage from '~/features/hospitals/pages/HospitalAdminDashboardPage';
import GuardianPage from '~/features/patient/pages/GuardianPage';

/**
 * 수정사항
 * GuardianPage 이름 변경
 */

export default function myPage() {
  const role = LoginStore().user?.role;

  return (
    <>
      {role == 'PATIENT' && <GuardianPage />}
      {role === 'GUARDIAN' && <GuardianPatientPage />}
      {role === 'DOCTOR' && <DoctorInfoPage />}
      {role === 'HOSPITAL_ADMIN' && <HospitalAdminDashboardPage />}
    </>
  );
}
