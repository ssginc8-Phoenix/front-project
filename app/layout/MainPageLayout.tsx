import React from 'react';
import { Outlet } from 'react-router';
import FooterLayout from '~/layout/FooterLayout';
import Header from '~/layout/Header';

export default function MainLayout() {
  return (
    <>
      <Header />

      <main style={{ maxWidth: 1024, margin: '0 auto', padding: '24px' }}>
        <Outlet />
      </main>

      <FooterLayout />
    </>
  );
}
