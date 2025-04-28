import React from 'react';
import { useRouter } from 'next/router';
import Button from '../common/Button';
import Card from '../common/Card';
import { Travel } from '../../types/travel';

interface TravelCardProps {
  travel: Travel;
  isEmployee?: boolean;
}

const TravelCard: React.FC<TravelCardProps> = ({ travel, isEmployee = false }) => {
  const router = useRouter();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    }).format(date);
  };
  
  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleViewDetails = () => {
    router.push(`/dashboard/travels/${travel.id}`);
  };

  const handleEdit = () => {
    router.push(`/dashboard/travels/edit/${travel.id}`);
  };

  return (
    <Card className="border-t-4 border-indigo-500 shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col">
        <div className="bg-gray-50 p-4 rounded-t-lg">
          <h3 className="text-xl font-bold text-indigo-800 mb-2">
            {travel.destination.name}
          </h3>
          
          <p className="text-gray-700 mb-4">
            {travel.destination.city && `${travel.destination.city}, `}
            {travel.destination.country}
          </p>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-indigo-600 font-medium">Start Date (UTC)</p>
              <p className="font-medium text-gray-800">{formatDate(travel.startDate)}</p>
            </div>
            
            <div>
              <p className="text-sm text-indigo-600 font-medium">End Date (UTC)</p>
              <p className="font-medium text-gray-800">{formatDate(travel.endDate)}</p>
            </div>
          </div>
          
          <div className="bg-indigo-50 p-3 rounded-md text-center mb-4">
            <p className="text-indigo-700 font-semibold">
              Duration: {calculateDuration(travel.startDate, travel.endDate)} days
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4 pt-4 border-t border-gray-200">
            <Button onClick={handleViewDetails} variant="secondary">
              View Details
            </Button>
            
            {isEmployee && (
              <Button onClick={handleEdit} variant="primary">
                Edit Travel
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TravelCard;