export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

export type ReservationStatus = 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
}

export interface Resource {
  id: number;
  resourceCode: string;
  displayName: string;
  category: string;
  description: string;
  seatingCapacity: number;
  currentRate: number;
  availableQuantity: number;
  active: boolean;
  imageUrl?: string;
}

export interface ReservationItem {
  id: number;
  resourceId: number;
  resourceCode: string;
  displayName: string;
  quantity: number;
  savedUnitRate: number;
  savedBaseAmount: number;
}

export interface BookingStatusHistory {
  id: number;
  previousStatus: string | null;
  newStatus: string;
  changedBy: string;
  changedAt: string;
  remarks: string | null;
}

export interface Reservation {
  id: number;
  uniqueBookingReference: string;
  userId: number;
  userEmail: string;
  customerName: string;
  customerPhone: string;
  bookingDate: string;
  diningSlot: string;
  specialRequests?: string;
  status: ReservationStatus;
  baseAmount: number;
  bookingCharge: number;
  grandTotal: number;
  items: ReservationItem[];
  statusHistory: BookingStatusHistory[];
  createdAt: string;
  updatedAt?: string;
}

export interface FareCalculationResponse {
  resourceId: number;
  resourceCode: string;
  displayName: string;
  unitRate: number;
  quantity: number;
  baseAmount: number;
  bookingCharge: number;
  grandTotal: number;
}

export interface AdminStats {
  totalReservations: number;
  confirmedCount: number;
  checkedInCount: number;
  completedCount: number;
  cancelledCount: number;
  totalRevenue: number;
}
