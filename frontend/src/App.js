import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { ProductsProvider } from './context/ProductsContext';
import { OrdersProvider } from './context/OrdersContext';

// Layout Components
import DashboardLayout from './components/layout/DashboardLayout';
import { ProtectedRoute, PublicRoute } from './components/layout/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import Products from './pages/dashboard/Products';
import Orders from './pages/dashboard/Orders';
import Settings from './pages/dashboard/Settings';

// Storefront Pages
import Storefront from './pages/storefront/Storefront';
import PublicStorefront from './pages/storefront/PublicStorefront';

// Store Directory Component
import StoreDirectory from './pages/storefront/StoreDirectory';

function App() {
  return (
    <Router>
      <AuthProvider>
        <StoreProvider>
          <ProductsProvider>
            <OrdersProvider>
              <Routes>
                {/* Public Store Routes - Multi-tenant */}
                <Route path="/store/:storeSlug" element={<PublicStorefront />} />
                <Route path="/stores" element={<StoreDirectory />} />

                {/* Public Routes */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />

                {/* Protected Dashboard Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<Products />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Storefront Preview (Protected - for store owner) */}
                <Route
                  path="/storefront"
                  element={
                    <ProtectedRoute>
                      <Storefront />
                    </ProtectedRoute>
                  }
                />

                {/* Default Redirect */}
                <Route path="/" element={<Navigate to="/stores" replace />} />
                <Route path="*" element={<Navigate to="/stores" replace />} />
              </Routes>
            </OrdersProvider>
          </ProductsProvider>
        </StoreProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
