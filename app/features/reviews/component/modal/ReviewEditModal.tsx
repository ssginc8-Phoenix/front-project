import React, { useEffect } from 'react';
import {
  GOOD_OPTIONS,
  BAD_OPTIONS,
  type KeywordOption,
} from '~/features/reviews/constants/keywordOptions';
import * as S from '~/features/reviews/component/common/ReviewModal.styles';
import { useReviewStore } from '~/features/reviews/stores/useReviewStore';
import { Modal } from '~/features/reviews/component/common/Modal';
import Button from '~/components/styled/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  hospitalName: string;
  doctorName: string;
  reviewId: number;
  initialGood: string[];
  initialBad: string[];
  initialContents: string;
}

export function ReviewEditModal({
  isOpen,
  onClose,
  onSaved,
  hospitalName,
  doctorName,
  reviewId,
  initialGood,
  initialBad,
  initialContents,
}: Props) {
  const { keywords, contents, loading, error, setField, toggleKeyword, resetForm, updateReview } =
    useReviewStore();

  // 열릴 때마다 초기값 세팅
  useEffect(() => {
    if (!isOpen) return;
    resetForm();
    // 기존 선택 키워드 재토글
    initialGood.forEach((k) => toggleKeyword(k));
    initialBad.forEach((k) => toggleKeyword(k));
    setField('contents', initialContents);
  }, [isOpen, resetForm, toggleKeyword, setField, initialGood, initialBad, initialContents]);

  const isValid = keywords.length >= 3 && keywords.length <= 8 && contents.trim().length > 0;

  const handleSave = async () => {
    if (!isValid) {
      alert('키워드를 3~8개, 내용을 입력해주세요.');
      return;
    }
    await updateReview(reviewId);
    onSaved();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="리뷰를 수정해주세요!"
      actions={
        <Button onClick={handleSave} disabled={!isValid || loading}>
          {loading ? '저장 중…' : '수정하기'}
        </Button>
      }
    >
      {/* header */}
      <S.HeaderWrapper>
        <S.HospitalName>{hospitalName}</S.HospitalName>
        <S.DoctorName>{doctorName} 원장</S.DoctorName>
        <S.PromptText>진료 리뷰를 수정해주세요!</S.PromptText>
      </S.HeaderWrapper>

      {/* keywords */}
      <S.KeywordsSection>
        <S.SectionContainer>
          <S.SectionTitle>좋은 점</S.SectionTitle>
          <S.KeywordsWrapper>
            {GOOD_OPTIONS.map((o: KeywordOption) => (
              <S.GoodKeywordButton
                key={o.value}
                selected={keywords.includes(o.value)}
                onClick={() => toggleKeyword(o.value)}
              >
                {o.emoji} {o.label}
              </S.GoodKeywordButton>
            ))}
          </S.KeywordsWrapper>
        </S.SectionContainer>

        <S.SectionContainer>
          <S.SectionTitle>아쉬운 점</S.SectionTitle>
          <S.KeywordsWrapper>
            {BAD_OPTIONS.map((o: KeywordOption) => (
              <S.BadKeywordButton
                key={o.value}
                selected={keywords.includes(o.value)}
                onClick={() => toggleKeyword(o.value)}
              >
                {o.emoji} {o.label}
              </S.BadKeywordButton>
            ))}
          </S.KeywordsWrapper>
        </S.SectionContainer>
      </S.KeywordsSection>

      <S.SectionContainer style={{ padding: '0 2rem', marginBottom: '1rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.25rem',
            fontWeight: 500,
            color: '#374151',
          }}
        >
          리뷰 내용
        </label>
        <S.Textarea value={contents} onChange={(e) => setField('contents', e.target.value)} />
      </S.SectionContainer>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
    </Modal>
  );
}
