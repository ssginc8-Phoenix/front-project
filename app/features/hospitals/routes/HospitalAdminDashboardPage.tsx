import ReviewSection from '../components/hospitalAdmin/review/ReviewSection';

const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* 1. 통계 부분 */}
      {/* 2. 그래프 부분 */}
      {/* 3. 리뷰 내용 */}
      <ReviewSection />
      {/* 4. 신고 내용 */}
    </div>
  );
};

export default AdminDashboard;
