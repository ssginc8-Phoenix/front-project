import React from 'react';
import { Outlet } from 'react-router';
import HeaderLayout from '~/layout/HeaderLayout';
import FooterLayout from '~/layout/FooterLayout';

export default function ReviewLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <HeaderLayout />

      <main style={{ flex: 1, padding: '1rem' }}>
        <Outlet />
      </main>

      <FooterLayout />
    </div>
  );
}
