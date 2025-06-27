import styled from 'styled-components';
import type { DoctorInfo } from '~/types/user';

// --- 반응형 디자인을 위한 공통 사이즈 및 미디어 쿼리 정의 ---
const sizes = {
  laptopL: '1600px',
  laptop: '1024px',
  tablet: '768px',
  mobile: '480px',
  mobileSmall: '360px', // Target for 360x740
};

const media = {
  laptopL: `@media (max-width: ${sizes.laptopL})`,
  laptop: `@media (max-width: ${sizes.laptop})`,
  tablet: `@media (max-width: ${sizes.tablet})`,
  mobile: `@media (max-width: ${sizes.mobile})`,
  mobileSmall: `@media (max-width: ${sizes.mobileSmall})`,
};

interface Props {
  doctor: DoctorInfo;
  index: number;
  onChange: (index: number, field: keyof DoctorInfo, value: string) => void;
  onCheckEmail: (index: number, email: string) => void;
  onRemove: (index: number) => void;
  emailCheckMessage?: string;
  emailCheckSuccess?: boolean;
  isEmailInteracted?: boolean; // 새롭게 추가된 prop
}
const SPECIALIZATIONS = [
  { value: 'CARDIOLOGY', label: '심장내과' },
  { value: 'NEUROLOGY', label: '신경과' },
  { value: 'DERMATOLOGY', label: '피부과' },
  { value: 'PEDIATRICS', label: '소아과' },
  { value: 'RADIOLOGY', label: '영상의학과' },
  { value: 'ONCOLOGY', label: '종양내과' },
  { value: 'GYNECOLOGY', label: '산부인과' },
  { value: 'PSYCHIATRY', label: '정신과' },
  { value: 'GENERAL_SURGERY', label: '일반외과' },
  { value: 'UROLOGY', label: '비뇨기과' },
  { value: 'OPHTHALMOLOGY', label: '안과' },
  { value: 'ENT', label: '이비인후과' },
  { value: 'INTERNAL_MEDICINE', label: '내과' },
];
const DoctorForm = ({
  doctor,
  index,
  onChange,
  onCheckEmail,
  onRemove,
  emailCheckMessage = '',
  emailCheckSuccess = false,
  isEmailInteracted = false, // 기본값 false 설정
}: Props) => {
  return (
    <FormBlock>
      <FieldGroup>
        <Label>이메일</Label>
        <EmailGroup>
          <Input
            type="email"
            value={doctor.email}
            onChange={(e) => onChange(index, 'email', e.target.value)}
          />
          <Button type="button" onClick={() => onCheckEmail(index, doctor.email)}>
            중복 확인
          </Button>
        </EmailGroup>
        {/* isEmailInteracted가 true일 때만 메시지 렌더링 */}
        {isEmailInteracted && (
          <EmailCheckMessage success={emailCheckSuccess}>{emailCheckMessage}</EmailCheckMessage>
        )}
      </FieldGroup>

      <FieldGroup>
        <Label>비밀번호</Label>
        <Input
          type="password"
          value={doctor.password}
          onChange={(e) => onChange(index, 'password', e.target.value)}
        />
      </FieldGroup>

      <FieldGroup>
        <Label>이름</Label>
        <Input
          type="text"
          value={doctor.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
        />
      </FieldGroup>

      <FieldGroup>
        <Label>휴대폰 번호</Label>
        <Input
          type="tel"
          value={doctor.phone}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, '').slice(0, 11); // 숫자만, 최대 11자리
            let formatted = raw;

            if (raw.length <= 3) {
              formatted = raw;
            } else if (raw.length <= 7) {
              formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
            } else {
              formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`;
            }

            onChange(index, 'phone', formatted);
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <Label>전공</Label>
        <Select
          value={doctor.specialization}
          onChange={(e) => onChange(index, 'specialization', e.target.value)}
        >
          <option value="">전공을 선택하세요</option>
          {SPECIALIZATIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </FieldGroup>

      <ButtonRow>
        <RemoveButton type="button" onClick={() => onRemove(index)}>
          삭제하기
        </RemoveButton>
      </ButtonRow>
    </FormBlock>
  );
};

export default DoctorForm;

const FormBlock = styled.div`
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #eee;
  border-radius: 1rem;
  background-color: #f9f9f9;

  ${media.mobile} {
    padding: 0.8rem; /* 모바일 패딩 조정 */
    margin-bottom: 1.2rem; /* 모바일 마진 조정 */
    border-radius: 0.8rem; /* 모바일 테두리 둥글기 조정 */
  }

  ${media.mobileSmall} {
    padding: 0.6rem; /* 360px 기준 패딩 조정 */
    margin-bottom: 1rem; /* 360px 기준 마진 조정 */
    border-radius: 0.7rem; /* 360px 기준 테두리 둥글기 조정 */
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  ${media.mobile} {
    margin-bottom: 0.8rem; /* 모바일 마진 조정 */
  }

  ${media.mobileSmall} {
    margin-bottom: 0.6rem; /* 360px 기준 마진 조정 */
  }
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.25rem;

  ${media.mobile} {
    font-size: 0.95rem; /* 모바일 폰트 크기 조정 */
    margin-bottom: 0.2rem;
  }

  ${media.mobileSmall} {
    font-size: 0.9rem; /* 360px 기준 폰트 크기 조정 */
    margin-bottom: 0.15rem;
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  flex: 1;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  }

  ${media.mobile} {
    padding: 0.4rem; /* 모바일 패딩 조정 */
    font-size: 0.95rem; /* 모바일 폰트 크기 조정 */
    border-radius: 0.4rem;
  }

  ${media.mobileSmall} {
    padding: 0.35rem; /* 360px 기준 패딩 조정 */
    font-size: 0.9rem; /* 360px 기준 폰트 크기 조정 */
    border-radius: 0.3rem;
  }
`;

const EmailGroup = styled.div`
  display: flex;
  gap: 0.5rem;

  ${media.mobileSmall} {
    flex-direction: column; /* 360px에서 세로로 쌓이도록 변경 */
    gap: 0.4rem; /* 360px 간격 조정 */
  }
`;
const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: white;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  }

  ${media.mobile} {
    padding: 0.4rem; /* 모바일 패딩 조정 */
    font-size: 0.95rem; /* 모바일 폰트 크기 조정 */
    border-radius: 0.4rem;
  }

  ${media.mobileSmall} {
    padding: 0.35rem; /* 360px 기준 패딩 조정 */
    font-size: 0.9rem; /* 360px 기준 폰트 크기 조정 */
    border-radius: 0.3rem;
  }
`;
const EmailCheckMessage = styled.div<{ success: boolean }>`
  font-size: 0.85rem;
  margin-top: 0.25rem;
  color: ${(props) => (props.success ? '#007bff' : 'red')};

  ${media.mobile} {
    font-size: 0.8rem; /* 모바일 폰트 크기 조정 */
    margin-top: 0.2rem;
  }

  ${media.mobileSmall} {
    font-size: 0.75rem; /* 360px 기준 폰트 크기 조정 */
    margin-top: 0.15rem;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end; /* 버튼을 오른쪽으로 정렬 */
  margin-top: 1rem;

  ${media.mobile} {
    margin-top: 0.8rem;
  }

  ${media.mobileSmall} {
    margin-top: 0.6rem;
    justify-content: center; /* 360px에서 중앙 정렬 */
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */

  &:hover {
    background-color: #005fcc;
  }

  ${media.mobile} {
    padding: 0.4rem 0.8rem; /* 모바일 패딩 조정 */
    font-size: 0.9rem; /* 모바일 폰트 크기 조정 */
    border-radius: 0.4rem;
  }

  ${media.mobileSmall} {
    padding: 0.35rem 0.7rem; /* 360px 기준 패딩 조정 */
    font-size: 0.85rem; /* 360px 기준 폰트 크기 조정 */
    border-radius: 0.3rem;
  }
`;

const RemoveButton = styled(Button)`
  background-color: #dc3545;
  &:hover {
    background-color: #c82333;
  }
`;
