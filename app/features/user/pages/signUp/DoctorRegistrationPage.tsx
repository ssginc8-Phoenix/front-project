import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DoctorForm from '~/features/user/components/signUp/DoctorForm';
import CommonModal from '~/components/common/CommonModal';
import { checkEmailDuplicate, submitDoctorsInfo } from '~/features/user/api/UserAPI';
import type { DoctorInfo } from '~/types/user';
import Header from '~/layout/Header';
import useHospitalStore from '~/features/hospitals/state/hospitalStore';
import { getMyHospital } from '~/features/hospitals/api/hospitalAPI';

const PageBackground = styled.div`
  background: linear-gradient(to bottom right, #f0f4f8, #ffffff);
  min-height: 100vh;
  padding: 4rem 1rem;
`;

const Wrapper = styled.div`
  max-width: 720px;
  margin: 5rem auto;
  padding: 3rem;
  background-color: #ffffff;
  border-radius: 1.25rem;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: #111827;
  margin-bottom: 2.5rem;
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
  &:hover {
    background-color: #005fcc;
  }
`;

const AddButton = styled(Button)`
  background-color: #28a745;
  margin-right: 1rem;
  &:hover {
    background-color: #218838;
  }
`;

const DoctorRegistrationPage = () => {
  const { hospitalId, setHospitalId } = useHospitalStore();
  const [doctors, setDoctors] = useState<DoctorInfo[]>([
    { email: '', password: '', name: '', phone: '', specialization: '' },
  ]);
  const [emailCheckResults, setEmailCheckResults] = useState<
    { success: boolean; message: string; checked: boolean }[]
  >([{ success: false, message: '', checked: false }]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hospitalId) {
      getMyHospital()
        .then((res) => setHospitalId(res.hospitalId))
        .catch((err) => console.error('병원 정보 불러오기 실패', err));
    }
  }, [hospitalId, setHospitalId]);

  const handleChange = (index: number, field: keyof DoctorInfo, value: string) => {
    const updated = [...doctors];
    updated[index][field] = value;
    setDoctors(updated);

    if (field === 'email') {
      const updatedChecks = [...emailCheckResults];
      updatedChecks[index] = { success: false, message: '', checked: false };
      setEmailCheckResults(updatedChecks);
    }
  };

  const handleAddDoctor = () => {
    setDoctors((prev) => [
      ...prev,
      { email: '', password: '', name: '', phone: '', specialization: '' },
    ]);
    setEmailCheckResults((prev) => [...prev, { success: false, message: '', checked: false }]);
  };

  const handleRemove = (index: number) => {
    if (doctors.length > 1) {
      setDoctors((prev) => prev.filter((_, i) => i !== index));
      setEmailCheckResults((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleCheckEmail = async (index: number, email: string) => {
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
    updated[index] = { success, message, checked };
    setEmailCheckResults(updated);
  };

  const handleSubmit = async () => {
    const unverified = emailCheckResults.some((res) => !res.success || !res.checked);
    if (unverified) {
      alert('모든 이메일에 대해 중복 확인을 완료해주세요.');
      return;
    }

    if (!hospitalId) {
      alert('병원 ID가 없습니다. 병원을 먼저 등록해주세요.');
      return;
    }

    try {
      await submitDoctorsInfo({
        doctorInfos: doctors.map((d) => ({ ...d, hospitalId })),
      });
      setShowModal(true);
    } catch (err) {
      console.error('의사 등록 실패:', err);
      alert('의사 등록 중 오류가 발생했습니다.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <PageBackground>
      <Header />
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
            emailCheckMessage={
              !emailCheckResults[index]?.checked && !emailCheckResults[index]?.success
                ? '이메일 중복 확인을 해주세요.'
                : emailCheckResults[index]?.message
            }
            emailCheckSuccess={emailCheckResults[index]?.success}
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
