import { useState } from 'react';
import styled from 'styled-components';
import DaumPost from './DaumPost';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { submitPatientInfo, submitSocialSignup } from '~/features/user/api/UserAPI';
import CommonModal from '~/components/common/CommonModal';
import useLoginStore from '~/features/user/stores/LoginStore';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 80px 40px;
  min-height: 100vh;
  margin-bottom: 5rem;
`;

const FormContainer = styled.div`
  width: 720px;
  background-color: #ffffff;
  padding: 48px 64px;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: bold;
  color: #222;
  text-align: center;
  margin-bottom: 40px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 14px 16px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
  }
`;

const FileInput = styled(Input).attrs({ type: 'file' })`
  padding: 6px;
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

  &:hover {
    background-color: #005fcc;
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
