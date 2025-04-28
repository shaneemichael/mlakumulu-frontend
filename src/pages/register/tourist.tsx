// pages/register/tourist.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail, isValidPhone, isValidPassport } from '../../utils/validationUtils';
import { getErrorMessage } from '../../utils/errorUtils';
import { touristService } from '@/services/touristService';
import { UserRole } from '../../types/auth';

const RegisterTouristPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    nationality: '',
    passportNumber: '',
    phoneNumber: '',
    email: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { registerTourist, loading, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    // Validate password
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Validate nationality
    if (!formData.nationality.trim()) {
      newErrors.nationality = 'Nationality is required';
      isValid = false;
    }

    // Validate optional fields if provided
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) {
      return;
    }

    try {
      // Register user
      const registerData = {
        username: formData.username,
        password: formData.password,
        role: UserRole.TOURIST,
        nationality: formData.nationality,
      };
      
      const user = await registerTourist(registerData);
      
      // If implemented, you would create a tourist profile here
      // with the user ID returned from registration
      await touristService.createTourist({
        name: formData.name,
        nationality: formData.nationality,
        passportNumber: formData.passportNumber || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        email: formData.email || undefined,
        userId: user.id,
      });

    } catch (err) {
      console.error('Registration failed:', getErrorMessage(err));
    }
  };

  return (
    <MainLayout hideNavbar={true}>
      <div className="max-w-lg mx-auto">
        <Card title="Register as Tourist">
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Account Information</h3>
              <Input
                label="Username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                placeholder="Choose a username"
              />
              
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Choose a password"
              />
              
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="Confirm your password"
              />
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Personal Information</h3>
              <Input
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Enter your full name"
              />
              
              <Input
                label="Nationality"
                name="nationality"
                type="text"
                value={formData.nationality}
                onChange={handleChange}
                error={errors.nationality}
                placeholder="Enter your nationality"
              />
              
              <Input
                label="Passport Number (optional)"
                name="passportNumber"
                type="text"
                value={formData.passportNumber}
                onChange={handleChange}
                error={errors.passportNumber}
                placeholder="Enter your passport number"
              />
              
              <Input
                label="Phone Number (optional)"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={errors.phoneNumber}
                placeholder="Enter your phone number"
              />
              
              <Input
                label="Email (optional)"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Enter your email address"
              />
            </div>
            
            <Button
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p>Already have an account?</p>
            <Link href="/login">
              <span className="mt-2 inline-block">
                <Button variant="secondary">Login</Button>
              </span>
            </Link>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RegisterTouristPage;