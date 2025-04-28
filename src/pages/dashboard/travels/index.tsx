import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import TravelList from '../../../components/travel/TravelList';
import { travelService } from '../../../services/travelService';
import { useAuth } from '../../../hooks/useAuth';
import { Travel } from '../../../types/travel';
import { UserRole } from '../../../types/auth';

const TravelsIndexPage: React.FC = () => {
  const [travels, setTravels] = useState<Travel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { hasRole } = useAuth();
  const isEmployee = hasRole(UserRole.EMPLOYEE);

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const data = isEmployee 
          ? await travelService.getAllTravels()
          : await travelService.getMyTravels();
        setTravels(data);
      } catch (err) {
        setError('Failed to load travels. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTravels();
  }, [isEmployee]);
  
  const handleCreateTravel = () => {
    router.push('/dashboard/travels/create');  // Fixed path to be consistent with folder structure
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loading size="lg" text="Loading travels..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEmployee ? 'All Travels' : 'My Travels'}
        </h1>
        {isEmployee && (
          <Button variant="primary" onClick={handleCreateTravel}>
            Create New Travel
          </Button>
        )}
      </div>

      {error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : (
        <TravelList 
          travels={travels} 
          isEmployee={isEmployee}
          // Don't pass any UI control props - handle UI elements at page level only
          hideHeader={true}  // Add this prop to TravelList to hide its header if it has one
          hideControls={true}  // Add this prop to hide any action buttons in TravelList
        />
      )}
    </DashboardLayout>
  );
};

export default TravelsIndexPage;