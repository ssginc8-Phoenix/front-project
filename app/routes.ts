import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),

  route('/login', 'routes/login.tsx'),
  route('/signup', 'routes/signup.tsx'),
  // route('/signup/social-form', 'routes/socialSignupForm.tsx'),
  route('/register-doctors', 'routes/doctorForm.tsx'),
  route('/find-email', 'routes/findEmail.tsx'),
  route('/reset-password', 'routes/passwordResetVerify.tsx'),
  route('/reset-password/set', 'routes/resetPassword.tsx'),

  route('appointments', 'layout/MainLayout.tsx', [
    route('', 'routes/appointmentRequest.tsx'),
    route('list', 'routes/appointmentList.tsx'),
  ]),

  route('/reviews', 'layout/ReviewLayout.tsx', [
    route('me/*', 'features/reviews/pages/ReviewMyListPage.tsx', [
      // route('new', 'features/reviews/pages/ReviewCreatePage.tsx'),
      // route(':reviewId/edit', 'features/reviews/pages/ReviewEditPage.tsx'),
      // route(':reviewId/delete', 'features/reviews/pages/ReviewDeletePage.tsx'),
    ]),
    // route('hospital/:hospitalId', 'features/reviews/pages/ReviewAllListPage.tsx'),
  ]),
] satisfies RouteConfig;
