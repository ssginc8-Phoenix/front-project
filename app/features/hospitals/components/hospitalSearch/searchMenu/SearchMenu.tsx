// src/components/hospitalSearch/searchMenu/SearchMenu.tsx
import React, { useState, useLayoutEffect } from 'react';
import styled from 'styled-components';

const MenuWrapper = styled.div`
  background-color: #ffffff;
  padding: 1.5rem;
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
  flex-grow: 1;
  padding: 0.8rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 180px;
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
  onSearch: (query: string, sortBy: string) => void;
  initialQuery: string;
  initialSpecialization: string;
  initialSortBy: string;
  onSearchModeChange?: (
    value: ((prevState: 'nearby' | 'global') => 'nearby' | 'global') | 'nearby' | 'global',
  ) => void;
  currentSearchMode?: 'nearby' | 'global';
}

const SPECIALIZATION_OPTIONS = [
  { value: '', label: '전체 진료 과목' },
  { value: '내과', label: '내과' },
  { value: '외과', label: '외과' },
  { value: '소아청소년과', label: '소아청소년과' },
  { value: '정형외과', label: '정형외과' },
  { value: '피부과', label: '피부과' },
  { value: '안과', label: '안과' },
  { value: '이비인후과', label: '이비인후과' },
];

const SORT_OPTIONS = [
  { value: 'DISTANCE', label: '거리순' },
  { value: 'RATING', label: '평점순' },
  { value: 'REVIEW_COUNT', label: '리뷰 많은 순' },
];

const SearchMenu = ({
  onSearch,
  initialQuery,
  initialSpecialization,
  initialSortBy,
  currentSearchMode,
}: SearchMenuProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [specialization, setSpecialization] = useState(initialSpecialization);
  const [sortBy, setSortBy] = useState(initialSortBy);

  useLayoutEffect(() => {
    setQuery(initialQuery);
    setSpecialization(initialSpecialization);
    setSortBy(initialSortBy);
  }, [initialQuery, initialSpecialization, initialSortBy]);

  const handleSearch = () => {
    onSearch(query, sortBy);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <MenuWrapper>
      <InputGroup>
        <SearchInput
          type="text"
          placeholder="병원 이름, 의사 이름 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <Select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
          {SPECIALIZATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        <SearchButton onClick={handleSearch}>검색</SearchButton>
      </InputGroup>
    </MenuWrapper>
  );
};

export default SearchMenu;
