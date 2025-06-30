import styled from 'styled-components';
import { media } from '~/components/styled/GlobalStyle';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  ${media.mobile} {
    padding: 0 1rem;
    gap: 0.75rem;
  }
`;

export const TitleBox = styled.div`
  margin-bottom: 1rem;

  ${media.mobile} {
    margin-bottom: 0.5rem;
  }
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #00499e;

  ${media.mobile} {
    font-size: 1.1rem;
  }
`;

export const Description = styled.p`
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;

  ${media.mobile} {
    font-size: 0.8rem;
  }
`;

export const CardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  ${media.mobile} {
    flex-direction: column;
    gap: 0.75rem;
  }
`;
