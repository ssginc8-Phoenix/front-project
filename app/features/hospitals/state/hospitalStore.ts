// src/features/hospitals/stores/hospitalStore.ts
import { create } from 'zustand';

interface HospitalState {
  hospitalId: number | null;
  setHospitalId: (id: number) => void;
  clearHospitalId: () => void;
}

const useHospitalStore = create<HospitalState>((set) => ({
  hospitalId: null,
  setHospitalId: (id: number) => set({ hospitalId: id }),
  clearHospitalId: () => set({ hospitalId: null }),
}));

export default useHospitalStore;
