// src/types/review.d.ts

export type Category = 'MEDICAL_SERVICE' | 'FACILITY_ENV' | 'COST_ADMIN';
export type Polarity = 'POSITIVE' | 'NEGATIVE';

export interface KeywordTypeInfo {
  label: string;
  category: Category;
  polarity: Polarity;
  weight: number;
}

// KeywordType 문자열 리터럴
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

// 리뷰 인터페이스
export interface Review {
  name: string;
  reviewId: number;
  userId: number;
  hospitalId: number;
  doctorId: number;
  appointmentId: number;
  contents: string;
  reportCount: number;
  keywords: KeywordType[];
  createdAt: string;
}

// KeywordType 별 라벨 매핑
