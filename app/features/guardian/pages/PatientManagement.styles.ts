import styled from 'styled-components';
import { ContentBody, media } from '~/components/styled/MyPage.styles';

export const InviteButton = styled.button`
  background: #00499e;
  color: #fff;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;
  &:hover {
    background: #003a7a;
  }

  ${media.tablet} {
    padding: 8px 15px;
    font-size: 0.9rem;
  }

  ${media.mobile} {
    width: 100%; /* 모바일에서 버튼 너비를 꽉 채움 */
    padding: 10px;
    font-size: 0.95rem;
    margin-top: 0.5rem; /* 쌓였을 때 약간의 간격 추가 */
  }
`;

// 기본 ContentBody를 확장하여 사용하며, 필요에 따라 추가 스타일을 적용합니다.
export const PatientManagementContentBody = styled(ContentBody)`
  align-items: stretch; /* ContentBody 내에서 내용이 너비를 꽉 채우도록 함 */
  flex-grow: 1; /* 사용 가능한 공간을 채우도록 허용 */
`;

export const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%; /* ContentBody의 전체 너비를 사용하도록 함 */

  ${media.mobile} {
    gap: 0.8rem;
  }
`;

export const Card = styled.div`
  position: relative;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${media.tablet} {
    padding: 16px;
  }

  ${media.mobile} {
    padding: 14px;
    flex-direction: column; /* 모바일에서 내용을 세로로 쌓음 */
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: #999;
  cursor: pointer;
  transition: color 0.2s ease;
  &:hover {
    color: #ff4646;
  }

  ${media.mobile} {
    font-size: 1.1rem;
    top: 10px;
    right: 10px;
  }
`;

export const PatientName = styled.div`
  font-size: 1.25rem;
  font-weight: 600;

  ${media.tablet} {
    font-size: 1.15rem;
  }

  ${media.mobile} {
    font-size: 1.05rem;
  }
`;

export const PatientInfo = styled.div`
  font-size: 1rem;
  color: #555;

  ${media.tablet} {
    font-size: 0.9rem;
  }

  ${media.mobile} {
    font-size: 0.85rem;
  }
`;

export const ModalContentWrapper = styled.div`
  padding: 20px;
  text-align: center;

  ${media.mobile} {
    padding: 15px;
  }
`;

export const ModalTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;

  ${media.mobile} {
    font-size: 1.3rem;
    margin-bottom: 15px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 1.05rem;
  border-radius: 8px;
  border: 1.5px solid #ddd;
  box-sizing: border-box;

  ${media.mobile} {
    padding: 10px;
    font-size: 0.95rem;
    margin-bottom: 15px;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #00499e;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  cursor: pointer;
  transition: background 0.2s ease;
  &:hover {
    background: #003a7a;
  }

  ${media.mobile} {
    padding: 10px;
    font-size: 0.95rem;
  }
`;

export const ConfirmText = styled.div`
  font-size: 1.13rem;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;

  ${media.tablet} {
    font-size: 1.05rem;
    margin-bottom: 20px;
  }

  ${media.mobile} {
    font-size: 0.95rem;
    margin-bottom: 18px;
  }
`;

export const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;

  ${media.mobile} {
    flex-direction: column; /* 매우 작은 화면에서는 버튼을 세로로 쌓음 */
    gap: 10px;
  }
`;

export const ModalActionButton = styled.button`
  border-radius: 16px;
  border: none;
  padding: 10px 24px;
  font-weight: 500;
  font-size: 1.05rem;
  cursor: pointer;
  transition:
    background 0.16s ease,
    color 0.16s ease;
  min-width: 100px;

  ${media.tablet} {
    padding: 9px 20px;
    font-size: 1rem;
    min-width: 90px;
  }

  ${media.mobile} {
    padding: 8px 16px;
    font-size: 0.95rem;
    width: 100%; /* 쌓인 버튼의 경우 너비를 꽉 채움 */
    min-width: unset;
  }
`;

export const CancelModalButton = styled(ModalActionButton)`
  background: #f3f3f3;
  color: #555;
  &:hover {
    background: #e0e0e0;
  }
`;

export const DeleteModalButton = styled(ModalActionButton)`
  background: #ff4646;
  color: #fff;
  font-weight: 600;
  &:hover {
    background: #cc3737;
  }
`;
