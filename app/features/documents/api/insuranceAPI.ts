import axios from 'axios';
import type {
  DocumentApprovalDTO,
  DocumentResponseDTO,
  UserDocumentRequestDTO,
} from '~/features/documents/types/insurance';

const api = axios.create({ baseURL: '/api/v1/insurance/documents' });

// 사용자 요청 생성
export const createDocumentRequest = (
  payload: UserDocumentRequestDTO,
): Promise<DocumentResponseDTO> =>
  axios.post('/api/v1/insurance/documents', payload).then((res) => res.data);

// 상태 조회
export const getDocumentStatus = (id: number): Promise<DocumentResponseDTO> =>
  axios.get(`/api/v1/insurance/documents/${id}`).then((res) => res.data);

// 다운로드
export const downloadDocument = async (id: number): Promise<{ blob: Blob; filename: string }> => {
  const res = await axios.get(`/api/v1/insurance/documents/${id}/download`, {
    responseType: 'arraybuffer',
    withCredentials: true,
  });
  console.log('▶ download response headers:', res.headers);
  console.log('▶ content-disposition:', res.headers['content-disposition']);
  // 1) 파일명 추출
  const disposition = res.headers['content-disposition'] || '';
  const match = disposition.match(/filename="?(.+?)"?(;|$)/);
  const filename = match ? match[1] : `document-${id}.pdf`;

  // 2) 수동 Blob 생성
  const contentType = res.headers['content-type'] || 'application/octet-stream';
  const blob = new Blob([res.data], { type: contentType });

  return { blob, filename };
};
// 관리자: 전체 목록
export const listAllDocuments = (): Promise<DocumentResponseDTO[]> =>
  axios.get('/api/v1/admin/insurance/documents').then((res) => res.data);

// 관리자: 파일 첨부

export const attachDocumentFile = (id: number, file: File) => {
  const form = new FormData();
  form.append('file', file); // key 는 반드시 "file"
  return axios.post(`/api/v1/admin/insurance/documents/${id}/attach`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// 승인/반려
export const approveDocument = (id: number, dto: DocumentApprovalDTO): Promise<void> =>
  axios.patch(`/api/v1/admin/insurance/documents/${id}`, dto).then(() => {});

export const getMyDocumentRequests = async (
  requesterId: number,
  page: number = 0,
  size: number = 10,
) => {
  const res = await axios.get(`/api/v1/insurance/documents`, {
    params: { requesterId, page, size },
  });
  return res.data as {
    content: DocumentResponseDTO[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
  };
};
