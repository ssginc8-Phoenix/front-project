import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  background-color: ${({ active }) => (active ? '#2563eb' : '#f1f5f9')};
  color: ${({ active }) => (active ? '#fff' : '#334155')};

  &:hover {
    background-color: ${({ active }) => (active ? '#1d4ed8' : '#e2e8f0')};
  }
`;

const ArrowButton = styled.button`
  padding: 6px 8px;
  font-size: 0.9rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #334155;

  &:disabled {
    color: #94a3b8;
    cursor: not-allowed;
  }
`;

const Ellipsis = styled.span`
  padding: 6px 8px;
  font-size: 0.9rem;
  color: #94a3b8;
`;

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ totalPages, currentPage, onPageChange }: PaginationProps) => {
  const createPageNumbers = () => {
    const pages: (number | '...')[] = [];
    const maxPageButtons = 5;
    const start = Math.max(0, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    if (start > 0) {
      pages.push(0);
      if (start > 1) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      if (end < totalPages - 2) pages.push('...');
      pages.push(totalPages - 1);
    }

    return pages;
  };

  return (
    <Wrapper>
      <ArrowButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}>
        ◀ Previous
      </ArrowButton>

      {createPageNumbers().map((item, index) =>
        item === '...' ? (
          <Ellipsis key={index}>...</Ellipsis>
        ) : (
          <PageButton key={item} active={item === currentPage} onClick={() => onPageChange(item)}>
            {item + 1}
          </PageButton>
        ),
      )}

      <ArrowButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        Next ▶
      </ArrowButton>
    </Wrapper>
  );
};

export default Pagination;
