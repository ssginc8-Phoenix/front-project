import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('/appointment', 'layout/MainLayout.tsx', [route('create', 'routes/appointment.tsx')]),
] satisfies RouteConfig;
