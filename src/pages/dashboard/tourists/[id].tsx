import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../../components/layout/MainLayout';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import ProfileCard from '../../../components/tourist/ProfileCard';
import TravelCard from '../../../components/tourist/TravelCard';
import DeleteTouristModal from '../../../components/tourist/DeleteTouristModal';
import { touristService } from '../../../services/touristService';
import { travelService } from '../../../services/travelService';
import { useAuth } from '../../../hooks/useAuth';
import { Tourist } from '../../../types/tourist';
import { Travel } from '../../../types/travel';
import { UserRole } from '../../../types/auth';

const TouristDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  
  const [tourist, setTourist] = useState<Tourist | null>(null);
  const [travels, setTravels] = useState<Travel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    // Redirect if not employee
    if (user && user.role !== UserRole.EMPLOYEE) {
      router.push('/dashboard');
      return;
    }
    
    // Add this check - Next.js may run this effect before router is ready
    if (!router.isReady || !id) return;
    
    fetchTouristData();
  }, [id, user, router.isReady, router]);
  
  const fetchTouristData = async () => {
    try {
      const touristData = await touristService.getTourist(id);
      setTourist(touristData);
      
      // Fetch tourist's travels
      const travelsData = await travelService.getAllTravels();
      // Filter travels for this tourist
      const touristTravels = travelsData.filter(travel => travel.touristId === id);
      setTravels(touristTravels);
    } catch (err) {
      setError('Failed to load tourist details. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddTravel = () => {
    router.push(`/dashboard/travels/create?touristId=${id}`);
  };
  
  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!tourist) return;
    
    setIsDeleting(true);
    try {
      await touristService.deleteTourist(tourist.id);
      
      // Redirect to tourists list with success message
      router.push({
        pathname: '/dashboard/tourists',
        query: { 
          notification: 'Tourist deleted successfully',
          type: 'success'
        }
      });
    } catch (err) {
      setError('Failed to delete tourist. Please try again.');
      console.error(err);
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };
  
  if (loading) {
    return (
      <MainLayout hideNavbar={false}>
        <Loading />
      </MainLayout>
    );
  }
  
  if (!tourist) {
    return (
      <MainLayout hideNavbar={false}>
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          Tourist not found or you dont have permission to view this page.
        </div>
        <Button onClick={() => router.push('/dashboard/tourists')} className="mt-4">
          Back to Tourists
        </Button>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout hideNavbar={false}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tourist Details</h1>
        <div className="space-x-2">
          <Button 
            onClick={() => router.push(`/dashboard/tourists/edit/${id}`)} 
            variant="outline"
          >
            Edit Tourist
          </Button>
          <Button 
            onClick={handleAddTravel} 
            variant="primary"
          >
            Add Travel
          </Button>
          <Button 
            onClick={handleDeleteClick} 
            variant="danger"
          >
            Delete Tourist
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="mb-8">
        <ProfileCard tourist={tourist} />
      </div>
      
      <h2 className="text-xl font-bold mb-4">Travels</h2>
      {travels.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg">
          <h3 className="text-lg font-medium text-gray-500">No travels found</h3>
          <p className="mt-2 text-gray-400">
            This tourist doesnt have any travel records yet.
          </p>
          <Button 
            onClick={handleAddTravel}
            variant="primary"
            className="mt-4"
          >
            Add First Travel
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {travels.map((travel) => (
            <TravelCard 
              key={travel.id} 
              travel={travel} 
              isEmployee={true}
            />
          ))}
        </div>
      )}
      
      <DeleteTouristModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        touristName={tourist.name}
        isDeleting={isDeleting}
      />
    </MainLayout>
  );
};

export default TouristDetail;