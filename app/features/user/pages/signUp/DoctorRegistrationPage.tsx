import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DoctorForm from '~/features/user/components/signUp/DoctorForm';
import CommonModal from '~/components/common/CommonModal';
import { checkEmailDuplicate, submitDoctorsInfo } from '~/features/user/api/UserAPI';
import type { DoctorInfo } from '~/types/user';
import Header from '~/layout/Header';

const Wrapper = styled.div`
  max-width: 600px;
  margin: 60px auto;
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
  const [doctors, setDoctors] = useState<DoctorInfo[]>([
    { email: '', password: '', name: '', phone: '' },
  ]);
  const [emailCheckResults, setEmailCheckResults] = useState<
    { success: boolean; message: string }[]
  >([{ success: false, message: '' }]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleRemove = (index: number) => {
    if (doctors.length === 1) return;
    setDoctors((prev) => prev.filter((_, i) => i !== index));
    setEmailCheckResults((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof DoctorInfo, value: string) => {
    const updated = [...doctors];
    updated[index][field] = value;
    setDoctors(updated);
  };

  const handleAddDoctor = () => {
    setDoctors([...doctors, { email: '', password: '', name: '', phone: '' }]);
    setEmailCheckResults([...emailCheckResults, { success: false, message: '' }]);
  };

  const handleCheckEmail = async (index: number, email: string) => {
    try {
      await checkEmailDuplicate(email);
      updateEmailCheckResult(index, true, '사용 가능한 이메일입니다.');
    } catch (e) {
      updateEmailCheckResult(index, false, '이미 사용 중인 이메일입니다.');
    }
  };

  const updateEmailCheckResult = (index: number, success: boolean, message: string) => {
    const updated = [...emailCheckResults];
    updated[index] = { success, message };
    setEmailCheckResults(updated);
  };

  const handleSubmit = async () => {
    await submitDoctorsInfo({ doctorInfos: doctors });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <>
      <Header></Header>
      <Wrapper>
        <Title>의사 등록</Title>
        {doctors.map((doctor, index) => (
          <DoctorForm
            key={index}
            doctor={doctor}
            index={index}
            onRemove={handleRemove}
            onChange={handleChange}
            onCheckEmail={handleCheckEmail}
            emailCheckSuccess={emailCheckResults[index]?.success}
            emailCheckMessage={emailCheckResults[index]?.message}
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
    </>
  );
};

export default DoctorRegistrationPage;
