import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth';

const RegisterEmployeePage: NextPage = () => {
  const router = useRouter();
  const { user, hasRole } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    employeeId: '',
    department: '',
    contactNumber: '',
    email: '',
    nationality: '' // Add nationality field
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [adminCode, setAdminCode] = useState('');
  const [adminCodeError, setAdminCodeError] = useState<string | null>(null);

  // Only admin can register employees, redirect others
  useEffect(() => {
    // If logged in but not admin, redirect to dashboard
    if (user && !hasRole(UserRole.EMPLOYEE)) {
      router.push('/dashboard');
    }
    // If not logged in at all, show admin code field
  }, [user, hasRole, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAdminCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminCode(e.target.value);
    setAdminCodeError(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // If not logged in, validate admin code
    if (!user && (!adminCode.trim() || adminCode !== 'ADMIN123')) { // Example admin code
      setAdminCodeError('Invalid admin code');
      return false;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setGeneralError(null);
    
    // Find this code around line 111
try {
  // Register employee account
  const userData = await authService.registerEmployee({
    username: formData.username,
    password: formData.password,
    role: UserRole.EMPLOYEE, // Specify role
    nationality: formData.nationality,
    // Employee-specific fields should be passed separately or in a proper format
    employeeDetails: {
      employeeId: formData.employeeId,
      department: formData.department,
      contactNumber: formData.contactNumber || '', // Provide empty string if undefined
    }
  });
      
      // If not already logged in as admin, login with the new account
      if (!user) {
        // Store token from registration response
        // Ensure userData is an object and access_token is a string
        if (typeof userData === 'object' && userData !== null && 'access_token' in userData && typeof userData.access_token === 'string') {
          localStorage.setItem('token', userData.access_token);
          // Ensure user property exists before stringifying
          if ('user' in userData) {
            localStorage.setItem('user', JSON.stringify(userData.user));
          }
        }
      }
      
      // Show success and redirect
      router.push(user ? '/dashboard/employees' : '/dashboard');
    } catch (err) {
      console.error(err);
      setGeneralError(
        err instanceof Error 
          ? err.message 
          : 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Employee Registration">
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {generalError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md">
            {generalError}
          </div>
        )}
        
        {!user && (
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Admin Authorization</h2>
            <div className="space-y-4">
              <Input
                id="adminCode"
                name="adminCode"
                type="password"
                label="Admin Code"
                value={adminCode}
                onChange={handleAdminCodeChange}
                error={adminCodeError || ''}
                required
              />
              <p className="text-sm text-gray-500">
                Employee registration requires admin authorization. Please enter the admin code.
              </p>
            </div>
          </div>
        )}
        
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Account Information</h2>
          <div className="space-y-4">
            <Input
              id="username"
              name="username"
              type="text"
              label="Username"
              value={formData.username}
              onChange={handleInputChange}
              error={errors.username}
              required
            />
            
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              required
            />
            
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              required
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Employee Information</h2>
          <div className="space-y-4">
            <Input
              id="employeeId"
              name="employeeId"
              type="text"
              label="Employee ID"
              value={formData.employeeId}
              onChange={handleInputChange}
              required
            />

            <Input
              id="nationality"
              name="nationality"
              type="text"
              label="Nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              error={errors.nationality}
              required // Assuming nationality is required
            />
            
            <Input
              id="department"
              name="department"
              type="text"
              label="Department"
              value={formData.department}
              onChange={handleInputChange}
              error={errors.department}
              required
            />
            
            <Input
              id="contactNumber"
              name="contactNumber"
              type="tel"
              label="Contact Number (Optional)"
              value={formData.contactNumber}
              onChange={handleInputChange}
              error={errors.contactNumber}
            />
            
            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address (Optional)"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
            />
          </div>
        </div>
        
        <div>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Employee'}
          </Button>
        </div>
        
        {!user && (
          <div className="text-center text-gray-600">
            Not an employee?{' '}
            <Link href="/register/tourist">
              <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                Register as Tourist
              </span>
            </Link>
          </div>
        )}
      </form>
    </AuthLayout>
  );
};

export default RegisterEmployeePage;