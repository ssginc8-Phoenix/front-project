import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  /** 로그인, 회원가입 관련  */
  route('/login', 'routes/login.tsx'),
  route('/signup', 'routes/signup.tsx'),
  route('/signup/form', 'routes/signupForm.tsx'),
  route('/register-doctors', 'routes/doctorForm.tsx'),
  route('/find-email', 'routes/findEmail.tsx'),
  route('/reset-password', 'routes/passwordResetVerify.tsx'),
  route('/reset-password/set', 'routes/resetPassword.tsx'),

  /** 결제  */
  route('/payments/request', 'routes/payments/paymentRequest.tsx'),
  route('/payments/history', 'routes/payments/paymentHistory.tsx'),
  route('/sandbox/success', 'routes/payments/success.tsx'),
  route('/sandbox/fail', 'routes/payments/fail.tsx'),

  route('hospital', 'layout/MapLayout.tsx', [
    route('search', 'routes/hospital/hospitalSearch.tsx'),
  ]),

  /** MainLayout 적용 */
  route('', 'layout/MainLayout.tsx', [
    /** HOME */
    index('routes/main.tsx'),
    route('hospital/main', 'routes/hospital/HospitalMainPage.tsx'),

    route('myPage', 'routes/myPage.tsx'), // 역할별 마이페이지

    route('guardian', 'routes/patient/guardianManagement.tsx'), // 환자 - 보호자 관리
    route('patient', 'routes/guardian/patientManagement.tsx'), // 보호자 - 환자 관리
    route('appointments', 'routes/appointment/appointmentDashboard.tsx'), // 역할별 예약 조회 및 관리
    route('calendar', 'routes/calendar/calendar.tsx'), // 역할별 캘린더
    route('review', 'features/reviews/pages/ReviewMyListPage.tsx'),
    route('qna', 'routes/qna/QnAListPage.tsx'),
    route('info', 'routes/info.tsx'),
    route('schedule', 'routes/doctor/doctorSchedule.tsx'),
    route('chart', 'routes/hospital/hospitalAdminChart.tsx'),

    route('appointment', 'routes/appointment/appointmentRequest.tsx'),

    // /** PATIENT 환자 영역 */
    // route('patients', 'routes/patient/emptyPage.tsx', [
    //   route('info', 'routes/patient/patientInfoPage.tsx'),
    //   // route('guardian', 'routes/patient/guardian.tsx'),
    //   route('calendar', 'routes/calendar/patientCalendar.tsx'),
    // ]),
    //
    // /** GUARDIAN 보호자 영역 */
    // route('guardians', 'routes/guardian/emptyPage.tsx', [
    //   route('info', 'routes/guardian/guardianInfoPage.tsx'),
    //   route('patients', 'routes/guardian/guardianpatientPage.tsx'),
    //   route('calendar', 'routes/calendar/guardianCalendar.tsx'),
    // ]),
    //
    // /** DOCTOR 병원 영역 */
    // route('doctor', 'routes/doctor/emptyPage.tsx', [
    //   route('info', 'routes/doctor/doctorInfo.tsx'),
    //   route('schedule', 'routes/doctor/doctorSchedule.tsx'),
    //   route('calendar', 'routes/calendar/doctorCalendar.tsx'),
    // ]),
    //
    // /** HOSPITAL 병원 영역 */
    // route('hospital', 'routes/hospital/emptyPage.tsx', [
    //   route(':hospitalId', 'routes/hospital/hospitalDetail.tsx'),
    //   route('info', 'routes/hospital/hospitalAdminInfo.tsx'),
    //   route('create', 'routes/hospital/hospitalCreate.tsx'),
    //   route('chart', 'routes/hospital/hospitalAdminChart.tsx'),
    //   route('calendar', 'routes/calendar/hospitalCalendar.tsx'),
    // ]),
    //
    // /** APPOINTMENT 예약 영역 */
    // route('appointments', 'routes/appointment/emptyPage.tsx', [
    //   route('request', 'routes/appointment/appointmentRequest.tsx'),
    // ]),
    //
    // /** QNA 큐앤에이 영역 */
    // route('qna', 'routes/qna/QnAListPage.tsx', [route(':qnaId', 'routes/qna/QnADetailPage.tsx')]),
    // route('doctor/qna', 'routes/doctor/Qna.tsx', [route(':qnaId', 'routes/doctor/QnaDetail.tsx')]),
    //
    // /** REVIEW 리뷰 영역 */
    // route('reviews/admin', 'features/reviews/pages/ReviewAdminPage.tsx'),
    // route('reviews/hospital/:hospitalId', 'features/reviews/pages/ReviewHospitalPage.tsx'),
    // route('reviews/:userId', 'features/reviews/pages/ReviewMyListPage.tsx'),
    //
    // /** CHATBOT 챗봇  */
    // route('chatbot', 'routes/chatbot/ChatbotPage.tsx'),
  ]),

  route('*', 'routes/NotFound.tsx'),
] satisfies RouteConfig;
