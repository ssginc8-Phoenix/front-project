import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function ListContainer({ title, children }: Props) {
  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
