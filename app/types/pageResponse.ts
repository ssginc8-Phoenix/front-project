// src/types/PageResponse.ts
export interface pageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    // 필요한 경우 더 상세히 추가하세요.
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
}
