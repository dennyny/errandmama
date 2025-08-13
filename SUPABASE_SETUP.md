# Supabase Setup Guide for Errand Mama

This guide will help you set up Supabase for the Errand Mama application, including database tables, authentication, and file storage.

## Prerequisites

1. Create a free Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in your Supabase dashboard

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (looks like: `https://your-project-ref.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 2: Configure Environment Variables

1. Create a `.env.local` file in your project root (copy from `.env.example`)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `supabase-schema.sql` file
4. Paste it into the SQL Editor and click **Run**

This will create:
- `profiles` table for user information
- `errand_requests` table for service requests
- `uploaded_files` table for file references
- `admin_users` table for admin authentication
- Row Level Security (RLS) policies
- Database triggers and functions

## Step 4: Set Up File Storage

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket called `errand-files`
3. Set the bucket to **Public** (for file access)
4. Configure the following bucket policies:

### Storage Policies

Go to **Storage** → **Policies** and add these policies for the `errand-files` bucket:

**Policy 1: Allow authenticated users to upload files**
```sql
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'errand-files' AND 
  auth.role() = 'authenticated'
);
```

**Policy 2: Allow users to view files for their requests**
```sql
CREATE POLICY "Allow users to view their files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'errand-files' AND 
  (
    auth.role() = 'authenticated' OR
    EXISTS (
      SELECT 1 FROM public.errand_requests er
      JOIN public.uploaded_files uf ON er.id = uf.request_id
      WHERE uf.storage_path = name AND er.user_id = auth.uid()
    )
  )
);
```

## Step 5: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure the following settings:

### Email Settings
- Enable **Email confirmations** (recommended for production)
- Set up **SMTP settings** for email delivery (optional for development)

### URL Configuration
- Add your site URL: `http://localhost:5174` (for development)
- Add your production URL when deploying

### Auth Providers
- Email/Password is enabled by default
- You can optionally enable social providers (Google, GitHub, etc.)

## Step 6: Create Admin User

1. Sign up for an account in your application using the email you want to use as admin
2. Go to **SQL Editor** in Supabase
3. Run this query to make your account an admin:

```sql
INSERT INTO public.admin_users (username, email) 
VALUES ('admin', 'your-admin-email@example.com')
ON CONFLICT (email) DO NOTHING;
```

Replace `your-admin-email@example.com` with your actual email address.

## Step 7: Test the Setup

1. Start your development server: `npm run dev`
2. Try signing up for a new account
3. Create a test errand request
4. Upload a file to test file storage
5. Log in as admin to view requests

## Troubleshooting

### Common Issues

**1. "Invalid API key" error**
- Check that your environment variables are correctly set
- Ensure you're using the **anon public key**, not the service role key
- Restart your development server after adding environment variables

**2. "Row Level Security policy violation" error**
- Ensure you've run the complete schema SQL
- Check that RLS policies are properly created
- Verify user authentication status

**3. File upload errors**
- Ensure the `errand-files` bucket exists and is public
- Check storage policies are correctly configured
- Verify file size limits (default is 50MB)

**4. Profile not created after signup**
- Check that the `handle_new_user()` function and trigger exist
- Verify the trigger is properly configured
- Check Supabase logs for any errors

### Checking Logs

1. Go to **Logs** in your Supabase dashboard
2. Check **Database**, **Auth**, and **Storage** logs for errors
3. Use the real-time logs to debug issues as they happen

## Production Deployment

When deploying to production:

1. Update your environment variables with production Supabase credentials
2. Add your production domain to Supabase Auth settings
3. Configure proper SMTP settings for email delivery
4. Review and tighten RLS policies if needed
5. Set up database backups
6. Monitor usage and upgrade your Supabase plan if necessary

## Security Best Practices

1. **Never expose your service role key** - only use it server-side
2. **Use Row Level Security** - all tables should have RLS enabled
3. **Validate file uploads** - check file types and sizes
4. **Regular backups** - set up automated database backups
5. **Monitor usage** - watch for unusual activity patterns

## Support

If you encounter issues:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Visit the [Supabase community](https://github.com/supabase/supabase/discussions)
3. Review the application logs and Supabase dashboard logs

Your Errand Mama application is now ready to use with Supabase! 🚀