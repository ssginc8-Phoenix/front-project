import React from 'react';
import styled from 'styled-components';
import type { ReviewMyListResponse } from '~/features/reviews/types/review';
import { GOOD_OPTIONS, BAD_OPTIONS } from '~/features/reviews/constants/keywordOptions';
import { Modal } from '~/features/reviews/component/common/Modal';

interface Props {
  isOpen: boolean;
  review: ReviewMyListResponse;
  onClose: () => void;
}

export function ReviewDetailModal({ isOpen, review, onClose }: Props) {
  if (!isOpen) return null;

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
    return `${yyyy}.${mm}.${dd}(${weekday}) ${hh}:${mi}`;
  };

  const getLabel = (value: string) => {
    const g = GOOD_OPTIONS.find((o) => o.value === value);
    if (g) return { label: g.label, type: 'good' as const };
    const b = BAD_OPTIONS.find((o) => o.value === value);
    if (b) return { label: b.label, type: 'bad' as const };
    return { label: value, type: 'unknown' as const };
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Content>
        <InfoBlock>
          <LabelRow>
            <Label>병원명 :</Label> {review.hospitalName}
          </LabelRow>
          <LabelRow>
            <Label>원장 :</Label> {review.doctorName} 원장
          </LabelRow>
          <LabelRow>
            <Label>예약일 :</Label> {formatDateTime(review.createdAt)}
          </LabelRow>
        </InfoBlock>

        <Tags>
          {review.keywords.map((k) => {
            const { label, type } = getLabel(k);
            return (
              <Tag key={k} type={type}>
                {label}
              </Tag>
            );
          })}
        </Tags>

        <ContentBox>{review.contents}</ContentBox>
      </Content>
    </Modal>
  );
}

const Content = styled.div`
  padding: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
`;

const InfoBlock = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const LabelRow = styled.div`
  font-size: 0.95rem;
  color: #374151;
`;

const Label = styled.span`
  font-weight: bold;
  margin-right: 0.5rem;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
  justify-content: center;
`;

const Tag = styled.span<{ type: 'good' | 'bad' | 'unknown' }>`
  padding: 0.35rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 500;
  ${({ type }) =>
    type === 'good'
      ? `background-color: #e6f0ff; color: #00499e;`
      : type === 'bad'
        ? `background-color: #ffe6e6; color: #c0392b;`
        : `background-color: #f3f4f6; color: #6b7280;`}
`;

const ContentBox = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: pre-wrap;

  @media (max-width: 480px) {
    font-size: 1.05rem;
    padding: 1rem;
  }
`;
