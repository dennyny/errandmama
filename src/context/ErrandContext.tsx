import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ErrandRequest, Admin } from '../types';
import { generateRequestId, calculateDueDate } from '../utils/currency';

interface ErrandContextType {
  requests: ErrandRequest[];
  admin: Admin;
  addRequest: (request: Omit<ErrandRequest, 'id' | 'submissionDate' | 'dueDate' | 'status'>) => string;
  updateRequestStatus: (id: string, status: ErrandRequest['status'], adminNotes?: string) => void;
  getRequestById: (id: string) => ErrandRequest | undefined;
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
}

const ErrandContext = createContext<ErrandContextType | undefined>(undefined);

// Sample data for demo purposes
const sampleRequests: ErrandRequest[] = [
  {
    id: 'EM001234',
    customerName: 'Adebayo Johnson',
    phoneNumber: '+234 801 234 5678',
    email: 'adebayo@email.com',
    address: 'Victoria Island, Lagos',
    serviceType: 'sharp-sharp',
    errandTitle: 'Emergency grocery shopping',
    description: 'Need to buy ingredients for surprise birthday party tomorrow',
    preferredDate: '2024-01-15',
    specialInstructions: 'Please call before delivery',
    budget: '₦25,000',
    status: 'new',
    submissionDate: '2024-01-14',
    dueDate: '2024-01-16',
    price: 50000,
    adminNotes: ''
  },
  {
    id: 'EM001235',
    customerName: 'Funmi Adebayo',
    phoneNumber: '+234 802 345 6789',
    email: 'funmi@email.com',
    address: 'Lekki, Lagos',
    serviceType: 'market-runs',
    errandTitle: 'Weekly market shopping',
    description: 'Weekly groceries and household items from local market',
    preferredDate: '2024-01-18',
    status: 'in-progress',
    submissionDate: '2024-01-14',
    dueDate: '2024-01-19',
    price: 30000,
    adminNotes: 'Assigned to John - in progress'
  }
];

export const ErrandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<ErrandRequest[]>(sampleRequests);
  const [admin, setAdmin] = useState<Admin>({
    username: '',
    isAuthenticated: false
  });

  const addRequest = (requestData: Omit<ErrandRequest, 'id' | 'submissionDate' | 'dueDate' | 'status'>): string => {
    const id = generateRequestId();
    const submissionDate = new Date().toISOString().split('T')[0];
    const dueDate = calculateDueDate(requestData.serviceType);
    
    const newRequest: ErrandRequest = {
      ...requestData,
      id,
      submissionDate,
      dueDate,
      status: 'new'
    };
    
    setRequests(prev => [...prev, newRequest]);
    return id;
  };

  const updateRequestStatus = (id: string, status: ErrandRequest['status'], adminNotes?: string) => {
    setRequests(prev => 
      prev.map(request => 
        request.id === id 
          ? { ...request, status, adminNotes: adminNotes || request.adminNotes }
          : request
      )
    );
  };

  const getRequestById = (id: string): ErrandRequest | undefined => {
    return requests.find(request => request.id === id);
  };

  const loginAdmin = (username: string, password: string): boolean => {
    // Simple authentication for demo - in production, use proper authentication
    if (username === 'admin' && password === 'admin123') {
      setAdmin({ username, isAuthenticated: true });
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdmin({ username: '', isAuthenticated: false });
  };

  return (
    <ErrandContext.Provider value={{
      requests,
      admin,
      addRequest,
      updateRequestStatus,
      getRequestById,
      loginAdmin,
      logoutAdmin
    }}>
      {children}
    </ErrandContext.Provider>
  );
};

export const useErrand = () => {
  const context = useContext(ErrandContext);
  if (!context) {
    throw new Error('useErrand must be used within an ErrandProvider');
  }
  return context;
};