import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import Card from '../../../../components/common/Card';
import Loading from '../../../../components/common/Loading';
import TravelForm from '../../../../components/travel/TravelForm';
import { travelService } from '../../../../services/travelService';
import { touristService } from '../../../../services/touristService';
import { useAuth } from '../../../../hooks/useAuth';
import { UserRole } from '../../../../types/auth';
import { Tourist } from '../../../../types/tourist';
import { Travel } from '../../../../types/travel';

const EditTravelPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [travel, setTravel] = useState<Travel | null>(null);
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;
  const { hasRole } = useAuth();
  const isEmployee = hasRole(UserRole.EMPLOYEE);

  useEffect(() => {
    // Only employees can access this page
    if (!isEmployee) {
      router.push('/dashboard');
      return;
    }

    if (!id || typeof id !== 'string') {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch both travel data and tourist list in parallel
        const [travelData, touristsData] = await Promise.all([
          travelService.getTravel(id),
          touristService.getAllTourists()
        ]);

        setTravel(travelData);
        setTourists(touristsData);
      } catch (err) {
        setError(err instanceof Error 
          ? err.message 
          : 'Failed to load travel data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEmployee, router]);

  const handleSuccess = () => {
    router.push('/dashboard/travels');
  };

  if (!isEmployee) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loading size="lg" text="Loading travel data..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !travel) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error || 'Travel not found'}
        </div>
        <div className="flex justify-end">
          <button 
            onClick={() => router.push('/dashboard/travels')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Back to Travels
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Edit Travel to {travel.destination.name}
        </h1>
      </div>
      
      <Card padding="lg">
        <TravelForm
          travel={travel}
          availableTourists={tourists}
          isEdit={true}
          onSuccess={handleSuccess}
        />
      </Card>
    </DashboardLayout>
  );
};

export default EditTravelPage;