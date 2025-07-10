// src/hooks/useDocumentRequests.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDocumentRequest,
  getDocumentStatus,
  downloadDocument,
  listAllDocuments,
  attachDocumentFile,
  approveDocument,
  getMyDocumentRequests,
} from '../api/insuranceAPI';
import type {
  DocumentApprovalDTO,
  DocumentResponseDTO,
  UserDocumentRequestDTO,
} from '~/features/documents/types/insurance';
import axios from 'axios';

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<DocumentResponseDTO, Error, UserDocumentRequestDTO>({
    mutationFn: (payload) => createDocumentRequest(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['docStatus', data.documentId] });
    },
  });
};

export const useDocumentStatus = (id: number) => {
  return useQuery<DocumentResponseDTO, Error>({
    queryKey: ['docStatus', id],
    queryFn: () => getDocumentStatus(id),
    enabled: id > 0,
  });
};

export const useDownload = (id: number) => {
  return useQuery<Blob, Error>({
    queryKey: ['docDownload', id],
    queryFn: () => downloadDocument(id),
    enabled: false, // 수동으로 refetch() 호출
  });
};

export const useAdminList = () => {
  return useQuery<DocumentResponseDTO[], Error>({
    queryKey: ['adminDocs'],
    queryFn: () => listAllDocuments(),
  });
};

export const useAttachFile = () => {
  const queryClient = useQueryClient();
  return useMutation<DocumentResponseDTO, Error, { id: number; file: File }>({
    mutationFn: ({ id, file }) =>
      attachDocumentFile(id, file).then((res) => res.data as DocumentResponseDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDocs'] });
    },
  });
};

export const useApprove = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: number; dto: DocumentApprovalDTO }>({
    mutationFn: ({ id, dto }) => approveDocument(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDocs'] });
    },
  });
};
export const useDownloadDocument = (id: number) =>
  useQuery<Blob, Error>({
    queryKey: ['docDownload', id],
    queryFn: () => downloadDocument(id),
    enabled: false,
  });

/**
 * 관리자용: 모든 보험 서류 요청 목록 조회 훅
 *
 * @returns
 *  - data: DocumentResponseDTO[] | undefined
 *  - status: 'loading' | 'error' | 'success'
 *  - error: Error | null
 */

export const useAdminDocumentList = (hospitalId?: number) => {
  return useQuery({
    queryKey: ['adminDocuments', hospitalId],
    queryFn: () => getAdminDocuments(hospitalId!),
    enabled: !!hospitalId,
  });
};
export const getAdminDocuments = async (hospitalId: number) => {
  const res = await axios.get('http://localhost:8080/api/v1/admin/insurance/documents', {
    params: { hospitalId },
    withCredentials: true, // ✅ 인증 쿠키 포함
  });
  return res.data;
};
export const useMyDocumentRequests = (requesterId: number, page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: ['myDocumentRequests', requesterId, page, size],
    queryFn: () => getMyDocumentRequests(requesterId, page, size),
    enabled: !!requesterId, // requesterId 있을 때만 실행
  });
};
