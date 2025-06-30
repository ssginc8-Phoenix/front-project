import React, { useState } from 'react';
import styled from 'styled-components';

import Pagination from '~/components/common/Pagination';
import QaChatModal from '~/features/qna/component/QaChatModal';
import { useDoctorQnAs } from '~/features/qna/hooks/useDoctorQnAs';
import {
  Wrapper,
  Title as StyledTitle,
  ContentBody,
  PaginationWrapper,
} from '~/components/styled/MyPage.styles';

const PAGE_SIZE = 10;

const DoctorQnaListPage: React.FC = () => {
  const [tab, setTab] = useState<'PENDING' | 'COMPLETED'>('PENDING');
  const [page, setPage] = useState(0);

  const pendingQuery = useDoctorQnAs('PENDING', 0, 1);
  const completedQuery = useDoctorQnAs('COMPLETED', 0, 1);
  const { data, isLoading, isError, refetch } = useDoctorQnAs(tab, page, PAGE_SIZE);

  const [openId, setOpenId] = useState<number | null>(null);

  if (isLoading) return <Centered>로딩 중…</Centered>;
  if (isError || !data) return <Centered>목록을 불러올 수 없습니다.</Centered>;

  return (
    <Wrapper>
      <StyledTitle>
        <Emoji>💬</Emoji> 의사 Q&A
      </StyledTitle>

      <TabContainer>
        <TabButton $isActive={tab === 'PENDING'} onClick={() => setTab('PENDING')}>
          대기중 ({pendingQuery.data?.totalElements ?? 0})
        </TabButton>
        <TabButton $isActive={tab === 'COMPLETED'} onClick={() => setTab('COMPLETED')}>
          완료 ({completedQuery.data?.totalElements ?? 0})
        </TabButton>
      </TabContainer>

      <ContentBody>
        {data.content.length === 0 ? (
          <Centered>해당 상태의 질문이 없습니다.</Centered>
        ) : (
          <List>
            {data.content.map((post) => (
              <Card key={post.qnaPostId} onClick={() => setOpenId(post.qnaPostId)}>
                <Snippet>{post.content.slice(0, 50)}…</Snippet>
                <Meta>{new Date(post.createdAt).toLocaleDateString()}</Meta>
              </Card>
            ))}
          </List>
        )}

        <PaginationWrapper>
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </PaginationWrapper>
      </ContentBody>

      {openId !== null && (
        <QaChatModal
          qnaId={openId}
          onClose={() => {
            setOpenId(null);
            setTab('PENDING');
            setPage(0);
            refetch();
          }}
          showInput={tab === 'PENDING'}
          isDoctor
        />
      )}
    </Wrapper>
  );
};

const Emoji = styled.span`
  display: none;

  @media (max-width: 768px) {
    display: inline;
  }
`;

const Centered = styled.p`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
  border-bottom: 1.5px solid #d6d6d6;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    margin-bottom: 15px;
  }
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  padding: 10px 20px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: ${(props) => (props.$isActive ? 'bold' : 'normal')};
  color: ${(props) => (props.$isActive ? '#007bff' : '#555')};
  border-bottom: ${(props) => (props.$isActive ? '2px solid #007bff' : 'none')};
  transition: all 0.3s ease;

  &:hover {
    color: #007bff;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 8px 15px;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 7px 12px;
  }
`;

const List = styled.div`
  width: 100%;
  max-width: 960px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled.div`
  padding: 24px 28px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition:
    transform 0.15s,
    box-shadow 0.15s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }
`;

const Snippet = styled.p`
  margin: 0 0 10px;
  font-size: 1rem;
  font-weight: 500;
  color: #222;
  line-height: 1.5;
`;

const Meta = styled.div`
  font-size: 0.85rem;
  color: #999;
`;

export default DoctorQnaListPage;
