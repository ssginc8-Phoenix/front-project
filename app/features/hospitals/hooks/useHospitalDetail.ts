import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Hospital } from '../types/hospital';
import type { HospitalSchedule } from '../types/hospitalSchedule';

// useHospitalDetail.ts (수정)
import type { Doctor } from '../types/doctor'; // 타입 import

export const useHospitalDetail = (hospitalId: number) => {
  const [data, setData] = useState<Hospital | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [reviews, setReviews] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hospitalRes, scheduleRes, doctorRes, reviewRes] = await Promise.all([
          axios.get(`/api/v1/hospitals/${hospitalId}`),
          axios.get<HospitalSchedule[]>(`/api/v1/hospitals/${hospitalId}/schedules`),
          axios.get<Doctor[]>('/api/v1/doctors', {
            params: { hospitalId },
          }),
          axios.get(`/api/v1/hospitals/${hospitalId}/reviews`),
        ]);

        const hospital = hospitalRes.data;
        const schedules = scheduleRes.data;
        const doctors = doctorRes.data;
        const reviews = reviewRes.data;
        setData({ ...hospital, schedules });
        setDoctors(doctors);
        setReviews(reviews);
        setLat(hospital.latitude ?? null);
        setLon(hospital.longitude ?? null);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setError('병원 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hospitalId]);

  return { data, loading, error, lat, lon, doctors };
};
