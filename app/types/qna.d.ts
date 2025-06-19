export interface QaPostCreateRequest {
  appointmentId: number;
  content: string;
}

export interface QaPostUpdateRequest {
  content: string;
}

export interface QaPostResponse {
  qnaPostId: number | null;
  appointmentId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  answered: boolean;
  status: 'PENDING' | 'COMPLETED';
}
