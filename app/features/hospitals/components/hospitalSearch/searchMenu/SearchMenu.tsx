// src/components/hospitalSearch/searchMenu/SearchMenu.tsx
import React, { useState, useLayoutEffect } from 'react';
import styled from 'styled-components';

const MenuWrapper = styled.div`
  background-color: #ffffff;
  padding: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 0 0 8px 8px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1 1 300px;
  max-width: 250px;
  min-width: 290px;
  padding: 0.8rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.8rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #fff;
  cursor: pointer;
`;

const SearchButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

interface SearchMenuProps {
  /**
   * query, sortBy, radius(km) 를 부모로 전달합니다
   */
  onSearch: (query: string, sortBy: 'NAME' | 'DISTANCE' | 'REVIEW_COUNT', radius: number) => void;
  initialQuery: string;
  initialSortBy: 'NAME' | 'DISTANCE' | 'REVIEW_COUNT';
  /** 반경 초기값 (km) — 없으면 5km */
  initialRadius?: number;
}

// sortBy 옵션 중 NAME 은 별도 추가하므로 DISTANCE/REVIEW_COUNT 만
const SORT_OPTIONS = [{ value: 'DISTANCE', label: '거리순' }];

// radius 선택 옵션
const RADIUS_OPTIONS = [
  { value: 3, label: '3km' },
  { value: 5, label: '5km' },
  { value: 10, label: '10km' },
];

const SearchMenu: React.FC<SearchMenuProps> = ({
  onSearch,
  initialQuery,
  initialSortBy,
  initialRadius = 5,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [radius, setRadius] = useState<number>(initialRadius);

  useLayoutEffect(() => {
    setQuery(initialQuery);
    setSortBy(initialSortBy);
    setRadius(initialRadius);
  }, [initialQuery, initialSortBy, initialRadius]);

  const handleSearch = () => {
    onSearch(query, sortBy, radius);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <MenuWrapper>
      <InputGroup>
        {/* 검색어 */}
        <SearchInput
          type="text"
          placeholder="병원 이름"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* 정렬 기준 */}
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'NAME' | 'DISTANCE' | 'REVIEW_COUNT')}
        >
          <option value="NAME">전체(이름순)</option>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        {/* 반경 선택 */}
        <Select value={radius} onChange={(e) => setRadius(Number(e.target.value))}>
          {RADIUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        {/* 검색 버튼 */}
        <SearchButton onClick={handleSearch}>검색</SearchButton>
      </InputGroup>
    </MenuWrapper>
  );
};

export default SearchMenu;
