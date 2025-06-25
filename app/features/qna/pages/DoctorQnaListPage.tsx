import React, { useState } from 'react';
import styled from 'styled-components';

import Sidebar from '~/common/Sidebar';
import Pagination from '~/components/common/Pagination';
import QaChatModal from '~/features/qna/component/QaChatModal';
import { useDoctorQnAs } from '~/features/qna/hooks/useDoctorQnAs';

const PAGE_SIZE = 10;

const DoctorQnaListPage: React.FC = () => {
  const [tab, setTab] = useState<'PENDING' | 'COMPLETED'>('PENDING');
  const [page, setPage] = useState(0);

  // 건수만 표시하기 위한 쿼리
  const pendingQuery = useDoctorQnAs('PENDING', 0, 1);
  const completedQuery = useDoctorQnAs('COMPLETED', 0, 1);

  // 실제 리스트 쿼리
  const { data, isLoading, isError, refetch } = useDoctorQnAs(tab, page, PAGE_SIZE);

  const [openId, setOpenId] = useState<number | null>(null);

  /* ─────── 렌더링 ─────── */
  if (isLoading) return <Centered>로딩 중…</Centered>;
  if (isError || !data) return <Centered>목록을 불러올 수 없습니다.</Centered>;

  return (
    <Layout>
      <Sidebar />

      <Content>
        <Header>💬 의사 Q&A</Header>
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

        <PaginationWrapper>
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </PaginationWrapper>
      </Content>

      {/* Q&A 모달 */}
      {openId !== null && (
        <QaChatModal
          qnaId={openId}
          onClose={() => {
            setOpenId(null);
            setTab('PENDING'); // 모달 닫히면 대기중 탭으로
            setPage(0);
            refetch(); // 목록 갱신
          }}
          showInput={tab === 'PENDING'}
          isDoctor
        />
      )}
    </Layout>
  );
};

const Layout = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const Content = styled.main`
  flex: 1;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #00499e;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Centered = styled.p`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
`;

const TabBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 10px 24px;
  border-radius: 999px;
  border: none;
  font-size: 1rem;
  font-weight: ${({ active }) => (active ? 700 : 500)};
  background-color: ${({ active }) => (active ? '#005fcc' : '#f1f3f5')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ active }) => (active ? '#004da8' : '#e4e7ea')};
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

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
`;

export default DoctorQnaListPage;
