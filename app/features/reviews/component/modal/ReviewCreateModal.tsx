import React, { useEffect, useState } from 'react';
import * as S from '~/features/reviews/component/common/ReviewModal.styles';
import { BAD_OPTIONS, GOOD_OPTIONS } from '~/features/reviews/constants/keywordOptions';
import { addReview } from '~/features/reviews/api/reviewAPI';
import type { ReviewCreateRequest } from '~/features/reviews/types/review';
import Button from '~/components/styled/Button';

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

  // 모달 열릴 때마다 초기화
  useEffect(() => {
    if (isOpen) {
      setGoodKeywords([]);
      setBadKeywords([]);
      setContents('');
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
    const payload: ReviewCreateRequest = {
      userId,
      hospitalId,
      doctorId,
      appointmentId,
      keywords: [...goodKeywords, ...badKeywords],
      contents,
    };
    try {
      await addReview(payload);
      onSaved();
      onClose();
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
          <S.PromptText>(키워드는 3~8개 필수 선택입니다.)</S.PromptText>
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

        <S.ButtonGroup>
          {/* 버튼만 비활성화되고, 클릭해도 경고는 뜨지 않음 */}
          <Button onClick={handleSave} disabled={!isValid()}>
            완료
          </Button>
        </S.ButtonGroup>
      </S.Container>
    </S.Overlay>
  );
}
