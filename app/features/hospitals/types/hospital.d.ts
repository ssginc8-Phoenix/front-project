// types/hospital.ts (예시)
export interface Hospital {
  schedules: HospitalSchedules;
  imageUrl?: never;
  name: string;
  waiting: number;
  hospitalId: number;
  hospitalName: string;
  address: string;
  phone: string;
  specialization: string;
  latitude: number;
  longitude: number;
  distance?: number;
  rating?: number;
  reviewCount?: number;
  notice: string;
}

export interface HospitalPage {
  content: Hospital[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
