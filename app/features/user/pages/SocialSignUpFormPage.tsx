import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Header from '~/layout/Header';
import { getProviderId } from '~/features/user/api/UserAPI';
import { useNavigate } from 'react-router';
import SocialSignupForm from '~/features/user/components/signUp/SocialSignupForm';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
`;

const SocialSignUpFormPage = () => {
  const navigate = useNavigate();
  const [providerId, setProviderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviderId = async () => {
      try {
        const id = await getProviderId();
        setProviderId(id);
      } catch (error) {
        console.error('providerId 조회 실패:', error);
        navigate('/login');
      }
    };

    fetchProviderId();
  }, []);

  return (
    <>
      <Header />
      <Wrapper>
        <SocialSignupForm providerId={providerId} />
      </Wrapper>
    </>
  );
};

export default SocialSignUpFormPage;
