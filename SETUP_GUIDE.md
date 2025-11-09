# Quick Setup Guide

Follow these steps to get your Subscription Manager up and running.

## 1. Install Dependencies

```bash
npm install
```

## 2. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if you don't have one)
4. Click "New Project"
5. Fill in the project details:
   - Name: subscription-manager (or any name you like)
   - Database Password: Create a strong password (save it somewhere safe)
   - Region: Choose the closest to your users
6. Click "Create new project"
7. Wait 2-3 minutes for the project to be ready

## 3. Set Up Database

1. In your Supabase dashboard, click on "SQL Editor" in the left sidebar
2. Click "New query"
3. Copy and paste the contents of `supabase/migrations/20241031000000_initial_schema.sql`
4. Click "Run" or press Ctrl+Enter (Cmd+Enter on Mac)
5. You should see "Success. No rows returned"

## 4. Configure Authentication Providers

### Email (Magic Link) - Already Enabled

Email authentication is enabled by default. No additional setup needed!

### Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 credentials
5. Add authorized redirect URIs from Supabase:
   - In Supabase dashboard, go to Authentication > Providers > Google
   - Copy the "Callback URL (for OAuth)"
   - Add it to your Google OAuth client's authorized redirect URIs
6. Copy the Client ID and Client Secret from Google
7. Paste them in Supabase under Authentication > Providers > Google
8. Enable Google provider in Supabase
9. Save

### Facebook OAuth (Optional)

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use an existing one
3. Add Facebook Login product
4. Go to Facebook Login > Settings
5. Add authorized redirect URIs from Supabase:
   - In Supabase dashboard, go to Authentication > Providers > Facebook
   - Copy the "Callback URL (for OAuth)"
   - Add it to Facebook Login's Valid OAuth Redirect URIs
6. Copy the App ID and App Secret from Facebook
7. Paste them in Supabase under Authentication > Providers > Facebook
8. Enable Facebook provider in Supabase
9. Save

## 5. Get Your Supabase Credentials

1. In your Supabase project, click on the Settings icon (gear) in the left sidebar
2. Click on "API" under Project Settings
3. You'll see two important values:
   - **Project URL**: Something like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public** key: A long string starting with `eyJ...`

## 6. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and replace the placeholder values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 8. Test Your Application

1. Click "Get Started" or "View Dashboard"
2. Click "Continue with Google", "Continue with Facebook", or enter your email
3. Complete the authentication
4. You should be redirected to the dashboard
5. Try adding a subscription!

## Common Issues

### "Invalid API credentials"
- Check that your `.env.local` file has the correct values
- Make sure there are no extra spaces or quotes around the values
- Restart the development server after changing environment variables

### "Failed to fetch"
- Check your internet connection
- Verify that your Supabase project URL is correct
- Check if your Supabase project is active (not paused)

### OAuth not working
- Verify that you've added the correct redirect URLs in Google/Facebook
- Make sure you've enabled the provider in Supabase
- Check that your Client ID and Secret are correct
- For development, make sure you're testing on `localhost:3000` (not `127.0.0.1`)

### Database errors
- Make sure you ran the migration SQL script
- Check that RLS policies are enabled
- Verify you're logged in with a valid user

## Next Steps

- Add your first subscription
- Explore the dashboard
- Customize the application to your needs
- Deploy to production (see README.md for deployment instructions)

## Need Help?

If you encounter any issues not covered here, please:
1. Check the main [README.md](README.md) for more details
2. Open an issue on GitHub
3. Review Supabase documentation at [https://supabase.com/docs](https://supabase.com/docs)
