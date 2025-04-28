// pages/profile.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../hooks/useAuth';
import { touristService } from '../../services/touristService';
import { Tourist, UpdateTouristDto } from '../../types/tourist';
import { UserRole } from '../../types/auth';
import { formatDate } from '../../utils/dateUtils';
import { isValidEmail, isValidPhone, isValidPassport } from '../../utils/validationUtils';
import { getErrorMessage } from '../../utils/errorUtils';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [tourist, setTourist] = useState<Tourist | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateTouristDto>({
    name: '',
    nationality: '',
    passportNumber: '',
    phoneNumber: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.role === UserRole.TOURIST) {
          const touristData = await touristService.getProfile();
          setTourist(touristData);
          setFormData({
            name: touristData.name || '',
            nationality: touristData.nationality || '',
            passportNumber: touristData.passportNumber || '',
            phoneNumber: touristData.phoneNumber || '',
            email: touristData.email || '',
          });
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile data. Please try again later.');
        console.error('Error fetching profile:', err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.nationality?.trim()) {
      newErrors.nationality = 'Nationality is required';
      isValid = false;
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (formData.phoneNumber && !isValidPhone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
      isValid = false;
    }

    if (formData.passportNumber && !isValidPassport(formData.passportNumber)) {
      newErrors.passportNumber = 'Passport number must be at least 5 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setUpdating(true);
    setError(null);
    setMessage(null);

    try {
      if (tourist) {
        const updatedTourist = await touristService.updateTourist(tourist.id, formData);
        setTourist(updatedTourist);
        setMessage('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loading />
      </DashboardLayout>
    );
  }

  // Return appropriate UI based on user role
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Your Profile</h1>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 text-green-800 p-4 rounded-md mb-6">
          {message}
        </div>
      )}

      {user?.role === UserRole.TOURIST && tourist ? (
        <div className="space-y-6">
          <Card title="Tourist Information">
            {isEditing ? (
              <form onSubmit={handleUpdateProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={errors.name}
                    className="text-gray-800"
                  />
                  
                  <Input
                    label="Nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    error={errors.nationality}
                    className="text-gray-800"
                  />
                  
                  <Input
                    label="Passport Number (Optional)"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleInputChange}
                    error={errors.passportNumber}
                    className="text-gray-800"
                  />
                  
                  <Input
                    label="Phone Number (Optional)"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    error={errors.phoneNumber}
                    className="text-gray-800"
                  />
                  
                  <Input
                    label="Email (Optional)"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    className="text-gray-800"
                  />
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                    disabled={updating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updating}
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Name</h3>
                    <p className="mt-1 text-gray-900">{tourist.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Nationality</h3>
                    <p className="mt-1 text-gray-900">{tourist.nationality}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Username</h3>
                    <p className="mt-1 text-gray-600">{user?.username}</p>
                  </div>

                  {tourist.passportNumber && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Passport Number</h3>
                      <p className="mt-1 text-gray-600">{tourist.passportNumber}</p>
                    </div>
                  )}
                  
                  {tourist.phoneNumber && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Phone Number</h3>
                      <p className="mt-1 text-gray-600">{tourist.phoneNumber}</p>
                    </div>
                  )}
                  
                  {tourist.email && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Email</h3>
                      <p className="mt-1 text-gray-600">{tourist.email}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <Card title="Account Information">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Account Created</h3>
                <p className="mt-1 text-gray-900">{formatDate(tourist.createdAt, true)} (UTC)</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600">Last Updated</h3>
                <p className="mt-1 text-gray-900">{formatDate(tourist.updatedAt, true)} (UTC)</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600">Role</h3>
                <p className="mt-1 capitalize text-gray-900">{user?.role}</p>
              </div>
            </div>
          </Card>

          {tourist.travels && tourist.travels.length > 0 && (
            <Card title="Recent Travels">
              <div className="space-y-4">
                {tourist.travels.slice(0, 3).map((travel) => (
                  <div 
                    key={travel.id} 
                    className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                  >
                    <h3 className="font-medium text-gray-900">{travel.destination.city}, {travel.destination.country}</h3>
                    <p className="text-sm text-gray-700">
                      {formatDate(travel.startDate)} - {formatDate(travel.endDate)}
                    </p>
                    <button 
                      onClick={() => router.push(`/travel/${travel.id}`)}
                      className="text-blue-700 text-sm mt-2 hover:underline"
                    >
                      View details
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Button 
                  variant="secondary"
                  onClick={() => router.push('/dashboard/travels')}
                >
                  View All Travels
                </Button>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card title="Employee Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Username</h3>
              <p className="mt-1 text-gray-900">{user?.username}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-600">Role</h3>
              <p className="mt-1 capitalize text-gray-900">{user?.role}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                variant="secondary"
                onClick={() => router.push('tourists')}
                fullWidth
              >
                Manage Tourists
              </Button>
              
              <Button 
                variant="secondary"
                onClick={() => router.push('travels')}
                fullWidth
              >
                Manage Travels
              </Button>
            </div>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default ProfilePage;