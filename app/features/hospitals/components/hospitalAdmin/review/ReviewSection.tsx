import { useReviews } from '../../../hooks/hospitalAdmin/useReviews';
import { useUser } from '../../../hooks/hospitalAdmin/useUser';

const ReviewSection = () => {
  const hospitalId = 1;
  const {
    data: reviews,
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useReviews(hospitalId);
  const { data: users, loading: usersLoading, error: usersError } = useUser();

  if (reviewsLoading || usersLoading) return <div>로딩 중...</div>;
  if (reviewsError || usersError) return <div>데이터를 불러오는 데 실패했습니다.</div>;

  const getUserNameById = (userId: number): string => {
    if (!users || !Array.isArray(users)) return '알 수 없음';
    const user = users.find((u) => u.userId === userId);
    return user?.name ?? '알 수 없음';
  };
  const getUserEmailById = (userId: number): string => {
    if (!users || !Array.isArray(users)) return '알 수 없음';
    const user = users.find((u) => u.userId === userId);
    return user?.email ?? '알 수 없음';
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">병원 리뷰</h2>
      <ul className="space-y-3">
        {reviews?.map((review) => (
          <li key={review.reviewId} className="border-b pb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
              <span className="text-sm font-semibold">{getUserNameById(review.userId)}</span>
              <span className="text-sm font-semibold">{getUserEmailById(review.userId)}</span>
            </div>
            <p className="text-gray-700">{review.contents}</p>
            <div className="text-xs text-gray-400">
              키워드: {review.keywords.join(', ')} / 신고수: {review.reportCount}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewSection;
