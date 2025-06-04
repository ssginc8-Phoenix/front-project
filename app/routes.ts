import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('/login', 'routes/login.tsx'),
  route('/signup', 'routes/signup.tsx'),
  route('/signup/social-form', 'routes/socialSignupForm.tsx'),
  route('/register-doctors', 'routes/doctorForm.tsx'),
  route('appointments', 'layout/MainLayout.tsx', [
    route('', 'routes/appointmentRequest.tsx'),
    route('list', 'routes/appointmentList.tsx'),
  ]),
] satisfies RouteConfig;
