import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import type { Hospital } from '../../../types/hospital';

declare global {
  interface Window {
    kakao: any;
  }
}

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

interface LocationCoord {
  lat: number;
  lng: number;
}

interface AroundMapProps {
  hospitals: Hospital[];
  center: LocationCoord;
  onMarkerClick: (hospitalId: number, lat: number, lng: number) => void;
}

const AroundMap = ({ hospitals, center, onMarkerClick }: AroundMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [kakaoMapLoaded, setKakaoMapLoaded] = useState(false);
  const markerRefs = useRef<any[]>([]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=83891ef3391e6ddba1522c1c0be3a184&autoload=false`;
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

  useEffect(() => {
    if (!kakaoMapLoaded || !mapRef.current) return;

    const map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(center.lat, center.lng),
      level: 5,
    });
    mapInstance.current = map;

    // 기존 마커 제거
    markerRefs.current.forEach((marker) => marker.setMap(null));
    markerRefs.current = [];

    hospitals.forEach((hospital) => {
      const position = new window.kakao.maps.LatLng(hospital.latitude, hospital.longitude);
      const marker = new window.kakao.maps.Marker({ position, map });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        onMarkerClick(hospital.hospitalId, hospital.latitude, hospital.longitude);
      });

      markerRefs.current.push(marker);
    });

    return () => {
      markerRefs.current.forEach((marker) => marker.setMap(null));
      markerRefs.current = [];
    };
  }, [kakaoMapLoaded, hospitals, center]);

  useEffect(() => {
    if (mapInstance.current && center) {
      const newCenter = new window.kakao.maps.LatLng(center.lat, center.lng);
      mapInstance.current.setCenter(newCenter);
    }
  }, [center]);

  return <MapContainer ref={mapRef} />;
};

export default AroundMap;
