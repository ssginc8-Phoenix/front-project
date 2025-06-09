// src/hooks/useCurrentLocation.ts (개선된 가정 코드)
import { useState, useEffect, useMemo } from 'react';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
}

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<LocationState>({ latitude: null, longitude: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 기본 위치 (부산) 설정
    let defaultLat = 35.159545; // 부산 위도
    let defaultLng = 129.075633; // 부산 경도

    if (!navigator.geolocation) {
      setError('브라우저에서 위치 정보를 지원하지 않습니다.');
      setLocation({ latitude: defaultLat, longitude: defaultLng }); // 기본 위치 설정
      setLoading(false);
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setLoading(false);
    };

    const handleError = (err: GeolocationPositionError) => {
      setError(`위치 정보 오류: ${err.message}`);
      setLocation({ latitude: defaultLat, longitude: defaultLng }); // 오류 시 기본 위치 설정
      setLoading(false);
    };

    // 위치 정보를 한 번만 가져오도록 watchPosition 대신 getCurrentPosition 사용
    // 또는 watchPosition을 사용한다면, 콜백 함수를 useCallback으로 감싸야 합니다.
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

    // 만약 watchPosition을 사용한다면, 반드시 clearWatch를 반환해야 합니다.
    // const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, { ... });
    // return () => navigator.geolocation.clearWatch(watchId);
  }, []); // ✅ 의존성 배열을 비워 한 번만 실행되도록

  // ✅ currentLocation 객체를 useMemo로 감싸서, latitude나 longitude가 실제로 변할 때만 새로운 객체를 생성
  const memoizedCurrentLocation = useMemo(() => {
    if (location.latitude !== null && location.longitude !== null) {
      return { latitude: location.latitude, longitude: location.longitude };
    }
    return null;
  }, [location.latitude, location.longitude]); // 실제 값에만 의존

  return { currentLocation: memoizedCurrentLocation, loading, error };
};
