import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../../components/layout/MainLayout';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Loading from '../../../components/common/Loading';
import { touristService } from '../../../services/touristService';
import { authService } from '../../../services/authService';
import { useAuth } from '../../../hooks/useAuth';
import { CreateTouristDto } from '../../../types/tourist';
import { UserRole } from '../../../types/auth';
import { v4 as uuidv4 } from 'uuid';

const CreateTourist: React.FC = () => {
  const [formData, setFormData] = useState<CreateTouristDto>({
    name: '',
    nationality: '',
    passportNumber: '',
    phoneNumber: '',
    email: '',
    userId: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect if not employee
    if (user && user.role !== UserRole.EMPLOYEE) {
      router.push('/dashboard');
      return;
    }
    
    // If employee, they can proceed
    setInitialLoading(false);
  }, [user, router]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // First create a user account
      // … inside handleSubmit, replace your registerTourist call with:

      await authService.registerTourist({
        username: formData.name,
        password: 'tempPassword123', 
        role: UserRole.TOURIST,
        nationality: formData.nationality
      })
      
      const randomUserId = uuidv4();
      const touristData = {
        ...formData,
        userId: randomUserId,
      };
      
      const newTourist = await touristService.createTourist(touristData);
      setSuccess(true);
      
      // Redirect after short delay
      setTimeout(() => {
        router.push(`/tourists/${newTourist.id}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (initialLoading) {
    return (
      <MainLayout hideNavbar={false}>
        <Loading />
      </MainLayout>
    );
  }
  
  return (
    <MainLayout hideNavbar={false}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Tourist</h1>
      </div>
      
      <Card>
        {success ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-md">
            Tourist created successfully! Redirecting...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md">
                {error}
              </div>
            )}
            
            <Input
              label="Full Name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Nationality"
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Passport Number"
              id="passportNumber"
              name="passportNumber"
              value={formData.passportNumber || ''}
              onChange={handleInputChange}
            />
            
            <Input
              label="Phone Number"
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber || ''}
              onChange={handleInputChange}
            />
            
            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleInputChange}
            />
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/tourists')}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Tourist'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </MainLayout>
  );
};

export default CreateTourist;