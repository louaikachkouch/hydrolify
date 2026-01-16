import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Button, Badge, Logo } from '../../components/ui';
import { companyBranding } from '../../data/mockData';
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  ArrowLeftIcon,
  HeartIcon,
  StarIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import { ShoppingCartIcon as ShoppingCartSolidIcon } from '@heroicons/react/24/solid';

/**
 * Storefront preview page - store owner's preview of their store
 */
export default function Storefront() {
  const { user } = useAuth();
  const { settings, currentStoreId } = useStore();
  const { getProductsByStore } = useProducts();
  
  // Get current store's products
  const storeId = currentStoreId || user?.storeId || 1;
  const products = getProductsByStore(storeId);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);

  // Get active products only
  const activeProducts = products.filter((p) => p.status === 'active');

  // Get unique categories
  const categories = ['All', ...new Set(activeProducts.map((p) => p.category))];

  // Filter products
  const filteredProducts = activeProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add to cart
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Calculate cart total
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Get public store URL
  const publicStoreUrl = settings.slug ? `/store/${settings.slug}` : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Preview Mode</span> - This is how your store looks to customers
          </p>
          {publicStoreUrl && (
            <a
              href={publicStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-yellow-700 hover:text-yellow-900"
            >
              <LinkIcon className="h-4 w-4" />
              View Public Store
            </a>
          )}
        </div>
      </div>

      {/* Header */}
      <header
        className="sticky top-0 z-50 bg-white shadow-sm"
        style={{ borderBottom: `3px solid ${settings.themeColor}` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg"
                style={{ backgroundColor: settings.themeColor }}
              >
                <ShoppingBagIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-800">
                {settings.storeName}
              </span>
            </div>

            {/* Search */}
            <div className="hidden sm:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Cart */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <button className="p-2 text-secondary-600 hover:text-secondary-800">
                  <ShoppingCartIcon className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full"
                      style={{ backgroundColor: settings.themeColor }}
                    >
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm text-secondary-600 hover:text-secondary-800"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative py-20 text-white"
        style={{ backgroundColor: settings.themeColor }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Welcome to {settings.storeName}
          </h1>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. Shop now and enjoy
            free shipping on orders over $50!
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="bg-white hover:bg-gray-100"
            style={{ color: settings.themeColor }}
          >
            Shop Now
          </Button>
        </div>
        {/* Decorative waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.92,146.53,111.31,216.36,92.83,262.42,81,308.23,66.19,321.39,56.44Z"
              fill="#f9fafb"
            ></path>
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                  ${
                    selectedCategory === category
                      ? 'text-white'
                      : 'bg-gray-100 text-secondary-600 hover:bg-gray-200'
                  }
                `}
                style={
                  selectedCategory === category
                    ? { backgroundColor: settings.themeColor }
                    : {}
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-secondary-800">
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </h2>
            <p className="text-secondary-500">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCartSolidIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-800">
                No products found
              </h3>
              <p className="text-secondary-500 mt-2">
                Try adjusting your search or filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Sale Badge */}
                    {product.compareAtPrice && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="danger">Sale</Badge>
                      </div>
                    )}
                    {/* Wishlist Button */}
                    <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-secondary-400 hover:text-red-500 transition-colors">
                      <HeartIcon className="h-5 w-5" />
                    </button>
                    {/* Quick Add */}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full py-2 bg-white text-secondary-800 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <p className="text-xs text-secondary-500 mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-medium text-secondary-800 mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className="h-4 w-4"
                          style={{
                            fill: i < 4 ? settings.themeColor : 'none',
                            stroke: settings.themeColor,
                          }}
                        />
                      ))}
                      <span className="text-xs text-secondary-500 ml-1">
                        (24)
                      </span>
                    </div>
                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span
                        className="text-lg font-bold"
                        style={{ color: settings.themeColor }}
                      >
                        {product.price.toFixed(2)} TND
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-secondary-400 line-through">
                          {product.compareAtPrice.toFixed(2)} TND
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cart Summary (if items in cart) */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className="bg-white rounded-2xl shadow-xl p-4 border-2"
            style={{ borderColor: settings.themeColor }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl"
                style={{ backgroundColor: settings.themeColor }}
              >
                <ShoppingCartSolidIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-secondary-500">Cart Total</p>
                <p className="text-lg font-bold text-secondary-800">
                  {cartTotal.toFixed(2)} TND
                </p>
              </div>
              <Button
                size="sm"
                style={{ backgroundColor: settings.themeColor }}
              >
                Checkout ({cartCount})
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-secondary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              
              <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg"
                style={{ backgroundColor: settings.themeColor }}
              >
                <ShoppingBagIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-800">
                {settings.storeName}
              </span>
            </div>

              <p className="text-secondary-400 max-w-sm mt-4">
                Your one-stop shop for amazing products. Quality, affordability,
                and convenience all in one place.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-secondary-400">
                <li><button className="hover:text-white transition-colors">About Us</button></li>
                <li><button className="hover:text-white transition-colors">Contact</button></li>
                <li><button className="hover:text-white transition-colors">FAQs</button></li>
                <li><button className="hover:text-white transition-colors">Shipping</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-secondary-400">
                <li>{settings.storeEmail}</li>
                <li>{settings.storePhone}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary-700 mt-8 pt-8 text-center text-secondary-400">
            <p>&copy; 2026 {settings.storeName}. All rights reserved.</p>
            <p className="text-xs mt-2">Powered by {companyBranding.name} - {companyBranding.tagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
