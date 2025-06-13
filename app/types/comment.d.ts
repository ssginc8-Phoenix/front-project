export interface CommentRequest {
  content: string;
}

export interface CommentResponse {
  commentId: number;
  qnaPostId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}
