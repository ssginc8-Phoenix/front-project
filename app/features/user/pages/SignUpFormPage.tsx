import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Header from '~/layout/Header';
import { getProviderId } from '~/features/user/api/UserAPI';
import SocialSignupForm from '~/features/user/components/signUp/SocialSignupForm';
import UserSignupForm from '~/features/user/components/signUp/UserSignupForm';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
`;

const SignUpFormPage = () => {
  const [providerId, setProviderId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const fetchProviderId = async () => {
      try {
        const id = await getProviderId();
        setProviderId(id);
      } catch (error) {
        console.error('providerId 조회 실패:', error);
        setProviderId(null);
      }
    };

    fetchProviderId();
  }, []);

  return (
    <>
      <Header />
      <Wrapper>
        {providerId === undefined ? (
          <UserSignupForm />
        ) : (
          <SocialSignupForm providerId={providerId} />
        )}
      </Wrapper>
    </>
  );
};

export default SignUpFormPage;
