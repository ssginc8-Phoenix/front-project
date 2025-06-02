import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('/appointments', 'layout/MainLayout.tsx', [
    route(':appointmentId', 'routes/appointment.tsx'),
  ]),
] satisfies RouteConfig;
