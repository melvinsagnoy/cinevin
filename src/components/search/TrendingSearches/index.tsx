import Link from 'next/link'
import Image from 'next/image'
import { tmdbClient } from '@/lib/tmdb/client'
import { getPosterUrl } from '@/lib/utils/helpers'

export async function TrendingSearches() {
  let trending: any[] = []

  try {
    const data = await tmdbClient.getTrending('all', 'day')
    trending = (data.results || []).slice(0, 8)
  } catch (error) {
    console.error('Trending fetch error:', error)
    return null
  }

  if (trending.length === 0) return null

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Trending Searches</h2>
        <p className="mt-1 text-sm text-cinevin-text-dim">
          What everyone's searching for today
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {trending.map((item) => {
          const title = item.title || item.name || 'Unknown'
          const href =
            item.media_type === 'movie'
              ? `/movies/${item.id}`
              : `/tv/${item.id}`
          const posterUrl = getPosterUrl(item.poster_path, 'small')

          return (
            <Link
              key={`${item.media_type}-${item.id}`}
              href={href}
              className="group flex items-center gap-3 rounded-lg border border-cinevin-border bg-cinevin-surface/50 p-3 transition hover:border-cinevin-red/50 hover:bg-cinevin-surface"
            >
              <div className="relative h-16 w-11 flex-shrink-0 overflow-hidden rounded bg-cinevin-dark">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={title}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-cinevin-text-dim">
                    ?
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white transition-colors group-hover:text-cinevin-red">
                  {title}
                </p>
                <p className="text-xs text-cinevin-text-dim">
                  {item.media_type === 'movie' ? 'Movie' : 'TV'}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}