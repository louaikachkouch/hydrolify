import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { Button, Input, Card, AuthHeader, PoweredBy } from '../../components/ui';

/**
 * Register page component
 */
export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { setCurrentStore } = useStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    storeName: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Store name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      storeName: formData.storeName,
    });

    if (result.success) {
      // Backend creates the store during registration - just set the current store
      if (result.user?.storeId) {
        setCurrentStore(result.user.storeId);
      }
      navigate('/dashboard');
    } else {
      setErrors({ submit: result.error });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Company Branding Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <AuthHeader
          title="Create your store"
          subtitle="Start selling online in minutes"
        />
      </div>

      {/* Register Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-8 py-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            {/* Name Field */}
            <Input
              id="name"
              name="name"
              type="text"
              label="Your name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              autoComplete="name"
            />

            {/* Email Field */}
            <Input
              id="email"
              name="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />

            {/* Store Name Field */}
            <Input
              id="storeName"
              name="storeName"
              type="text"
              label="Store name"
              placeholder="My Awesome Store"
              value={formData.storeName}
              onChange={handleChange}
              error={errors.storeName}
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
              error={errors.password}
              autoComplete="new-password"
            />

            {/* Confirm Password Field */}
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Create account
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in
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
