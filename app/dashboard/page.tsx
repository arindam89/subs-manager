import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/DashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's subscriptions
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')
    .order('next_renewal', { ascending: true })

  return <DashboardClient user={user} initialSubscriptions={subscriptions || []} />
}
