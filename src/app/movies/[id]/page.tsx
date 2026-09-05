import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { tmdbClient } from '@/lib/tmdb/client'
import { getBackdropUrl, getPosterUrl, formatDate, formatRuntime, truncateText } from '@/lib/utils/helpers'
import { Button } from '@/components/ui/Button'
import { Rating } from '@/components/ui/Rating'
import { GenreBadge } from '@/components/ui/GenreBadge'
import { MyListButton } from '@/components/ui/MyListButton'
import { MediaRow } from '@/components/media/MediaRow'
import { convertToMediaItem } from '@/lib/utils/converters'

interface MovieDetailsPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: MovieDetailsPageProps) {
  const id = parseInt(params.id)
  if (isNaN(id)) return {}

  try {
    const movie = await tmdbClient.getMovieDetails(id)
    return {
      title: `${movie.title} — Cinevin`,
      description: movie.overview,
      openGraph: {
        title: movie.title,
        description: movie.overview,
        images: movie.poster_path
          ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`]
          : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const id = parseInt(params.id)
  if (isNaN(id)) {
    notFound()
  }

  try {
    const [movie, credits, similar] = await Promise.all([
      tmdbClient.getMovieDetails(id),
      tmdbClient.getMovieCredits(id),
      tmdbClient.getMovieSimilar(id),
    ])

    const backdropUrl = getBackdropUrl(movie.backdrop_path)
    const posterUrl = getPosterUrl(movie.poster_path, 'large')
    const director = credits.crew.find((person: any) => person.job === 'Director')
    const cast = credits.cast.slice(0, 10)
    const similarItems = similar.results.map(convertToMediaItem)

    return (
      <div className="min-h-screen bg-[#141414] pt-16">
        {/* Backdrop */}
        <div className="relative h-[50vh] w-full overflow-hidden">
          {backdropUrl ? (
            <Image
              src={backdropUrl}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-b from-zinc-800 to-zinc-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="container-netflix -mt-32 pb-8">
          <div className="grid gap-8 md:grid-cols-[300px,1fr]">
            {/* Poster */}
            <div className="hidden md:block">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-2xl">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#1a1a1a]">
                    <svg className="h-20 w-20 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Poster - Mobile */}
              <div className="block md:hidden">
                <div className="relative aspect-[2/3] w-32 overflow-hidden rounded-lg shadow-2xl">
                  {posterUrl ? (
                    <Image
                      src={posterUrl}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#1a1a1a]">
                      <svg className="h-12 w-12 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="mt-2 text-lg text-[#b3b3b3]">{movie.tagline}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-[#b3b3b3]">
                {movie.release_date && <span>{formatDate(movie.release_date)}</span>}
                {movie.runtime && <span>• {formatRuntime(movie.runtime)}</span>}
                <Rating rating={movie.vote_average} size="md" />
              </div>

              {movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre: any) => (
                    <GenreBadge key={genre.id} name={genre.name} />
                  ))}
                </div>
              )}

              <p className="text-base text-[#b3b3b3] md:text-lg">{movie.overview}</p>

              <div className="flex flex-wrap gap-4">
                <Link href={`/watch/movie/${movie.id}`}>
                  <Button size="lg" className="min-w-[140px] bg-white text-black hover:bg-white/90">
                    <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Play
                  </Button>
                </Link>
                
                <MyListButton
                  tmdbId={movie.id}
                  mediaType="movie"
                  title={movie.title}
                  posterPath={movie.poster_path}
                  releaseYear={movie.release_date ? new Date(movie.release_date).getFullYear() : undefined}
                  size="lg"
                />
              </div>

              {director && (
                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm text-[#808080]">
                    <span className="font-medium text-white">Director:</span> {director.name}
                  </p>
                </div>
              )}

              {cast.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-white">Cast</h3>
                  <div className="flex flex-wrap gap-4">
                    {cast.map((actor: any) => (
                      <div key={actor.id} className="text-center">
                        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-[#1a1a1a]">
                          {actor.profile_path ? (
                            <Image
                              src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                              alt={actor.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-2xl text-[#808080]">
                              {actor.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-white">{actor.name}</p>
                        <p className="text-xs text-[#808080]">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {similarItems.length > 0 && (
          <div className="container-netflix pb-12">
            <MediaRow title="Similar Movies" items={similarItems} />
          </div>
        )}
      </div>
    )
  } catch {
    notFound()
  }
}