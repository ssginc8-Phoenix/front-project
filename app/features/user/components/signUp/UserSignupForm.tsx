import { useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CommonModal from '~/components/common/CommonModal';
import {
  checkEmailDuplicate,
  submitEmailSignup,
  submitPatientInfo,
  login,
} from '~/features/user/api/UserAPI';
import DaumPost from '~/features/user/components/signUp/DaumPost';

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
  flex: 1;

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

const FileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px; /* 기본 간격 */

  ${media.mobile} {
    gap: 10px;
  }

  ${media.mobileSmall} {
    gap: 8px;
  }
`;

const HiddenFileInput = styled.input.attrs({ type: 'file' })`
  display: none;
`;

const FileLabel = styled.label`
  padding: 10px 18px; /* 기본 패딩 */
  background-color: #007bff;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem; /* 기본 폰트 크기 */
  white-space: nowrap; /* 텍스트가 줄바꿈되지 않도록 */

  &:hover {
    background-color: #005fcc;
  }

  ${media.mobile} {
    padding: 8px 14px; /* 모바일 패딩 조정 */
    font-size: 0.9rem; /* 모바일 폰트 크기 조정 */
  }

  ${media.mobileSmall} {
    padding: 6px 10px; /* 모바일 360px 기준 패딩 조정 */
    font-size: 0.85rem; /* 모바일 360px 기준 폰트 크기 조정 */
  }
`;

const FileName = styled.span`
  font-size: 0.95rem; /* 기본 폰트 크기 */
  color: #333;
  word-break: break-all; /* 파일 이름이 너무 길면 줄바꿈되도록 */
  flex: 1; /* 남은 공간 차지 */
  overflow: hidden; /* 넘치는 내용 숨김 */
  text-overflow: ellipsis; /* 넘치는 내용 ...으로 표시 */

  ${media.mobile} {
    font-size: 0.9rem; /* 모바일 폰트 크기 조정 */
  }

  ${media.mobileSmall} {
    font-size: 0.85rem; /* 모바일 360px 기준 폰트 크기 조정 */
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

const InputWithActionButtonGroup = styled.div`
  display: flex;
  gap: 12px; /* 기본 간격 */

  ${media.mobile} {
    flex-direction: column; /* 모바일에서 세로로 쌓이도록 변경 */
    gap: 8px; /* 모바일 간격 조정 */
  }

  ${media.mobileSmall} {
    gap: 6px;
  }
`;

const ActionButton = styled.button`
  padding: 12px 20px; /* 기본 패딩 */
  font-size: 0.95rem; /* 기본 폰트 크기 */
  background-color: #333;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap; /* 텍스트가 줄바꿈되지 않도록 */

  &:hover {
    background-color: #5593ff;
  }

  ${media.mobile} {
    padding: 10px 16px; /* 모바일 패딩 조정 */
    font-size: 0.9rem; /* 모바일 폰트 크기 조정 */
    width: 100%; /* 모바일에서 너비 100%로 설정 */
  }

  ${media.mobileSmall} {
    padding: 8px 12px; /* 모바일 360px 기준 패딩 조정 */
    font-size: 0.85rem; /* 모바일 360px 기준 폰트 크기 조정 */
  }
`;

const EmailCheckMessage = styled.div<{ success: boolean }>`
  font-size: 0.85rem; /* 기본 폰트 크기 */
  color: ${(props) => (props.success ? '#007bff' : 'red')};
  margin-top: 4px;
  min-height: 20px;

  ${media.mobile} {
    font-size: 0.8rem; /* 모바일 폰트 크기 조정 */
  }

  ${media.mobileSmall} {
    font-size: 0.75rem; /* 모바일 360px 기준 폰트 크기 조정 */
  }
`;

const ErrorMessage = styled.div`
  font-size: 0.85rem; /* 기본 폰트 크기 */
  color: red;
  margin-top: 4px;

  ${media.mobile} {
    font-size: 0.8rem; /* 모바일 폰트 크기 조정 */
  }

  ${media.mobileSmall} {
    font-size: 0.75rem; /* 모바일 360px 기준 폰트 크기 조정 */
  }
`;

const Notice = styled.div`
  background-color: #eef1f6;
  padding: 12px 16px; /* 기본 패딩 */
  border-radius: 8px;
  font-size: 0.95rem; /* 기본 폰트 크기 */
  margin-bottom: 2rem; /* 기본 마진 */
  color: #444;
  line-height: 1.6;

  ${media.mobile} {
    padding: 10px 14px; /* 모바일 패딩 조정 */
    font-size: 0.9rem; /* 모바일 폰트 크기 조정 */
    margin-bottom: 1.5rem;
  }

  ${media.mobileSmall} {
    padding: 8px 12px; /* 모바일 360px 기준 패딩 조정 */
    font-size: 0.85rem; /* 모바일 360px 기준 폰트 크기 조정 */
    margin-bottom: 1rem;
  }
`;

const UserSignupForm = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || '';
  const navigate = useNavigate();

  // Input 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [residentRegistrationNumber, setResidentRegistrationNumber] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);

  // 검증 상태
  const [passwordError, setPasswordError] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState('');
  const [isEmailCheckSuccess, setIsEmailCheckSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [rrnError, setRrnError] = useState('');

  // ref들
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const rrnRef = useRef<HTMLInputElement>(null);

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^01[016789]\d{7,8}$/.test(phone);
  const isValidRRN = (rrn: string) => /^\d{6}-\d{7}$/.test(rrn);

  const formatPhoneNumber = (value: string) => {
    if (value.length === 11) return value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    if (value.length === 10) return value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    return value;
  };

  const validatePassword = (password: string): string => {
    if (!password || password.length < 8) return '비밀번호는 최소 8자 이상이어야 합니다.';
    let typeCount = 0;
    if (/[A-Z]/.test(password)) typeCount++;
    if (/[a-z]/.test(password)) typeCount++;
    if (/[0-9]/.test(password)) typeCount++;
    if (/[!@#$%^&*()_+\-={}[\]:;"'<>,.?/]/.test(password)) typeCount++;
    if (typeCount < 2) return '영문 대소문자, 숫자, 특수문자 중 2가지 이상을 포함해야 합니다.';
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
        if (lower.includes(seq.slice(i, i + 4))) return '연속된 문자열은 사용할 수 없습니다.';
      }
    }
    if (/(.)\1{2,}/.test(password)) return '동일한 문자를 3번 이상 연속 사용할 수 없습니다.';
    return '';
  };

  const formatRRN = (value: string) => {
    const digits = value.replace(/[^0-9]/g, '').slice(0, 13);
    return digits.length <= 6 ? digits : digits.slice(0, 6) + '-' + digits.slice(6);
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
      emailRef.current?.focus();
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
      emailRef.current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailChecked) {
      setEmailCheckMessage('이메일 중복 확인을 해주세요.');
      setIsEmailCheckSuccess(false);
      emailRef.current?.focus();
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      confirmPasswordRef.current?.focus();
      return;
    }

    if (!isValidPhone(phone)) {
      setPhoneError('휴대폰 번호 형식이 올바르지 않습니다.');
      phoneRef.current?.focus();
      return;
    }

    if (role === 'PATIENT' && !isValidRRN(residentRegistrationNumber)) {
      setRrnError('주민등록번호 형식이 올바르지 않습니다.');
      rrnRef.current?.focus();
      return;
    }

    const passwordValidationMsg = validatePassword(password);
    if (passwordValidationMsg) {
      setPasswordError(passwordValidationMsg);
      passwordRef.current?.focus();
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
    }

    try {
      await login({ email, password });

      if (role === 'HOSPITAL_ADMIN') {
        navigate('/hospital/create');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('자동 로그인 실패:', err);
      navigate('/login');
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
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <ActionButton type="button" onClick={handleEmailCheck}>
                중복 확인
              </ActionButton>
            </InputWithActionButtonGroup>
            <EmailCheckMessage success={isEmailCheckSuccess}>{emailCheckMessage}</EmailCheckMessage>
          </FieldGroup>

          <FieldGroup>
            <Label>비밀번호</Label>
            <Notice>8자 이상, 영문/숫자/특수문자 중 2가지 이상 포함</Notice>
            <Input
              ref={passwordRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FieldGroup>

          <FieldGroup>
            <Label>비밀번호 확인</Label>
            <Input
              ref={confirmPasswordRef}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
          </FieldGroup>

          <FieldGroup>
            <Label>이름</Label>
            <Input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FieldGroup>

          <FieldGroup>
            <Label>휴대폰 번호</Label>
            <Input
              ref={phoneRef}
              type="tel"
              value={formatPhoneNumber(phone)}
              placeholder="010-1234-1234 (-를 빼고 입력해주세요)"
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                setPhone(digitsOnly);
              }}
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
                ref={rrnRef}
                type="text"
                placeholder="123456-1234567 (-를 빼고 입력해주세요)"
                value={formatRRN(residentRegistrationNumber)}
                onChange={(e) => {
                  const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 13);
                  setResidentRegistrationNumber(formatRRN(digits));
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
      </FormContainer>
    </Wrapper>
  );
};

export default UserSignupForm;
