// src/features/qna/pages/DoctorQnaListPage.tsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { useDoctorQnAs } from '~/features/qna/hooks/useDoctorQnAs';
import QaChatModal from '~/features/qna/component/QaChatModal';

export const DoctorQnaListPage: React.FC = () => {
  const [tab, setTab] = useState<'PENDING' | 'COMPLETED'>('PENDING');
  const [page, setPage] = useState(0);
  const size = 10;

  // 각각의 상태별 전체 개수만 조회
  const pendingQuery = useDoctorQnAs('PENDING', 0, 1);
  const completedQuery = useDoctorQnAs('COMPLETED', 0, 1);

  // 현재 선택된 탭에 대한 데이터 조회
  const { data, isLoading, isError } = useDoctorQnAs(tab, page, size);

  const [openId, setOpenId] = useState<number | null>(null);

  if (isLoading) return <Centered>로딩 중…</Centered>;
  if (isError || !data) return <Centered>목록을 불러올 수 없습니다.</Centered>;

  return (
    <Container>
      <Header>💬 의사 Q&A </Header>

      <TabBar>
        <Tab
          active={tab === 'PENDING'}
          onClick={() => {
            setTab('PENDING');
            setPage(0);
          }}
        >
          대기중 ({pendingQuery.data?.totalElements ?? 0})
        </Tab>
        <Tab
          active={tab === 'COMPLETED'}
          onClick={() => {
            setTab('COMPLETED');
            setPage(0);
          }}
        >
          완료됨 ({completedQuery.data?.totalElements ?? 0})
        </Tab>
      </TabBar>

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

      <Pagination>
        <PageButton disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
          이전
        </PageButton>
        <PageInfo>
          {page + 1} / {data.totalPages}
        </PageInfo>
        <PageButton disabled={page + 1 >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
          다음
        </PageButton>
      </Pagination>

      {openId !== null && (
        <QaChatModal qnaId={openId} onClose={() => setOpenId(null)} showInput={tab === 'PENDING'} />
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.h2`
  text-align: center;
  margin-bottom: 16px;
`;

const Centered = styled.p`
  text-align: center;
  color: #666;
  margin: 48px 0;
`;

const TabBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 8px 0;
  border: none;
  cursor: pointer;
  background: ${({ active }) => (active ? '#00499e' : '#f0f0f0')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Card = styled.div`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const Snippet = styled.p`
  margin: 0 0 8px;
  font-size: 1rem;
  color: #333;
`;

const Meta = styled.div`
  font-size: 0.75rem;
  color: #888;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  border: none;
  background: #eee;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const PageInfo = styled.span`
  font-size: 0.875rem;
  color: #555;
`;
