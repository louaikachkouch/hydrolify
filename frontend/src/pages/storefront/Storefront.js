import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Button, Badge, Spinner } from '../../components/ui';
import { companyBranding } from '../../data/mockData';
import { getStoreUrl } from '../../utils/subdomain';
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  HeartIcon,
  StarIcon,
  LinkIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

/**
 * Storefront preview page - store owner's preview of their store
 * Matches the public storefront design for accurate preview
 */
export default function Storefront() {
  useAuth(); // Auth context for protected route
  const { settings, refreshSettings } = useStore();
  const { products, loadMyProducts, isLoading } = useProducts();
  
  // Load products and settings on mount
  useEffect(() => {
    loadMyProducts();
    refreshSettings();
  }, [loadMyProducts, refreshSettings]);

  // Ensure products is an array
  const productList = Array.isArray(products) ? products : [];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Get active products only
  const activeProducts = productList.filter((p) => p.status === 'active');

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

  // Cart functions
  const addToCart = (product) => {
    const productId = product._id || product.id;
    const existingItem = cart.find((item) => (item._id || item.id) === productId);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          (item._id || item.id) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => (item._id || item.id) !== productId));
  };

  const updateQuantity = (productId, change) => {
    setCart(
      cart.map((item) => {
        if ((item._id || item.id) === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  // Calculate cart total
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Get public store URL with subdomain
  const publicStoreUrl = settings.subdomain ? getStoreUrl(settings.subdomain) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-secondary-600">Loading store preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-sm text-yellow-700 hover:text-yellow-900"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Dashboard
            </Link>
            <div className="h-4 w-px bg-yellow-300" />
            <div>
              <p className="text-sm text-yellow-800">
                <span className="font-medium">Preview Mode</span> - This is how your store looks to customers
              </p>
              {settings.subdomain && (
                <p className="text-xs text-yellow-600 font-mono mt-0.5">
                  hydrolify.vercel.app/store/{settings.subdomain}
                </p>
              )}
            </div>
          </div>
          {publicStoreUrl && (
            <a
              href={publicStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-yellow-700 hover:text-yellow-900 bg-yellow-100 px-3 py-1 rounded-lg"
            >
              <LinkIcon className="h-4 w-4" />
              Visit Live Store
            </a>
          )}
        </div>
      </div>

      {/* Header */}
      <header
        className="sticky top-0 z-40 bg-white shadow-sm"
        style={{ borderBottom: `3px solid ${settings.themeColor}` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              {settings.storeLogo ? (
                <img
                  src={settings.storeLogo}
                  alt={settings.storeName}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-lg"
                  style={{ backgroundColor: settings.themeColor }}
                >
                  <ShoppingBagIcon className="h-6 w-6 text-white" />
                </div>
              )}
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': settings.themeColor }}
                />
              </div>
            </div>

            {/* Cart */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-secondary-600 hover:text-secondary-800"
              >
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
            {settings.description || 'Discover amazing products at great prices!'}
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

      {/* Mobile Search */}
      <div className="sm:hidden px-4 py-3 bg-white border-b border-gray-100">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:border-transparent"
          />
        </div>
      </div>

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
              <ShoppingBagIcon className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-800 mb-2">
                No products found
              </h3>
              <p className="text-secondary-500">
                {searchQuery
                  ? `No products match "${searchQuery}"`
                  : 'Add some products from your dashboard!'}
              </p>
              <Link to="/dashboard/products">
                <Button className="mt-4" style={{ backgroundColor: settings.themeColor }}>
                  Add Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id || product.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.compareAtPrice && (
                      <Badge
                        variant="error"
                        className="absolute top-3 left-3"
                      >
                        Sale
                      </Badge>
                    )}
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <HeartIcon className="h-5 w-5 text-secondary-400 hover:text-red-500" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <p className="text-xs text-secondary-400 mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-semibold text-secondary-800 mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Rating (placeholder) */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-secondary-400 ml-1">
                        (4.0)
                      </span>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="flex items-center justify-between">
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

                    <Button
                      onClick={() => addToCart(product)}
                      className="w-full mt-3"
                      size="sm"
                      style={{ backgroundColor: settings.themeColor }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Store Info Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Store Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                {settings.storeLogo ? (
                  <img
                    src={settings.storeLogo}
                    alt={settings.storeName}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: settings.themeColor }}
                  >
                    <ShoppingBagIcon className="h-5 w-5 text-white" />
                  </div>
                )}
                <span className="font-bold text-secondary-800">{settings.storeName}</span>
              </div>
              <p className="text-sm text-secondary-600">{settings.description}</p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-secondary-800 mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-secondary-600">
                <p>{settings.storeEmail}</p>
                <p>{settings.storePhone}</p>
                <p>{settings.storeAddress}</p>
              </div>
            </div>

            {/* Powered By */}
            <div>
              <h4 className="font-semibold text-secondary-800 mb-4">Powered by</h4>
              <p className="text-sm text-secondary-600">
                {companyBranding.name} - {companyBranding.tagline}
              </p>
              <Link
                to="/"
                className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block"
              >
                Create your own store →
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Cart Panel */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-secondary-800">
                  Shopping Cart ({cartCount})
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-secondary-400 hover:text-secondary-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCartIcon className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
                    <p className="text-secondary-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item._id || item.id}
                        className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-secondary-800 text-sm">
                            {item.name}
                          </h4>
                          <p
                            className="font-semibold mt-1"
                            style={{ color: settings.themeColor }}
                          >
                            {item.price.toFixed(2)} TND
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item._id || item.id, -1)}
                              className="p-1 rounded-md bg-white border border-gray-200 hover:bg-gray-100"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id || item.id, 1)}
                              className="p-1 rounded-md bg-white border border-gray-200 hover:bg-gray-100"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item._id || item.id)}
                              className="ml-auto text-xs text-red-500 hover:text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="border-t border-gray-200 p-4 space-y-4">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-medium text-secondary-600">Total</span>
                    <span
                      className="font-bold"
                      style={{ color: settings.themeColor }}
                    >
                      {cartTotal.toFixed(2)} TND
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    style={{ backgroundColor: settings.themeColor }}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
