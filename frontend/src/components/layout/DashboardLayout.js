import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../ui';
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  EyeIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

/**
 * Main dashboard layout with sidebar navigation
 */
export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { settings } = useStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Public store URL
  const publicStoreUrl = user?.storeSlug ? `/store/${user.storeSlug}` : (settings?.slug ? `/store/${settings.slug}` : null);

  // Navigation items
  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
    { name: 'Products', to: '/dashboard/products', icon: CubeIcon },
    { name: 'Orders', to: '/dashboard/orders', icon: ShoppingCartIcon },
    { name: 'Storefront', to: '/storefront', icon: EyeIcon },
    { name: 'Settings', to: '/dashboard/settings', icon: Cog6ToothIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <Logo size="sm" showTagline={false} />
          <button
            className="lg:hidden p-1 rounded-lg text-secondary-400 hover:text-secondary-600"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-1 p-4">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
                  ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-secondary-600 hover:bg-gray-50 hover:text-secondary-800'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* User section */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            {/* Public Store Link */}
            {publicStoreUrl && (
              <Link
                to={publicStoreUrl}
                target="_blank"
                className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-lg text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors duration-200"
              >
                <GlobeAltIcon className="h-5 w-5" />
                View Public Store
              </Link>
            )}
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="flex items-center justify-center w-9 h-9 bg-primary-100 rounded-full">
                <span className="text-sm font-medium text-primary-700">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary-800 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-secondary-500 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 mt-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Sign out
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-gray-200 lg:px-8">
          <button
            className="lg:hidden p-2 -ml-2 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex-1" />
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
