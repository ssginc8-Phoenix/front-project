import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('/patients', 'layout/MainLayout.tsx', [
    route('guardian', 'routes/GuardianPage.tsx'),
    route('info', 'routes/PatientInfoPage.tsx'),
    route('mypage', 'routes/PatientMyPage.tsx'),
  ]),
] satisfies RouteConfig;
