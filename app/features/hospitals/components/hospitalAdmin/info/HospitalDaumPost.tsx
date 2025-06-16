import styled from 'styled-components';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { getCoordsFromAddress } from '~/features/hospitals/api/geocode';
import { forwardRef } from 'react';

interface DaumPostProps {
  address: string;
  setAddress: (address: string) => void;
  setCoords: (coords: { lat: number; lng: number }) => void;
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

const HospitalDaumPost = forwardRef<HTMLInputElement, DaumPostProps>(
  ({ address, setAddress, setCoords }, ref) => {
    const postcodeScriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    const open = useDaumPostcodePopup(postcodeScriptUrl);

    const handleClick = () => {
      open({
        onComplete: async (data: any) => {
          let fullAddress = data.address;
          let extraAddress = '';

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

          try {
            const coords = await getCoordsFromAddress(fullAddress);
            console.log('📍 변환된 좌표:', coords);
            setCoords(coords);
          } catch (err) {
            console.error('❌ 좌표 변환 실패:', err);
          }
        },
      });
    };

    return (
      <Container>
        <AddressInput
          type="text"
          value={address}
          readOnly
          placeholder="주소를 검색해주세요"
          ref={ref} // ✅ 여기에 ref를 전달
        />
        <SearchButton type="button" onClick={handleClick}>
          주소 검색
        </SearchButton>
      </Container>
    );
  },
);

export default HospitalDaumPost;
