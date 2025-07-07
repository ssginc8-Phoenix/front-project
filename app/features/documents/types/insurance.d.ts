import { DocumentStatus } from './DocumentStatus';
export interface DocumentResponseDTO {
  documentId: number;
  status: DocumentStatus;
  rejectionReason?: string;
  downloadUrl?: string;
  type: string;
  originalName: string;
}
export interface UserDocumentRequestDTO {
  requesterId: number;
  note?: string;
  hospitalId: number;
  appointmentId: number;
  type: string;
}

/** PATCH /api/v1/insurance/documents/{id} 요청 시 */
export interface DocumentApprovalDTO {
  approved: boolean;
  reason?: string; // 반려 시 필수
}

export enum DocumentStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
