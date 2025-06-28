import React from 'react';
import styled, { css } from 'styled-components';
import { useMediaQuery } from 'react-responsive';

import type { ReviewMyListResponse } from '~/features/reviews/types/review';
import { GOOD_OPTIONS, BAD_OPTIONS } from '~/features/reviews/constants/keywordOptions';

interface ReviewCardProps {
  review: ReviewMyListResponse;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ReviewCard({ review, onClick, onEdit, onDelete }: ReviewCardProps) {
  const isMobile = useMediaQuery({ maxWidth: 480 });

  const formattedDate = (iso: string) => {
    const d = new Date(iso);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  };

  const getLabelByValue = (value: string) => {
    const goodMatch = GOOD_OPTIONS.find((opt) => opt.value === value);
    if (goodMatch) return { label: goodMatch.label, type: 'good' as const };
    const badMatch = BAD_OPTIONS.find((opt) => opt.value === value);
    if (badMatch) return { label: badMatch.label, type: 'bad' as const };
    return { label: value, type: 'unknown' as const };
  };

  // 모바일에서는 리뷰 3개만 보이도록
  const displayKeywords = isMobile ? review.keywords.slice(0, 3) : review.keywords;

  return (
    <CardContainer onClick={onClick}>
      <DeleteButton
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="삭제"
      >
        ×
      </DeleteButton>

      <CardHeader>
        <HeaderLeft>
          <HospitalText>{review.hospitalName}</HospitalText>
          <DoctorNameRow>
            <DoctorText>{review.doctorName} 원장</DoctorText>
            <EditButton
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              title="수정"
            >
              ✏️
            </EditButton>
          </DoctorNameRow>
        </HeaderLeft>
      </CardHeader>

      <KeywordsWrapper>
        {displayKeywords.map((kw) => {
          const { label, type } = getLabelByValue(kw);
          return (
            <KeywordTag key={kw} type={type}>
              {label}
            </KeywordTag>
          );
        })}
      </KeywordsWrapper>

      <ContentText>
        {review.contents.length > 30 ? `${review.contents.slice(0, 30)}...` : review.contents}
      </ContentText>

      <Footer>
        <DateText>{formattedDate(review.createdAt)}</DateText>
      </Footer>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  position: relative;
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  cursor: pointer;
  width: 100%;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #9ca3af;
  cursor: pointer;

  &:hover {
    color: #dc2626;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const HospitalText = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const DoctorText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`;

const DoctorNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #6b7280;

  &:hover {
    color: #374151;
  }
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

const ContentText = styled.p`
  font-size: 1rem;
  color: #374151;
  margin-bottom: 1rem;
  white-space: pre-wrap;
`;

const Footer = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
`;

const DateText = styled.span``;
