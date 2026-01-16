import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { getStoreUrl, validateSubdomain } from '../../utils/subdomain';
import {
  Card,
  CardTitle,
  CardDescription,
  Input,
  Textarea,
  Button,
  Select,
} from '../../components/ui';
import {
  BuildingStorefrontIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  LinkIcon,
  ExclamationCircleIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';

/**
 * Settings page for store configuration
 */
export default function Settings() {
  const { user } = useAuth();
  const { settings, updateSettings, updateSubdomain, isSubdomainAvailable, currentStoreId } = useStore();
  
  const [formData, setFormData] = useState({
    storeName: settings.storeName || '',
    storeEmail: settings.storeEmail || '',
    storePhone: settings.storePhone || '',
    storeAddress: settings.storeAddress || '',
    themeColor: settings.themeColor || '#2563eb',
    currency: settings.currency || 'TND',
    timezone: settings.timezone || 'Africa/Tunis',
    description: settings.description || '',
  });
  
  // Subdomain state
  const [subdomain, setSubdomain] = useState(settings.subdomain || '');
  const [subdomainError, setSubdomainError] = useState('');
  const [subdomainSuccess, setSubdomainSuccess] = useState(false);
  const [isSubdomainLoading, setIsSubdomainLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update form when settings change
  useEffect(() => {
    setFormData({
      storeName: settings.storeName || '',
      storeEmail: settings.storeEmail || '',
      storePhone: settings.storePhone || '',
      storeAddress: settings.storeAddress || '',
      themeColor: settings.themeColor || '#2563eb',
      currency: settings.currency || 'TND',
      timezone: settings.timezone || 'Africa/Tunis',
      description: settings.description || '',
    });
    setSubdomain(settings.subdomain || '');
  }, [settings]);

  // Currency options
  const currencyOptions = [
    { value: 'TND', label: 'TND - Tunisian Dinar' },
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'MAD', label: 'MAD - Moroccan Dirham' },
    { value: 'DZD', label: 'DZD - Algerian Dinar' },
  ];

  // Timezone options
  const timezoneOptions = [
    { value: 'Africa/Tunis', label: 'Tunisia (CET)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  ];

  // Theme color presets
  const colorPresets = [
    { name: 'Blue', value: '#2563eb' },
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Purple', value: '#7c3aed' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Green', value: '#10b981' },
    { name: 'Teal', value: '#0d9488' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Red', value: '#ef4444' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleColorChange = (color) => {
    setFormData((prev) => ({ ...prev, themeColor: color }));
    setIsSaved(false);
  };

  // Handle subdomain change
  const handleSubdomainChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(value);
    setSubdomainError('');
    setSubdomainSuccess(false);
  };

  // Validate and update subdomain
  const handleSubdomainUpdate = async () => {
    setIsSubdomainLoading(true);
    setSubdomainError('');
    setSubdomainSuccess(false);

    // Validate format
    const validation = validateSubdomain(subdomain);
    if (!validation.isValid) {
      setSubdomainError(validation.error);
      setIsSubdomainLoading(false);
      return;
    }

    // Check availability
    if (!isSubdomainAvailable(subdomain, currentStoreId)) {
      setSubdomainError('This subdomain is already taken');
      setIsSubdomainLoading(false);
      return;
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = updateSubdomain(subdomain);
    
    if (result.success) {
      setSubdomainSuccess(true);
      setTimeout(() => setSubdomainSuccess(false), 3000);
    } else {
      setSubdomainError(result.error);
    }
    
    setIsSubdomainLoading(false);
  };

  // Copy store URL to clipboard
  const copyStoreUrl = () => {
    const url = getStoreUrl(settings.subdomain);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    updateSettings(formData);
    setIsLoading(false);
    setIsSaved(true);

    // Hide saved message after 3 seconds
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-800">Settings</h1>
        <p className="text-secondary-500 mt-1">
          Manage your store settings and preferences
        </p>
      </div>

      {/* Success Message */}
      {isSaved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircleIcon className="h-5 w-5 text-green-600" />
          <p className="text-sm text-green-700">Settings saved successfully!</p>
        </div>
      )}

      {/* Store URL / Subdomain Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg">
            <LinkIcon className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <CardTitle>Store URL</CardTitle>
            <CardDescription>Customize your store's web address</CardDescription>
          </div>
        </div>

        {/* Current Store URL */}
        {settings.subdomain && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Your Store URL
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-secondary-700 font-mono">
                {getStoreUrl(settings.subdomain)}
              </code>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={copyStoreUrl}
                className="flex items-center gap-1"
              >
                <ClipboardDocumentIcon className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <a
                href={getStoreUrl(settings.subdomain)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button type="button" variant="secondary" size="sm">
                  Visit Store
                </Button>
              </a>
            </div>
          </div>
        )}

        {/* Subdomain Input */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Subdomain
          </label>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex">
                <input
                  type="text"
                  value={subdomain}
                  onChange={handleSubdomainChange}
                  placeholder="your-store-name"
                  className={`
                    flex-1 px-3 py-2 border rounded-l-lg text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                    ${subdomainError ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  `}
                />
                <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-r-lg">
                  .hydrolify.vercel.app
                </span>
              </div>
              {subdomainError && (
                <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  {subdomainError}
                </div>
              )}
              {subdomainSuccess && (
                <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                  <CheckCircleIcon className="h-4 w-4" />
                  Subdomain updated successfully!
                </div>
              )}
              <p className="mt-2 text-xs text-secondary-500">
                Only lowercase letters, numbers, and hyphens allowed. Must be 3-30 characters.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleSubdomainUpdate}
              isLoading={isSubdomainLoading}
              disabled={subdomain === settings.subdomain || !subdomain}
            >
              Update URL
            </Button>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Information */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
              <BuildingStorefrontIcon className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Basic information about your store</CardDescription>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              id="storeName"
              name="storeName"
              label="Store Name"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="My Awesome Store"
            />
            <Input
              id="storeEmail"
              name="storeEmail"
              type="email"
              label="Contact Email"
              value={formData.storeEmail}
              onChange={handleChange}
              placeholder="contact@store.com"
            />
            <Input
              id="storePhone"
              name="storePhone"
              label="Phone Number"
              value={formData.storePhone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
            <div className="md:col-span-2">
              <Textarea
                id="storeAddress"
                name="storeAddress"
                label="Store Address"
                value={formData.storeAddress}
                onChange={handleChange}
                placeholder="123 Commerce Street, City, State, ZIP"
                rows={2}
              />
            </div>
          </div>
        </Card>

        {/* Store Logo */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
              <PaintBrushIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Customize your store's appearance</CardDescription>
            </div>
          </div>

          {/* Logo Upload Placeholder */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Store Logo
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-20 h-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl">
                <span className="text-3xl font-bold text-gray-400">
                  {formData.storeName?.charAt(0)?.toUpperCase() || 'S'}
                </span>
              </div>
              <div>
                <Button type="button" variant="secondary" size="sm">
                  Upload Logo
                </Button>
                <p className="text-xs text-secondary-500 mt-1">
                  PNG, JPG up to 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Theme Color */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-3">
              Theme Color
            </label>
            <div className="flex flex-wrap gap-3">
              {colorPresets.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleColorChange(color.value)}
                  className={`
                    w-10 h-10 rounded-lg transition-all
                    ${formData.themeColor === color.value
                      ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                      : 'hover:scale-105'
                    }
                  `}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
              {/* Custom color input */}
              <div className="relative">
                <input
                  type="color"
                  value={formData.themeColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-10 h-10"
                />
                <div
                  className="w-10 h-10 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-white"
                  title="Custom color"
                >
                  <span className="text-xs text-gray-400">+</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-secondary-500 mt-2">
              Current: {formData.themeColor}
            </p>
          </div>
        </Card>

        {/* Regional Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
              <GlobeAltIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Currency and timezone preferences</CardDescription>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              id="currency"
              name="currency"
              label="Currency"
              value={formData.currency}
              onChange={handleChange}
              options={currencyOptions}
            />
            <Select
              id="timezone"
              name="timezone"
              label="Timezone"
              value={formData.timezone}
              onChange={handleChange}
              options={timezoneOptions}
            />
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" isLoading={isLoading}>
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
