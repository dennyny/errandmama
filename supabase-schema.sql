-- Errand Mama Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to create the required tables

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create errand_requests table
CREATE TABLE IF NOT EXISTS public.errand_requests (
  id TEXT PRIMARY KEY DEFAULT 'EM' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0'),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  delivery_location TEXT,
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  urgency TEXT CHECK (urgency IN ('low', 'normal', 'high')) DEFAULT 'normal',
  special_instructions TEXT,
  status TEXT CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')) DEFAULT 'pending',
  submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  admin_notes TEXT,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create uploaded_files table
CREATE TABLE IF NOT EXISTS public.uploaded_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id TEXT REFERENCES public.errand_requests(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table (for admin authentication)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_errand_requests_user_id ON public.errand_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_errand_requests_status ON public.errand_requests(status);
CREATE INDEX IF NOT EXISTS idx_errand_requests_created_at ON public.errand_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_request_id ON public.uploaded_files(request_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.errand_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for errand_requests
CREATE POLICY "Users can view own requests" ON public.errand_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own requests" ON public.errand_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own requests" ON public.errand_requests
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies (you'll need to create admin users manually)
CREATE POLICY "Admins can view all requests" ON public.errand_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admins can update all requests" ON public.errand_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- RLS Policies for uploaded_files
CREATE POLICY "Users can view files for own requests" ON public.uploaded_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.errand_requests 
      WHERE id = request_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert files for own requests" ON public.uploaded_files
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.errand_requests 
      WHERE id = request_id AND user_id = auth.uid()
    )
  );

-- Admin policies for files
CREATE POLICY "Admins can view all files" ON public.uploaded_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, phone, location)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'location', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_errand_requests_updated_at
  BEFORE UPDATE ON public.errand_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample admin user (replace with your actual admin email)
-- You'll need to sign up with this email first in your app
INSERT INTO public.admin_users (username, email) 
VALUES ('admin', 'admin@errandmama.com')
ON CONFLICT (email) DO NOTHING;

-- Enable realtime for live updates (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE public.errand_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.uploaded_files;