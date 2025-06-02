import styled from 'styled-components';

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
  padding: 2rem;
  border-radius: 1rem;
  min-width: 300px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  margin-bottom: 1rem;
`;

const ModalButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 1.25rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #005fcc;
  }
`;

interface CommonModalProps {
  title: string;
  buttonText: string;
  onClose: () => void;
}

const CommonModal = ({ title, buttonText, onClose }: CommonModalProps) => {
  return (
    <>
      <ModalBackground onClick={onClose} />
      <ModalWrapper>
        <ModalTitle>{title}</ModalTitle>
        <ModalButton onClick={onClose}>{buttonText}</ModalButton>
      </ModalWrapper>
    </>
  );
};

export default CommonModal;
