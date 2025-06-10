export interface QaPostCreateRequest {
  appointmentId: number;
  content: string;
}

export interface QaPostUpdateRequest {
  content: string;
}

export interface QaPostResponse {
  qnaPostId: number;
  appointmentId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}
