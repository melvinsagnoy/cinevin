import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/50 py-12 mt-12">
      <div className="container-netflix">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-bold">
              <span className="text-[#E50914]">CINE</span>
              <span className="text-white">VIN</span>
            </h3>
            <p className="text-sm text-[#808080]">
              Discover, watch, and save your favorite movies and TV shows.
            </p>
          </div>
          
          <div>
            <h4 className="mb-3 text-sm font-semibold text-[#b3b3b3]">Browse</h4>
            <ul className="space-y-2 text-sm text-[#808080]">
              <li><Link href="/movies" className="hover:text-white transition">Movies</Link></li>
              <li><Link href="/tv" className="hover:text-white transition">TV Shows</Link></li>
              <li><Link href="/my-list" className="hover:text-white transition">My List</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-3 text-sm font-semibold text-[#b3b3b3]">Legal</h4>
            <ul className="space-y-2 text-sm text-[#808080]">
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-3 text-sm font-semibold text-[#b3b3b3]">Disclaimer</h4>
            <p className="text-xs text-[#808080] leading-relaxed">
              Cinevin does not host any video content. All metadata is provided by TMDB, and video playback is powered by third-party services.
            </p>
          </div>
        </div>
        
        <div className="mt-8 border-t border-white/5 pt-8 text-center text-xs text-[#808080]">
          <p>&copy; {new Date().getFullYear()} Cinevin. All rights reserved.</p>
          <p className="mt-1">Powered by TMDB API</p>
        </div>
      </div>
    </footer>
  )
}