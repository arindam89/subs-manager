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
