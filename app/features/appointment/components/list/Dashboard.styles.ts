import styled from 'styled-components';
import { media } from '~/components/styled/GlobalStyle';

export const PageWrapper = styled.div`
  ${media.mobile} {
    gap: 1rem;
  }
`;

export const TopSectionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto 20px auto;
  box-sizing: border-box;

  ${media.mobile} {
    gap: 15px;
    margin-bottom: 15px;
    padding: 15px;
    border-radius: 12px;
  }
`;

export const StyledButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #004085;
  }

  ${media.mobile} {
    padding: 12px 15px;
    font-size: 0.95rem;
  }
`;

export const DashboardWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 20px;
  max-width: 100%;

  ${media.mobile} {
    padding: 15px;
    gap: 15px;
    border-radius: 12px;
    margin-bottom: 10px;
  }
`;

export const SectionWrapper = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;

  ${media.mobile} {
    flex-direction: column;
    gap: 15px;
  }
`;

export const Section = styled.div`
  flex: 1;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-height: 60vh;

  ${media.tablet} {
    min-height: 40vh;
    width: calc(50% - 7.5px);
  }

  ${media.mobile} {
    min-height: auto;
    padding: 12px;
    width: 100%;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;

  ${media.mobile} {
    font-size: 16px;
    margin-bottom: 12px;
  }
`;

export const NoAppointmentsMessage = styled.p`
  color: #777;
  font-size: 0.95rem;
  text-align: center;
  padding: 20px 0;
  border-top: 1px dashed #eee;
  margin-top: 10px;

  ${media.mobile} {
    font-size: 0.85rem;
    padding: 15px 0;
    margin-top: 8px;
  }
`;
