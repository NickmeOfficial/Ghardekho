export interface Property {
  property_id: number;
  title: string;
  description: string;
  created_at: string;
  created_by: string | null;
  price: string;
  currency: string;
  email: string;
  mobile: string;
  property_type: string;
  area: string;
  measurement_type: number;
  is_featured: boolean;
  status: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface PropertyResponse {
  property_id: number;
  title: string;
  description: string;
  created_by: string | null;
  price: number;
  currency: string;
  email: string;
  mobile: string;
  property_type: string;
  area: string;
  measurement_type: number;
  is_featured: boolean;
  status: string;
  created_at: string;
}

export interface PropertyDetails {
  id: number;
  title: string;
  description: string;
  created_by: string;
  price: number;
  currency: string;
  email: string;
  mobile: string;
  property_type: string;
  area: string;
  measurement_type: number;
  is_featured: boolean;
  status: string;
}

export interface PropertyListResponse {
  data: PropertyResponse[];
  total: number;
}
