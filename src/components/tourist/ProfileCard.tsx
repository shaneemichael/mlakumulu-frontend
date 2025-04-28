import React from 'react';
import { useRouter } from 'next/router';
import Button from '../common/Button';
import Card from '../common/Card';

interface Tourist {
  id: string;
  name: string;
  nationality: string;
  passportNumber?: string;
  phoneNumber?: string;
  email?: string;
  userId: string;
}

interface ProfileCardProps {
  tourist: Tourist;
  isEditable?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ tourist, isEditable = false }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/tourist/edit/${tourist.id}`);
  };

  // Info item component for consistent styling
  const InfoItem = ({ label, value }: { label: string; value?: string }) => {
    if (!value) return null;
    
    return (
      <div className="mb-4 bg-indigo-50 p-3 rounded-md">
        <p className="text-sm font-medium text-indigo-700 mb-1">{label}</p>
        <p className="text-base font-medium text-gray-800">{value}</p>
      </div>
    );
  };

  return (
    <Card className="overflow-visible shadow-md">
      <div className="relative">
        {/* Header with avatar */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 pb-6 border-b border-indigo-100">
          <div className="flex-shrink-0 w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4 sm:mb-0 sm:mr-6 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-bold text-indigo-800 mb-1">{tourist.name}</h3>
            <div className="inline-flex items-center bg-indigo-100 px-3 py-1 rounded-full text-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              {tourist.nationality}
            </div>
          </div>
        </div>
        
        {/* Main content with grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <InfoItem label="Passport Number" value={tourist.passportNumber} />
          <InfoItem label="Phone Number" value={tourist.phoneNumber} />
          <InfoItem label="Email" value={tourist.email} />
        </div>
        
        {/* Actions */}
        {isEditable && (
          <div className="mt-6 pt-6 border-t border-indigo-100 bg-gray-50 p-4 rounded-b-lg">
            <Button onClick={handleEdit} variant="primary" size="md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileCard;