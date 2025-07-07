import styled from 'styled-components';

export const media = {
  laptopL: `@media (max-width: 1600px)`,
  laptop: `@media (max-width: 1024px)`,
  tablet: `@media (max-width: 768px)`,
  mobile: `@media (max-width: 480px)`,
  mobileSmall: `@media (max-width: 360px)`,
};

export const Wrapper = styled.div`
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  margin-left: 0;

  ${media.tablet} {
    padding: 1.5rem 1rem;
    min-height: calc(100vh - 80px);
  }

  ${media.mobile} {
    padding: 1rem 0.8rem;
  }

  ${media.mobileSmall} {
    padding: 0.8rem;
  }
`;

export const Icon = styled.div`
  display: none;

  ${media.mobileSmall} {
    display: block;
  }
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;

  ${media.tablet} {
    font-size: 1.3rem;
    margin-bottom: 20px;
  }

  ${media.mobile} {
    font-size: 1.2rem;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    margin-bottom: 15px;
  }
`;

export const ContentBody = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const PaginationWrapper = styled.div`
  margin-top: auto;
  width: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  padding-top: 2rem;

  ${media.tablet} {
    padding-top: 1.5rem;
  }

  ${media.mobile} {
    padding-top: 1rem;
  }
`;
