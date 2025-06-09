import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

declare global {
  interface Window {
    kakao: any;
  }
}

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

interface LocationCoord {
  lat: number;
  lng: number;
}

interface Hospital {
  hospitalId: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface AroundMapProps {
  hospitals: Hospital[];
  center: LocationCoord;
  onMarkerClick: (hospitalId: number, lat: number, lng: number) => void;
}

const AroundMap = ({ hospitals, center, onMarkerClick }: AroundMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // 카카오 지도 로딩 및 초기화
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=3bde56866d8f5daeff2c18e2bcbdf4f1&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(initMap);
      };

      return () => {
        document.head.removeChild(script);
      };
    } else {
      initMap();
    }
  }, []);

  // 지도 초기화 함수
  const initMap = () => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: 5,
      });
    }
  };

  // center 변경 시 지도 중심 이동
  useEffect(() => {
    if (mapInstance.current) {
      const newCenter = new window.kakao.maps.LatLng(center.lat, center.lng);
      mapInstance.current.setCenter(newCenter);
    }
  }, [center]);

  // 마커 그리기 (병원 목록 변경 시마다)
  useEffect(() => {
    if (!mapInstance.current || !window.kakao || !window.kakao.maps) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    hospitals.forEach((hospital) => {
      const position = new window.kakao.maps.LatLng(hospital.latitude, hospital.longitude);
      const marker = new window.kakao.maps.Marker({
        position,
        map: mapInstance.current,
      });

      // ✅ 클릭 이벤트 바인딩
      window.kakao.maps.event.addListener(marker, 'click', () => {
        console.log('[마커 클릭됨]', hospital.name);
        onMarkerClick(hospital.hospitalId, hospital.latitude, hospital.longitude);
      });

      markersRef.current.push(marker);
    });
  }, [hospitals, onMarkerClick]);

  return <MapContainer ref={mapRef} />;
};

export default AroundMap;
