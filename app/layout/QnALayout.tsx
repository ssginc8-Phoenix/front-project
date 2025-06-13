// src/layout/QnALayout.tsx
import React from 'react';
import { Outlet } from 'react-router';
import Header from '~/layout/Header';
import FooterLayout from '~/layout/FooterLayout';

export default function QnALayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: 1, padding: '1rem' }}>
        <Outlet />
      </main>

      <FooterLayout />
    </div>
  );
}
