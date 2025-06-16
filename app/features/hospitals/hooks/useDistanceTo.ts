import { useState, useEffect } from 'react';

const toRad = (deg: number) => (deg * Math.PI) / 180;

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useDistanceTo = (
  targetLat: number | null,
  targetLng: number | null,
): number | null => {
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation || targetLat === null || targetLng === null) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: myLat, longitude: myLng } = pos.coords;
        const dist = calculateDistance(myLat, myLng, targetLat, targetLng);
        setDistance(dist);
      },
      (err) => {
        console.error('위치 정보를 가져오지 못했습니다:', err);
      },
    );
  }, [targetLat, targetLng]);

  return distance;
};
