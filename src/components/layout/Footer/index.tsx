import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export function Footer() {
  return (
    <footer className="border-t border-cinevin-border bg-cinevin-dark/60">
      <div className="container-cinevin py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo size="md" />
            <p className="mt-4 max-w-xs text-sm text-cinevin-text-muted">
              Discover, watch, and save your favorite movies and TV shows.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-cinevin-text-dim">
              Browse
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/movies" className="text-cinevin-text-muted transition hover:text-white">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/tv" className="text-cinevin-text-muted transition hover:text-white">
                  TV Shows
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-cinevin-text-muted transition hover:text-white">
                  Trending
                </Link>
              </li>
              <li>
                <Link href="/my-list" className="text-cinevin-text-muted transition hover:text-white">
                  My List
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-cinevin-text-dim">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-cinevin-text-muted transition hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-cinevin-text-muted transition hover:text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-cinevin-text-muted transition hover:text-white">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-cinevin-text-dim">
              Disclaimer
            </h4>
            <p className="text-xs leading-relaxed text-cinevin-text-dim">
              Cinevin does not host any video content. All metadata is provided by
              TMDB, and video playback is powered by third-party services.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-cinevin-border pt-6 text-center text-xs text-cinevin-text-dim">
          <p>© {new Date().getFullYear()} Cinevin. All rights reserved.</p>
          <p className="mt-1">Powered by TMDB API</p>
        </div>
      </div>
    </footer>
  )
}