import styled from 'styled-components';
import { X } from 'lucide-react';

// --- 반응형 디자인을 위한 공통 사이즈 및 미디어 쿼리 정의 ---
const sizes = {
  laptopL: '1600px',
  laptop: '1024px',
  tablet: '768px',
  mobile: '480px',
  mobileSmall: '360px', // Target for 360x740
};

const media = {
  laptopL: `@media (max-width: ${sizes.laptopL})`,
  laptop: `@media (max-width: ${sizes.laptop})`,
  tablet: `@media (max-width: ${sizes.tablet})`,
  mobile: `@media (max-width: ${sizes.mobile})`,
  mobileSmall: `@media (max-width: ${sizes.mobileSmall})`,
};

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1000;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 2.5rem 2rem;
  border-radius: 1rem;
  min-width: 200px;
  max-width: 30%; /* 기본 데스크탑/큰 화면 */
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  position: relative;

  ${media.tablet} {
    max-width: 50%; /* 태블릿에서는 최대 너비 50% */
    padding: 2rem 1.5rem; /* 태블릿 패딩 조정 */
  }

  ${media.mobile} {
    max-width: 85%; /* 모바일에서는 최대 너비 85% */
    padding: 1.5rem 1rem; /* 모바일 패딩 조정 */
    border-radius: 0.8rem; /* 모바일 테두리 둥글기 조정 */
  }

  ${media.mobileSmall} {
    max-width: 90%; /* 360px 기준에서는 최대 너비 90% */
    padding: 1.2rem 0.8rem; /* 360px 기준 패딩 조정 */
    border-radius: 0.7rem; /* 360px 기준 테두리 둥글기 조정 */
  }
`;

const CloseIcon = styled(X)`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: #555;

  ${media.mobile} {
    top: 1rem;
    right: 1rem;
    width: 18px;
    height: 18px;
  }

  ${media.mobileSmall} {
    top: 0.8rem;
    right: 0.8rem;
    width: 16px;
    height: 16px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a3c8b;
  margin-bottom: 1.25rem;

  ${media.mobile} {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  ${media.mobileSmall} {
    font-size: 1rem;
    margin-bottom: 0.8rem;
  }
`;

const ModalDescription = styled.div`
  font-size: 0.95rem;
  color: #555;
  line-height: 1.5;
  margin-bottom: 1.5rem;

  ${media.mobile} {
    font-size: 0.9rem;
    margin-bottom: 1.2rem;
  }

  ${media.mobileSmall} {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.25rem;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #005fcc;
  }

  ${media.mobile} {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    border-radius: 0.4rem;
  }

  ${media.mobileSmall} {
    padding: 0.5rem 0.8rem;
    font-size: 0.85rem;
    border-radius: 0.3rem;
  }
`;

interface CommonModalProps {
  title: string;
  buttonText: string;
  onClose: () => void;
  children?: React.ReactNode;
}

const CommonModal = ({ title, buttonText, onClose, children }: CommonModalProps) => {
  return (
    <ModalBackground onClick={onClose}>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        <CloseIcon onClick={onClose} />
        <ModalTitle>{title}</ModalTitle>

        {/* 조건 분기: 버튼 텍스트가 있으면 설명 모드, 없으면 자유 모드 */}
        {buttonText ? (
          <>
            <ModalDescription>{children}</ModalDescription>
            <ModalButton onClick={onClose}>{buttonText}</ModalButton>
          </>
        ) : (
          children
        )}
      </ModalWrapper>
    </ModalBackground>
  );
};

export default CommonModal;
