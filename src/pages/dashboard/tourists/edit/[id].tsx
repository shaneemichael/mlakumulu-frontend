import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import Card from '../../../../components/common/Card';
import Input from '../../../../components/common/Input';
import Button from '../../../../components/common/Button';
import Loading from '../../../../components/common/Loading';
import { touristService } from '../../../../services/touristService';
import { Tourist, UpdateTouristDto } from '../../../../types/tourist';
import { useAuth } from '../../../../hooks/useAuth';
import { UserRole } from '../../../../types/auth';
import { isValidEmail, isValidPhone, isValidPassport } from '../../../../utils/validationUtils';
import { getErrorMessage } from '../../../../utils/errorUtils';

const EditTouristPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { user } = useAuth();
  
  const [tourist, setTourist] = useState<Tourist | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
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
    // Redirect if not employee
    if (user && user.role !== UserRole.EMPLOYEE) {
      router.push('/dashboard');
      return;
    }

    // Wait for router to be ready and have the ID
    if (!router.isReady || !id) return;

    const fetchTourist = async () => {
      try {
        const touristData = await touristService.getTourist(id);
        setTourist(touristData);
        setFormData({
          name: touristData.name || '',
          nationality: touristData.nationality || '',
          passportNumber: touristData.passportNumber || '',
          phoneNumber: touristData.phoneNumber || '',
          email: touristData.email || '',
        });
      } catch (err) {
        setError('Failed to load tourist data. Please try again later.');
        console.error('Error fetching tourist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTourist();
  }, [id, user, router.isReady, router]);

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

  const handleUpdateTourist = async (e: React.FormEvent) => {
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
        setMessage('Tourist profile updated successfully!');
        
        // Redirect after successful update
        setTimeout(() => {
          router.push(`/dashboard/tourists/${tourist.id}`);
        }, 1500);
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

  if (!tourist) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          Tourist not found or you dont have permission to edit this profile.
        </div>
        <Button onClick={() => router.push('/dashboard/tourists')} className="mt-4">
          Back to Tourists
        </Button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Tourist Profile</h1>
        <Button
          onClick={() => router.push(`/dashboard/tourists/${tourist.id}`)}
          variant="outline"
        >
          Back to Tourist Details
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
          {message}
        </div>
      )}

      <Card title="Edit Tourist Information">
        <form onSubmit={handleUpdateTourist}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              required
            />
            
            <Input
              label="Nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              error={errors.nationality}
              required
            />
            
            <Input
              label="Passport Number (Optional)"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={handleInputChange}
              error={errors.passportNumber}
            />
            
            <Input
              label="Phone Number (Optional)"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={errors.phoneNumber}
            />
            
            <Input
              label="Email (Optional)"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(`/dashboard/tourists/${tourist.id}`)}
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
      </Card>
    </DashboardLayout>
  );
};

export default EditTouristPage;