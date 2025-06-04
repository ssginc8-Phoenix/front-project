import styled from 'styled-components';
import hospitalDefault from '~/assets/hospital-default.jpeg';
import { useHospitalDetail } from '../../../hooks/useHospitalDetail';
import type { HospitalSchedule } from '../../../types/hospitalSchedule';

const Container = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 1rem;
`;

const Image = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: 0.75rem;
`;

const Header = styled.div`
  margin: 1.5rem 0;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HospitalName = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
`;

const WaitCount = styled.span`
  background-color: #fef3c7;
  color: #b45309;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.9rem;
`;

const Address = styled.p`
  color: #374151;
  margin: 0.5rem 0;
`;

const InfoRow = styled.div`
  margin-top: 0.5rem;
  color: #6b7280;
`;

const NoticeBox = styled.div`
  background-color: #f9fafb;
  padding: 1rem;
  border-left: 4px solid #3b82f6;
  margin-top: 1rem;
  border-radius: 0.5rem;

  p {
    margin: 0;
    color: #1f2937;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ActionButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`;

interface HospitalInfoTabProps {
  hospitalId: number;
  setSelectedTab: (tab: 'location' | 'doctors' | 'reviews') => void;
  selectedTab: 'location' | 'doctors' | 'reviews';
}

const HospitalInfoTab = ({ hospitalId }: HospitalInfoTabProps) => {
  const { data: hospital, loading, error } = useHospitalDetail(hospitalId);

  if (loading) return <p style={{ textAlign: 'center' }}>로딩 중...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
  if (!hospital) return <p style={{ textAlign: 'center' }}>병원 정보를 찾을 수 없습니다.</p>;

  const dayOfWeekMap: Record<number, string> = {
    0: 'SUNDAY',
    1: 'MONDAY',
    2: 'TUESDAY',
    3: 'WEDNESDAY',
    4: 'THURSDAY',
    5: 'FRIDAY',
    6: 'SATURDAY',
  };

  const today = new Date().getDay(); // 0~6
  const todayKey = dayOfWeekMap[today];

  const todaySchedule = hospital.schedules?.find((s: HospitalSchedule) => s.dayOfWeek === todayKey);
  const sch = todaySchedule
    ? `${todaySchedule.openTime} ~ ${todaySchedule.closeTime}`
    : '정보 없음';

  return (
    <Container>
      <Image src={hospital.imageUrl || hospitalDefault} alt={hospital.name} />

      <Header>
        <TitleRow>
          <HospitalName>{hospital.name}</HospitalName>
          <WaitCount>대기 {hospital.waiting ?? 0}명</WaitCount>
        </TitleRow>
        <Address>{hospital.address}</Address>
        <InfoRow>
          ☎ {hospital.phone} | 진료시간: {sch}
        </InfoRow>
      </Header>

      {hospital.notice && (
        <NoticeBox>
          <p>📢 {hospital.notice}</p>
        </NoticeBox>
      )}

      <ButtonGroup>
        <ActionButton>📹 비대면 진료 접수</ActionButton>
        <ActionButton>🏥 대면 진료 접수</ActionButton>
      </ButtonGroup>
    </Container>
  );
};

export default HospitalInfoTab;
