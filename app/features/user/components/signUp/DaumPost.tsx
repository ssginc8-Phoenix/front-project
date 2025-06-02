import { useEffect } from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';

interface DaumPostProps {
  setAddress: (address: string) => void;
}

const DaumPost: React.FC<DaumPostProps> = ({ setAddress }) => {
  const postcodeScriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  const open = useDaumPostcodePopup(postcodeScriptUrl);

  const handleComplete = (data: any) => {
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
  };

  useEffect(() => {
    open({ onComplete: handleComplete });
  }, [open]);

  return null;
};

export default DaumPost;
