// src/features/cs/api/csAPI.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// 페이징 응답 타입
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
}

// CsRoom 타입
export interface CsRoomResponse {
  lastTime: string;
  lastMessage: string;
  customerId: number;
  csRoomId: number;
  agentId: number;
  status: string;
  customerName: string;
  customerAvatarUrl: string;
}

// CsMessage 타입
export interface CsMessageResponse {
  system: boolean;
  csRoomId: number;
  csMessageId: number;
  userId: number;
  content: string;
  createdAt: string;
}

// CsNote 타입
export interface CsNoteDto {
  csNoteId: number;
  content: string;
  agentId: number;
  createdAt: string;
}

// CS 방 목록 조회 (관리자)
export const fetchAdminCsRooms = async (
  page = 0,
  size = 20,
): Promise<PageResponse<CsRoomResponse>> => {
  const { data } = await apiClient.get<PageResponse<CsRoomResponse>>('/admin/csrooms', {
    params: { page, size },
  });
  return data;
};

// 특정 방 메시지 조회
export const fetchCsMessages = async (
  csRoomId: number | string,
  before?: string,
  size = 20,
): Promise<CsMessageResponse[]> => {
  const { data } = await apiClient.get<CsMessageResponse[]>(`/csrooms/${csRoomId}/messages`, {
    params: { before, size },
  });
  return data;
};

// 고객별 메시지 조회
export const fetchCsMessagesByCustomer = async (
  customerId: number,
  before?: string,
  size = 20,
): Promise<CsMessageResponse[]> => {
  const { data } = await apiClient.get<CsMessageResponse[]>('/csrooms/messages', {
    params: { customerId, before, size },
  });
  return data;
};

// 메시지 전송
export const postCsMessage = async (
  csRoomId: number | string,
  content: string,
): Promise<CsMessageResponse> => {
  const { data } = await apiClient.post<CsMessageResponse>(`/csrooms/${csRoomId}/messages`, {
    content,
  });
  return data;
};

// 상담사 배정
export const assignCsAgent = async (
  csRoomId: number | string,
  agentId: number | string,
): Promise<void> => {
  await apiClient.patch(`/csrooms/${csRoomId}/assign`, { agentId });
};

// 상담 상태 변경
export const updateCsRoomStatus = async (csRoomId: number, status: string): Promise<void> => {
  // 상태를 텍스트/plain으로 전송
  await apiClient.patch(`/csrooms/${csRoomId}/status`, status, {
    headers: { 'Content-Type': 'text/plain' },
  });
};

// CS 방 생성
export interface CsRoomCreateRequest {
  customerId: number | string;
  title?: string;
}
export const createCsRoom = async (payload: CsRoomCreateRequest): Promise<number> => {
  const { data } = await apiClient.post<number>(`/csrooms`, payload);
  return data;
};

// CS 룸 삭제
export const deleteCsRoom = async (csRoomId: number): Promise<void> => {
  await apiClient.delete(`/csrooms/${csRoomId}`);
};

// 상담 메모 조회
export const fetchCsNotes = async (
  csRoomId: number,
  page = 0,
  size = 20,
): Promise<PageResponse<CsNoteDto>> => {
  const { data } = await apiClient.get<PageResponse<CsNoteDto>>(`/csrooms/${csRoomId}/notes`, {
    params: { page, size },
  });
  return data;
};

// 상담 메모 저장
export const saveCsNote = async (
  csRoomId: number,
  payload: {
    agentId: number;
    content: string;
  },
): Promise<CsNoteDto> => {
  const { data } = await apiClient.post<CsNoteDto>(`/csrooms/${csRoomId}/notes`, payload);
  return data;
};
export const assignAgentToRoom = async (csRoomId: number, agentId: number): Promise<void> => {
  await apiClient.patch(`/csrooms/${csRoomId}/assign`, { agentId });
};
export interface CsRoomDetailResponse {
  csRoomId: number;
  customerId: number;
  customerName: string;
  customerAvatarUrl: string;
  agentId?: number;
  agentName?: string;
  agentAvatarUrl?: string;
  status: string;
}
// 단건 조회
export function fetchCsRoomDetail(csRoomId: number) {
  return apiClient.get<CsRoomDetailResponse>(`/csRooms/${csRoomId}`);
}
