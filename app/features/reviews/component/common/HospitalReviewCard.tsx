import React from 'react';
import styled from 'styled-components';
import type { HospitalReviewResponse } from '~/features/reviews/types/review';

interface HospitalReviewCardProps {
  review: HospitalReviewResponse;
  onReport: (reviewId: number) => void;
}

export const HospitalReviewCard: React.FC<HospitalReviewCardProps> = ({ review, onReport }) => {
  // 작성일 포맷 (YYYY.MM.DD)
  const formattedDate = (iso: string) => {
    const d = new Date(iso);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  };

  return (
    <CardWrapper>
      <ReportButton onClick={() => onReport(review.reviewId)}>🚩 게시글 신고</ReportButton>

      <CardTitle>📍 전체 리뷰 목록</CardTitle>
      <Divider />

      <Content>{review.contents}</Content>

      <Footer>
        <DateText>{formattedDate(review.createdAt)}</DateText>
        <ReportCount>신고 {review.reportCount}회</ReportCount>
      </Footer>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  position: relative;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ReportButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #ba1a1a;
  font-size: 0.875rem;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #00499e;
  text-align: center;
  margin: 0 0 0.5rem;
`;

const Divider = styled.hr`
  border: none;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
`;

const Content = styled.p`
  font-size: 1rem;
  color: #374151;
  line-height: 1.6;
  white-space: pre-wrap;
  margin-bottom: 1rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;
`;

const DateText = styled.span``;
const ReportCount = styled.span``;
