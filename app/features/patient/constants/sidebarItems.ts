export interface SidebarItem {
  label: string;
  icon: React.ReactNode; // 👈 ReactNode 타입!
  key: string;
}

export const patientSidebarItems: SidebarItem[] = [
  { label: '보호자 관리', icon: '🧑‍🤝‍🧑', key: 'guardian' },
  { label: '캘린더 관리', icon: '🗓️', key: 'calendar' },
  { label: '정보 관리', icon: '⚙️', key: 'info' },
  { label: 'Q&A', icon: '💬', key: 'qna' },
  { label: '리뷰 관리', icon: '✏️', key: 'review' },
  { label: '예약 관리', icon: '📋', key: 'reservation' },
];
