import React from 'react';
import styled from 'styled-components';
import { useReviewForm } from '~/features/reviews/hooks/useReviewForm';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 48rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  margin: 0 1rem; /* mx-4 */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: #374151;
  }
`;

const HeaderWrapper = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  padding-top: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 1.5rem;
`;

const HospitalName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const DoctorName = styled.p`
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
`;

const PromptText = styled.p`
  font-size: 0.875rem;
  color: #00499e;
`;

const KeywordsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const KeywordsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
`;

const GoodKeywordButton = styled.button<{ selected: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;

  ${({ selected }) =>
    selected
      ? `
    background-color: #ECF2FE;
    color: #00499E;
    border: 1px solid #00499E;
  `
      : `
    background-color: rgba(236, 242, 254, 0.7);
    color: #00499E;
    &:hover {
      background-color: #ECF2FE;
    }
  `}
`;

const BadKeywordButton = styled.button<{ selected: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;

  ${({ selected }) =>
    selected
      ? `
    background-color: #F1A89E;
    color: #7A261D;
    border: 1px solid #7A261D;
  `
      : `
    background-color: rgba(241, 168, 158, 0.7);
    color: #7A261D;
    &:hover {
      background-color: #F1A89E;
    }
  `}
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 8rem;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  resize: none;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 73, 158, 0.5);
  }
`;

const SubmitButton = styled.button`
  padding: 0.5rem 1.5rem;
  color: #ffffff;
  font-weight: 500;
  border-radius: 9999px;
  background-color: #00499e;
  transition: background-color 0.2s;

  &:hover {
    background-color: #003974;
  }
`;

interface ReviewCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { goodKeywords: string[]; badKeywords: string[]; contents: string }) => void;
  hospitalName: string;
  doctorName: string;
  userId: number;
  doctorId?: number;
  appointmentId?: number;
}

export default function ReviewCreateModal({
  isOpen,
  onClose,
  onSubmit,
  hospitalName,
  doctorName,
  userId,
  doctorId = 0,
  appointmentId = 0,
}: ReviewCreateModalProps) {
  const {
    GOOD_OPTIONS,
    BAD_OPTIONS,
    goodKeywords,
    badKeywords,
    contents,
    toggleGoodKeyword,
    toggleBadKeyword,
    setContents,
    isValid,
  } = useReviewForm({ userId, hospitalId: 123, doctorId, appointmentId });
  // hospitalId: 123은 더미값

  const handleSubmit = () => {
    if (!isValid()) {
      alert('키워드를 3개 이상, 8개 이하로 선택하고 리뷰 내용을 입력해주세요.');
      return;
    }
    onSubmit({
      goodKeywords,
      badKeywords,
      contents,
    });
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Container onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>✕</CloseButton>

        <HeaderWrapper>
          <HospitalName>{hospitalName}</HospitalName>
          <DoctorName>{doctorName} 원장</DoctorName>
          <PromptText>진료 리뷰를 남겨주세요!</PromptText>
        </HeaderWrapper>

        <KeywordsSection>
          {/* 좋은 점 섹션 */}
          <div style={{ flex: 1 }}>
            <SectionTitle>좋은 점</SectionTitle>
            <KeywordsWrapper>
              {GOOD_OPTIONS.map((opt) => {
                const selected = goodKeywords.includes(opt.value);
                return (
                  <GoodKeywordButton
                    key={opt.value}
                    selected={selected}
                    onClick={() => toggleGoodKeyword(opt.value)}
                  >
                    {opt.label}
                  </GoodKeywordButton>
                );
              })}
            </KeywordsWrapper>
          </div>

          {/* 아쉬운 점 섹션 */}
          <div style={{ flex: 1 }}>
            <SectionTitle>아쉬운 점</SectionTitle>
            <KeywordsWrapper>
              {BAD_OPTIONS.map((opt) => {
                const selected = badKeywords.includes(opt.value);
                return (
                  <BadKeywordButton
                    key={opt.value}
                    selected={selected}
                    onClick={() => toggleBadKeyword(opt.value)}
                  >
                    {opt.label}
                  </BadKeywordButton>
                );
              })}
            </KeywordsWrapper>
          </div>
        </KeywordsSection>

        <div style={{ marginBottom: '1.5rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '0.25rem',
              fontWeight: 500,
              color: '#374151',
            }}
          >
            내용 작성
          </label>
          <Textarea
            placeholder="리뷰 내용을 작성해주세요."
            value={contents}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContents(e.target.value)}
          />
        </div>

        <div style={{ textAlign: 'center', paddingBottom: '2rem' }}>
          <SubmitButton onClick={handleSubmit}>완료</SubmitButton>
        </div>
      </Container>
    </Overlay>
  );
}
