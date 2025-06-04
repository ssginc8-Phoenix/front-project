// app/features/patient/components/DashboardButton.tsx

import React from 'react';

interface DashboardButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export const DashboardButton: React.FC<DashboardButtonProps> = ({
  icon,
  label,
  onClick,
  active = false,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      flex flex-col items-center p-6 rounded-2xl bg-gray-50 border border-transparent
      transition-all duration-150
      hover:bg-blue-50 hover:shadow-md
      ${active ? 'ring-2 ring-blue-400 bg-blue-50' : ''}
    `}
  >
    <span className="mb-2">{icon}</span>
    <span className="text-base font-semibold">{label}</span>
  </button>
);
