'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'

interface Subscription {
  id: string
  name: string
  description?: string
  next_renewal: string
  renewal_period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  credits?: number
  user_id: string
  created_at: string
}

interface DashboardClientProps {
  user: User
  initialSubscriptions: Subscription[]
}

export default function DashboardClient({ user, initialSubscriptions }: DashboardClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions)
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleAddSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const next_renewal = formData.get('next_renewal') as string
    const renewal_period = formData.get('renewal_period') as string
    const credits = formData.get('credits') as string

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([
        {
          name,
          description,
          next_renewal,
          renewal_period,
          credits: credits ? parseInt(credits) : null,
          user_id: user.id,
        },
      ])
      .select()

    if (error) {
      alert('Error adding subscription: ' + error.message)
    } else if (data) {
      setSubscriptions([...subscriptions, ...data])
      setShowAddModal(false)
      ;(e.target as HTMLFormElement).reset()
    }

    setLoading(false)
  }

  const handleDeleteSubscription = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return

    const { error } = await supabase.from('subscriptions').delete().eq('id', id)

    if (error) {
      alert('Error deleting subscription: ' + error.message)
    } else {
      setSubscriptions(subscriptions.filter((s) => s.id !== id))
    }
  }

  const calculateTimeRemaining = (nextRenewal: string) => {
    const now = new Date()
    const renewal = new Date(nextRenewal)
    const diff = renewal.getTime() - now.getTime()

    if (diff < 0) return 'Expired'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  // Update timers every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setSubscriptions([...subscriptions])
    }, 60000)

    return () => clearInterval(interval)
  }, [subscriptions])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Subscription Manager</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Subscriptions</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Subscription
          </button>
        </div>

        {/* Subscriptions Grid */}
        {subscriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No subscriptions yet</h3>
            <p className="text-gray-600 mb-6">
              Start tracking your subscriptions by adding your first one!
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Subscription
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{sub.name}</h3>
                    {sub.description && (
                      <p className="text-sm text-gray-600 mt-1">{sub.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteSubscription(sub.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Time Remaining</span>
                    <span className="text-lg font-bold text-blue-600">
                      {calculateTimeRemaining(sub.next_renewal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Renewal Date</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(sub.next_renewal).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Period</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {sub.renewal_period}
                    </span>
                  </div>

                  {sub.credits && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Credits</span>
                      <span className="text-sm font-medium text-gray-900">{sub.credits}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add New Subscription</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddSubscription} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Netflix, Spotify, etc."
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Premium plan, Family subscription, etc."
                />
              </div>

              <div>
                <label htmlFor="next_renewal" className="block text-sm font-medium text-gray-700 mb-1">
                  Next Renewal Date *
                </label>
                <input
                  type="datetime-local"
                  id="next_renewal"
                  name="next_renewal"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="renewal_period" className="block text-sm font-medium text-gray-700 mb-1">
                  Renewal Period *
                </label>
                <select
                  id="renewal_period"
                  name="renewal_period"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-1">
                  Credits (optional)
                </label>
                <input
                  type="number"
                  id="credits"
                  name="credits"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="100"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Subscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
