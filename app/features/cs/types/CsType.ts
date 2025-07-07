// src/features/cs/types.ts

/**
 * 메시지 전송 요청 payload
 */
export interface CsMessageRequest {
  /** CS 방 ID */
  roomId: number;
  /** 전송할 메시지 텍스트 */
  text: string;
}

/**
 * 서버가 반환하는 메시지 정보
 */
export interface CsMessageResponse {
  /** 메시지 고유 ID */
  id: number;
  /** CS 방 ID */
  roomId: string;
  /** 메시지 텍스트 */
  text: string;
  /** 발신자 이름 */
  senderName: string;
  /** 발신자 프로필 이미지 URL */
  senderAvatarUrl: string;
  /** 타임스탬프 (ISO 8601 형식) */
  timestamp: string;
}

/**
 * ChatWindow 컴포넌트가 사용하는 메시지 타입
 */
export interface ChatWindowMessage {
  text: string;
  /** Date 객체로 변환된 timestamp */
  date: Date;
  sender: string;
  avatar: string;
}

/**
 * CS 방 목록 조회 시 반환되는 객체
 */
export interface CsRoomResponse {
  csRoomId: number;
  customerId: number;

  agentId: number;

  status: boolean;
}

/**
 * WebSocket 메시지를 처리할 콜백 타입
 */
export type OnCsMessage = (msg: CsMessageResponse) => void;

/**
 * STOMP 클라이언트 래퍼 타입
 */
export interface WsClient {
  /** 활성화 (connect) */
  activate: () => void;
  /** 비활성화 (disconnect) */
  deactivate: () => void;
  /** 메시지 publish */
  publish: (options: { destination: string; body: string }) => void;
  /** topic 구독 */
  subscribe: (destination: string, callback: (message: any) => void) => void;
  /** 현재 연결 상태 */
  connected: boolean;
}
