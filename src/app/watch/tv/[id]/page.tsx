import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { tmdbClient } from '@/lib/tmdb/client'
import { getBackdropUrl, getPosterUrl, formatDate, truncateText } from '@/lib/utils/helpers'
import { Button } from '@/components/ui/Button'
import { Rating } from '@/components/ui/Rating'
import { GenreBadge } from '@/components/ui/GenreBadge'
import { MyListButton } from '@/components/ui/MyListButton'
import { MediaRow } from '@/components/media/MediaRow'
import { convertToMediaItem } from '@/lib/utils/converters'
import { EpisodesSection } from '@/components/tv/EpisodesSection'

interface TVDetailsPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: TVDetailsPageProps) {
  const id = parseInt(params.id)
  if (isNaN(id)) return {}

  try {
    const tv = await tmdbClient.getTVDetails(id)
    return {
      title: `${tv.name} — Cinevin`,
      description: tv.overview,
      openGraph: {
        title: tv.name,
        description: tv.overview,
        images: tv.poster_path
          ? [`https://image.tmdb.org/t/p/w500${tv.poster_path}`]
          : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function TVDetailsPage({ params }: TVDetailsPageProps) {
  const id = parseInt(params.id)
  if (isNaN(id)) {
    notFound()
  }

  try {
    const [tv, credits, similar] = await Promise.all([
      tmdbClient.getTVDetails(id),
      tmdbClient.getTVCredits(id),
      tmdbClient.getTVSimilar(id),
    ])

    // Fetch ALL seasons
    const seasonsPromises = []
    for (let i = 1; i <= tv.number_of_seasons; i++) {
      seasonsPromises.push(
        tmdbClient.getTVSeason(id, i).catch(() => null)
      )
    }
    const seasonsData = await Promise.all(seasonsPromises)
    const validSeasons = seasonsData.filter((s): s is NonNullable<typeof s> => s !== null)

    const backdropUrl = getBackdropUrl(tv.backdrop_path)
    const posterUrl = getPosterUrl(tv.poster_path, 'large')
    const cast = credits.cast.slice(0, 10)
    const similarItems = similar.results.map(convertToMediaItem)

    return (
      <div className="min-h-screen bg-[#141414] pt-16">
        {/* Backdrop */}
        <div className="relative h-[50vh] w-full overflow-hidden">
          {backdropUrl ? (
            <Image
              src={backdropUrl}
              alt={tv.name}
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
        <div className="container-premium -mt-32 pb-8">
          <div className="grid gap-8 md:grid-cols-[300px,1fr]">
            {/* Poster */}
            <div className="hidden md:block">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-2xl">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={tv.name}
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
                      alt={tv.name}
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
                  {tv.name}
                </h1>
                {tv.tagline && (
                  <p className="mt-2 text-lg text-[#b3b3b3]">{tv.tagline}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-[#b3b3b3]">
                {tv.first_air_date && <span>{formatDate(tv.first_air_date)}</span>}
                <span>• {tv.number_of_seasons} Seasons</span>
                <span className="text-[#808080]">HD</span>
                <Rating rating={tv.vote_average} size="md" />
              </div>

              {tv.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tv.genres.map((genre: any) => (
                    <GenreBadge key={genre.id} name={genre.name} />
                  ))}
                </div>
              )}

              <p className="text-base text-[#b3b3b3] md:text-lg">{tv.overview}</p>

              <div className="flex flex-wrap gap-4">
                <Link href={`/tv/${tv.id}?season=1&episode=1`}>
                  <Button size="lg" className="min-w-[140px] bg-white text-black hover:bg-white/90">
                    <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Play
                  </Button>
                </Link>
                
                <MyListButton
                  tmdbId={tv.id}
                  mediaType="tv"
                  title={tv.name}
                  posterPath={tv.poster_path}
                  releaseYear={tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : undefined}
                  size="lg"
                />
              </div>

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

        {/* Episodes Section - Now interactive */}
        {validSeasons.length > 0 && (
          <EpisodesSection showId={tv.id} seasons={validSeasons} />
        )}

        {/* Similar Shows */}
        {similarItems.length > 0 && (
          <div className="container-premium pb-12">
            <MediaRow title="More Like This" items={similarItems} />
          </div>
        )}
      </div>
    )
  } catch {
    notFound()
  }
}