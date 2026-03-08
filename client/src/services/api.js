import axios from "axios";

// Configure axios
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`📡 ${config.method.toUpperCase()} ${config.url}`, config.data || config.params);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// Product API
export const productAPI = {
  getAll: () => api.get('/api/product/list'),
  getById: (id) => api.get(`/api/product/${id}`),
  create: (data) => api.post('/api/product/add', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/api/product/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/api/product/${id}`),
  updateStock: (id, inStock) => api.patch('/api/product/stock', { id, inStock })
};

// User API
export const userAPI = {
  register: (data) => api.post('/api/user/register', data),
  login: (data) => api.post('/api/user/login', data),
  logout: () => api.post('/api/user/logout'),
  checkAuth: () => api.get('/api/user/isauth'),
  getProfile: () => api.get('/api/user/profile'),
  updateProfile: (data) => api.put('/api/user/profile', data),
  updateCart: (cartItems) => api.post('/api/user/cart', { cartItems })
};

// Seller API
export const sellerAPI = {
  login: (data) => api.post('/api/seller/login', data),
  checkAuth: () => api.get('/api/seller/isauth'),
  logout: () => api.post('/api/seller/logout')
};

// Address API
export const addressAPI = {
  add: (data) => api.post('/api/address/add', data),
  getAll: () => api.get('/api/address/')
};

// Order API
export const orderAPI = {
  place: (data) => api.post('/api/order/place', data),
  getUserOrders: () => api.get('/api/order/user'),
  getAllOrders: () => api.get('/api/order/all'),
  updateStatus: (orderId, status) => api.patch('/api/order/status', { orderId, status }),
  getQRCode: () => api.get('/api/order/qr-code'),
  getWhatsAppLink: (orderId) => api.get(`/api/order/whatsapp/${orderId}`)
};

export default api;