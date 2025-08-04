export interface ErrandRequest {
  id: string;
  customerName: string;
  phoneNumber: string;
  email: string;
  address: string;
  serviceType: 'sharp-sharp' | 'market-runs' | 'others';
  errandTitle: string;
  description: string;
  preferredDate: string;
  specialInstructions?: string;
  budget?: string;
  status: 'new' | 'assigned' | 'in-progress' | 'completed';
  submissionDate: string;
  dueDate: string;
  price: number;
  adminNotes?: string;
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