// app/components/ui/card.tsx

import React from 'react';

export const Card = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="rounded-2xl border bg-white shadow p-4" {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="p-4" {...props}>
    {children}
  </div>
);
