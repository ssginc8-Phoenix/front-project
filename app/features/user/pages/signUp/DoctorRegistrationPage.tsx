import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DoctorForm from '~/features/user/components/signUp/DoctorForm';
import CommonModal from '~/components/common/CommonModal';
import { checkEmailDuplicate, submitDoctorsInfo } from '~/features/user/api/UserAPI';
import type { DoctorInfo } from '~/types/user';
import useHospitalStore from '~/features/hospitals/state/hospitalStore';
import { getMyHospital } from '~/features/hospitals/api/hospitalAPI';
import { showErrorAlert } from '~/components/common/alert';

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

const PageBackground = styled.div`
  background: linear-gradient(to bottom right, #f0f4f8, #ffffff);
  min-height: 100vh;
  padding: 4rem 1rem;

  ${media.mobile} {
    padding: 2rem 0.5rem; /* 모바일 패딩 조정 */
  }

  ${media.mobileSmall} {
    padding: 1.5rem 0.25rem; /* 360px 기준 패딩 조정 */
  }
`;

const Wrapper = styled.div`
  max-width: 720px;
  margin: 5rem auto;
  padding: 3rem;
  background-color: #ffffff;
  border-radius: 1.25rem;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.06);

  ${media.tablet} {
    max-width: 600px;
    padding: 2.5rem;
    margin: 4rem auto;
  }

  ${media.mobile} {
    max-width: 95%; /* 모바일에서 더 넓게 사용 */
    margin: 2rem auto; /* 모바일 마진 조정 */
    padding: 2rem; /* 모바일 패딩 조정 */
    border-radius: 1rem; /* 모바일 테두리 둥글기 조정 */
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05); /* 모바일 그림자 약화 */
  }

  ${media.mobileSmall} {
    margin: 1.5rem auto; /* 360px 기준 마진 조정 */
    padding: 1.5rem; /* 360px 기준 패딩 조정 */
    border-radius: 0.8rem; /* 360px 기준 테두리 둥글기 조정 */
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: #111827;
  margin-bottom: 2.5rem;

  ${media.mobile} {
    font-size: 1.8rem; /* 모바일 폰트 크기 조정 */
    margin-bottom: 2rem; /* 모바일 마진 조정 */
  }

  ${media.mobileSmall} {
    font-size: 1.5rem; /* 360px 기준 폰트 크기 조정 */
    margin-bottom: 1.5rem; /* 360px 기준 마진 조정 */
  }
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%; /* 너비 100%로 설정 */

  &:hover {
    background-color: #005fcc;
  }

  ${media.mobile} {
    padding: 0.6rem 0.8rem; /* 모바일 패딩 조정 */
    font-size: 0.95rem; /* 모바일 폰트 크기 조정 */
    margin-top: 0.8rem;
  }

  ${media.mobileSmall} {
    padding: 0.5rem 0.7rem; /* 360px 기준 패딩 조정 */
    font-size: 0.9rem; /* 360px 기준 폰트 크기 조정 */
    margin-top: 0.7rem;
  }
`;

const AddButton = styled(Button)`
  background-color: #28a745;
  margin-right: 0; /* Remove right margin for full width on mobile */
  margin-bottom: 1rem; /* Add bottom margin for separation on mobile */

  &:hover {
    background-color: #218838;
  }

  ${media.mobile} {
    margin-bottom: 0.8rem;
  }

  ${media.mobileSmall} {
    margin-bottom: 0.7rem;
  }
`;

