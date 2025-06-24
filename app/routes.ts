import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  route('hospital', 'layout/MapLayout.tsx', [
    route(':hospitalId', 'routes/hospital/hospitalDetail.tsx'),
    route('search', 'routes/hospital/hospitalSearch.tsx'),
  ]),

  /** MainLayout 적용 */
  route('', 'layout/MainLayout.tsx', [
    /** HOME */
    index('routes/main.tsx'),
    route('hospital/main', 'routes/hospital/HospitalMainPage.tsx'),

    route('myPage', 'routes/myPage.tsx'), // 역할별 마이페이지

    /** 로그인, 회원가입 관련  */
    route('/login', 'routes/login.tsx'),
    route('/signup', 'routes/signup.tsx'),
    route('/signup/form', 'routes/signupForm.tsx'),
    route('/register-doctors', 'routes/doctorForm.tsx'),
    route('/find-email', 'routes/findEmail.tsx'),
    route('/reset-password', 'routes/passwordResetVerify.tsx'),
    route('/reset-password/set', 'routes/resetPassword.tsx'),

    /** 사이드바 */
    route('guardian', 'routes/patient/guardianManagement.tsx'), // 환자 - 보호자 관리
    route('patient', 'routes/guardian/patientManagement.tsx'), // 보호자 - 환자 관리
    route('appointments', 'routes/appointment/appointmentDashboard.tsx'), // 역할별 예약 조회 및 관리
    route('calendar', 'routes/calendar/calendar.tsx'), // 역할별 캘린더
    route('review', 'features/reviews/pages/ReviewMyListPage.tsx'),
    route('qna', 'routes/qna/QnAListPage.tsx'),
    route('info', 'routes/info.tsx'),
    route('schedule', 'routes/doctor/doctorSchedule.tsx'),
    route('chart', 'routes/hospital/hospitalAdminChart.tsx'),

    /** 결제  */
    route('/payments/request', 'routes/payments/paymentRequest.tsx'),
    route('/payments/history', 'routes/payments/paymentHistory.tsx'),
    route('/sandbox/success', 'routes/payments/success.tsx'),
    route('/sandbox/fail', 'routes/payments/fail.tsx'),

    /** 예약 요청 */
    route('appointment', 'routes/appointment/appointmentRequest.tsx'),

    /** CHATBOT 챗봇  */
    route('chatbot', 'routes/chatbot/ChatbotPage.tsx'),
  ]),

  route('*', 'routes/NotFound.tsx'),
] satisfies RouteConfig;
