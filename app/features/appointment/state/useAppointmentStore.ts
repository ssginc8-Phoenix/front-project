import { create } from 'zustand';

interface AppointmentState {
  patientId: number | null;
  setPatientId: (patientId: number | null) => void;
  patientName: string | null;
  setPatientName: (patientName: string | null) => void;
  rrn: string | null;
  setRrn: (rrn: string | null) => void;

  doctorId: number | null;
  setDoctorId: (doctorId: number | null) => void;
  doctorName: string | null;
  setDoctorName: (doctorName: string | null) => void;

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

const useAppointmentStore = create<AppointmentState>((set) => ({
  patientId: null,
  setPatientId: (id: number | null) => set({ patientId: id }),
  patientName: null,
  setPatientName: (name: string | null) => set({ patientName: name }),
  rrn: null,
  setRrn: (rrn: string | null) => set({ rrn: rrn }),

  doctorId: null,
  setDoctorId: (id: number | null) => set({ doctorId: id }),
  doctorName: null,
  setDoctorName: (name: string | null) => set({ doctorName: name }),

  selectedSymptoms: [],
  setSelectedSymptoms: (symptoms) => set({ selectedSymptoms: symptoms }),

  extraSymptom: '',
  setExtraSymptom: (text) => set({ extraSymptom: text }),

  question: '',
  setQuestion: (text) => set({ question: text }),

  date: null,
  setDate: (date) => set({ date }),

  time: '',
  setTime: (time) => set({ time }),

  paymentMethod: '',
  setPaymentMethod: (method) => set({ paymentMethod: method }),

  reset: () =>
    set({
      patientId: null,
      patientName: null,
      doctorId: null,
      selectedSymptoms: [],
      extraSymptom: '',
      question: '',
      date: null,
      time: '',
      paymentMethod: '',
    }),
}));

export default useAppointmentStore;
