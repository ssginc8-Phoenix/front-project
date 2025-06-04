import styled from 'styled-components';

import { useHospitalDetail } from '../../../hooks/useHospitalDetail';
import BasicMap from './BasicMap';

const SectionTitle = styled.h3`
  margin-top: 2rem;
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
`;

const MapContainer = styled.div`
  margin-top: 1rem;
`;

const TabContent = styled.div`
  padding-top: 0.5rem;
`;

interface HospitalMapProps {
  hospitalId: number;
}

const HospitalMap = ({ hospitalId }: HospitalMapProps) => {
  const { lat, lon } = useHospitalDetail(hospitalId);

  return (
    <TabContent>
      <SectionTitle>위치 정보</SectionTitle>
      <MapContainer>
        {lat !== null && lon !== null ? (
          <BasicMap lat={lat} lon={lon} />
        ) : (
          <p style={{ color: '#9ca3af' }}>지도 정보를 찾을 수 없습니다.</p>
        )}
      </MapContainer>
    </TabContent>
  );
};

export default HospitalMap;
