import styled from 'styled-components';
import { useDaumPostcodePopup } from 'react-daum-postcode';

// --- 반응형 디자인을 위한 공통 사이즈 및 미디어 쿼리 정의 ---
const sizes = {
  laptopL: '1600px',
  laptop: '1024px',
  tablet: '768px',
  mobile: '480px',
  mobileSmall: '360px',
};

const media = {
  laptopL: `@media (max-width: ${sizes.laptopL})`,
  laptop: `@media (max-width: ${sizes.laptop})`,
  tablet: `@media (max-width: ${sizes.tablet})`,
  mobile: `@media (max-width: ${sizes.mobile})`,
  mobileSmall: `@media (max-width: ${sizes.mobileSmall})`,
};

interface DaumPostProps {
  address: string;
  setAddress: (address: string) => void;
}

const Container = styled.div`
  display: flex;
  gap: 0.5rem; /* 기본 간격 */
  align-items: center;
  width: 100%; /* 부모 너비에 맞춤 */

  ${media.mobile} {
    flex-direction: column; /* 모바일에서 세로로 쌓이도록 변경 */
    gap: 0.8rem; /* 모바일에서 간격 조정 */
    align-items: stretch; /* 세로 정렬 시 너비를 채우도록 */
  }

  ${media.mobileSmall} {
    gap: 0.6rem; /* 모바일 360px 기준 간격 조정 */
  }
`;

const AddressInput = styled.input`
  padding: 14px 16px; /* 기본 패딩 */
  font-size: 1rem; /* 기본 폰트 크기 */
  border: 1px solid #ccc;
  border-radius: 8px;
  flex: 1;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
  }

  ${media.mobile} {
    padding: 12px 14px; /* 모바일 패딩 조정 */
    font-size: 0.95rem; /* 모바일 폰트 크기 조정 */
  }

  ${media.mobileSmall} {
    padding: 10px 12px; /* 모바일 360px 기준 패딩 조정 */
    font-size: 0.9rem; /* 모바일 360px 기준 폰트 크기 조정 */
  }
`;

const SearchButton = styled.button`
  padding: 0.75rem 1.25rem; /* 기본 패딩 */
  border-radius: 0.5rem;
  font-size: 0.95rem; /* 기본 폰트 크기 */
  font-weight: 600;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  white-space: nowrap; /* 텍스트가 줄바꿈되지 않도록 */

  &:hover {
    background-color: #005fcc;
  }

  ${media.mobile} {
    padding: 0.65rem 1rem; /* 모바일 패딩 조정 */
    font-size: 0.9rem; /* 모바일 폰트 크기 조정 */
    width: 100%; /* 모바일에서 너비 100%로 설정 */
  }

  ${media.mobileSmall} {
    padding: 0.55rem 0.8rem; /* 모바일 360px 기준 패딩 조정 */
    font-size: 0.85rem; /* 모바일 360px 기준 폰트 크기 조정 */
  }
`;

const DaumPost: React.FC<DaumPostProps> = ({ address, setAddress }) => {
  const postcodeScriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  const open = useDaumPostcodePopup(postcodeScriptUrl);

  const handleClick = () => {
    open({
      onComplete: (data: any) => {
        let fullAddress = data.address;
        let extraAddress = '';
        // const localAddress = `${data.sido} ${data.sigungu}`; // 사용되지 않으므로 주석 처리하거나 제거 가능

        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
          }
          fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        setAddress(fullAddress);
      },
    });
  };

  return (
    <Container>
      <AddressInput type="text" value={address} readOnly placeholder="주소를 검색해주세요" />
      <SearchButton type="button" onClick={handleClick}>
        주소 검색
      </SearchButton>
    </Container>
  );
};

export default DaumPost;
