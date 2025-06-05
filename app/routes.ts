import { type RouteConfig, route } from '@react-router/dev/routes';

export default [
  route('/', 'layout/HeaderLayout.tsx', [
    route('/hospitals/:hospitalId', 'features/hospitals/routes/hospitalDetailPage.tsx'),
    route('/test', 'features/hospitals/routes/hospitalSearchPage.tsx'),
    route('/test2', 'features/hospitals/routes/HospitalAdminDashboardPage.tsx'),
  ]),
] satisfies RouteConfig;
