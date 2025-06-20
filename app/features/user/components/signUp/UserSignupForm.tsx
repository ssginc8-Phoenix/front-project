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
import { login } from '~/features/user/api/UserAPI';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 80px 40px;
  min-height: 100vh;
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

const FileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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

  &:hover {
    background-color: #005fcc;
  }
`;

const FileName = styled.span`
  font-size: 0.95rem;
  color: #333;
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

const InputWithActionButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  padding: 12px 20px;
  font-size: 0.95rem;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #5593ff;
  }
`;

const EmailCheckMessage = styled.div<{ success: boolean }>`
  font-size: 0.85rem;
  color: ${(props) => (props.success ? '#007bff' : 'red')};
  margin-top: 4px;
  min-height: 20px;
`;

const ErrorMessage = styled.div`
  font-size: 0.85rem;
  color: red;
  margin-top: 4px;
`;

const Notice = styled.div`
  background-color: #eef1f6;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  margin-bottom: 2rem;
  color: #444;
  line-height: 1.6;
`;

const validatePassword = (password: string): string => {
  if (!password || password.length < 8) {
    return '비밀번호는 최소 8자 이상이어야 합니다.';
  }

  let typeCount = 0;
  if (/[A-Z]/.test(password)) typeCount++;
  if (/[a-z]/.test(password)) typeCount++;
  if (/[0-9]/.test(password)) typeCount++;
  if (/[!@#$%^&*()_+\-={}|\[\]:";'<>?,./`~]/.test(password)) typeCount++;

  if (typeCount < 2) {
    return '비밀번호는 영문 대소문자, 숫자, 특수문자 중 2가지 이상을 포함해야 합니다.';
  }

  const badSequences = [
    'abcdefghijklmnopqrstuvwxyz',
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm',
    '0123456789',
  ];
  const lower = password.toLowerCase();
  for (const seq of badSequences) {
    for (let i = 0; i < seq.length - 3; i++) {
      if (lower.includes(seq.slice(i, i + 4))) {
        return '비밀번호에 연속된 문자열을 사용할 수 없습니다.';
      }
    }
  }

  if (/(.)\1{2,}/.test(password)) {
    return '비밀번호에 동일한 문자를 3번 이상 연속 사용할 수 없습니다.';
  }

  return '';
};

const UserSignupForm = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || '';
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
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
  const [phoneError, setPhoneError] = useState('');
  const [rrnError, setRrnError] = useState('');

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^01[016789]\d{7,8}$/.test(phone);
  const isValidRRN = (rrn: string) => /^\d{6}-\d{7}$/.test(rrn);

  const formatPhoneNumber = (value: string) => {
    if (value.length === 11) return value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    if (value.length === 10) return value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    return value;
  };

  const formatRRN = (value: string) => {
    const digits = value.replace(/[^0-9]/g, '').slice(0, 13);
    if (digits.length <= 6) return digits;
    return digits.slice(0, 6) + '-' + digits.slice(6);
  };

  const roleTitleMap: Record<string, string> = {
    PATIENT: '환자 회원가입',
    GUARDIAN: '보호자 회원가입',
    HOSPITAL_ADMIN: '병원 관리자 회원가입',
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailChecked) {
      setEmailCheckMessage('이메일 중복 확인을 해주세요.');
      setIsEmailCheckSuccess(false);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!isValidPhone(phone)) {
      setPhoneError('휴대폰 번호 형식이 올바르지 않습니다. (예: 010-1234-5678)');
      return;
    }

    setPhoneError('');

    if (role === 'PATIENT' && !isValidRRN(residentRegistrationNumber)) {
      setRrnError('주민등록번호 형식이 올바르지 않습니다. (예: 900101-1234567)');
      return;
    }
    setRrnError('');

    const passwordValidationMsg = validatePassword(password);
    if (passwordValidationMsg) {
      setPasswordError(passwordValidationMsg);
      return;
    }

    setPasswordError('');

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
    }

    // 회원가입 후 로그인 자동 수행
    try {
      await login({ email, password });
      navigate('/'); // 또는 '/patients/mypage' 등 역할별로 분기 가능
    } catch (err) {
      console.error('자동 로그인 실패:', err);
      navigate('/login'); // 실패 시 로그인 페이지로 fallback
    }
  };

  return (
    <Wrapper>
      <FormContainer>
        <Title>{roleTitleMap[role] || '회원가입'}</Title>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <FieldGroup>
            <Label>이메일</Label>
            <InputWithActionButtonGroup>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ flex: 1 }}
              />
              <ActionButton type="button" onClick={handleEmailCheck}>
                {' '}
                중복 확인
              </ActionButton>
            </InputWithActionButtonGroup>
            <EmailCheckMessage success={isEmailCheckSuccess}>{emailCheckMessage}</EmailCheckMessage>
          </FieldGroup>

          <FieldGroup>
            <Label>비밀번호</Label>
            <Notice>
              - 8~15자 이내로 입력해주세요.
              <br />- 영문 대/소문자, 숫자, 특수문자 2가지 이상을 포함해주세요.
            </Notice>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FieldGroup>

          <FieldGroup>
            <Label>비밀번호 확인</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
          </FieldGroup>

          <FieldGroup>
            <Label>이름</Label>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </FieldGroup>

          <FieldGroup>
            <Label>휴대폰 번호</Label>
            <Input
              type="tel"
              value={formatPhoneNumber(phone)}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
              required
            />
            {phoneError && <ErrorMessage>{phoneError}</ErrorMessage>}
          </FieldGroup>

          <FieldGroup>
            <Label>주소</Label>
            <DaumPost address={address} setAddress={setAddress} />
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
                value={formatRRN(residentRegistrationNumber)}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/[^0-9]/g, '').slice(0, 13);
                  setResidentRegistrationNumber(formatRRN(onlyDigits));
                }}
                required
              />

              {rrnError && <ErrorMessage>{rrnError}</ErrorMessage>}
            </FieldGroup>
          )}

          <FieldGroup>
            <Label>프로필 이미지</Label>
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

          <Button type="submit">회원가입</Button>
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

export default UserSignupForm;
