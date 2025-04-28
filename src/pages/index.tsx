import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <MainLayout hideNavbar={true}>
      <div className="max-w-4xl mx-auto">
        <Card title="Welcome to Tourism Guide">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Hello, {user?.username || 'Tourist'}!
            </h2>
            <p className="text-gray-700">
              Explore exciting destinations and plan your next adventure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card title="Popular Destinations">
              <p className="mb-4 text-gray-800">Discover top-rated destinations around the world.</p>
              <Button 
                onClick={() => router.push('/destinations')}
                fullWidth
              >
                Browse Destinations
              </Button>
            </Card>

            <Card title="Your Itineraries">
              <p className="mb-4 text-gray-800">View and manage your saved travel plans.</p>
              <Button 
                onClick={() => router.push('/itineraries')}
                fullWidth
              >
                My Itineraries
              </Button>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              variant="secondary" 
              onClick={() => logout()}
            >
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default HomePage;