const DoctorRegistrationPage = () => {
  const { hospitalId, setHospitalId } = useHospitalStore();
  const [doctors, setDoctors] = useState<DoctorInfo[]>([
    { email: '', password: '', name: '', phone: '', specialization: '' },
  ]);
  // `isInteracted` 속성 추가: 이 필드에 사용자 상호작용(입력 또는 버튼 클릭)이 있었는지 여부
  const [emailCheckResults, setEmailCheckResults] = useState<
    { success: boolean; message: string; checked: boolean; isInteracted: boolean }[]
  >([{ success: false, message: '', checked: false, isInteracted: false }]); // 초기에는 `isInteracted`를 false로 설정

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hospitalId) {
      getMyHospital()
        .then((res) => setHospitalId(res.hospitalId))
        .catch(async (err) => {
          console.error('병원 정보 불러오기 실패', err);
          await showErrorAlert('병원 정보 오류', '병원 정보를 불러오는 데 실패했습니다.');
        });
    }
  }, [hospitalId, setHospitalId]);

  const handleChange = (index: number, field: keyof DoctorInfo, value: string) => {
    const updated = [...doctors];
    updated[index][field] = value;
    setDoctors(updated);

    if (field === 'email') {
      const updatedChecks = [...emailCheckResults];
      // 이메일 필드에 값이 변경되면 `isInteracted`를 true로 설정하고, 중복 확인 상태 초기화
      updatedChecks[index] = {
        ...updatedChecks[index],
        success: false,
        message: '',
        checked: false,
        isInteracted: true,
      };
      setEmailCheckResults(updatedChecks);
    }
  };

  const handleAddDoctor = () => {
    setDoctors((prev) => [
      ...prev,
      { email: '', password: '', name: '', phone: '', specialization: '' },
    ]);
    // 새 의사를 추가할 때도 `isInteracted`는 false로 초기화
    setEmailCheckResults((prev) => [
      ...prev,
      { success: false, message: '', checked: false, isInteracted: false },
    ]);
  };

  const handleRemove = (index: number) => {
    if (doctors.length > 1) {
      setDoctors((prev) => prev.filter((_, i) => i !== index));
      setEmailCheckResults((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleCheckEmail = async (index: number, email: string) => {
    // '중복 확인' 버튼 클릭 시, `isInteracted`를 true로 설정
    const updatedChecks = [...emailCheckResults];
    if (!updatedChecks[index].isInteracted) {
      updatedChecks[index].isInteracted = true;
      setEmailCheckResults(updatedChecks);
    }

    // 이메일이 비어있는지 확인
    if (email.trim() === '') {
      updateEmailCheckResult(index, false, '이메일을 입력해주세요.', false); // 비어있으면 체크되지 않은 상태로 메시지 표시
      return; // API 호출 중단
    }

    try {
      await checkEmailDuplicate(email);
      updateEmailCheckResult(index, true, '사용 가능한 이메일입니다.', true);
    } catch {
      updateEmailCheckResult(index, false, '이미 사용 중인 이메일입니다.', true);
    }
  };

  const updateEmailCheckResult = (
    index: number,
    success: boolean,
    message: string,
    checked: boolean,
  ) => {
    const updated = [...emailCheckResults];
    // 중복 확인 결과가 업데이트될 때 `isInteracted`를 true로 설정
    updated[index] = { ...updated[index], success, message, checked, isInteracted: true };
    setEmailCheckResults(updated);
  };

  const handleSubmit = async () => {
    const updatedEmailChecks = [...emailCheckResults];
    let needsUpdate = false;

    // 제출하기 전에, 이메일이 입력되어 있는데 `isInteracted`가 false인 경우 `isInteracted`를 true로 변경
    // 이렇게 하면 제출 시 아직 중복 확인을 안 한 이메일에 대한 메시지가 나타남
    doctors.forEach((doctor, index) => {
      if (doctor.email.trim() !== '' && !updatedEmailChecks[index].isInteracted) {
        updatedEmailChecks[index].isInteracted = true;
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      setEmailCheckResults(updatedEmailChecks);
    }

    // `isInteracted` 상태를 고려하여 중복 확인이 완료되지 않은 이메일이 있는지 검사
    const unverified = emailCheckResults.some(
      (res, index) =>
        doctors[index].email.trim() !== '' && res.isInteracted && (!res.success || !res.checked),
    );

    if (unverified) {
      await showErrorAlert('이메일 중복 확인 필요', '모든 의사의 이메일 중복 확인을 완료해주세요.');
      return;
    }

    if (!hospitalId) {
      await showErrorAlert(
        '병원 정보 누락',
        '병원 ID가 존재하지 않습니다. 먼저 병원을 등록해주세요.',
      );
      return;
    }

    try {
      await submitDoctorsInfo({
        doctorInfos: doctors.map((d) => ({ ...d, hospitalId })),
      });
      setShowModal(true);
    } catch (err) {
      console.error('의사 등록 실패:', err);
      await showErrorAlert(
        '의사 등록 실패',
        '의사 등록 중 오류가 발생했습니다. 다시 시도해주세요.',
      );
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <PageBackground>
      <Wrapper>
        <Title>의사 등록</Title>
        {doctors.map((doctor, index) => (
          <DoctorForm
            key={index}
            doctor={doctor}
            index={index}
            onChange={handleChange}
            onCheckEmail={handleCheckEmail}
            onRemove={handleRemove}
            // `isInteracted`가 true일 때만 메시지 표시 로직 실행
            emailCheckMessage={
              emailCheckResults[index]?.isInteracted
                ? !emailCheckResults[index]?.checked && !emailCheckResults[index]?.success
                  ? '이메일 중복 확인을 해주세요.'
                  : emailCheckResults[index]?.message
                : '' // `isInteracted`가 false이면 메시지를 비워둠
            }
            emailCheckSuccess={emailCheckResults[index]?.success}
            isEmailInteracted={emailCheckResults[index]?.isInteracted} // DoctorForm에 `isInteracted` 상태 전달
          />
        ))}
        <AddButton type="button" onClick={handleAddDoctor}>
          의사 추가
        </AddButton>
        <Button type="button" onClick={handleSubmit}>
          등록하기
        </Button>

        {showModal && (
          <CommonModal
            title="의사 등록이 완료되었습니다."
            buttonText="확인"
            onClose={handleCloseModal}
          />
        )}
      </Wrapper>
    </PageBackground>
  );
};

export default DoctorRegistrationPage;
