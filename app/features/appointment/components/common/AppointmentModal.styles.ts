import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const Modal = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 540px;
  max-height: 90vh;
  overflow-y: auto;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 10px;
`;

export const Header = styled.div`
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    margin-bottom: 0.8rem;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #0066ff;
  margin-bottom: 0.25rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.15rem;
  }
`;

export const HospitalName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #000;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-top: 0.4rem;
  }
`;

export const SubInfo = styled.div`
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }

  @media (max-width: 480px) {
    font-size: 0.65rem;
    margin-top: 0.2rem;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb; // 연한 회색 선
  margin: 1rem 0;

  @media (max-width: 480px) {
    margin: 0.8rem 0;
  }
`;

export const Section = styled.div`
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

export const SectionTitle = styled.div`
  font-weight: 600;
  color: #1d4ed8;
  margin-bottom: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

export const InfoText = styled.p`
  margin: 0;
  color: #333;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    line-height: 1.4;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.8rem; /* 모바일에서 버튼 간격 조정 */
    margin-top: 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 0.6rem;
  }
`;
