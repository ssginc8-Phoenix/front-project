import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Review } from '../types/review';

interface ReviewPage {
  content: Review[];
  totalPages: number;
  number: number;
  totalElements: number;
  size: number;
}

export const useHospitalReviews = (hospitalId: number, initialPage = 0, pageSize = 10) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get<ReviewPage>(`/api/v1/hospitals/${hospitalId}/reviews`, {
        params: { page, size: pageSize },
      })
      .then((res) => {
        setReviews(res.data.content);
        setTotalPages(res.data.totalPages);
        setError(null);
      })
      .catch(() => {
        setError('리뷰를 불러오는 데 실패했습니다.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [hospitalId, page, pageSize]);

  return { reviews, page, totalPages, loading, error, setPage };
};
