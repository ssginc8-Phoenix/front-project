import styled from 'styled-components';
import { useDaumPostcodePopup } from 'react-daum-postcode';

interface DaumPostProps {
  address: string;
  setAddress: (address: string) => void;
}

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

const Container = styled.div`
  display: flex;
  gap: 0.5rem; /* 요소 간 기본 간격 */
  align-items: center;
  width: 100%; /* 부모 너비에 맞춰 확장 */
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 설정 */
  flex-wrap: wrap; /* 작은 화면에서 요소들이 줄 바꿈되도록 설정 */

  ${media.mobile} {
    flex-direction: column; /* 모바일에서는 세로로 쌓이도록 변경 */
    gap: 0.75rem; /* 세로로 쌓일 때 간격 늘림 */
    align-items: stretch; /* 세로 정렬 시 너비를 채우도록 */
  }
`;

const AddressInput = styled.input`
  flex: 1; /* 남은 공간을 유동적으로 차지 */
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 */

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
  }

  ${media.tablet} {
    padding: 0.65rem;
    font-size: 0.95rem;
  }

  ${media.mobile} {
    width: 100%; /* 모바일에서는 전체 너비를 사용 */
    padding: 0.6rem;
    font-size: 0.9rem;
  }

  ${media.mobileSmall} {
    font-size: 0.85rem;
  }
`;

const SearchButton = styled.button`
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  white-space: nowrap; /* 버튼 텍스트가 줄 바꿈되지 않도록 */
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 */

  &:hover {
    background-color: #005fcc;
  }

  ${media.tablet} {
    padding: 0.65rem 1rem;
    font-size: 0.9rem;
  }

  ${media.mobile} {
    width: 100%; /* 모바일에서는 전체 너비를 사용 */
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
  }

  ${media.mobileSmall} {
    font-size: 0.8rem;
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
        // const localAddress = `${data.sido} ${data.sigungu}`; // 이 변수는 사용되지 않으므로 제거했습니다.

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
