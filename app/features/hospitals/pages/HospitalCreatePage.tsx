import styled from 'styled-components';
import HospitalCreateForm from '~/features/hospitals/components/hospitalAdmin/info/HospitalCreateForm';

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #00499e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  margin-left: 30rem;
`;

const HospitalCreatePage = () => {
  return (
    <>
      <Title>🏥 병원 등록</Title>
      <HospitalCreateForm />
    </>
  );
};

export default HospitalCreatePage;
