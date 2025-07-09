import type { doctorSidebarItem } from '~/features/doctor/components/constants/doctorSidebarItems';
import type { hospitalSidebarItem } from '~/features/hospitals/components/constants/hospitalSidebarItems';

export interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  key: string;
}

export const patientSidebarItems: SidebarItem[] = [
  { label: '보호자 관리', icon: '🧑‍🤝‍🧑', key: 'guardian' },
  { label: '예약 조회', icon: '📋', key: 'appointment' },
  { label: '캘린더', icon: '🗓️', key: 'calendar' },
  { label: '정보 관리', icon: '⚙️', key: 'info' },
];

export const guardianSidebarItems = [
  { label: '환자 관리', key: 'patient', icon: '🧑‍💼' },
  { label: '예약 관리', key: 'appointment', icon: '📋' },
  { label: '캘린더', key: 'calendar', icon: '🗓️' },
  { label: '리뷰 관리', key: 'review', icon: '✏️' },
  { label: 'Q&A', key: 'qna', icon: '💬' },
  { label: '정보 관리', key: 'info', icon: '⚙️' },
];

export const doctorSidebarItems: doctorSidebarItem[] = [
  { label: '정보 관리', icon: '🧑‍🤝‍🧑', key: 'info' },
  { label: '스케줄 관리', icon: '⚙️', key: 'schedule' },
  { label: '예약 조회', icon: '💬', key: 'appointmentDashboard' },
  { label: 'Q&A', icon: '❓', key: 'qna' },
  { label: '캘린더', icon: '🗓️', key: 'calendar' },
  { label: '리뷰 관리', icon: '✏️', key: 'review' },
  { label: '고객 센터', icon: '📋', key: 'cs' },
];

export const hospitalSidebarItems: hospitalSidebarItem[] = [
  { label: '병원 정보 관리', icon: '🧑‍🤝‍🧑', key: 'info' },
  { label: '예약 관리', icon: '💬', key: 'appointmentDashboard' },
  { label: '차트 관리', icon: '⚙️', key: 'chart' },
  { label: '캘린더', icon: '🗓️', key: 'calendar' },
  { label: '리뷰 관리', icon: '✏️', key: 'review' },
  { label: '고객 센터', icon: '📋', key: 'cs' },
];
