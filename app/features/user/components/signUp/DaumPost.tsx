import styled from 'styled-components';
import { useDaumPostcodePopup } from 'react-daum-postcode';

interface DaumPostProps {
  address: string;
  setAddress: (address: string) => void;
}

const Container = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const AddressInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
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

  &:hover {
    background-color: #005fcc;
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
        const localAddress = `${data.sido} ${data.sigungu}`;

        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
          }
          fullAddress = fullAddress.replace(localAddress, '');
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
