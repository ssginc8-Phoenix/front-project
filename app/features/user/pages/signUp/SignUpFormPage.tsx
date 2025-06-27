import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { getProviderId } from '~/features/user/api/UserAPI';
import SocialSignupForm from '~/features/user/components/signUp/SocialSignupForm';
import UserSignupForm from '~/features/user/components/signUp/UserSignupForm';

const sizes = {
  laptopL: '1600px',
  laptop: '1024px',
  tablet: '768px',
  mobile: '480px',
  mobileSmall: '360px',
};

const media = {
  laptopL: `@media (max-width: ${sizes.laptopL})`,
  laptop: `@media (max-width: ${sizes.laptop})`,
  tablet: `@media (max-width: ${sizes.tablet})`,
  mobile: `@media (max-width: ${sizes.mobile})`,
  mobileSmall: `@media (max-width: ${sizes.mobileSmall})`,
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
  width: 100%;
  box-sizing: border-box;

  ${media.tablet} {
    padding-top: 80px;
  }

  ${media.mobile} {
    padding-top: 60px;
  }

  ${media.mobileSmall} {
    padding-top: 50px;
  }
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
        setProviderId(undefined);
      }
    };

    fetchProviderId();
  }, []);

  return (
    <>
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
