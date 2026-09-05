import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service — Cinevin',
  description: 'Read Cinevin\'s terms of service to understand the rules and guidelines for using our platform.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#141414] pt-16">
      <div className="container-netflix py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6">Terms of Service</h1>
          
          <div className="space-y-6 text-[#b3b3b3]">
            <p className="text-sm text-[#808080]">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/5">
              <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By using Cinevin, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/5">
              <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
              <p className="mb-2">Cinevin provides a platform for discovering movies and TV shows through:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Browsing and searching for content</li>
                <li>Viewing metadata from TMDB API</li>
                <li>Creating and managing personal watchlists (stored locally)</li>
                <li>Accessing third-party video players for streaming</li>
              </ul>
            </div>

            <div className="flex gap-4 pt-4">
              <Link href="/about">
                <span className="text-[#E50914] hover:underline">About</span>
              </Link>
              <span className="text-[#808080]">|</span>
              <Link href="/privacy">
                <span className="text-[#E50914] hover:underline">Privacy Policy</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}