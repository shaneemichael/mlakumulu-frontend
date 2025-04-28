import React, { ReactNode } from 'react';
import Navbar from '../common/Navbar';

interface MainLayoutProps {
  children: ReactNode;
  hideNavbar: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, hideNavbar }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {!hideNavbar && <Navbar />}
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
        <p>© {new Date().getFullYear()} Mlaku-Mulu Travel Agency</p>
      </footer>
    </div>
  );
};

export default MainLayout;