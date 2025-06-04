import React from 'react';
import { Routes, Route, Navigate } from 'react-router';

import ReviewMyListPage from '~/features/reviews/pages/ReviewMyListPage';
import ReviewAllListPage from '~/features/reviews/pages/ReviewAllListPage';

export default function ReviewsRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="me" replace />} />
      <Route path="me" element={<ReviewMyListPage />} />
      <Route path="hospital/:hospitalId" element={<ReviewAllListPage />} />
      <Route path="*" element={<Navigate to="me" replace />} />
    </Routes>
  );
}
