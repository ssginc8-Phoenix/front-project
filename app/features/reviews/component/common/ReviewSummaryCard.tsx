import React from 'react';

import { Wrapper, Card, Title, SummaryText, Footer, Skeleton } from './ReviewSummaryStyles';
import { useReviewSummary } from '~/features/reviews/hooks/useReviewSummary';

interface Props {
  hospitalId: number;
}

const ReviewSummaryCard: React.FC<Props> = ({ hospitalId }) => {
  const { data, isLoading, error } = useReviewSummary(hospitalId);

  return (
    <Wrapper>
      <Card>
        {isLoading && (
          <>
            <Skeleton w="60%" h="1.2rem" />
            <Skeleton />
            <Skeleton />
          </>
        )}

        {error && !isLoading && (
          <SummaryText style={{ color: 'red' }}>
            요약 불러오기 실패: {(error as Error).message}
          </SummaryText>
        )}

        {data && !isLoading && (
          <>
            <Title>AI 리뷰 요약</Title>
            <SummaryText>{data.summary}</SummaryText>
            <Footer>총 리뷰 수: {data.reviewCount}개</Footer>
          </>
        )}
      </Card>
    </Wrapper>
  );
};

export default ReviewSummaryCard;
