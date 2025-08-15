import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ErrandRequest, Admin } from '../types';
import { generateRequestId, calculateDueDate } from '../utils/currency';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  isAuthenticated: boolean;
}

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
}

interface ErrandContextType {
  requests: ErrandRequest[];
  admin: Admin;
  user: User;
  addRequest: (request: Omit<ErrandRequest, 'id' | 'submissionDate' | 'dueDate' | 'status'>) => Promise<string>;
  updateRequestStatus: (id: string, status: ErrandRequest['status'], adminNotes?: string) => Promise<void>;
  getRequestById: (id: string) => ErrandRequest | undefined;
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
  loginUser: (email: string, password: string) => Promise<boolean>;
  signupUser: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    password: string;
  }) => Promise<{ success: boolean; needsEmailConfirmation: boolean }>;
  logoutUser: () => void;
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
  const [requests, setRequests] = useState<ErrandRequest[]>([]);
  const [admin, setAdmin] = useState<Admin>({
    username: '',
    isAuthenticated: false
  });
  const [user, setUser] = useState<User>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    isAuthenticated: false
  });
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    getSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user);
        await loadUserRequests(session.user.id);
      } else {
        setUser({
          id: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          location: '',
          isAuthenticated: false
        });
        setRequests([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await loadUserProfile(session.user);
      await loadUserRequests(session.user.id);
    }
    setLoading(false);
  };

  const loadUserProfile = async (authUser: SupabaseUser) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (profile) {
      setUser({
        id: profile.id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        isAuthenticated: true
      });
    }
  };

  const loadUserRequests = async (userId: string) => {
    const { data: userRequests } = await supabase
      .from('errand_requests')
      .select(`
        *,
        uploaded_files(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (userRequests) {
      const formattedRequests: ErrandRequest[] = userRequests.map(req => ({
        id: req.id,
        customerName: req.customer_name,
        customerEmail: req.customer_email,
        customerPhone: req.customer_phone,
        pickupLocation: req.pickup_location,
        deliveryLocation: req.delivery_location,
        serviceType: req.service_type,
        description: req.description,
        urgency: req.urgency as 'low' | 'normal' | 'high',
        specialInstructions: req.special_instructions,
        status: req.status as ErrandRequest['status'],
        submissionDate: req.submission_date,
        dueDate: req.due_date,
        adminNotes: req.admin_notes,
        uploadedFiles: Array.isArray(req.uploaded_files) ? req.uploaded_files.map((file: any) => ({
          id: file.id,
          name: file.file_name,
          size: file.file_size,
          type: file.file_type,
          url: file.storage_path
        })) : []
      }));
      setRequests(formattedRequests);
    }
  };

  const addRequest = async (requestData: Omit<ErrandRequest, 'id' | 'submissionDate' | 'dueDate' | 'status'>): Promise<string> => {
    if (!user.isAuthenticated) {
      throw new Error('User must be authenticated to create requests');
    }

    const id = generateRequestId();
    const submissionDate = new Date().toISOString();
    const dueDate = calculateDueDate(requestData.serviceType);
    
    const { data, error } = await supabase
      .from('errand_requests')
      .insert({
        id,
        customer_name: requestData.customerName,
        customer_email: requestData.customerEmail,
        customer_phone: requestData.customerPhone,
        pickup_location: requestData.pickupLocation,
        delivery_location: requestData.deliveryLocation,
        service_type: requestData.serviceType,
        description: requestData.description,
        urgency: requestData.urgency,
        special_instructions: requestData.specialInstructions,
        submission_date: submissionDate,
        due_date: dueDate,
        user_id: user.id,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating request:', error);
      throw new Error('Failed to create request');
    }

    // Handle file uploads if any
    if (requestData.uploadedFiles && requestData.uploadedFiles.length > 0) {
      for (const file of requestData.uploadedFiles) {
        // Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('errand-files')
          .upload(fileName, file as File);

        if (!uploadError && uploadData) {
          // Save file record to database
          await supabase
            .from('uploaded_files')
            .insert({
              request_id: id,
              file_name: file.name,
              file_size: file.size,
              file_type: file.type,
              storage_path: uploadData.path
            });
        }
      }
    }

    // Reload requests to get the updated list
    await loadUserRequests(user.id);
    return id;
  };

  const updateRequestStatus = async (id: string, status: ErrandRequest['status'], adminNotes?: string) => {
    const { error } = await supabase
      .from('errand_requests')
      .update({ 
        status, 
        admin_notes: adminNotes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating request status:', error);
      throw new Error('Failed to update request status');
    }

    // Reload requests to get the updated list
    if (user.isAuthenticated) {
      await loadUserRequests(user.id);
    }
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

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      if (data.user) {
        await loadUserProfile(data.user);
        await loadUserRequests(data.user.id);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signupUser = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    password: string;
  }): Promise<{ success: boolean; needsEmailConfirmation: boolean }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            location: userData.location
          }
        }
      });

      if (error) {
        console.error('Signup error:', error.message);
        return { success: false, needsEmailConfirmation: false };
      }

      if (data.user) {
        // Check if email confirmation is needed
        const needsEmailConfirmation = !data.user.email_confirmed_at;
        
        if (!needsEmailConfirmation) {
          // Profile will be created automatically by the trigger
          // Load the profile after a short delay to ensure it's created
          setTimeout(async () => {
            await loadUserProfile(data.user!);
          }, 1000);
        }
        
        return { success: true, needsEmailConfirmation };
      }
      
      return { success: false, needsEmailConfirmation: false };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, needsEmailConfirmation: false };
    }
  };

  const logoutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    }
    
    setUser({
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      isAuthenticated: false
    });
    setRequests([]);
  };

  return (
    <ErrandContext.Provider value={{
      requests,
      admin,
      user,
      addRequest,
      updateRequestStatus,
      getRequestById,
      loginAdmin,
      logoutAdmin,
      loginUser,
      signupUser,
      logoutUser
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