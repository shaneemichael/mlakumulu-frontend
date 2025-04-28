import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { travelService } from '../../services/travelService';
import { CreateTravelDto, UpdateTravelDto } from '@/types/travel';

interface Tourist {
  id: string;
  name: string;
  nationality: string;
  passportNumber?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Destination {
  name: string;
  country: string;
  city?: string;
  description?: string;
}

interface Travel {
  id?: string;
  startDate: string;
  endDate: string;
  destination: Destination;
  touristId: string;
}

interface TravelFormProps {
  travel?: Travel;
  touristId?: string;
  availableTourists?: Tourist[];
  isEdit?: boolean;
  onSuccess?: () => void;
}

const TravelForm: React.FC<TravelFormProps> = ({ 
  travel, 
  touristId, 
  availableTourists = [],
  isEdit = false,
  onSuccess
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [formData, setFormData] = useState<Travel>({
    startDate: '',
    endDate: '',
    destination: {
      name: '',
      country: '',
      city: '',
      description: ''
    },
    touristId: touristId || ''
  });

  useEffect(() => {
    if (travel) {
      // Format dates for datetime-local input
      const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };
      
      setFormData({
        id: travel.id,
        startDate: formatDateForInput(travel.startDate),
        endDate: formatDateForInput(travel.endDate),
        destination: {
          name: travel.destination.name,
          country: travel.destination.country,
          city: travel.destination.city ?? '',
          description: travel.destination.description ?? '',
        },
        touristId: travel.touristId
      });
    }
  }, [travel]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('destination.')) {
      const destinationField = name.split('.')[1];
      setFormData({
        ...formData,
        destination: {
          ...formData.destination,
          [destinationField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isEdit && travel?.id) {
        await travelService.updateTravel(travel.id, formData as UpdateTravelDto);
      } else {
        await travelService.createTravel(formData as CreateTravelDto);
      }
      
      setShowSuccessModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    if (onSuccess) {
      onSuccess();
    } else {
      router.push('/dashboard/travels');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md shadow-sm border border-red-200">
            {error}
          </div>
        )}
        
        {!touristId && availableTourists.length > 0 && (
          <div className="p-4 bg-indigo-50 rounded-lg shadow-sm">
            <label htmlFor="touristId" className="block text-sm font-medium text-indigo-700 mb-2">
              Tourist
            </label>
            <select
                id="touristId"
                name="touristId"
                value={formData.touristId}
                onChange={handleInputChange}
                className="w-full p-2 border border-indigo-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                required
              >
                <option value="">Select a tourist</option>
                {availableTourists.map((tourist) => (
                  <option key={tourist.id} value={tourist.id}>
                    {tourist.name} - {tourist.nationality}
                  </option>
                ))}
            </select>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-lg shadow-sm">
          <Input
            id="startDate"
            name="startDate"
            label="Start Date (UTC)"
            type="datetime-local"
            value={formData.startDate}
            onChange={handleInputChange}
            required
          />
          
          <Input
            id="endDate"
            name="endDate"
            label="End Date (UTC)"
            type="datetime-local"
            value={formData.endDate}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="border-t border-gray-200 pt-6 bg-white p-5 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-indigo-800 mb-4">Destination Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              id="destination.name"
              name="destination.name"
              label="Destination Name"
              value={formData.destination.name}
              onChange={handleInputChange}
              required
            />
            
            <Input
              id="destination.country"
              name="destination.country"
              label="Country"
              value={formData.destination.country}
              onChange={handleInputChange}
              required
            />
            
            <Input
              id="destination.city"
              name="destination.city"
              label="City (Optional)"
              value={formData.destination.city || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="mt-6">
            <label htmlFor="destination.description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="destination.description"
              name="destination.description"
              rows={3}
              value={formData.destination.description || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEdit ? 'Update Travel' : 'Create Travel'}
          </Button>
        </div>
      </form>
      
      <Modal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        title={isEdit ? 'Travel Updated' : 'Travel Created'}
      >
        <div className="p-6 bg-indigo-50">
          <p className="mb-4 text-gray-800">
            Travel <span className="font-semibold text-indigo-700">{formData.destination.name}</span> has been successfully {isEdit ? 'updated' : 'created'}.
          </p>
          <div className="flex justify-end">
            <Button variant="primary" onClick={handleCloseModal}>
              Continue
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TravelForm;