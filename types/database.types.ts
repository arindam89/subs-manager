export interface Subscription {
  id: string
  name: string
  description?: string
  next_renewal: string
  renewal_period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  credits?: number
  user_id: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      subscriptions: {
        Row: Subscription
        Insert: Omit<Subscription, 'id' | 'created_at'>
        Update: Partial<Omit<Subscription, 'id' | 'created_at'>>
      }
    }
  }
}
