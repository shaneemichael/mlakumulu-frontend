import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../../components/layout/MainLayout';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import { touristService } from '../../../services/touristService';
import { useAuth } from '../../../hooks/useAuth';
import { Tourist } from '../../../types/tourist';
import { UserRole } from '../../../types/auth';

const TouristsList: React.FC = () => {
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect if not employee
    if (user && user.role !== UserRole.EMPLOYEE) {
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
  }, [user, router]);
  
  if (loading) {
    return (
      <MainLayout hideNavbar={false}>
        <Loading />
      </MainLayout>
    );
  }
  
  return (
    <MainLayout hideNavbar={false}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-500">Tourists</h1>
        <Button onClick={() => router.push('/dashboard/tourists/create')} variant="primary">
          Add New Tourist
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {tourists.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No tourists found</p>
            <Button onClick={() => router.push('/dashboard/tourists/create')} variant="primary">
              Add your first tourist
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tourists.map((tourist) => (
            <Card key={tourist.id}>
              <div className="flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 blue-100" viewBox="0 0 20 20" fill="blue-300">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-500">{tourist.name}</h3>
                    <p className="text-sm text-gray-600">{tourist.nationality}</p>
                  </div>
                </div>
                
                {tourist.email && (
                  <p className="text-sm mb-2 text-gray-600">
                    <span className="font-medium text-gray-600">Email:</span> {tourist.email}
                  </p>
                )}
                
                {tourist.phoneNumber && (
                  <p className="text-sm mb-4 text-gray-600">
                    <span className="font-medium text-gray-600">Phone:</span> {tourist.phoneNumber}
                  </p>
                )}
                
                <div className="mt-auto pt-4 flex justify-between">
                  <Button 
                    onClick={() => router.push(`/dashboard/tourists/${tourist.id}`)} 
                    variant="secondary"
                    size="sm"
                  >
                    View Details
                  </Button>
                  <Button 
                    onClick={() => router.push(`/dashboard/tourists/edit/${tourist.id}`)} 
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default TouristsList;