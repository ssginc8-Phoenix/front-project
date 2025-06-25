import React, { useEffect, useMemo, useState } from 'react';
import Button from '~/components/styled/Button';
import { GOOD_OPTIONS, BAD_OPTIONS } from '~/features/reviews/constants/keywordOptions';
import * as S from '~/features/reviews/component/common/ReviewModal.styles';

import { addReview } from '~/features/reviews/api/reviewAPI';

import type { ReviewCreateRequest } from '~/features/reviews/types/review';
import { Modal } from '~/features/reviews/component/common/Modal';
import { useKeywordSelection } from '~/features/reviews/hooks/useKeywordSelection';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  userId: number;
  hospitalId: number;
  doctorId: number;
  appointmentId: number;
  hospitalName: string;
  doctorName: string;
}

const ReviewCreateModal = ({
  isOpen,
  onClose,
  onSaved,
  userId,
  hospitalId,
  doctorId,
  appointmentId,
  hospitalName,
  doctorName,
}: Props) => {
  /* 키워드 선택 */
  const good = useKeywordSelection();
  const bad = useKeywordSelection();
  const [contents, setContents] = useState('');

  /* 초기화 */
  useEffect(() => {
    if (isOpen) {
      good.reset();
      bad.reset();
      setContents('');
    }
  }, [isOpen]);

  /* 검증 */
  const totalKeywords = useMemo(() => good.keywords.length + bad.keywords.length, [good, bad]);
  const isValid = totalKeywords >= 3 && totalKeywords <= 8 && !!contents.trim();

  /* 저장 */
  const handleSave = async () => {
    if (!isValid) return;

    const payload: ReviewCreateRequest = {
      userId,
      hospitalId,
      doctorId,
      appointmentId,
      keywords: [...good.keywords, ...bad.keywords],
      contents,
    };
    await addReview(payload);
    onSaved();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <S.HospitalName>{hospitalName}</S.HospitalName>
          <S.DoctorName>{doctorName} 원장</S.DoctorName>
          <S.PromptText>진료 리뷰를 남겨주세요! (키워드 3~8개 필수)</S.PromptText>
        </>
      }
      actions={
        <Button onClick={handleSave} disabled={!isValid}>
          완료
        </Button>
      }
    >
      {/* 좋은 점 키워드 */}
      <S.KeywordsSection>
        <S.SectionContainer>
          <S.SectionTitle>좋은 점</S.SectionTitle>
          <S.KeywordsWrapper>
            {GOOD_OPTIONS.map((opt) => (
              <S.GoodKeywordButton
                key={opt.value}
                selected={good.keywords.includes(opt.value)}
                onClick={() => good.toggle(opt.value)}
              >
                {opt.emoji} {opt.label}
              </S.GoodKeywordButton>
            ))}
          </S.KeywordsWrapper>
        </S.SectionContainer>

        {/* 아쉬운 점 */}
        <S.SectionContainer>
          <S.SectionTitle>아쉬운 점</S.SectionTitle>
          <S.KeywordsWrapper>
            {BAD_OPTIONS.map((opt) => (
              <S.BadKeywordButton
                key={opt.value}
                selected={bad.keywords.includes(opt.value)}
                onClick={() => bad.toggle(opt.value)}
              >
                {opt.emoji} {opt.label}
              </S.BadKeywordButton>
            ))}
          </S.KeywordsWrapper>
        </S.SectionContainer>
      </S.KeywordsSection>

      {/* 내용 입력 */}
      <S.SectionContainer style={{ padding: '0 2rem', marginBottom: '1rem' }}>
        <label
          style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, color: '#374151' }}
        >
          내용 작성
        </label>
        <S.Textarea
          placeholder="리뷰 내용을 작성해주세요."
          value={contents}
          onChange={(e) => setContents(e.target.value)}
        />
      </S.SectionContainer>
    </Modal>
  );
};

export default ReviewCreateModal;
