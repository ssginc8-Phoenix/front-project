import LoginStore from '~/features/user/stores/LoginStore';
import PatientCalendarPage from '~/features/calendar/pages/PatientCalendarPage';
import GuardianCalendarPage from '~/features/calendar/pages/GuardianCalendarPage';
import DoctorCalendarPage from '~/features/calendar/pages/DoctorCalendarPage';
import HospitalCalendarPage from '~/features/calendar/pages/HospitalCalendarPage';

export default function Calendar() {
  const role = LoginStore().user?.role;

  return (
    <>
      {role === 'PATIENT' && <PatientCalendarPage />}
      {role === 'GUARDIAN' && <GuardianCalendarPage />}
      {role === 'DOCTOR' && <DoctorCalendarPage />}
      {role === 'HOSPITAL_ADMIN' && <HospitalCalendarPage />}
    </>
  );
}
