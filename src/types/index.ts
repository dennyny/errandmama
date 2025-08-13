export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface ErrandRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupLocation: string;
  deliveryLocation?: string;
  serviceType: string;
  description: string;
  urgency: 'low' | 'normal' | 'high';
  specialInstructions?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  submissionDate: string;
  dueDate: string;
  adminNotes?: string;
  uploadedFiles?: UploadedFile[];
}

export interface ServiceTier {
  id: string;
  name: string;
  price: number;
  timeline: string;
  description: string;
  examples: string[];
  icon: string;
}

export interface Admin {
  username: string;
  isAuthenticated: boolean;
}

export interface LagosArea {
  name: string;
  lga: string;
}