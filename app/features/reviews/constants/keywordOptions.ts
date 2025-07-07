export interface KeywordOption {
  value: string;
  label: string;
  emoji: string;
}

export const GOOD_OPTIONS: KeywordOption[] = [
  { value: 'THOROUGH', label: '진료가 꼼꼼해요', emoji: '🔎' },
  { value: 'FRIENDLY_DOCTOR', label: '의사가 친절해요', emoji: '😊' },
  { value: 'FAST', label: '진료가 빨라요', emoji: '⚡️' },
  { value: 'SHORT_WAIT', label: '대기 시간이 짧아요', emoji: '⏱️' },
  { value: 'PROFESSIONAL', label: '전문성이 느껴져요', emoji: '🎓' },
  { value: 'SENIOR_FRIENDLY', label: '노인 환자에게 배려가 있어요', emoji: '👵' },
  { value: 'CLEAN_HOSPITAL', label: '위생이 청결해요', emoji: '🧼' },
  { value: 'NICE_FACILITY', label: '시설이 좋아요', emoji: '🏥' },
  { value: 'EASY_PARKING', label: '주차가 편해요', emoji: '🅿️' },
  { value: 'GOOD_LOCATION', label: '위치가 좋아요', emoji: '📍' },
];

export const BAD_OPTIONS: KeywordOption[] = [
  { value: 'UNFRIENDLY_EXAM', label: '진료가 불친절해요', emoji: '😠' },
  { value: 'LACK_EXPLANATION', label: '설명이 부족해요', emoji: '❓' },
  { value: 'WAIT_AFTER_BOOK', label: '예약해도 오래 기다렸어요', emoji: '⌛️' },
  { value: 'LACK_GUIDE', label: '안내가 부족했어요', emoji: '🚫' },
  { value: 'DIRTY_HOSPITAL', label: '병원이 지저분해요', emoji: '🦠' },
  { value: 'WORRY_CLEAN', label: '소독/청결이 걱정돼요', emoji: '🤒' },
  { value: 'TIGHT_WAIT_AREA', label: '대기실이 좁고 불편해요', emoji: '📦' },
  { value: 'NO_PARKING_SPACE', label: '주차 공간이 부족해요', emoji: '❌🅿️' },
  { value: 'EXPENSIVE', label: '진료비가 너무 비싸요', emoji: '💸' },
  { value: 'PUSH_UNNECESSARY', label: '불필요한 시술을 권유해요', emoji: '💉' },
];
