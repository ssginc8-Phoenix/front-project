import { useState, useEffect } from 'react';
import type { HospitalReviewResponse, Page } from '~/features/reviews/types/review';
import { getHospitalReviews } from '~/features/reviews/api/reviewAPI';

export function useHospitalReviews(hospitalId: number | null, page: number, size: number = 10) {
  const [data, setData] = useState<Page<HospitalReviewResponse> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hospitalId === null || hospitalId < 0) return;

    setLoading(true);
    setError(null);

    getHospitalReviews(hospitalId, page, size)
      .then((res: Page<HospitalReviewResponse>) => {
        setData(res);
      })
      .catch((e) => {
        console.error(e);
        setError('리뷰를 불러오는 중 오류가 발생했습니다.');
      })
      .finally(() => setLoading(false));
  }, [hospitalId, page, size]);

  return {
    reviews: data?.content ?? [],
    pagination: {
      currentPage: data?.number ?? 0,
      totalPages: data?.totalPages ?? 0,
    },
    loading,
    error,
  };
}
