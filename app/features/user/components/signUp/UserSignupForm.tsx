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
  align-items: flex-start; /* FormContainer가 Wrapper의 상단에 정렬되도록 */
  padding: 80px 40px; /* 기본 데스크톱 패딩 */
  min-height: 100vh; /* 뷰포트 높이보다 작아도 최소한 뷰포트만큼 차지 */
  margin-bottom: 5rem;
  width: 100%; /* 부모의 전체 너비를 사용하도록 */
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 */

  ${media.tablet} {
    padding: 60px 20px; /* 태블릿에서는 패딩 줄임 */
    margin-bottom: 3rem;
  }

  ${media.mobile} {
    padding: 30px 15px; /* 모바일에서는 패딩 더 줄임 */
    margin-bottom: 2rem;
  }

  ${media.mobileSmall} {
    padding: 20px 10px; /* 아주 작은 모바일에서는 최소 패딩 */
    margin-bottom: 1rem;
  }
`;

const FormContainer = styled.div`
  width: 720px; /* 기본 데스크톱 너비 */
  background-color: #ffffff;
  padding: 48px 64px; /* 기본 데스크톱 패딩 */
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 */

  ${media.tablet} {
    width: 90%; /* 태블릿에서는 화면의 90% 너비 */
    max-width: 720px; /* 최대 너비는 유지 */
    padding: 40px 48px; /* 태블릿 패딩 줄임 */
  }

  ${media.mobile} {
    width: 100%; /* 모바일에서는 거의 전체 너비 사용 */
    padding: 24px 24px; /* 모바일 패딩 더 줄임 */
    border-radius: 8px; /* 모바일에서 모서리 둥글기 줄임 */
    box-shadow: none; /* 모바일에서 그림자 제거 (선택 사항, 깔끔하게) */
  }

  ${media.mobileSmall} {
    padding: 16px 16px; /* 아주 작은 모바일에서 최소 패딩 */
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
  gap: 24px; /* 필드 그룹 간의 간격 */

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
  flex: 1; /* InputWithActionButtonGroup 내부에서 유동적으로 너비 차지 */
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
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 */

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

const InputWithActionButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap; /* 작은 화면에서 버튼이 줄 바꿈되도록 */

  ${media.mobile} {
    flex-direction: column; /* 모바일에서는 세로로 쌓이도록 */
    gap: 8px;
  }
`;

const ActionButton = styled.button`
  padding: 12px 20px;
  font-size: 0.95rem;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap; /* 텍스트 줄 바꿈 방지 */
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 */

  &:hover {
    background-color: #5593ff;
  }

  ${media.tablet} {
    padding: 10px 18px;
    font-size: 0.9rem;
  }

  ${media.mobile} {
    width: 100%; /* 모바일에서는 버튼이 꽉 차도록 */
    padding: 10px 12px;
    font-size: 0.85rem;
  }
`;

const EmailCheckMessage = styled.div<{ success: boolean }>`
  font-size: 0.85rem;
  color: ${(props) => (props.success ? '#007bff' : 'red')};
  margin-top: 4px;
  min-height: 20px; /* 메시지가 없어도 레이아웃 흔들림 방지 */

  ${media.tablet} {
    font-size: 0.8rem;
  }
`;

const ErrorMessage = styled.div`
  font-size: 0.85rem;
  color: red;
  margin-top: 4px;
  min-height: 20px; /* 메시지가 없어도 레이아웃 흔들림 방지 */

  ${media.tablet} {
    font-size: 0.8rem;
  }
`;

const Notice = styled.div`
  background-color: #eef1f6;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  margin-bottom: 2rem;
  color: #444;
  line-height: 1.6;
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 */

  ${media.tablet} {
    padding: 10px 14px;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  ${media.mobile} {
    padding: 8px 12px;
    font-size: 0.85rem;
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
    // 숫자만 남기고 최대 11자리로 제한
    const digitsOnly = value.replace(/[^0-9]/g, '').slice(0, 11);
    if (digitsOnly.length === 11) return digitsOnly.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    if (digitsOnly.length === 10 && digitsOnly.startsWith('010'))
      return digitsOnly.replace(/(\d{3})(\d{4})(\d{3})/, '$1-$2-$3'); // 010-xxxx-xxx 형태 방지
    if (digitsOnly.length === 10) return digitsOnly.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    return digitsOnly;
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
    return digits.length <= 6 ? digits : `${digits.slice(0, 6)}-${digits.slice(6)}`;
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

    if (!emailChecked || !isEmailCheckSuccess) {
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

    const passwordValidationMsg = validatePassword(password);
    if (passwordValidationMsg) {
      setPasswordError(passwordValidationMsg);
      passwordRef.current?.focus();
      return;
    } else {
      setPasswordError(''); // 오류 메시지 초기화
    }

    if (!isValidPhone(phone)) {
      setPhoneError('휴대폰 번호 형식이 올바르지 않습니다.');
      phoneRef.current?.focus();
      return;
    } else {
      setPhoneError('');
    }

    if (role === 'PATIENT' && !isValidRRN(residentRegistrationNumber)) {
      setRrnError('주민등록번호 형식이 올바르지 않습니다.');
      rrnRef.current?.focus();
      return;
    } else {
      setRrnError('');
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('address', `${address} ${detailAddress}`.trim());
    if (profileImage) formData.append('profileImage', profileImage);
    formData.append('role', role);

    try {
      const response = await submitEmailSignup(formData);

      if (role === 'PATIENT') {
        await submitPatientInfo({ userId: response.userId, residentRegistrationNumber });
      }

      await login({ email, password }); // 자동 로그인 시도

      if (role === 'HOSPITAL_ADMIN') {
        navigate('/hospital/create');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('회원가입 또는 자동 로그인 실패:', err);
      // 사용자에게 에러 메시지를 보여주는 모달 등을 추가할 수 있습니다.
      // 예: setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      navigate('/login'); // 실패 시 로그인 페이지로 리다이렉트
    }
  };

  return (
    <Wrapper>
      <FormContainer>
        <Title>{roleTitleMap[role] || '회원가입'}</Title>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <FieldGroup>
            <Label htmlFor="email">이메일</Label>
            <InputWithActionButtonGroup>
              <Input
                id="email"
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailChecked(false); // 이메일 변경 시 중복 확인 초기화
                  setIsEmailCheckSuccess(false);
                  setEmailCheckMessage('');
                }}
                required
              />
              <ActionButton type="button" onClick={handleEmailCheck}>
                중복 확인
              </ActionButton>
            </InputWithActionButtonGroup>
            <EmailCheckMessage success={isEmailCheckSuccess}>{emailCheckMessage}</EmailCheckMessage>
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Notice>8자 이상, 영문/숫자/특수문자 중 2가지 이상 포함</Notice>
            <Input
              id="password"
              ref={passwordRef}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(validatePassword(e.target.value)); // 실시간 비밀번호 유효성 검사
              }}
              required
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              ref={confirmPasswordRef}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
            {password !== confirmPassword && confirmPassword && (
              <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
            )}
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="phone">휴대폰 번호</Label>
            <Input
              id="phone"
              ref={phoneRef}
              type="tel"
              value={formatPhoneNumber(phone)}
              placeholder="010-1234-1234 (-를 빼고 입력해주세요)"
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                setPhone(digitsOnly);
                setPhoneError(''); // 입력 시 오류 메시지 초기화
              }}
              required
            />
            {phoneError && <ErrorMessage>{phoneError}</ErrorMessage>}
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="address">주소</Label>
            <DaumPost address={address} setAddress={setAddress} />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="detailAddress">상세 주소</Label>
            <Input
              id="detailAddress"
              type="text"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
            />
          </FieldGroup>

          {role === 'PATIENT' && (
            <FieldGroup>
              <Label htmlFor="residentRegistrationNumber">주민등록번호</Label>
              <Input
                id="residentRegistrationNumber"
                ref={rrnRef}
                type="text"
                placeholder="123456-1234567 (-를 빼고 입력해주세요)"
                value={formatRRN(residentRegistrationNumber)}
                onChange={(e) => {
                  const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 13);
                  setResidentRegistrationNumber(formatRRN(digits));
                  setRrnError(''); // 입력 시 오류 메시지 초기화
                }}
                required
              />
              {rrnError && <ErrorMessage>{rrnError}</ErrorMessage>}
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

          <Button type="submit">회원가입</Button>
        </Form>
      </FormContainer>
    </Wrapper>
  );
};

export default UserSignupForm;
