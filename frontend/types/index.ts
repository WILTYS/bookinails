export interface Salon {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  rating: number;
  total_reviews: number;
  price_range: string;
  image_url: string | null;
  open_time: string;
  close_time: string;
  created_at: string;
}

export interface Reservation {
  id: number;
  salon_id: number;
  client_id: number;
  service_type: string;
  appointment_date: string;
  duration_minutes: number;
  price: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded';
  client_notes?: string;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  is_professional: boolean;
  created_at: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  price: number;
}

export interface AvailabilityResponse {
  salon_id: number;
  date: string;
  slots: TimeSlot[];
}

export interface SearchFilters {
  city?: string;
  service_type?: string;
  date?: string;
  price_range?: string;
}
