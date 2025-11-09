# Subscription Manager

A web application for tracking subscription renewals and credit resets. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔐 **Easy Authentication**: Sign in with Google, Facebook, or email using Supabase Auth
- ⏰ **Multiple Timers**: Create and manage multiple subscription timers
- 📊 **Track Renewals**: Monitor time remaining until your next renewal
- 💳 **Credit Management**: Track usage-based credits and when they reset
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier is sufficient)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/arindam89/subs-manager.git
cd subs-manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up

#### Configure Authentication Providers

**Google OAuth:**
1. In your Supabase dashboard, go to Authentication > Providers
2. Enable Google provider
3. Follow the instructions to create OAuth credentials in Google Cloud Console
4. Add the authorized redirect URI from Supabase

**Facebook OAuth:**
1. In your Supabase dashboard, go to Authentication > Providers
2. Enable Facebook provider
3. Follow the instructions to create a Facebook App
4. Add the authorized redirect URI from Supabase

**Email (Magic Link):**
- Email authentication is enabled by default in Supabase

#### Create Database Schema

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create subscriptions table
create table subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  next_renewal timestamp with time zone not null,
  renewal_period text not null check (renewal_period in ('daily', 'weekly', 'monthly', 'yearly')),
  credits integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table subscriptions enable row level security;

-- Create policies
create policy "Users can view their own subscriptions"
  on subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own subscriptions"
  on subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own subscriptions"
  on subscriptions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own subscriptions"
  on subscriptions for delete
  using (auth.uid() = user_id);

-- Create index for better query performance
create index subscriptions_user_id_idx on subscriptions(user_id);
create index subscriptions_next_renewal_idx on subscriptions(next_renewal);
```

### 4. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Supabase credentials:
   - Go to your Supabase project settings
   - Click on "API" in the sidebar
   - Copy the "Project URL" and "anon public" key

3. Update `.env.local` with your credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Getting Started

1. **Sign Up/Login**: Click "Get Started" and sign in with Google, Facebook, or email
2. **Add Subscription**: Click "Add Subscription" on the dashboard
3. **Fill Details**:
   - Name: e.g., "Netflix"
   - Description: e.g., "Premium Plan" (optional)
   - Next Renewal Date: Select when your subscription renews
   - Renewal Period: Choose daily, weekly, monthly, or yearly
   - Credits: Add credit amount if applicable (optional)
4. **Track**: View countdown timers for all your subscriptions

### Managing Subscriptions

- **View**: All subscriptions are displayed as cards showing time remaining
- **Delete**: Click the trash icon on any subscription card to remove it
- **Auto-refresh**: Timers update automatically every minute

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (recommended)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel project settings
5. Deploy!

Make sure to update your Supabase redirect URLs to include your production domain.

## Database Schema

### subscriptions

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Reference to auth.users |
| name | text | Subscription name |
| description | text | Optional description |
| next_renewal | timestamp | When the subscription renews |
| renewal_period | text | daily, weekly, monthly, or yearly |
| credits | integer | Optional credit amount |
| created_at | timestamp | When the record was created |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please open an issue on GitHub.
