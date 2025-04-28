import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Changed this import
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { travelService } from '../../services/travelService';
import { touristService } from '../../services/touristService';
import { useAuth } from '../../hooks/useAuth';
import { Travel } from '../../types/travel';
import { Tourist } from '../../types/tourist';
import { UserRole } from '../../types/auth';

const Dashboard: React.FC = () => {
  const [recentTravels, setRecentTravels] = useState<Travel[]>([]);
  const [touristProfile, setTouristProfile] = useState<Tourist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter(); // Changed to useRouter from Next.js
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent travels
        const travelsData = await travelService.getMyTravels();
        setRecentTravels(travelsData.slice(0, 3)); // Get only most recent 3
        
        // If user is a tourist, fetch their profile
        if (user?.role === UserRole.TOURIST) {
          const profileData = await touristService.getProfile();
          setTouristProfile(profileData);
        }
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  if (loading) {
    return (
      <DashboardLayout>
        <Loading />
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Dashboard</h1>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card title="Recent Travels" className="lg:col-span-2">
          {recentTravels.length === 0 ? (
            <p className="text-gray-500">No recent travels found.</p>
          ) : (
            <div className="space-y-4">
              {recentTravels.map((travel) => (
                <div 
                  key={travel.id} 
                  className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                >
                  <h3 className="font-medium text-gray-600">{travel.destination.city}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(travel.startDate).toLocaleDateString()} - {new Date(travel.endDate).toLocaleDateString()}
                  </p>
                  <button 
                    onClick={() => router.push(`/dashboard/travels/${travel.id}`)} // Changed to router.push
                    className="text-blue-600 text-sm mt-2 hover:underline"
                  >
                    View details
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
        
        <Card title="Quick Actions">
          <div className="space-y-4">
            <button
              onClick={() => router.push('/dashboard/profile')} // Changed to router.push
              className="block w-full text-left px-4 py-2 border border-gray-200 rounded hover:bg-gray-50 text-gray-600"
            >
              View Profile
            </button>
            <button
              onClick={() => router.push('/dashboard/travels')} // Changed to router.push
              className="block w-full text-left px-4 py-2 border border-gray-200 rounded hover:bg-gray-50 text-gray-600"
            >
              Manage Travels
            </button>
            {user?.role === UserRole.EMPLOYEE && (
              <button
                onClick={() => router.push('/dashboard/tourists')} // Changed to router.push
                className="block w-full text-left px-4 py-2 border border-gray-200 rounded hover:bg-gray-50 text-gray-600"
              >
                Manage Tourists
              </button>
            )}
          </div>
        </Card>
      </div>
      
      {user?.role === UserRole.TOURIST && touristProfile && (
        <Card title="Your Profile Summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-600">{touristProfile.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nationality</p>
              <p className="font-medium text-gray-600">{touristProfile.nationality}</p>
            </div>
            {touristProfile.passportNumber && (
              <div>
                <p className="text-sm text-gray-500">Passport Number</p>
                <p className="font-medium text-gray-600">{touristProfile.passportNumber}</p>
              </div>
            )}
            {touristProfile.email && (
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-600">{touristProfile.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => router.push('/dashboard/profile')} // Changed to router.push
            className="mt-4 text-blue-600 hover:underline"
          >
            View full profile
          </button>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;