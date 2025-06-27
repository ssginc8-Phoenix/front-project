import { useState } from 'react';
import styled from 'styled-components';
import DaumPost from './DaumPost'; // DaumPost 컴포넌트도 반응형 고려 필요
import { useNavigate, useSearchParams } from 'react-router-dom';
import { submitPatientInfo, submitSocialSignup } from '~/features/user/api/UserAPI';
import CommonModal from '~/components/common/CommonModal';
import useLoginStore from '~/features/user/stores/LoginStore';

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

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 80px 40px;
  min-height: 100vh;
  margin-bottom: 5rem;
  width: 100%;
  box-sizing: border-box;

  ${media.tablet} {
    padding: 60px 20px;
    margin-bottom: 3rem;
  }

  ${media.mobile} {
    padding: 30px 15px;
    margin-bottom: 2rem;
  }

  ${media.mobileSmall} {
    padding: 20px 10px;
    margin-bottom: 1rem;
  }
`;

const FormContainer = styled.div`
  width: 720px;
  background-color: #ffffff;
  padding: 48px 64px;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;

  ${media.tablet} {
    width: 90%;
    max-width: 720px;
    padding: 40px 48px;
  }

  ${media.mobile} {
    width: 100%;
    padding: 24px 24px;
    border-radius: 8px;
    box-shadow: none;
  }

  ${media.mobileSmall} {
    padding: 16px 16px;
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: bold;
  color: #222;
  text-align: center;
  margin-bottom: 40px;

  ${media.tablet} {
    font-size: 2rem;
    margin-bottom: 30px;
  }

  ${media.mobile} {
    font-size: 1.5rem;
    margin-bottom: 24px;
  }

  ${media.mobileSmall} {
    font-size: 1.3rem;
    margin-bottom: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${media.tablet} {
    gap: 20px;
  }

  ${media.mobile} {
    gap: 16px;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;

  ${media.tablet} {
    font-size: 0.95rem;
    margin-bottom: 6px;
  }

  ${media.mobile} {
    font-size: 0.9rem;
    margin-bottom: 4px;
  }
`;

const Input = styled.input`
  padding: 14px 16px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 */

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
  }

  ${media.tablet} {
    padding: 12px 14px;
    font-size: 0.95rem;
  }

  ${media.mobile} {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
`;

const FileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap; /* 작은 화면에서 요소들이 줄 바꿈되도록 */

  ${media.mobile} {
    gap: 8px;
  }
`;

const HiddenFileInput = styled.input.attrs({ type: 'file' })`
  display: none;
`;

const FileLabel = styled.label`
  padding: 10px 18px;
  background-color: #007bff;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  white-space: nowrap; /* 텍스트 줄 바꿈 방지 */

  &:hover {
    background-color: #005fcc;
  }

  ${media.tablet} {
    padding: 9px 16px;
    font-size: 0.9rem;
  }

  ${media.mobile} {
    padding: 8px 14px;
    font-size: 0.85rem;
  }
`;

const FileName = styled.span`
  font-size: 0.95rem;
  color: #333;
  flex: 1; /* 남은 공간을 차지하도록 */
  overflow: hidden; /* 긴 파일 이름이 넘치지 않도록 */
  text-overflow: ellipsis; /* 넘칠 경우 ...으로 표시 */
  white-space: nowrap; /* 줄 바꿈 방지 */

  ${media.tablet} {
    font-size: 0.9rem;
  }

  ${media.mobile} {
    font-size: 0.85rem;
  }
`;

const Button = styled.button`
  margin-top: 40px;
  padding: 16px;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    background-color: #005fcc;
  }

  ${media.tablet} {
    margin-top: 30px;
    padding: 14px;
    font-size: 1rem;
  }

  ${media.mobile} {
    margin-top: 24px;
    padding: 12px;
    font-size: 0.95rem;
  }
`;

const SocialSignupForm = ({ providerId }: { providerId: string | null }) => {
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [residentRegistrationNumber, setResidentRegistrationNumber] = useState('');
  // isSignupComplete 상태는 CommonModal 렌더링에만 사용됩니다.
  // 실제 회원가입 완료 후 리다이렉트가 일어나므로, 이 상태는 불필요할 수 있습니다.
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchMyInfo } = useLoginStore();

  const role = searchParams.get('role') || '';

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/[^0-9]/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  const formatRRN = (value: string) => {
    const digits = value.replace(/[^0-9]/g, '').slice(0, 13);
    if (digits.length <= 6) return digits;
    return `${digits.slice(0, 6)}-${digits.slice(6)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = `${address} ${detailAddress}`.trim();

    // 필수 입력 필드 유효성 검사 추가 (예시)
    if (!phone || !fullAddress || (role === 'PATIENT' && !residentRegistrationNumber)) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    const formData = new FormData();
    if (providerId) formData.append('providerId', providerId);
    formData.append('phone', phone);
    if (profileImage) formData.append('profileImage', profileImage);
    formData.append('address', fullAddress);
    formData.append('role', role);

    try {
      const response = await submitSocialSignup(formData);

      await fetchMyInfo(); // 사용자 정보 업데이트

      if (role === 'PATIENT') {
        await submitPatientInfo({ userId: response.userId, residentRegistrationNumber });
      }

      // 회원가입 및 추가 정보 제출 완료 후 리다이렉트
      if (role === 'HOSPITAL_ADMIN') {
        navigate('/hospital/create');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('소셜 회원가입 실패:', error);
      // 에러 모달 또는 메시지 표시
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Wrapper>
      <FormContainer>
        <Title>회원가입</Title>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <FieldGroup>
            <Label htmlFor="phone">휴대폰 번호</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="010-1234-5678 (-를 빼고 입력해주세요.)"
              value={formatPhoneNumber(phone)}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="address">주소</Label>
            {/* DaumPost 컴포넌트도 내부적으로 반응형을 지원해야 합니다. */}
            <DaumPost address={address} setAddress={setAddress} />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="detailAddress">상세 주소</Label>
            <Input
              id="detailAddress"
              type="text"
              placeholder="101동 202호 등 상세 주소 입력"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
            />
          </FieldGroup>

          {role === 'PATIENT' && (
            <FieldGroup>
              <Label htmlFor="residentRegistrationNumber">주민등록번호</Label>
              <Input
                id="residentRegistrationNumber"
                type="text"
                placeholder="123456-1234567 (-를 빼고 입력해주세요)"
                value={formatRRN(residentRegistrationNumber)}
                onChange={(e) => setResidentRegistrationNumber(e.target.value)}
                required
              />
            </FieldGroup>
          )}

          <FieldGroup>
            <Label htmlFor="profileImage">프로필 이미지</Label>
            <FileInputWrapper>
              <FileLabel htmlFor="profileImage">파일 선택</FileLabel>
              <HiddenFileInput
                id="profileImage"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
              />
              <FileName>{profileImage?.name || '선택된 파일 없음'}</FileName>
            </FileInputWrapper>
          </FieldGroup>

          <Button type="submit">다음</Button>
        </Form>

        {/* isSignupComplete는 현재 자동 리다이렉트 로직으로 인해 불필요할 수 있습니다.
            만약 모달을 띄운 후 사용자가 직접 '로그인 하러 가기'를 클릭하게 하려면 이 부분을 다시 활성화하고 navigate 로직을 모달의 onClose 안으로 이동시키세요.
        */}
        {isSignupComplete && (
          <CommonModal
            title="회원가입이 완료되었습니다!"
            buttonText="확인"
            onClose={() => {
              setIsSignupComplete(false); // 모달 닫기
              if (role === 'HOSPITAL_ADMIN') {
                navigate('/hospital/create');
              } else {
                navigate('/');
              }
            }}
          />
        )}
      </FormContainer>
    </Wrapper>
  );
};

export default SocialSignupForm;
