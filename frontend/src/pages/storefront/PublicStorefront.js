import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useProducts } from '../../context/ProductsContext';
import { useOrders } from '../../context/OrdersContext';
import { Button, Badge, Spinner } from '../../components/ui';
import { companyBranding } from '../../data/mockData';
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  HeartIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { ShoppingCartIcon as ShoppingCartSolidIcon } from '@heroicons/react/24/solid';

/**
 * Public Storefront - Customer-facing view accessible via /store/:storeSlug
 * Each client has their own unique store URL
 */
export default function PublicStorefront() {
  const { storeSlug } = useParams();
  const { getStoreBySlug, getActiveStores } = useStore();
  const { getProductsByStore } = useProducts();
  const { addOrder } = useOrders();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load store data based on slug
  useEffect(() => {
    const loadStore = () => {
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        const foundStore = getStoreBySlug(storeSlug);
        
        if (foundStore) {
          setStore(foundStore);
          const storeProducts = getProductsByStore(foundStore.id);
          setProducts(storeProducts);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
        
        setIsLoading(false);
      }, 300);
    };

    loadStore();
  }, [storeSlug, getStoreBySlug, getProductsByStore]);

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

  // Cart functions
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

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, change) => {
    setCart(
      cart.map((item) => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  // Calculate cart totals
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-secondary-600">Loading store...</p>
        </div>
      </div>
    );
  }

  // Store not found
  if (notFound) {
    const activeStores = getActiveStores();
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <ShoppingBagIcon className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-secondary-800 mb-2">
            Store Not Found
          </h1>
          <p className="text-secondary-600 mb-6">
            The store "{storeSlug}" doesn't exist or is no longer available.
          </p>
          
          {activeStores.length > 0 && (
            <div className="mt-8">
              <p className="text-sm text-secondary-500 mb-4">
                Browse other stores on {companyBranding.name}:
              </p>
              <div className="space-y-2">
                {activeStores.map((s) => (
                  <Link
                    key={s.id}
                    to={`/store/${s.slug}`}
                    className="block p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: s.themeColor }}
                      >
                        <ShoppingBagIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-secondary-800">{s.storeName}</p>
                        <p className="text-xs text-secondary-500">{s.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          <Link
            to="/"
            className="inline-block mt-6 text-primary-600 hover:text-primary-700 text-sm"
          >
            ← Back to {companyBranding.name}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="sticky top-0 z-50 bg-white shadow-sm"
        style={{ borderBottom: `3px solid ${store.themeColor}` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg"
                style={{ backgroundColor: store.themeColor }}
              >
                <ShoppingBagIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-800">
                {store.storeName}
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
                  style={{ '--tw-ring-color': store.themeColor }}
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
                    style={{ backgroundColor: store.themeColor }}
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
        style={{ backgroundColor: store.themeColor }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Welcome to {store.storeName}
          </h1>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            {store.description || 'Discover amazing products at great prices!'}
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="bg-white hover:bg-gray-100"
            style={{ color: store.themeColor }}
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
                    ? { backgroundColor: store.themeColor }
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
                  : 'Check back later for new products!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
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
                          style={{ color: store.themeColor }}
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
                      style={{ backgroundColor: store.themeColor }}
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
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: store.themeColor }}
                >
                  <ShoppingBagIcon className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-secondary-800">{store.storeName}</span>
              </div>
              <p className="text-sm text-secondary-600">{store.description}</p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-secondary-800 mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-secondary-600">
                <p>{store.storeEmail}</p>
                <p>{store.storePhone}</p>
                <p>{store.storeAddress}</p>
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
                        key={item.id}
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
                            style={{ color: store.themeColor }}
                          >
                            {item.price.toFixed(2)} TND
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 rounded-md bg-white border border-gray-200 hover:bg-gray-100"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 rounded-md bg-white border border-gray-200 hover:bg-gray-100"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
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
                      style={{ color: store.themeColor }}
                    >
                      {cartTotal.toFixed(2)} TND
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    style={{ backgroundColor: store.themeColor }}
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
