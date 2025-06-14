export interface ReviewCreateRequest {
  appointmentId: number;
  userId: number;
  hospitalId: number;
  doctorId: number;
  keywords: string[];
  contents: string;
}

export interface ReviewUpdateRequest {
  contents: string;
  keywords: string[];
}

export interface ReviewResponse {
  reviewId: number;
  contents: string;
  createdAt: string;
  updatedAt: string;
  keywords: string[];
}

export interface ReviewMyListResponse {
  appointmentId: number;
  patientName: string;
  hospitalId: number;
  hospitalName: string;
  doctorId: number;
  doctorName: string;
  reviewId: number;
  contents: string;
  createdAt: string;
  keywords: string[];
  reportCount?: number;
}

export interface ReviewAllListResponse {
  reviewId: number;
  hospitalId: number;
  hospitalName: string;
  contents: string;
  createdAt: string;
  updatedAt: string;
  reportCount: number;
  keywords: string[];
}

export interface HospitalReviewResponse {
  reviewId: number;
  contents: string;
  createdAt: string;
  reportCount: number;
  keywords: string[];
}

//페이징 처리
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
