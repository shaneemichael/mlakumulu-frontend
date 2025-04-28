import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import Modal from '../../../components/common/Modal';
import TravelForm from '../../../components/travel/TravelForm';
import { travelService } from '../../../services/travelService';
import { useAuth } from '../../../hooks/useAuth';
import { UserRole } from '../../../types/auth';
import { Travel } from '../../../types/travel';

const TravelDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { hasRole } = useAuth();
  const isEmployee = hasRole(UserRole.EMPLOYEE);
  
  const [travel, setTravel] = useState<Travel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchTravel = async () => {
      if (!id || typeof id !== 'string') return;
      
      try {
        const data = await travelService.getTravel(id);
        setTravel(data);
      } catch (err) {
        setError('Failed to load travel details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTravel();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    setIsDeleting(true);
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
  };

  const handleConfirmDelete = async () => {
    if (!travel?.id) return;
    
    setDeleteLoading(true);
    try {
      await travelService.deleteTravel(travel.id);
      setIsDeleting(false);
      router.push('/dashboard/travels');
    } catch (err) {
      setError('Failed to delete travel. Please try again later.');
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setIsEditing(false);
    // Refresh data
    if (id && typeof id === 'string') {
      setLoading(true);
      travelService.getTravel(id)
        .then(data => setTravel(data))
        .catch(err => {
          setError('Failed to refresh travel details.');
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loading size="lg" text="Loading travel details..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  if (!travel) {
    return (
      <DashboardLayout>
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md">
          Travel not found.
        </div>
      </DashboardLayout>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Travel Details
        </h1>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => router.push('/dashboard/travels')}>
            Back to List
          </Button>
          {isEmployee && (
            <>
              <Button variant="primary" onClick={handleEdit}>
                Edit Travel
              </Button>
              <Button variant="danger" onClick={handleDeleteClick}>
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <Card padding="lg">
          <TravelForm
            travel={travel}
            touristId={travel.touristId}
            isEdit={true}
            onSuccess={handleFormSuccess}
          />
        </Card>
      ) : (
        <Card padding="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
            <div>
              <h2 className="text-xl font-semibold mb-4">Travel Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">{formatDate(travel.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-medium">{formatDate(travel.endDate)}</p>
                </div>
                {travel.tourist && (
                  <div>
                    <p className="text-sm text-gray-500">Tourist</p>
                    <p className="font-medium">{travel.tourist.name}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Destination Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{travel.destination.city || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium">{travel.destination.country}</p>
                </div>
                {travel.destination.city && (
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium">{travel.destination.city}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {travel.destination.description && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2 text-black">Description</h2>
              <p className="text-gray-700">{travel.destination.description}</p>
            </div>
          )}
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleting}
        onClose={handleCancelDelete}
        title="Confirm Delete"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Travel'}
            </Button>
          </>
        }
      >
        <div className="p-4 text-gray-600">
          <p>Are you sure you want to delete this travel to {travel.destination.city}?</p>
          <p className="text-red-600 mt-2">This action cannot be undone.</p>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default TravelDetailPage;