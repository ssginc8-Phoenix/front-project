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
        <HospitalName>{review.hospitalName}</HospitalName>
        <DoctorName>{review.doctorName} 원장</DoctorName>
        {/*<PatientName>환자: {review.patientName}</PatientName>*/}

        <DateTime>{formatDateTime(review.createdAt)}</DateTime>

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

        <FullText>{review.contents}</FullText>
      </Content>
    </Modal>
  );
}

// ------------------- styled-components -------------------

const Content = styled.div`
  padding: 1rem 2rem;
`;

const HospitalName = styled.h3`
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const DoctorName = styled.h2`
  text-align: center;
  margin-bottom: 0.25rem;
  font-size: 1.25rem;
  font-weight: bold;
`;

const DateTime = styled.p`
  text-align: center;
  color: #6b7280;
  margin-bottom: 1rem;
`;

const Tags = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const Tag = styled.span<{ type: 'good' | 'bad' | 'unknown' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  ${({ type }) =>
    type === 'good'
      ? `background: #ecf2fe; color:#00499e;`
      : type === 'bad'
        ? `background: #fbeaea; color:#ba1a1a;`
        : `background: #f5f5f5; color:#6b7280;`}
`;

const FullText = styled.p`
  white-space: pre-wrap;
  line-height: 1.6;
  color: #374151;
`;
