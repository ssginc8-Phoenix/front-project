// types/review.d.ts

export type Category = 'MEDICAL_SERVICE' | 'FACILITY_ENV' | 'COST_ADMIN';

export type Polarity = 'POSITIVE' | 'NEGATIVE';

export interface KeywordTypeInfo {
  label: string;
  category: Category;
  polarity: Polarity;
  weight: number;
}

// KeywordType 문자열 리터럴 (enum 대신 union type 사용)
export type KeywordType =
  | 'THOROUGH'
  | 'FRIENDLY_DOCTOR'
  | 'FAST'
  | 'SHORT_WAIT'
  | 'PROFESSIONAL'
  | 'SENIOR_FRIENDLY'
  | 'CLEAN_HOSPITAL'
  | 'NICE_FACILITY'
  | 'EASY_PARKING'
  | 'GOOD_LOCATION'
  | 'COMFORTABLE_ATMOS'
  | 'FAIR_PRICE'
  | 'EASY_INSURANCE'
  | 'FAST_RESULTS'
  | 'ENOUGH_CONSULT'
  | 'WANT_RETURN'
  | 'FAST_PAYMENT'
  | 'UNFRIENDLY_EXAM'
  | 'LACK_EXPLANATION'
  | 'POOR_COMMUNICATION'
  | 'NO_EFFECT_TREAT'
  | 'LONG_WAIT'
  | 'WAIT_AFTER_BOOK'
  | 'LACK_GUIDE'
  | 'COMPLEX_PAYMENT'
  | 'DIRTY_HOSPITAL'
  | 'WORRY_CLEAN'
  | 'TIGHT_WAIT_AREA'
  | 'NO_PARKING_SPACE'
  | 'CONFUSING_SIGNAGE'
  | 'NO_WHEELCHAIR_ACCESS'
  | 'NO_GUARDIAN_SPACE'
  | 'EXPENSIVE'
  | 'PUSH_UNNECESSARY'
  | 'LACK_FEE_EXPLAN'
  | 'INSURANCE_BUREAUCRACY'
  | 'LATE_RECEIPT';

