import React from 'react';
import styled, { css } from 'styled-components';
import type { HospitalReviewResponse } from '~/features/reviews/types/review';
import { GOOD_OPTIONS, BAD_OPTIONS } from '~/features/reviews/constants/keywordOptions';

interface Props {
  review: HospitalReviewResponse;
  onReport: (reviewId: number) => void;
}

export const HospitalReviewCard: React.FC<Props> = ({ review, onReport }) => {
  const formattedDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const getLabelByValue = (value: string) => {
    const good = GOOD_OPTIONS.find((opt) => opt.value === value);
    if (good) return { label: good.label, type: 'good' as const };
    const bad = BAD_OPTIONS.find((opt) => opt.value === value);
    if (bad) return { label: bad.label, type: 'bad' as const };
    return { label: value, type: 'unknown' as const };
  };

  return (
    <CardContainer>
      <ReportButton onClick={() => onReport(review.reviewId)}>🚩 신고</ReportButton>

      <ContentText>{review.contents}</ContentText>

      <KeywordsWrapper>
        {review.keywords.map((kw) => {
          const { label, type } = getLabelByValue(kw);
          return (
            <KeywordTag key={kw} type={type}>
              #{label}
            </KeywordTag>
          );
        })}
      </KeywordsWrapper>

      <Footer>
        <DateText>{formattedDate(review.createdAt)}</DateText>
        <AuthorText>{review.writerName}</AuthorText>
        <ReportCount>신고 {review.reportCount}회</ReportCount>
      </Footer>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  position: relative;
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
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

const ContentText = styled.p`
  font-size: 1rem;
  color: #374151;
  margin-bottom: 1rem;
  white-space: pre-wrap;
`;

const KeywordsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const KeywordTag = styled.span<{ type: 'good' | 'bad' | 'unknown' }>`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  ${({ type }) =>
    type === 'good'
      ? css`
          background-color: #ecf2fe;
          color: #00499e;
        `
      : type === 'bad'
        ? css`
            background-color: #fbeaea;
            color: #ba1a1a;
          `
        : css`
            background-color: #f5f5f5;
            color: #6b7280;
          `}
`;

const Footer = styled.div`
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #6b7280;
`;

const DateText = styled.span``;
const AuthorText = styled.span``;
const ReportCount = styled.span``;
