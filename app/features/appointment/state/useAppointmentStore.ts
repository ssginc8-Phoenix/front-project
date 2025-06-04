import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppointmentState {
  patientId: number | null;
  setPatientId: (patientId: number) => void;

  doctorId: number | null;
  setDoctorId: (doctorId: number) => void;

  selectedSymptoms: string[];
  setSelectedSymptoms: (symptoms: string[]) => void;

  extraSymptom: string;
  setExtraSymptom: (text: string) => void;

  question: string;
  setQuestion: (text: string) => void;

  date: Date | null;
  setDate: (date: Date) => void;

  time: string;
  setTime: (time: string) => void;

  paymentMethod: string;
  setPaymentMethod: (method: string) => void;

  reset: () => void;
}

/* 일단 영속성 설정을 위해 Local Storage에 저장하는 걸로 함 */

const useAppointmentStore = create(
  persist<AppointmentState>(
    (set) => ({
      patientId: null,
      setPatientId: (id: number) => set({ patientId: id }),

      doctorId: null,
      setDoctorId: (id: number) => set({ doctorId: id }),

      selectedSymptoms: [],
      setSelectedSymptoms: (symptoms) => set({ selectedSymptoms: symptoms }),

      extraSymptom: '',
      setExtraSymptom: (text) => set({ extraSymptom: text }),

      question: '',
      setQuestion: (text) => set({ question: text }),

      date: null,
      setDate: (date) => set({ date: date }),

      time: '',
      setTime: (time) => set({ time: time }),

      paymentMethod: '',
      setPaymentMethod: (method) => set({ paymentMethod: method }),

      reset: () => {
        localStorage.removeItem('appointment-storage');
        set({
          patientId: null,
          doctorId: null,
          selectedSymptoms: [],
          extraSymptom: '',
          question: '',
          date: null,
          time: '',
          paymentMethod: '',
        });
      },
    }),
    {
      name: 'appointment-storage', // localStorage key 이름
    },
  ),
);

export default useAppointmentStore;
