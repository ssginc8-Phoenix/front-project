import styled from 'styled-components';

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const IconButton = styled.button`
  all: unset;
  cursor: pointer;
  width: 200px;
  height: 48px;
  display: block;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    pointer-events: none;
    user-select: none;
  }
`;

const SocialLoginButtons = () => {
  return (
    <ButtonGroup>
      <IconButton>
        <img src="/kakaoLogin.png" alt="카카오 로그인" />
      </IconButton>
      <IconButton>
        <img src="/naverLogin.png" alt="네이버 로그인" />
      </IconButton>
    </ButtonGroup>
  );
};

export default SocialLoginButtons;
