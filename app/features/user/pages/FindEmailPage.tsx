import { useState } from 'react';
import styled from 'styled-components';
import { findEmail } from '~/features/user/api/UserAPI';
import CommonModal from '~/components/common/CommonModal';
import FindEmailForm from '~/features/user/components/FindEmailForm';
import Header from '~/layout/Header';

const Wrapper = styled.div`
  max-width: 480px;
  margin: 80px auto;
  padding: 2rem;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`;

const Message = styled.div`
  margin-top: 1rem;
  font-size: 0.95rem;
  text-align: center;
  color: #333;
`;

const FindEmailPage = () => {
  const [email, setEmail] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleFindEmail = async (name: string, phone: string) => {
    try {
      const response = await findEmail({ name, phone });
      setEmail(response.email);
      setModalOpen(true);
    } catch (e) {
      setEmail('');
      setModalOpen(true);
    }
  };

  return (
    <>
      <Header />
      <Wrapper>
        <Title>이메일 찾기</Title>
        <FindEmailForm onFindEmail={handleFindEmail} />

        {modalOpen && (
          <CommonModal
            title={email ? '이메일 찾기 완료' : '이메일을 찾을 수 없습니다'}
            buttonText="확인"
            onClose={() => setModalOpen(false)}
          >
            {email && (
              <Message>
                회원님의 이메일은 <strong>{email}</strong> 입니다.
              </Message>
            )}
          </CommonModal>
        )}
      </Wrapper>
    </>
  );
};

export default FindEmailPage;