// KeywordType 별 상세 정보 매핑 객체
export const KeywordTypeMap: Record<KeywordType, KeywordTypeInfo> = {
  THOROUGH: {
    label: '진료가 꼼꼼해요',
    category: 'MEDICAL_SERVICE',
    polarity: 'POSITIVE',
    weight: 5,
  },
  FRIENDLY_DOCTOR: {
    label: '의사가 친절해요',
    category: 'MEDICAL_SERVICE',
    polarity: 'POSITIVE',
    weight: 5,
  },
  FAST: { label: '진료가 빨라요', category: 'MEDICAL_SERVICE', polarity: 'POSITIVE', weight: 3 },
  SHORT_WAIT: {
    label: '대기 시간이 짧아요',
    category: 'MEDICAL_SERVICE',
    polarity: 'POSITIVE',
    weight: 4,
  },
  PROFESSIONAL: {
    label: '전문성이 느껴져요',
    category: 'MEDICAL_SERVICE',
    polarity: 'POSITIVE',
    weight: 5,
  },
  SENIOR_FRIENDLY: {
    label: '노인 환자에게 배려가 있어요',
    category: 'MEDICAL_SERVICE',
    polarity: 'POSITIVE',
    weight: 4,
  },

  CLEAN_HOSPITAL: {
    label: '위생이 청결해요',
    category: 'FACILITY_ENV',
    polarity: 'POSITIVE',
    weight: 5,
  },
  NICE_FACILITY: {
    label: '시설이 좋아요',
    category: 'FACILITY_ENV',
    polarity: 'POSITIVE',
    weight: 3,
  },
  EASY_PARKING: {
    label: '주차가 편해요',
    category: 'FACILITY_ENV',
    polarity: 'POSITIVE',
    weight: 4,
  },
  GOOD_LOCATION: {
    label: '위치가 좋아요',
    category: 'FACILITY_ENV',
    polarity: 'POSITIVE',
    weight: 3,
  },
  COMFORTABLE_ATMOS: {
    label: '분위기가 편안해요',
    category: 'FACILITY_ENV',
    polarity: 'POSITIVE',
    weight: 4,
  },

  FAIR_PRICE: {
    label: '진료비가 합리적이에요',
    category: 'COST_ADMIN',
    polarity: 'POSITIVE',
    weight: 5,
  },
  EASY_INSURANCE: {
    label: '보험 처리가 편해요',
    category: 'COST_ADMIN',
    polarity: 'POSITIVE',
    weight: 4,
  },
  FAST_RESULTS: {
    label: '검사 결과가 빨리 나와요',
    category: 'COST_ADMIN',
    polarity: 'POSITIVE',
    weight: 4,
  },
  ENOUGH_CONSULT: {
    label: '상담 시간이 충분해요',
    category: 'COST_ADMIN',
    polarity: 'POSITIVE',
    weight: 5,
  },
  WANT_RETURN: {
    label: '재방문하고 싶어요',
    category: 'COST_ADMIN',
    polarity: 'POSITIVE',
    weight: 5,
  },
  FAST_PAYMENT: {
    label: '수납이 빠르고 편해요',
    category: 'COST_ADMIN',
    polarity: 'POSITIVE',
    weight: 3,
  },

  UNFRIENDLY_EXAM: {
    label: '진료가 불친절해요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
    weight: 5,
  },
  LACK_EXPLANATION: {
    label: '설명이 부족해요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
    weight: 5,
  },
  POOR_COMMUNICATION: {
    label: '환자 말을 잘 안 들어줘요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
    weight: 5,
  },
  NO_EFFECT_TREAT: {
    label: '치료 효과가 없었어요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
    weight: 5,
  },
  LONG_WAIT: {
    label: '대기 시간이 너무 길어요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
    weight: 4,
  },
  WAIT_AFTER_BOOK: {
    label: '예약해도 오래 기다렸어요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
    weight: 4,
  },
  LACK_GUIDE: {
    label: '안내가 부족했어요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
    weight: 3,
  },
  COMPLEX_PAYMENT: {
    label: '접수/수납 과정이 복잡해요',
    category: 'MEDICAL_SERVICE',
    polarity: 'NEGATIVE',
    weight: 4,
  },

  DIRTY_HOSPITAL: {
    label: '병원이 지저분해요',
    category: 'FACILITY_ENV',
    polarity: 'NEGATIVE',
    weight: 5,
  },
  WORRY_CLEAN: {
    label: '소독/청결이 걱정돼요',
    category: 'FACILITY_ENV',
    polarity: 'NEGATIVE',
    weight: 5,
  },
  TIGHT_WAIT_AREA: {
    label: '대기실이 좁고 불편해요',
    category: 'FACILITY_ENV',
    polarity: 'NEGATIVE',
    weight: 4,
  },
  NO_PARKING_SPACE: {
    label: '주차 공간이 부족해요',
    category: 'FACILITY_ENV',
    polarity: 'NEGATIVE',
    weight: 3,
  },
  CONFUSING_SIGNAGE: {
    label: '안내 표지가 헷갈려요',
    category: 'FACILITY_ENV',
    polarity: 'NEGATIVE',
    weight: 3,
  },
  NO_WHEELCHAIR_ACCESS: {
    label: '휠체어 접근이 어려워요',
    category: 'FACILITY_ENV',
    polarity: 'NEGATIVE',
    weight: 4,
  },
  NO_GUARDIAN_SPACE: {
    label: '보호자 공간이 부족해요',
    category: 'FACILITY_ENV',
    polarity: 'NEGATIVE',
    weight: 3,
  },

  EXPENSIVE: {
    label: '진료비가 너무 비싸요',
    category: 'COST_ADMIN',
    polarity: 'NEGATIVE',
    weight: 5,
  },
  PUSH_UNNECESSARY: {
    label: '불필요한 시술을 권유해요',
    category: 'COST_ADMIN',
    polarity: 'NEGATIVE',
    weight: 5,
  },
  LACK_FEE_EXPLAN: {
    label: '비용 설명이 부족해요',
    category: 'COST_ADMIN',
    polarity: 'NEGATIVE',
    weight: 4,
  },
  INSURANCE_BUREAUCRACY: {
    label: '보험 처리가 번거로워요',
    category: 'COST_ADMIN',
    polarity: 'NEGATIVE',
    weight: 4,
  },
  LATE_RECEIPT: {
    label: '영수증/서류 처리 지연',
    category: 'COST_ADMIN',
    polarity: 'NEGATIVE',
    weight: 3,
  },
};

// 리뷰 인터페이스
export interface Review {
  reviewId: number;
  userId: number; // 실제 User 객체가 아니라 userId만 포함 가능
  hospitalId: number;
  doctorId: number;
  appointmentId: number;
  contents: string;
  reportCount: number;
  keywords: KeywordType[]; // keyword는 문자열 배열로
  createdAt: string; // 생성 날짜 (ISO 문자열)
}
