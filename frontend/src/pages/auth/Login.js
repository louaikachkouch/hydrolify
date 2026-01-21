import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { Button, Input, Card, AuthHeader, PoweredBy } from '../../components/ui';

/**
 * Login page component
 */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setCurrentStore } = useStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Set the user's store as current store
      if (result.user?.storeId) {
        setCurrentStore(result.user.storeId);
      }
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Company Branding Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <AuthHeader
          title="Welcome back"
          subtitle="Sign in to manage your store"
        />
      </div>

      {/* Login Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-8 py-10">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <Input
              id="email"
              name="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            {/* Password Field */}
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Sign in
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Create one now
              </Link>
            </p>
          </div>
        </Card>

        {/* Powered By Footer */}
        <PoweredBy className="mt-8" />
      </div>
    </div>
  );
}
