import React from 'react';
import Link from 'next/link';
import TravelCard from '../tourist/TravelCard';
import Button from '../common/Button';
import { Travel } from '../../types/travel';

interface TravelListProps {
  travels: Travel[];
  isEmployee: boolean;
  hideHeader?: boolean;
  hideControls?: boolean;
}

const TravelList: React.FC<TravelListProps> = ({ 
  travels, 
  isEmployee,
  hideHeader = false,
  hideControls = false, 
}) => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        {!hideHeader && (
        <div className="flex justify-between items-center mb-6 border-b border-indigo-100 pb-4">
          <h2 className="text-2xl font-bold text-indigo-800">
            {isEmployee ? 'All Travels' : 'My Travels'}
          </h2>
          
          {!hideControls && isEmployee && (
            <Link href="/travel/new">
              <Button variant="primary">
                Create New Travel
              </Button>
            </Link>
          )}
        </div>
        )}
        
        {travels.length === 0 ? (
          <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-600">No travels found</h3>
            <p className="mt-2 text-gray-500">
              {isEmployee 
                ? 'Create a new travel by clicking the button above.'
                : 'You have no travel records yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {travels.map((travel) => (
              <TravelCard 
                key={travel.id} 
                travel={travel} 
                isEmployee={isEmployee}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default TravelList;