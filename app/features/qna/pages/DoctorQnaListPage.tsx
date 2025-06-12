import React, { useState } from 'react';
import styled from 'styled-components';
import { useDoctorQnAs } from '~/features/qna/hooks/useDoctorQnAs';

import type { QaPostResponse } from '~/types/qna';
import QaChatModal from '~/features/qna/component/QaChatModal';

export const DoctorQnaListPage: React.FC = () => {
  const { data: posts, isLoading, isError } = useDoctorQnAs();
  const [openId, setOpenId] = useState<number | null>(null);

  if (isLoading) return <Loading>로딩 중…</Loading>;
  if (isError) return <Error>목록을 불러오지 못했습니다.</Error>;

  return (
    <Container>
      <Header>💬의사 Q&A 질문 목록</Header>
      <List>
        {posts?.map((post: QaPostResponse) => (
          <Card key={post.qnaPostId} onClick={() => setOpenId(post.qnaPostId!)}>
            <Snippet>
              {post.content.length > 50 ? `${post.content.slice(0, 50)}…` : post.content}
            </Snippet>
            <CreatedAt>{new globalThis.Date(post.createdAt).toLocaleDateString()}</CreatedAt>
          </Card>
        ))}
      </List>

      {openId !== null && (
        <QaChatModal
          qnaId={openId}
          onClose={() => setOpenId(null)}
          showInput={true} // 의사용 답변 입력 폼 표시
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 1.5rem;
  background-color: #f9f9f9;
  min-height: 100vh;
`;

const Header = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #333;
`;

const List = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const Snippet = styled.div`
  font-size: 1rem;
  color: #444;
  margin-bottom: 0.5rem;
`;

// Date 라는 이름 충돌을 피하려 CreatedAt 로 변경
const CreatedAt = styled.div`
  font-size: 0.875rem;
  color: #888;
`;

const Loading = styled.p`
  padding: 2rem;
  text-align: center;
  color: #666;
`;

const Error = styled.p`
  padding: 2rem;
  text-align: center;
  color: #d9534f;
`;
