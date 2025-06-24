import React from 'react';
import {
  Wrapper,
  Card,
  Header,
  Icon,
  TitleBox,
  Title,
  SubTitle,
  SummaryText,
  Footer,
  Skeleton,
} from './ReviewSummaryStyles';
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
            <Skeleton w="40%" h="1.2rem" />
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
            <Header>
              <Icon>🧠</Icon>
              <TitleBox>
                <Title>AI 브리핑</Title>
                <SubTitle>사용자 리뷰를 기반으로 요약된 내용입니다</SubTitle>
              </TitleBox>
            </Header>

            <SummaryText>{data.summary}</SummaryText>
            <Footer>총 리뷰 수: {data.reviewCount}개</Footer>
          </>
        )}
      </Card>
    </Wrapper>
  );
};

export default ReviewSummaryCard;
