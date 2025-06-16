import { create } from 'zustand';
import type { ReviewCreateRequest, ReviewUpdateRequest } from '~/features/reviews/types/review';
import * as reviewAPI from '~/features/reviews/api/reviewAPI';

interface ReviewForm {
  userId: number;
  hospitalId: number;
  doctorId: number;
  appointmentId: number;
  keywords: string[];
  contents: string;
}

interface ReviewStore extends ReviewForm {
  loading: boolean;
  error: string | null;

  // 필드 하나만 업데이트
  setField: <K extends keyof ReviewForm>(field: K, value: ReviewForm[K]) => void;

  // 키워드 토글
  toggleKeyword: (keyword: string) => void;

  // 폼 초기화
  resetForm: () => void;

  // 생성/수정
  createReview: () => Promise<void>;
  updateReview: (reviewId: number) => Promise<void>;
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  // 초기 폼 값
  userId: 0,
  hospitalId: 0,
  doctorId: 0,
  appointmentId: 0,
  keywords: [],
  contents: '',

  // 상태
  loading: false,
  error: null,

  setField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),

  toggleKeyword: (keyword) => {
    const { keywords } = get();
    const next = keywords.includes(keyword)
      ? keywords.filter((k) => k !== keyword)
      : [...keywords, keyword];
    set({ keywords: next });
  },

  resetForm: () =>
    set({
      userId: 0,
      hospitalId: 0,
      doctorId: 0,
      appointmentId: 0,
      keywords: [],
      contents: '',
      loading: false,
      error: null,
    }),

  createReview: async () => {
    set({ loading: true, error: null });
    try {
      const { userId, hospitalId, doctorId, appointmentId, keywords, contents } = get();
      const payload: ReviewCreateRequest = {
        userId,
        hospitalId,
        doctorId,
        appointmentId,
        keywords,
        contents,
      };
      await reviewAPI.addReview(payload);
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '리뷰 생성 중 알 수 없는 오류가 발생했습니다.',
      });
    } finally {
      set({ loading: false });
    }
  },

  updateReview: async (reviewId) => {
    set({ loading: true, error: null });
    try {
      const { keywords, contents } = get();
      const payload: ReviewUpdateRequest = { keywords, contents };
      await reviewAPI.editReview(reviewId, payload);
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '리뷰 수정 중 알 수 없는 오류가 발생했습니다.',
      });
    } finally {
      set({ loading: false });
    }
  },
}));
