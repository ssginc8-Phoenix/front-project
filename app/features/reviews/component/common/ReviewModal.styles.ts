import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
`;

export const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 48rem;
  max-height: 90vh;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  margin: 1rem;
  overflow-y: auto;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;

  &:hover {
    color: #374151;
  }
`;

export const HeaderWrapper = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 2rem 2rem 1.5rem;
`;

export const HospitalName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

export const DoctorName = styled.p`
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
`;

export const PromptText = styled.p`
  font-size: 0.875rem;
  color: #00499e;
`;

export const KeywordsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

export const SectionContainer = styled.div`
  flex: 1;
  padding: 0 2rem;
`;

export const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 0.5rem;
`;

export const KeywordsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
`;

export const GoodKeywordButton = styled.button<{ selected: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
  ${({ selected }) =>
    selected
      ? `
    background-color: #ECF2FE;
    color: #00499E;
    border: 1px solid #00499E;
  `
      : `
    background-color: rgba(236, 242, 254, 0.7);
    color: #00499E;
    &:hover {
      background-color: #ECF2FE;
    }
  `}
`;

export const BadKeywordButton = styled.button<{ selected: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
  ${({ selected }) =>
    selected
      ? `
    background-color: #F1A89E;
    color: #7A261D;
    border: 1px solid #7A261D;
  `
      : `
    background-color: rgba(241, 168, 158, 0.7);
    color: #7A261D;
    &:hover {
      background-color: #F1A89E;
    }
  `}
`;

export const Textarea = styled.textarea`
  width: 100%;
  height: 8rem;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  resize: none;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 73, 158, 0.5);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  padding: 1.5rem 0 2rem 0;
`;
