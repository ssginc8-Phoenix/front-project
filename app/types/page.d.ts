export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // 현재 페이지
  first: boolean;
  last: boolean;
  empty: boolean;
}
