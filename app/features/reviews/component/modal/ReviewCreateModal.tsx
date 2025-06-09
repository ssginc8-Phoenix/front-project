import React, { useEffect, useState } from 'react';
import * as S from '~/features/reviews/component/common/ReviewModal.styles';
import { Button } from '~/features/reviews/component/common/Button';
import { BAD_OPTIONS, GOOD_OPTIONS } from '~/features/reviews/constants/keywordOptions';
import { addReview } from '~/features/reviews/api/reviewAPI';
import type { ReviewCreateRequest } from '~/features/reviews/types/review';

interface ReviewCreateModalProps {
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

export default function ReviewCreateModal({
  isOpen,
  onClose,
  onSaved,
  userId,
  hospitalId,
  doctorId,
  appointmentId,
  hospitalName,
  doctorName,
}: ReviewCreateModalProps) {
  const [goodKeywords, setGoodKeywords] = useState<string[]>([]);
  const [badKeywords, setBadKeywords] = useState<string[]>([]);
  const [contents, setContents] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setGoodKeywords([]);
      setBadKeywords([]);
      setContents('');
      setShowSuccess(false);
    }
  }, [isOpen]);

  const toggleGoodKeyword = (value: string) =>
    setGoodKeywords((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value],
    );
  const toggleBadKeyword = (value: string) =>
    setBadKeywords((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value],
    );

  const isValid = () => {
    const total = goodKeywords.length + badKeywords.length;
    return total >= 3 && total <= 8 && contents.trim().length > 0;
  };

  const handleSave = async () => {
    if (!isValid()) {
      alert('키워드를 3개 이상, 8개 이하로 선택하고 리뷰 내용을 입력해주세요.');
      return;
    }
    const keywords = [...goodKeywords, ...badKeywords];
    const payload: ReviewCreateRequest = {
      userId,
      hospitalId,
      doctorId,
      appointmentId,
      keywords,
      contents,
    };
    try {
      await addReview(payload);
      setShowSuccess(true);
      onSaved();
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('리뷰 작성 중 오류가 발생했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <S.Overlay onClick={onClose}>
      <S.Container onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={onClose}>✕</S.CloseButton>

        <S.HeaderWrapper>
          <S.HospitalName>{hospitalName}</S.HospitalName>
          <S.DoctorName>{doctorName} 원장</S.DoctorName>
          <S.PromptText>진료 리뷰를 남겨주세요!</S.PromptText>
        </S.HeaderWrapper>

        <S.KeywordsSection>
          <S.SectionContainer>
            <S.SectionTitle>좋은 점</S.SectionTitle>
            <S.KeywordsWrapper>
              {GOOD_OPTIONS.map((opt) => {
                const selected = goodKeywords.includes(opt.value);
                return (
                  <S.GoodKeywordButton
                    key={opt.value}
                    selected={selected}
                    onClick={() => toggleGoodKeyword(opt.value)}
                  >
                    {opt.emoji} {opt.label}
                  </S.GoodKeywordButton>
                );
              })}
            </S.KeywordsWrapper>
          </S.SectionContainer>

          <S.SectionContainer>
            <S.SectionTitle>아쉬운 점</S.SectionTitle>
            <S.KeywordsWrapper>
              {BAD_OPTIONS.map((opt) => {
                const selected = badKeywords.includes(opt.value);
                return (
                  <S.BadKeywordButton
                    key={opt.value}
                    selected={selected}
                    onClick={() => toggleBadKeyword(opt.value)}
                  >
                    {opt.emoji} {opt.label}
                  </S.BadKeywordButton>
                );
              })}
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
            내용 작성
          </label>
          <S.Textarea
            placeholder="리뷰 내용을 작성해주세요."
            value={contents}
            onChange={(e) => setContents(e.target.value)}
          />
        </S.SectionContainer>

        {showSuccess && (
          <p style={{ textAlign: 'center', color: '#00499e', marginBottom: '1rem' }}>
            🎉 리뷰가 저장되었습니다!
          </p>
        )}

        <S.ButtonGroup>
          <Button onClick={handleSave} disabled={!isValid()}>
            완료
          </Button>
        </S.ButtonGroup>
      </S.Container>
    </S.Overlay>
  );
}
