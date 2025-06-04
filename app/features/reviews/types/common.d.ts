export interface ActionResult<T> {
  success: boolean; // 요청이 성공했는지
  data: T;
  message?: string; // 에러나 상태 메시지
}
