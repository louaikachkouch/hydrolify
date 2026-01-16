import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useProducts } from '../../context/ProductsContext';
import { companyBranding } from '../../data/mockData';
import { getStoreUrl } from '../../utils/subdomain';
import { Button, Spinner } from '../../components/ui';
import {
  ShoppingBagIcon,
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

/**
 * Individual Store Card component that loads its own products
 */
function StoreCard({ store }) {
  const { getProductsByStore } = useProducts();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const storeProducts = await getProductsByStore(store._id || store.id);
        const activeProducts = Array.isArray(storeProducts) 
          ? storeProducts.filter(p => p.status === 'active')
          : [];
        setProducts(activeProducts);
      } catch (error) {
        console.error('Failed to load products for store:', store._id, error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [store._id, store.id, getProductsByStore]);

  return (
    <a
      href={getStoreUrl(store.subdomain)}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Store Banner */}
      <div
        className="h-32 relative"
        style={{ backgroundColor: store.themeColor }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <ShoppingBagIcon
                className="h-7 w-7"
                style={{ color: store.themeColor }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-secondary-800 mb-1 group-hover:text-primary-600 transition-colors">
          {store.storeName}
        </h3>
        <p className="text-xs text-secondary-400 font-mono mb-2">
          hydrolify.vercel.app/store/{store.subdomain}
        </p>
        <p className="text-sm text-secondary-500 mb-4 line-clamp-2">
          {store.description || 'Discover amazing products at great prices'}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary-400">
            {loading ? '...' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
          </span>
          <span
            className="font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
            style={{ color: store.themeColor }}
          >
            Visit Store
            <ArrowRightIcon className="h-4 w-4" />
          </span>
        </div>

        {/* Product Preview */}
        {!loading && products.length > 0 && (
          <div className="mt-4 flex -space-x-2">
            {products.slice(0, 4).map((product) => (
              <img
                key={product._id || product.id}
                src={product.image}
                alt={product.name}
                className="w-10 h-10 rounded-lg border-2 border-white object-cover"
              />
            ))}
            {products.length > 4 && (
              <div className="w-10 h-10 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-secondary-500">
                +{products.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
    </a>
  );
}

/**
 * Store Directory - Landing page showing all available stores
 */
export default function StoreDirectory() {
  const { getActiveStores, isLoading } = useStore();
  
  const stores = getActiveStores();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-800">
                {companyBranding.name}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm text-secondary-600 hover:text-secondary-800"
              >
                Sign In
              </Link>
              <Link to="/register">
                <Button size="sm">Create Store</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-6">
            {companyBranding.tagline}
          </h1>
          <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
            {companyBranding.description}. Join thousands of entrepreneurs building their online stores with us.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="px-8">
                Start Your Free Store
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <a href="#stores" className="text-primary-600 hover:text-primary-700 font-medium">
              Browse Stores →
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyBranding.features.map((feature, index) => {
              const icons = [SparklesIcon, ShieldCheckIcon, ChartBarIcon, CreditCardIcon];
              const Icon = icons[index];
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-xl mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="font-medium text-secondary-800">{feature}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Store Directory */}
      <section id="stores" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Discover Amazing Stores
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Browse stores from entrepreneurs around Tunisia. Each store is uniquely crafted with care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : (
              stores.map((store) => (
                <StoreCard key={store._id || store.id} store={store} />
              ))
            )}
          </div>

          {!isLoading && stores.length === 0 && (
            <div className="text-center py-16">
              <ShoppingBagIcon className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-800 mb-2">
                No stores yet
              </h3>
              <p className="text-secondary-500 mb-6">
                Be the first to create a store on {companyBranding.name}!
              </p>
              <Link to="/register">
                <Button>Create Your Store</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Create your online store in minutes. No coding required.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-secondary-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white">{companyBranding.name}</span>
            </div>
            <p className="text-sm">
              © 2026 {companyBranding.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <button type="button" className="hover:text-white transition-colors">Privacy</button>
              <button type="button" className="hover:text-white transition-colors">Terms</button>
              <a href={`mailto:${companyBranding.supportEmail}`} className="hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
