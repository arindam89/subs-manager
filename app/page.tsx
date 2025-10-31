import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Subscription Manager
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Track your subscription renewals and credit resets with ease. 
            Never miss a renewal date again!
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/dashboard"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              View Dashboard
            </Link>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold mb-2">Easy Sign Up</h3>
              <p className="text-gray-600">
                Sign in with Google, Facebook, or other providers using Supabase Auth
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold mb-2">Track Timers</h3>
              <p className="text-gray-600">
                Create multiple timers to track renewal dates for all your subscriptions
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Manage Credits</h3>
              <p className="text-gray-600">
                Know exactly when your usage-based credits will reset
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
