import styled from 'styled-components';
import { ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';

const CardWrapper = styled.div<{ backgroundColor?: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  background-color: ${(props) => props.backgroundColor || '#fff'};
  cursor: pointer;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const DoctorSection = styled.div`
  color: #0056b3;
  font-weight: bold;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 100px;
  margin-right: 16px;
`;

const Divider = styled.div`
  width: 1px;
  height: 40px;
  background-color: #e0e0e0;
  margin-right: 16px;
`;

const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PatientNameLine = styled.div`
  font-weight: bold;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GuardianLine = styled.div`
  font-size: 14px;
  color: #888888;
`;

const ArrowIcon = styled.div`
  margin-left: 16px;
`;

interface DashBoardCardProps {
  doctorName: string;
  patientName: string;
  // patientRrn: string;
  // guardianName: string;
  appointmentTime: string;
  backgroundColor?: string;
  onClick?: () => void;
}

const DashboardCard = ({
  doctorName,
  patientName,
  // patientRrn,
  // guardianName,
  appointmentTime,
  backgroundColor,
  onClick,
}: DashBoardCardProps) => {
  const formattedTime = dayjs(appointmentTime).format('YY.MM.DD HH:mm');

  return (
    <CardWrapper backgroundColor={backgroundColor} onClick={onClick}>
      <DoctorSection>
        {doctorName} 의사
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '4px' }}>
          {formattedTime}
        </div>
      </DoctorSection>
      <Divider />
      <InfoSection>
        <PatientNameLine>
          {patientName}{' '}
          {/*<span style={{ fontWeight: 'normal', fontSize: '14px' }}>{patientIdentifier}</span>*/}
        </PatientNameLine>
        {/*{guardianName && <GuardianLine>보호자 {guardianName} </GuardianLine>}*/}
      </InfoSection>
      <ArrowIcon>
        <ChevronRight size={20} color="#888" />
      </ArrowIcon>
    </CardWrapper>
  );
};

export default DashboardCard;
