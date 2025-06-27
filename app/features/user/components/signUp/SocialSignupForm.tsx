import { useState } from 'react';
import styled from 'styled-components';
import DaumPost from './DaumPost';
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
  padding: 80px 40px; /* 기본 데스크탑 패딩 */
  min-height: 100vh;
  margin-bottom: 5rem; /* 기본 데스크탑 하단 여백 */
  width: 100%; /* 부모 너비에 맞춤 */
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 */

  ${media.tablet} {
    padding: 60px 30px; /* 태블릿 패딩 조정 */
    margin-bottom: 4rem;
  }

  ${media.mobile} {
    padding: 30px 20px; /* 모바일 패딩 조정 */
    margin-bottom: 2rem;
  }

  ${media.mobileSmall} {
    padding: 20px 15px; /* 모바일 360px 기준 패딩 조정 */
    margin-bottom: 1rem;
  }
`;

const FormContainer = styled.div`
  width: 720px; /* 기본 데스크탑 너비 */
  max-width: 90%; /* 화면이 좁아질 때 컨테이너가 잘리지 않도록 최대 너비 설정 */
  background-color: #ffffff;
  padding: 48px 64px; /* 기본 데스크탑 패딩 */
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);

  ${media.tablet} {
    width: 95%; /* 태블릿에서 너비 조정 */
    padding: 40px 50px;
  }

  ${media.mobile} {
    width: 100%; /* 모바일에서 너비 100%로 설정하여 화면에 꽉 차게 */
    padding: 30px 25px; /* 모바일 패딩 조정 */
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05); /* 모바일에서 그림자 약화 */
  }

  ${media.mobileSmall} {
    padding: 20px 15px; /* 모바일 360px 기준 패딩 조정 */
  }
`;

const Title = styled.h1`
  font-size: 2.2rem; /* 기본 데스크탑 폰트 크기 */
  font-weight: bold;
  color: #222;
  text-align: center;
  margin-bottom: 40px; /* 기본 데스크탑 마진 */

  ${media.tablet} {
    font-size: 2rem;
    margin-bottom: 30px;
  }

  ${media.mobile} {
    font-size: 1.8rem;
    margin-bottom: 25px;
  }

  ${media.mobileSmall} {
    font-size: 1.6rem; /* 모바일 360px 기준 폰트 크기 */
    margin-bottom: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px; /* 기본 데스크탑 간격 */

  ${media.tablet} {
    gap: 20px;
  }

  ${media.mobile} {
    gap: 16px; /* 모바일 간격 조정 */
  }

  ${media.mobileSmall} {
    gap: 12px; /* 모바일 360px 기준 간격 조정 */
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem; /* 기본 폰트 크기 */
  font-weight: 600;
  margin-bottom: 8px; /* 기본 마진 */

  ${media.mobile} {
    font-size: 0.95rem; /* 모바일에서 폰트 크기 줄임 */
    margin-bottom: 6px;
  }

  ${media.mobileSmall} {
    font-size: 0.9rem; /* 모바일 360px 기준 폰트 크기 */
    margin-bottom: 4px;
  }
`;

const Input = styled.input`
  padding: 14px 16px; /* 기본 패딩 */
  font-size: 1rem; /* 기본 폰트 크기 */
  border: 1px solid #ccc;
  border-radius: 8px;

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

const FileInput = styled(Input).attrs({ type: 'file' })`
  padding: 6px; /* 기본 파일 인풋 패딩 */

  ${media.mobile} {
    padding: 5px; /* 모바일 패딩 조정 */
    font-size: 0.95rem; /* 모바일 폰트 크기 조정 */
  }

  ${media.mobileSmall} {
    padding: 4px; /* 모바일 360px 기준 패딩 조정 */
    font-size: 0.9rem; /* 모바일 360px 기준 폰트 크기 조정 */
  }
`;

const Button = styled.button`
  margin-top: 40px; /* 기본 마진 */
  padding: 16px; /* 기본 패딩 */
  font-size: 1.1rem; /* 기본 폰트 크기 */
  font-weight: bold;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%; /* 너비 100%로 설정 */

  &:hover {
    background-color: #005fcc;
  }

  ${media.tablet} {
    margin-top: 30px;
    padding: 14px;
    font-size: 1.05rem;
  }

  ${media.mobile} {
    margin-top: 25px;
    padding: 12px;
    font-size: 1rem;
  }

  ${media.mobileSmall} {
    margin-top: 20px; /* 모바일 360px 기준 마진 */
    padding: 10px; /* 모바일 360px 기준 패딩 */
    font-size: 0.95rem; /* 모바일 360px 기준 폰트 크기 */
  }
`;

const SocialSignupForm = ({ providerId }: { providerId: string | null }) => {
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [residentRegistrationNumber, setResidentRegistrationNumber] = useState('');
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
    const digits = value.replace(/[^0-9]/g, '').slice(0, 13); // 최대 13자리 숫자만
    if (digits.length <= 6) return digits;
    return `${digits.slice(0, 6)}-${digits.slice(6)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = `${address} ${detailAddress}`.trim();

    const formData = new FormData();
    if (providerId) formData.append('providerId', providerId);
    formData.append('phone', phone);
    if (profileImage) formData.append('profileImage', profileImage);
    formData.append('address', fullAddress);
    formData.append('role', role);

    const response = await submitSocialSignup(formData);

    fetchMyInfo();

    if (role === 'PATIENT') {
      await submitPatientInfo({ userId: response.userId, residentRegistrationNumber });
    }

    if (role === 'HOSPITAL_ADMIN') {
      navigate('/hospital/create');
    } else {
      navigate('/');
    }
  };

  return (
    <Wrapper>
      <FormContainer>
        <Title>회원가입</Title>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <FieldGroup>
            <Label>휴대폰 번호</Label>
            <Input
              type="tel"
              placeholder="010-1234-5678 (-를 빼고 입력해주세요.)"
              value={phone}
              onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>프로필 이미지</Label>
            <FileInput
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>주소</Label>
            <DaumPost address={address} setAddress={setAddress} />
          </FieldGroup>

          <FieldGroup>
            <Label>상세 주소</Label>
            <Input
              type="text"
              placeholder="101동 202호 등 상세 주소 입력"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
            />
          </FieldGroup>

          {role === 'PATIENT' && (
            <FieldGroup>
              <Label>주민등록번호</Label>
              <Input
                type="text"
                placeholder="123456-1234567 (-를 빼고 입력해주세요)"
                value={residentRegistrationNumber}
                onChange={(e) => setResidentRegistrationNumber(formatRRN(e.target.value))}
              />
            </FieldGroup>
          )}

          <Button type="submit">다음</Button>
        </Form>

        {isSignupComplete && (
          <CommonModal
            title="회원가입이 완료되었습니다!"
            buttonText="로그인 하러 가기"
            onClose={() => navigate('/login')}
          />
        )}
      </FormContainer>
    </Wrapper>
  );
};

export default SocialSignupForm;
