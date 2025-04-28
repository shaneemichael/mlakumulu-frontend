import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Safely use the auth hook with error handling
  let user = null;
  let logout = () => {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let hasRole = (_: UserRole) => false;
  let isEmployee = false;
  
  try {
    const auth = useAuth();
    user = auth.user;
    logout = auth.logout;
    hasRole = auth.hasRole;
    isEmployee = hasRole(UserRole.EMPLOYEE);
  } catch (error) {
    console.error("Auth context not available:", error);
  }
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Navigation items based on user role
  const navItems = user ? [
    { label: 'Dashboard', href: '/dashboard', active: router.pathname === '/dashboard' },
    { label: 'Profile', href: '/dashboard/profile', active: router.pathname === '/dashboard/profile' },
    ...(isEmployee ? [{ label: 'Tourists', href: '/dashboard/tourists', active: router.pathname.startsWith('/dashboard/tourists') }] : []),
    { label: 'Travels', href: '/dashboard/travels', active: router.pathname.startsWith('/dashboard/travels') }
  ] : [];
  
  return (
    <nav className="bg-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-white text-xl font-bold cursor-pointer">Mlaku-Mulu</span>
              </span>
            </Link>
            
            {user && (
              <div className="hidden md:flex md:ml-10 space-x-1">
                {navItems.map((item, idx) => (
                  <Link href={item.href} key={idx}>
                    <span className={`px-3 py-2 rounded-md text-sm font-medium text-white ${
                      item.active ? 'bg-blue-800' : 'hover:bg-blue-600'
                    } cursor-pointer transition-colors duration-200`}>
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <div className="hidden md:flex md:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white text-sm">Hello, {user.username}</span>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link href="/login">
                  <span className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-600 cursor-pointer transition-colors">
                    Login
                  </span>
                </Link>
                <Link href="/register/tourist">
                  <span className="px-3 py-2 rounded-md text-sm font-medium bg-white text-blue-700 hover:bg-gray-100 cursor-pointer transition-colors">
                    Register
                  </span>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-600 focus:outline-none transition-colors"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                {navItems.map((item, idx) => (
                  <Link href={item.href} key={idx}>
                    <span className={`block px-3 py-2 rounded-md text-base font-medium text-white ${
                      item.active ? 'bg-blue-900' : 'hover:bg-blue-600'
                    } cursor-pointer`}>
                      {item.label}
                    </span>
                  </Link>
                ))}
                
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <span className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-600 cursor-pointer">
                    Login
                  </span>
                </Link>
                <Link href="/register/tourist">
                  <span className="block px-3 py-2 rounded-md text-base font-medium bg-white text-blue-700 cursor-pointer">
                    Register
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;