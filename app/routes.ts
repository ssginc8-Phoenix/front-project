import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),

  route('/reviews', 'layout/ReviewLayout.tsx', [
    route('me/*', 'features/reviews/pages/ReviewMyListPage.tsx', [
      route('new', 'features/reviews/pages/ReviewCreatePage.tsx'),
      route(':reviewId/edit', 'features/reviews/pages/ReviewEditPage.tsx'),
      route(':reviewId/delete', 'features/reviews/pages/ReviewDeletePage.tsx'),
    ]),

    route('hospital/:hospitalId', 'features/reviews/pages/ReviewAllListPage.tsx'),
  ]),
] satisfies RouteConfig;
