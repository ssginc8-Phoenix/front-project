// src/components/BasicMap.tsx
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import useKakaoLoader from '../../../hooks/useKakaoLoader';

type BasicMapProps = {
  lat: number;
  lon: number;
};

export default function BasicMap({ lat, lon }: BasicMapProps) {
  useKakaoLoader();
  return (
    <Map
      center={{ lat, lng: lon }}
      style={{ width: '100%', height: '350px' }} // 350px 대신 100%
      level={3}
    >
      <MapMarker
        position={{
          lat,
          lng: lon,
        }}
      />
    </Map>
  );
}
