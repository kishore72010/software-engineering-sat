import axios from 'axios';
import {
  AuthResponse,
  User,
  Resource,
  Reservation,
  FareCalculationResponse,
  AdminStats,
  ReservationStatus,
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for friendly error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    return res.data;
  },
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', { name, email, password });
    return res.data;
  },
  getMe: async (): Promise<User> => {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },
};

export const resourceService = {
  getAll: async (): Promise<Resource[]> => {
    const res = await api.get<Resource[]>('/resources');
    return res.data;
  },
  getById: async (id: number): Promise<Resource> => {
    const res = await api.get<Resource>(`/resources/${id}`);
    return res.data;
  },
  calculateFare: async (resourceId: number, quantity: number): Promise<FareCalculationResponse> => {
    const res = await api.post<FareCalculationResponse>('/resources/calculate-fare', {
      resourceId,
      quantity,
    });
    return res.data;
  },
  update: async (
    id: number,
    data: { currentRate?: number; availableQuantity?: number; active?: boolean }
  ): Promise<Resource> => {
    const res = await api.put<Resource>(`/resources/${id}`, data);
    return res.data;
  },
};

export const reservationService = {
  create: async (data: {
    resourceId: number;
    quantity: number;
    customerName: string;
    customerPhone: string;
    bookingDate: string;
    diningSlot: string;
    specialRequests?: string;
  }): Promise<Reservation> => {
    const res = await api.post<Reservation>('/reservations', data);
    return res.data;
  },
  getMy: async (): Promise<Reservation[]> => {
    const res = await api.get<Reservation[]>('/reservations/my');
    return res.data;
  },
  getById: async (id: number): Promise<Reservation> => {
    const res = await api.get<Reservation>(`/reservations/${id}`);
    return res.data;
  },
  cancel: async (id: number, reason?: string): Promise<Reservation> => {
    const res = await api.post<Reservation>(`/reservations/${id}/cancel`, { reason });
    return res.data;
  },
};

export const adminService = {
  getAllReservations: async (): Promise<Reservation[]> => {
    const res = await api.get<Reservation[]>('/admin/reservations');
    return res.data;
  },
  getStats: async (): Promise<AdminStats> => {
    const res = await api.get<AdminStats>('/admin/stats');
    return res.data;
  },
  getAllResources: async (): Promise<Resource[]> => {
    const res = await api.get<Resource[]>('/admin/resources');
    return res.data;
  },
  updateStatus: async (
    id: number,
    status: ReservationStatus,
    remarks?: string
  ): Promise<Reservation> => {
    const res = await api.patch<Reservation>(`/admin/reservations/${id}/status`, {
      status,
      remarks,
    });
    return res.data;
  },
};

export default api;
