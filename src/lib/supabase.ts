import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and anon key
// You can find these in your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      errand_requests: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          pickup_location: string;
          delivery_location: string;
          service_type: string;
          description: string;
          urgency: 'low' | 'normal' | 'high';
          special_instructions: string;
          status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
          submission_date: string;
          due_date: string;
          admin_notes?: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          pickup_location: string;
          delivery_location: string;
          service_type: string;
          description: string;
          urgency: 'low' | 'normal' | 'high';
          special_instructions: string;
          status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
          submission_date: string;
          due_date: string;
          admin_notes?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          pickup_location?: string;
          delivery_location?: string;
          service_type?: string;
          description?: string;
          urgency?: 'low' | 'normal' | 'high';
          special_instructions?: string;
          status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
          submission_date?: string;
          due_date?: string;
          admin_notes?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      uploaded_files: {
        Row: {
          id: string;
          request_id: string;
          file_name: string;
          file_size: number;
          file_type: string;
          storage_path: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          file_name: string;
          file_size: number;
          file_type: string;
          storage_path: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          file_name?: string;
          file_size?: number;
          file_type?: string;
          storage_path?: string;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          location: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          location: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          location?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}