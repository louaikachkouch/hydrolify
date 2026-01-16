/**
 * API Service for Hydrolify Backend
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getToken = () => localStorage.getItem('hydrolify_token');

// Helper for making authenticated requests
const authFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  
  return data;
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const data = await authFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem('hydrolify_token', data.token);
    }
    return data;
  },

  register: async (name, email, password, storeName) => {
    const data = await authFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, storeName }),
    });
    if (data.token) {
      localStorage.setItem('hydrolify_token', data.token);
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('hydrolify_token');
    localStorage.removeItem('hydrolify_user');
  },

  getMe: async () => {
    return authFetch('/auth/me');
  },
};

// Stores API
export const storesAPI = {
  getAll: async () => {
    return authFetch('/stores');
  },

  getBySlug: async (slug) => {
    return authFetch(`/stores/slug/${slug}`);
  },

  getBySubdomain: async (subdomain) => {
    return authFetch(`/stores/subdomain/${subdomain}`);
  },

  getMyStore: async () => {
    return authFetch('/stores/my-store');
  },

  updateMyStore: async (settings) => {
    return authFetch('/stores/my-store', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  updateSubdomain: async (subdomain) => {
    return authFetch('/stores/my-store/subdomain', {
      method: 'PUT',
      body: JSON.stringify({ subdomain }),
    });
  },

  checkSubdomain: async (subdomain, excludeStoreId = null) => {
    const params = excludeStoreId ? `?excludeStoreId=${excludeStoreId}` : '';
    return authFetch(`/stores/check-subdomain/${subdomain}${params}`);
  },
};

// Products API
export const productsAPI = {
  getByStore: async (storeId) => {
    return authFetch(`/products/store/${storeId}`);
  },

  getActiveByStore: async (storeId) => {
    return authFetch(`/products/store/${storeId}/active`);
  },

  getMyProducts: async () => {
    return authFetch('/products/my-products');
  },

  getById: async (id) => {
    return authFetch(`/products/${id}`);
  },

  create: async (product) => {
    return authFetch('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  update: async (id, product) => {
    return authFetch(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  delete: async (id) => {
    return authFetch(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersAPI = {
  getMyOrders: async () => {
    return authFetch('/orders/my-orders');
  },

  getById: async (id) => {
    return authFetch(`/orders/${id}`);
  },

  create: async (order) => {
    return authFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  },

  updateStatus: async (id, status) => {
    return authFetch(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  updatePaymentStatus: async (id, paymentStatus) => {
    return authFetch(`/orders/${id}/payment`, {
      method: 'PUT',
      body: JSON.stringify({ paymentStatus }),
    });
  },

  getDashboardStats: async () => {
    return authFetch('/orders/stats/dashboard');
  },
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  auth: authAPI,
  stores: storesAPI,
  products: productsAPI,
  orders: ordersAPI,
};
