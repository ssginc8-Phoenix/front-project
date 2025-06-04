import { useState, useCallback } from 'react';
import type { ReviewCreateRequest } from '~/features/reviews/types/review';
import { BAD_OPTIONS, GOOD_OPTIONS } from '~/features/reviews/constants/keywordOptions';

interface UseReviewFormParams {
  userId: number;
  hospitalId: number;
  doctorId?: number;
  appointmentId?: number;
}

export function useReviewForm({
  userId,
  hospitalId,
  doctorId = 0,
  appointmentId = 0,
}: UseReviewFormParams) {
  // 1) 키워드 옵션(상수) 참조
  //    GOOD_OPTIONS, BAD_OPTIONS는 import해서 사용

  // 2) 내부 상태: 좋은 키워드, 아쉬운 키워드, 내용
  const [goodKeywords, setGoodKeywords] = useState<string[]>([]);
  const [badKeywords, setBadKeywords] = useState<string[]>([]);
  const [contents, setContents] = useState<string>('');

  // 3) 토글 함수: 클릭 시 배열에 없으면 추가, 있으면 제거
  const toggleGoodKeyword = useCallback((value: string) => {
    setGoodKeywords((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }, []);

  const toggleBadKeyword = useCallback((value: string) => {
    setBadKeywords((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }, []);

  // 4) 유효성 검사: 키워드는 3~8개, 내용이 비어 있지 않아야 함
  const isValid = useCallback(() => {
    const total = goodKeywords.length + badKeywords.length;
    if (total < 3 || total > 8) return false;
    if (contents.trim().length === 0) return false;
    if (contents.length > 1000) return false;
    return true;
  }, [goodKeywords, badKeywords, contents]);

  // 5) payload 생성: 서버로 보낼 형태
  const getCreatePayload = useCallback((): ReviewCreateRequest => {
    return {
      userId,
      hospitalId,
      doctorId: doctorId!,
      appointmentId: appointmentId!,
      keywords: [...goodKeywords, ...badKeywords],
      contents,
    };
  }, [userId, hospitalId, doctorId, appointmentId, goodKeywords, badKeywords, contents]);

  return {
    GOOD_OPTIONS,
    BAD_OPTIONS,
    goodKeywords,
    badKeywords,
    contents,
    toggleGoodKeyword,
    toggleBadKeyword,
    setContents,
    isValid,
    getCreatePayload,
  };
}
