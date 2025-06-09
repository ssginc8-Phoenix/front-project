import { useEffect } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  lat: number;
  lng: number;
}

export default function KakaoMap({ lat, lng }: KakaoMapProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=3bde56866d8f5daeff2c18e2bcbdf4f1&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(lat, lng),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);

        // ✅ 마커 추가
        new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(lat, lng),
          map: map,
        });
      });
    };
    document.head.appendChild(script);
  }, [lat, lng]);

  return <div id="map" style={{ width: '100%', height: '400px' }} />;
}
