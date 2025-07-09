import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

declare global {
  interface Window {
    kakao: any;
  }
}

const MapContainer = styled.div`
  position: relative;
  height: calc(100vh - 146px);
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  overflow: hidden;
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
  currentLocation?: { latitude: number; longitude: number } | null;
  patientMarker?: { lat: number; lng: number } | null;
}

const AroundMap = ({ hospitals, center, onMarkerClick, currentLocation }: AroundMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const [kakaoMapLoaded, setKakaoMapLoaded] = useState(false);

  // 1. 카카오 지도 SDK 로드
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setKakaoMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=3bde56866d8f5daeff2c18e2bcbdf4f1&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        setKakaoMapLoaded(true);
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 2. 지도 초기화
  useEffect(() => {
    if (!kakaoMapLoaded || !mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: 5,
      });
    }
  }, [kakaoMapLoaded]);

  // 3. 지도 중심 이동
  useEffect(() => {
    if (mapInstance.current && center) {
      const newCenter = new window.kakao.maps.LatLng(center.lat, center.lng);
      mapInstance.current.setCenter(newCenter);
    }
  }, [center]);

  // 4. 마커 생성
  useEffect(() => {
    if (!kakaoMapLoaded || !mapInstance.current) return;

    // 기존 마커 제거
    markers.current.forEach((marker) => marker.setMap(null));
    markers.current = [];

    // 현재 위치 마커
    if (currentLocation) {
      const currentMarker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(currentLocation.latitude, currentLocation.longitude),
        map: mapInstance.current,
        image: new window.kakao.maps.MarkerImage(
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
          new window.kakao.maps.Size(32, 32),
          { offset: new window.kakao.maps.Point(16, 16) },
        ),
        clickable: false,
        zIndex: 10,
      });
      markers.current.push(currentMarker);
    }

    // 병원 마커
    hospitals.forEach((hospital) => {
      const position = new window.kakao.maps.LatLng(hospital.latitude, hospital.longitude);
      const marker = new window.kakao.maps.Marker({
        position,
        map: mapInstance.current,
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        onMarkerClick(hospital.hospitalId, hospital.latitude, hospital.longitude);
      });

      markers.current.push(marker);
    });
  }, [hospitals, kakaoMapLoaded, center, currentLocation, onMarkerClick]);

  return <MapContainer ref={mapRef} />;
};

export default AroundMap;
