import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CommonModal from '~/components/common/CommonModal';
import {
  checkEmailDuplicate,
  submitEmailSignup,
  submitPatientInfo,
} from '~/features/user/api/UserAPI';
import DaumPost from '~/features/user/components/signUp/DaumPost';

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

const EmailGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const EmailCheckButton = styled(Button)`
  padding: 0.6rem 1rem;
  margin: 0;
  background-color: #007bff;
  &:hover {
    background-color: #005fcc;
  }
`;

const EmailCheckMessage = styled.div<{ success: boolean }>`
  font-size: 0.85rem;
  margin-top: 0.25rem;
  color: ${(props) => (props.success ? '#007bff' : 'red')};
  height: 1rem;
`;

const AddressButton = styled.button`
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #5593ff;
  }
`;

const AddressInputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1000;
  transform: translate(-50%, -50%);
`;

const UserSignupForm = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || '';
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [residentRegistrationNumber, setResidentRegistrationNumber] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState('');
  const [isEmailCheckSuccess, setIsEmailCheckSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailCheck = async () => {
    if (!isEmailValid(email)) {
      setEmailCheckMessage('이메일 형식이 올바르지 않습니다.');
      setIsEmailCheckSuccess(false);
      setEmailChecked(false);
      return;
    }

    try {
      await checkEmailDuplicate(email);
      setEmailCheckMessage('사용 가능한 이메일입니다.');
      setIsEmailCheckSuccess(true);
      setEmailChecked(true);
    } catch {
      setEmailCheckMessage('이미 사용 중인 이메일입니다.');
      setIsEmailCheckSuccess(false);
      setEmailChecked(false);
    }
  };

  const handleAddressSelect = (addr: string) => {
    setAddress(addr);
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailChecked) {
      setEmailCheckMessage('이메일 중복 확인을 해주세요.');
      setIsEmailCheckSuccess(false);
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('address', `${address} ${detailAddress}`.trim());
    if (profileImage) formData.append('profileImage', profileImage);
    formData.append('role', role);

    const response = await submitEmailSignup(formData);

    if (role === 'PATIENT') {
      await submitPatientInfo({ userId: response.userId, residentRegistrationNumber });
      setIsSignupComplete(true);
    } else if (role === 'HOSPITAL_ADMIN') {
      navigate('/register-doctors');
    } else {
      setIsSignupComplete(true);
    }
  };

  return (
    <Wrapper>
      <Title>회원가입</Title>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <FieldGroup>
          <Label>이메일</Label>
          <EmailGroup>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <EmailCheckButton type="button" onClick={handleEmailCheck}>
              중복 확인
            </EmailCheckButton>
          </EmailGroup>
          <EmailCheckMessage success={isEmailCheckSuccess}>{emailCheckMessage}</EmailCheckMessage>
        </FieldGroup>

        <FieldGroup>
          <Label>비밀번호</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <Label>이름</Label>
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </FieldGroup>

        <FieldGroup>
          <Label>휴대폰 번호</Label>
          <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </FieldGroup>

        <FieldGroup>
          <Label>주소</Label>
          <AddressInputGroup>
            <Input type="text" value={address} readOnly style={{ flex: 1 }} />
            <AddressButton type="button" onClick={() => setShowModal(true)}>
              주소 검색
            </AddressButton>
          </AddressInputGroup>
        </FieldGroup>

        <FieldGroup>
          <Label>상세 주소</Label>
          <Input
            type="text"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
          />
        </FieldGroup>

        {role === 'PATIENT' && (
          <FieldGroup>
            <Label>주민등록번호</Label>
            <Input
              type="text"
              value={residentRegistrationNumber}
              onChange={(e) => setResidentRegistrationNumber(e.target.value)}
            />
          </FieldGroup>
        )}

        <FieldGroup>
          <Label>프로필 이미지</Label>
          <FileInput
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
          />
        </FieldGroup>

        <Button type="submit">회원가입</Button>
      </Form>

      {showModal && (
        <>
          <ModalBackground onClick={() => setShowModal(false)} />
          <ModalWrapper>
            <DaumPost setAddress={handleAddressSelect} />
          </ModalWrapper>
        </>
      )}

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

export default UserSignupForm;
