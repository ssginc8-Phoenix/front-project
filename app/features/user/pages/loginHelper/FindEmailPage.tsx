import { useState } from 'react';
import styled from 'styled-components';
import { findEmail } from '~/features/user/api/UserAPI';
import CommonModal from '~/components/common/CommonModal';
import FindEmailForm from '~/features/user/components/loginHelper/FindEmailForm';

const Wrapper = styled.div`
  max-width: 500px;
  margin: 10rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);

  /* Responsive adjustments for Wrapper */
  @media (max-width: 768px) {
    width: calc(100% - 2rem); /* Full width with horizontal padding */
    margin: 5rem 1rem; /* Adjust top/bottom margin, add side margin */
    padding: 1.5rem;
  }

  @media (max-width: 360px) {
    width: calc(100% - 2rem); /* Maximize width on smallest screens */
    margin: 3rem 1rem; /* Further reduce top margin for mobile */
    padding: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;

  /* Responsive adjustments for Title */
  @media (max-width: 360px) {
    font-size: 1.3rem; /* Smaller font size for mobile */
    margin-bottom: 1rem;
  }
`;

const Description = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  color: #555;

  /* Responsive adjustments for Description */
  @media (max-width: 360px) {
    font-size: 0.9rem; /* Smaller font size for mobile */
    margin-bottom: 1.5rem;
  }
`;

const Message = styled.div`
  margin-top: 1rem;
  font-size: 0.95rem;
  text-align: center;
  color: #333;

  /* Responsive adjustments for Message */
  @media (max-width: 360px) {
    font-size: 0.85rem; /* Smaller font size for mobile */
    margin-top: 0.8rem;
  }
`;

const FindEmailPage = () => {
  const [email, setEmail] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleFindEmail = async (name: string, phone: string) => {
    try {
      const response = await findEmail({ name, phone });
      setEmail(response.email);
    } catch {
      setEmail(''); // 이메일을 찾지 못했을 경우 빈 문자열로 설정
    } finally {
      setModalOpen(true);
    }
  };

  return (
    <>
      <Wrapper>
        <Title>이메일 찾기</Title>
        <Description>이름과 휴대폰 번호를 입력하면 가입한 이메일을 확인할 수 있어요.</Description>
        <FindEmailForm onFindEmail={handleFindEmail} />

        {modalOpen && (
          <CommonModal
            title={email ? '이메일 찾기 완료' : '이메일을 찾을 수 없습니다'}
            buttonText="확인"
            onClose={() => setModalOpen(false)}
          >
            {email ? (
              <Message>
                회원님의 이메일은 <strong>{email}</strong> 입니다.
              </Message>
            ) : (
              <Message>일치하는 이메일 정보를 찾을 수 없습니다.</Message>
            )}
          </CommonModal>
        )}
      </Wrapper>
    </>
  );
};

export default FindEmailPage;
