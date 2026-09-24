import React from 'react';
import { BakeryProvider, useBakery } from './context/BakeryContext';
import { Header } from './components/common/Header';
import { CustomerApp } from './components/customer/CustomerApp';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CodebaseExplorer } from './components/codebase/CodebaseExplorer';
import { AdminPasswordModal } from './components/modals/AdminPasswordModal';

const MainLayout: React.FC = () => {
  const { viewMode } = useBakery();

  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-[#211713] text-[#2B1A15] dark:text-[#FAF4EE] flex flex-col font-sans antialiased transition-colors duration-300">
      {/* Top Application Header - Only displayed on desktop (md:) or in admin/codebase mode to give pure native mobile app experience */}
      <div className={viewMode === 'customer' ? 'hidden md:block' : 'block'}>
        <Header />
      </div>

      {/* Main View Router */}
      <main className="flex-1 flex flex-col min-h-0">
        {viewMode === 'customer' && <CustomerApp />}
        {viewMode === 'admin' && <AdminDashboard />}
        {viewMode === 'codebase' && <CodebaseExplorer />}
      </main>

      {/* Security Gate for Admin Access (Simran@2208-) */}
      <AdminPasswordModal />
    </div>
  );
};

export default function App() {
  return (
    <BakeryProvider>
      <MainLayout />
    </BakeryProvider>
  );
}
