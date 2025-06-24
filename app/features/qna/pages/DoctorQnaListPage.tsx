import React, { useState } from 'react';
import styled from 'styled-components';
import { useDoctorQnAs } from '~/features/qna/hooks/useDoctorQnAs';
import QaChatModal from '~/features/qna/component/QaChatModal';
import Pagination from '~/components/common/Pagination';

export const DoctorQnaListPage: React.FC = () => {
  const [tab, setTab] = useState<'PENDING' | 'COMPLETED'>('PENDING');
  const [page, setPage] = useState(0);
  const size = 10;

  const pendingQuery = useDoctorQnAs('PENDING', 0, 1);
  const completedQuery = useDoctorQnAs('COMPLETED', 0, 1);
  const {
    data,
    isLoading,
    isError,
    refetch, // 여기 refetch 추가
  } = useDoctorQnAs(tab, page, size);

  const [openId, setOpenId] = useState<number | null>(null);

  if (isLoading) return <Centered>로딩 중…</Centered>;
  if (isError || !data) return <Centered>목록을 불러올 수 없습니다.</Centered>;

  return (
    <Container>
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

      {openId !== null && (
        <QaChatModal
          qnaId={openId}
          onClose={() => {
            setOpenId(null); // 모달 닫기
            setTab('PENDING'); // 대기중 탭으로 강제 이동
            setPage(0); // 첫 페이지로 이동
            refetch(); // 리스트 갱신
          }}
          showInput={tab === 'PENDING'}
          isDoctor={true}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  color: #222;
  margin-bottom: 2rem;
`;

const Centered = styled.p`
  text-align: center;
  color: #888;
  font-size: 1rem;
  margin: 80px 0;
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
  font-weight: ${({ active }) => (active ? '700' : '500')};
  background-color: ${({ active }) => (active ? '#005fcc' : '#f1f3f5')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ active }) => (active ? '#004da8' : '#e4e7ea')};
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled.div`
  padding: 24px 28px;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
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
