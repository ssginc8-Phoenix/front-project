import { useState } from 'react';
import styled from 'styled-components';
import DaumPost from './DaumPost';
import { useNavigate, useSearchParams } from 'react-router';
import { submitPatientInfo, submitSocialSignup } from '~/features/user/api/UserAPI';
import CommonModal from '~/components/common/CommonModal';

const Wrapper = styled.div`
  max-width: 480px;
  margin: 80px auto;
  padding: 2rem;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
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

const FileInput = styled(Input).attrs({ type: 'file' })`
  padding: 0.4rem;
`;

const Button = styled.button`
  padding: 1rem;
  margin-top: 1rem;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
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

  const role = searchParams.get('role') || '';

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

    if (role === 'PATIENT') {
      await submitPatientInfo({ userId: response.userId, residentRegistrationNumber });
    }

    if (role === 'HOSPITAL_ADMIN') {
      navigate('/register-doctors');
    } else {
      setIsSignupComplete(true); // 환자 or 보호자
    }
  };

  return (
    <Wrapper>
      <Title>회원가입</Title>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <FieldGroup>
          <Label>휴대폰 번호</Label>
          <Input
            type="tel"
            placeholder="010-1234-5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
              placeholder="123456-1234567"
              value={residentRegistrationNumber}
              onChange={(e) => setResidentRegistrationNumber(e.target.value)}
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
    </Wrapper>
  );
};

export default SocialSignupForm;
