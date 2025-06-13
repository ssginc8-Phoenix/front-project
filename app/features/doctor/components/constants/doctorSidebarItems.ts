export interface doctorSidebarItem {
  label: string;
  icon: React.ReactNode; // 👈 ReactNode 타입!
  key: string;
}

export const doctorSidebarItems: doctorSidebarItem[] = [
  { label: '정보 관리', icon: '🧑‍🤝‍🧑', key: 'info' },
  { label: '일정 관리', icon: '⚙️', key: 'schedule' },
  { label: '리뷰 관리', icon: '✏️', key: 'review' },
  { label: '캘린더', icon: '🗓️', key: 'calendar' },
  { label: '예약 관리', icon: '💬', key: 'appointment' },
  { label: '고객 센터', icon: '📋', key: 'cs1' },
];
