import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">{title}</h1>
          <h2 className="mt-6 text-center text-xl font-semibold text-green-600">
            Mlaku-Mulu Travel Agency
          </h2>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;