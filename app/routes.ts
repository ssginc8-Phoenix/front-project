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

  route('/patients/mypage', 'routes/PatientMyPage.tsx'),
  route('/patients/info', 'routes/PatientInfoPage.tsx'),
  route('/patients/guardian', 'routes/GuardianPage.tsx'),
  route('/guardians/mypage', 'routes/guardianMyPage.tsx'),
  route('/guardians/info', 'routes/guardianInfoPage.tsx'),
  route('/guardians/patients', 'routes/guardianpatientPage.tsx'),

  route('appointments', 'layout/MainLayout.tsx', [
    route('', 'routes/appointment/appointmentRequest.tsx'),
    route('list', 'routes/appointment/appointmentList.tsx'),
    route('dashboard', 'routes/appointment/dashBoard.tsx'),
  ]),

  route('/reviews', 'layout/ReviewLayout.tsx', [
    route('me', 'features/reviews/pages/ReviewMyListPage.tsx', [
      route(':reviewId/edit', 'features/reviews/pages/ReviewEditPage.tsx'),
      route(':reviewId/delete', 'features/reviews/pages/ReviewDeletePage.tsx'),
    ]),
    route('admin/reviews', 'features/reviews/pages/ReviewAdminPage.tsx'),
    route('hospital/:hospitalId', 'features/reviews/pages/ReviewHospitalPage.tsx'),
  ]),
  route('/hospitals/:hospitalId', 'routes/hospitalDetail.tsx'),
  route('/hospitals/search', 'routes/hospitalSearch.tsx'),
  route('/hospitals/info', 'routes/hospitalAdmin.tsx'),
] satisfies RouteConfig;
