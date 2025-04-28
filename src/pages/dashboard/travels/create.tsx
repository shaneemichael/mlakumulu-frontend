import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/common/Card';
import Loading from '../../../components/common/Loading';
import TravelForm from '../../../components/travel/TravelForm';
import { touristService } from '../../../services/touristService';
import { useAuth } from '../../../hooks/useAuth';
import { UserRole } from '../../../types/auth';
import { Tourist } from '../../../types/tourist';

const CreateTravelPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { hasRole } = useAuth();
  const isEmployee = hasRole(UserRole.EMPLOYEE);

  useEffect(() => {
    // Only employees can access this page or redirect
    if (!isEmployee) {
      router.push('/dashboard');
      return;
    }

    const fetchTourists = async () => {
      try {
        const data = await touristService.getAllTourists();
        setTourists(data);
      } catch (err) {
        setError('Failed to load tourists. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTourists();
  }, [isEmployee, router]);

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
          <Loading size="lg" text="Loading..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Travel</h1>
      
      <Card padding="lg">
        {error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        ) : null}
        
        <TravelForm
          availableTourists={tourists}
          onSuccess={handleSuccess}
        />
      </Card>
    </DashboardLayout>
  );
};

export default CreateTravelPage;