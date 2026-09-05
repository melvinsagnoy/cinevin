import Link from 'next/link'

export const metadata = {
  title: 'About — Cinevin',
  description: 'Learn about Cinevin - your premier destination for streaming movies and TV shows.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#141414] pt-16">
      <div className="container-netflix py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6">About Cinevin</h1>
          
          <div className="space-y-6 text-[#b3b3b3]">
            <p className="text-lg">
              Welcome to <span className="text-white font-semibold">Cinevin</span> - your premier destination for discovering and streaming movies and TV shows.
            </p>

            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/5">
              <h2 className="text-xl font-semibold text-white mb-3">Our Mission</h2>
              <p>
                Cinevin is designed to help you discover new content, create personalized watchlists, 
                and enjoy a seamless streaming experience. We believe in making entertainment accessible 
                and enjoyable for everyone.
              </p>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/5">
              <h2 className="text-xl font-semibold text-white mb-3">How It Works</h2>
              <ul className="space-y-3 list-disc list-inside">
                <li><span className="text-white">Browse:</span> Explore our extensive collection of movies and TV shows</li>
                <li><span className="text-white">Discover:</span> Find new content through trending, popular, and top-rated sections</li>
                <li><span className="text-white">Save:</span> Create your personal watchlist with the "Add to List" feature</li>
                <li><span className="text-white">Watch:</span> Stream content through our integrated video players</li>
              </ul>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/5">
              <h2 className="text-xl font-semibold text-white mb-3">Data Sources</h2>
              <p className="mb-2">
                Cinevin uses the <span className="text-white">TMDB API</span> (The Movie Database) for all movie and TV show metadata.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Link href="/privacy">
                <span className="text-[#E50914] hover:underline">Privacy Policy</span>
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