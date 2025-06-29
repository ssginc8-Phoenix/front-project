import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    min-height: calc(100vh - 80px);
  }

  @media (max-width: 480px) {
    padding: 1rem 0.8rem;
  }
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
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

  @media (max-width: 768px) {
    padding-top: 1.5rem;
  }

  @media (max-width: 480px) {
    padding-top: 1rem;
  }
`;
