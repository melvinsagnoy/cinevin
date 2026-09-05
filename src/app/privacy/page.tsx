import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — Cinevin',
  description: 'Read Cinevin\'s privacy policy to understand how we handle your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#141414] pt-16">
      <div className="container-netflix py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
          
          <div className="space-y-6 text-[#b3b3b3]">
            <p className="text-sm text-[#808080]">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/5">
              <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
              <p>
                Cinevin respects your privacy. This Privacy Policy explains how we collect, 
                use, and protect your information when you use our service.
              </p>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/5">
              <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
              <p className="text-white font-medium mt-3 mb-2">a) Information You Provide:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>We do not require user accounts or collect personal information</li>
                <li>No email addresses, names, or payment information is collected</li>
              </ul>
              
              <p className="text-white font-medium mt-3 mb-2">b) Automatically Collected Information:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Your watchlist is stored locally in your browser (localStorage)</li>
                <li>Watch history is stored locally in your browser (localStorage)</li>
                <li>No data is sent to our servers</li>
              </ul>
            </div>

            <div className="flex gap-4 pt-4">
              <Link href="/about">
                <span className="text-[#E50914] hover:underline">About</span>
              </Link>
              <span className="text-[#808080]">|</span>
              <Link href="/terms">
                <span className="text-[#E50914] hover:underline">Terms of Service</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}