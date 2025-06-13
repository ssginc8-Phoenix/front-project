import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),

  route('/login', 'routes/login.tsx'),
  route('/signup', 'routes/signup.tsx'),
  route('/signup/form', 'routes/signupForm.tsx'),
  route('/register-doctors', 'routes/doctorForm.tsx'),
  route('/find-email', 'routes/findEmail.tsx'),
  route('/reset-password', 'routes/passwordResetVerify.tsx'),
  route('/reset-password/set', 'routes/resetPassword.tsx'),

  /** MainLayout 적용 */
  route('', 'layout/MainLayout.tsx', [
    /** PATIENT 환자 영역 */
    route('patients', 'routes/patient/emptyPage.tsx', [
      route('mypage', 'routes/PatientMyPage.tsx'),
      route('info', 'routes/PatientInfoPage.tsx'),
      route('guardian', 'routes/GuardianPage.tsx'),
      route('calendar', 'routes/calendar/patientCalendar.tsx'),
    ]),

    /** GUARDIAN 보호자 영역 */
    route('guardians', 'routes/guardian/emptyPage.tsx', [
      route('mypage', 'routes/guardianMyPage.tsx'),
      route('info', 'routes/guardianInfoPage.tsx'),
      route('patients', 'routes/guardianpatientPage.tsx'),
      route('calendar', 'routes/calendar/guardianCalendar.tsx'),
    ]),

    /** HOSPITAL 병원 영역 */
    route('hospitals', 'routes/hospital/emptyPage.tsx', [
      route(':hospitalId', 'routes/hospital/hospitalDetail.tsx'),
      route('search', 'routes/hospital/hospitalSearch.tsx'),
      route('info', 'routes/hospital/hospitalAdmin.tsx'),
      route('chart', 'routes/hospital/hospitalAdminChart.tsx'),
      // route('calendar', 'routes/calendar/hospitalCalendar.tsx'),
    ]),

    /** DOCTOR 의사 영역 */
    route('doctor', 'routes/doctor/emptyPage.tsx', [
      route('info', 'routes/doctor/doctorInfo.tsx'),
      route('schedule', 'routes/doctor/doctorSchedule.tsx'),
      route('calendar', 'routes/calendar/doctorCalendar.tsx'),
    ]),

    /** APPOINTMENT 예약 영역 */
    route('appointments', 'routes/appointment/appointmentRequest.tsx', [
      route('list', 'routes/appointment/appointmentList.tsx'),
      route('dashboard', 'routes/appointment/dashBoard.tsx'),
    ]),
  ]),

  /** REVIEWS 리뷰 영역 */
  route('/reviews', 'layout/ReviewLayout.tsx', [
    route('me', 'features/reviews/pages/ReviewMyListPage.tsx', [
      route(':reviewId/edit', 'features/reviews/pages/ReviewEditPage.tsx'),
      route(':reviewId/delete', 'features/reviews/pages/ReviewDeletePage.tsx'),
    ]),
    route('admin/reviews', 'features/reviews/pages/ReviewAdminPage.tsx'),
    route('hospital/:hospitalId', 'features/reviews/pages/ReviewHospitalPage.tsx'),
  ]),
] satisfies RouteConfig;
