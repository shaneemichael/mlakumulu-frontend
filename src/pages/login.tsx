// pages/login.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const { login, loading, error } = useAuth();
  const router = useRouter();
  const { registered } = router.query;

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login({ username, password });
      // Redirect is handled in useAuth hook
    } catch (err) {
      // Error state is managed in useAuth hook
      console.error('Login failed:', err);
    }
  };

  return (
    <MainLayout hideNavbar={true}>
      <div className="max-w-md mx-auto">
        {registered && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
            Registration successful! Please login with your credentials.
          </div>
        )}
        
        <Card title="Login">
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
              placeholder="Enter your username"
              className="text-gray-800"
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="Enter your password"
              className="text-gray-800"
            />
            
            <Button
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-gray-800">Dont have an account?</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link href="/register/employee">
                <Button variant="secondary">Register as Employee</Button>
              </Link>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <Link href="/register/tourist">
                <Button variant="secondary">Register as Tourist</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default LoginPage;