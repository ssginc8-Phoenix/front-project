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
export const downloadDocument = (id: number): Promise<Blob> =>
  axios
    .get(`/api/v1/insurance/documents/${id}/download`, { responseType: 'blob' })
    .then((res) => res.data);

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
