// src/store/locationStore.ts
import { create } from 'zustand';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  isLoading: boolean;
  error: string | null;
  setLocation: (latitude: number, longitude: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchCurrentLocation: () => Promise<void>; // 위치 정보를 가져오는 액션 추가
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  isLoading: false,
  error: null,
  setLocation: (latitude, longitude) => set({ latitude, longitude }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  fetchCurrentLocation: async () => {
    set({ isLoading: true, error: null });
    try {
      const { latitude, longitude } = await import('../../../util/geolocation').then((module) =>
        module.getCurrentPosition(),
      );
      set({ latitude, longitude, isLoading: false, error: null });
    } catch (err: any) {
      console.error('Failed to fetch current location:', err);
      set({ error: err.message || 'Failed to get current location.', isLoading: false });
    }
  },
}));
