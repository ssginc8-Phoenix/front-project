import styled from 'styled-components';
import { media } from '~/components/styled/MyPage.styles';

export const Name = styled.div`
  font-size: 2.2rem;
  font-weight: 700;
  color: #00499e;

  ${media.mobile} {
    font-size: 1.5rem;
  }
`;

export const InfoFormBox = styled.form`
  margin: 0;
  width: 100%;
  padding: 40px 30px;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 4px 24px rgba(34, 97, 187, 0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;

  ${media.tablet} {
    padding: 30px 20px;
    gap: 15px;
  }

  ${media.mobile} {
    padding: 25px 15px;
    gap: 12px;
  }
`;

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;

  ${media.mobile} {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;
  }
`;

export const Label = styled.label`
  font-size: 1rem;
  color: #2c2c2c;
  width: 100px;
  flex-shrink: 0;
`;

export const Input = styled.input<{ readOnly?: boolean }>`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: ${({ readOnly }) => (readOnly ? '#f2f2f2' : '#fff')};
  color: ${({ readOnly }) => (readOnly ? '#6c757d' : '#343a40')}; /* readOnly 텍스트 색상 조정 */
  transition: all 0.2s ease-in-out; /* 부드러운 전환 */

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.15); /* 포커스 그림자 조정 */
    background-color: #fff;
  }

  ${media.mobile} {
    width: 100%;
    padding: 10px 12px;
    font-size: 0.9rem;
  }
`;

export const SaveButton = styled.button`
  margin: 30px auto 0;
  padding: 14px 60px;
  background: #0056b3;
  color: #fff;
  font-weight: 700;
  font-size: 1.15rem;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.1s ease; /* 전환 효과 추가 */
  box-shadow: 0 4px 15px rgba(0, 86, 179, 0.2); /* 그림자 추가 */

  &:hover {
    background: #004299;
    transform: translateY(-2px); /* 호버 효과 */
  }

  &:active {
    transform: translateY(0); /* 클릭 효과 */
    box-shadow: 0 2px 10px rgba(0, 86, 179, 0.3);
  }

  ${media.mobile} {
    padding: 12px 40px;
    font-size: 1rem;
    margin-top: 20px;
  }
`;

export const Footer = styled.div`
  margin-top: 40px; /* 마진 조정 */
  text-align: center;
  color: #777; /* 색상 조정 */
  font-size: 1.05rem; /* 폰트 사이즈 조정 */
  letter-spacing: 0.03rem;

  span {
    color: #0056b3; /* 색상 조정 */
    cursor: pointer;
    background: none;
    margin: 0 10px;
    font-weight: 600; /* 폰트 두께 조정 */
    font-size: 1.08rem; /* 폰트 사이즈 조정 */
    transition: color 0.16s ease; /* 전환 효과 조정 */
    text-decoration: none;
    border-bottom: 1px solid transparent; /* 호버 밑줄 효과를 위한 초기값 */
    padding-bottom: 2px;

    &:hover {
      color: #dc3545; /* 호버 색상 조정 */
      border-color: #dc3545; /* 호버 시 밑줄 색상 조정 */
    }
  }

  ${media.mobile} {
    margin-top: 30px;
    font-size: 0.95rem;
    span {
      font-size: 0.98rem;
    }
  }
`;

export const ImageUploadContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  margin-top: 10px;

  ${media.mobile} {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

export const HiddenInput = styled.input`
  display: none; /* 기본 파일 입력 숨기기 */
`;

export const CustomFileInputButton = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  background-color: #f0f0f0;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
    border-color: #ccc;
  }

  ${media.mobile} {
    width: 100%;
    text-align: center;
    padding: 8px 15px;
    font-size: 0.9rem;
  }
`;

export const ImagePreview = styled.img`
  width: 100px; /* 크기 조정 */
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e0e0; /* 테두리 추가 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08); /* 그림자 추가 */

  ${media.mobile} {
    margin-left: 0;
    align-self: center; /* 모바일에서 중앙 정렬 */
  }
`;
