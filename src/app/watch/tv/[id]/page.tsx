import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { tmdbClient } from '@/lib/tmdb/client'
import { VideoPlayer } from '@/components/watch/VideoPlayer'
import { MyListButton } from '@/components/ui/MyListButton'
import { Rating } from '@/components/ui/Rating'
import { getPosterUrl } from '@/lib/utils/helpers'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'

interface WatchTVPageProps {
  params: {
    id: string
  }
  searchParams: {
    season?: string
    episode?: string
  }
}

export default async function WatchTVPage({
  params,
  searchParams,
}: WatchTVPageProps) {
  const id = parseInt(params.id)
  const currentSeason = parseInt(searchParams.season || '1')
  const currentEpisode = parseInt(searchParams.episode || '1')

  if (isNaN(id)) {
    redirect('/tv')
  }

  try {
    const [show, seasonData] = await Promise.all([
      tmdbClient.getTVDetails(id),
      tmdbClient.getTVSeason(id, currentSeason),
    ])

    if (!show || !seasonData) {
      notFound()
    }

    const posterUrl = getPosterUrl(show.poster_path, 'large')
    const currentEpisodeData = seasonData.episodes?.find(
      (e: any) => e.episode_number === currentEpisode
    )

    const totalEpisodes = seasonData.episodes?.length || 0

    const getSeasonUrl = (seasonNum: number) =>
      `/watch/tv/${id}?season=${seasonNum}&episode=1`

    const getEpisodeUrl = (episodeNum: number) =>
      `/watch/tv/${id}?season=${currentSeason}&episode=${episodeNum}`

    const hasPrev = currentEpisode > 1 || currentSeason > 1
    const hasNext =
      currentEpisode < totalEpisodes || currentSeason < show.number_of_seasons

    let prevUrl = '#'
    if (currentEpisode > 1) {
      prevUrl = getEpisodeUrl(currentEpisode - 1)
    } else if (currentSeason > 1) {
      prevUrl = getSeasonUrl(currentSeason - 1)
    }

    let nextUrl = '#'
    if (currentEpisode < totalEpisodes) {
      nextUrl = getEpisodeUrl(currentEpisode + 1)
    } else if (currentSeason < show.number_of_seasons) {
      nextUrl = getSeasonUrl(currentSeason + 1)
    }

    return (
      <div className="min-h-screen bg-cinevin-dark pb-12">
        {/* Back to Show → /tv/{id} */}
        <div className="container-cinevin py-4">
          <Link
            href={`/tv/${id}`}
            className="inline-flex items-center gap-2 rounded-full bg-black/35 px-3 py-2 text-sm font-medium text-cinevin-text-muted backdrop-blur transition hover:bg-white/15 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Show
          </Link>
        </div>

        {/* Episode info bar */}
        <div className="container-cinevin py-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-cinevin-border bg-cinevin-surface/75 px-4 py-3 shadow-2xl shadow-black/20 md:gap-x-4">
            <h1 className="text-lg font-bold tracking-tight text-white md:text-2xl">
              {show.name}
            </h1>
            <span className="text-sm text-cinevin-text-dim">•</span>
            <span className="text-sm text-cinevin-text-muted">
              S{currentSeason} E{currentEpisode}
            </span>
            {currentEpisodeData && (
              <>
                <span className="text-sm text-cinevin-text-dim">•</span>
                <span className="text-sm text-cinevin-text-muted">
                  {currentEpisodeData.name}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Video Player */}
        <div className="container-cinevin">
          <VideoPlayer
            mediaType="tv"
            tmdbId={id}
            season={currentSeason}
            episode={currentEpisode}
            title={show.name}
            posterPath={show.poster_path}
          />
        </div>

        {/* Prev / Next */}
        <div className="container-cinevin py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              href={prevUrl}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-cinevin-text-muted transition hover:bg-white/10 hover:text-white ${
                !hasPrev && 'pointer-events-none opacity-50'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Link>

            <span className="hidden text-sm text-cinevin-text-muted sm:block">
              {currentEpisodeData?.name || `Episode ${currentEpisode}`}
            </span>
            <span className="text-sm text-cinevin-text-muted sm:hidden">
              S{currentSeason} E{currentEpisode}
            </span>

            <Link
              href={nextUrl}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-cinevin-text-muted transition hover:bg-white/10 hover:text-white ${
                !hasNext && 'pointer-events-none opacity-50'
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Show mini-block */}
        <div className="container-cinevin border-t border-cinevin-border py-4">
          <div className="flex flex-wrap items-center gap-4">
            {posterUrl && (
              <div className="relative h-20 w-14 flex-shrink-0 overflow-hidden rounded-md shadow-lg">
                <Image
                  src={posterUrl}
                  alt={show.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-bold text-white">
                {show.name}
              </h2>
              <p className="text-xs text-cinevin-text-dim">
                {show.number_of_seasons} Seasons
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Rating rating={show.vote_average} size="sm" />
              </div>
            </div>
            <div className="flex-shrink-0">
              <MyListButton
                tmdbId={show.id}
                mediaType="tv"
                title={show.name}
                posterPath={show.poster_path}
                releaseYear={
                  show.first_air_date
                    ? new Date(show.first_air_date).getFullYear()
                    : undefined
                }
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Season selector */}
        <div className="container-cinevin pt-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-cinevin-text-muted">
            Season
          </p>
          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
            {Array.from(
              { length: show.number_of_seasons },
              (_, index) => index + 1
            ).map((seasonNumber) => (
              <Link
                key={seasonNumber}
                href={getSeasonUrl(seasonNumber)}
                className={`shrink-0 rounded-md px-4 py-2 text-sm font-semibold transition ${
                  currentSeason === seasonNumber
                    ? 'bg-cinevin-red text-white'
                    : 'bg-cinevin-surface text-cinevin-text-muted hover:bg-cinevin-surface-hover hover:text-white'
                }`}
              >
                Season {seasonNumber}
              </Link>
            ))}
          </div>
        </div>

        {/* Jump to episode */}
        <div className="container-cinevin py-4">
          <details className="cursor-pointer">
            <summary className="text-sm font-bold uppercase tracking-[0.12em] text-cinevin-text-muted transition hover:text-white">
              Jump to Episode ▼
            </summary>
            <div className="mt-4 grid max-h-72 grid-cols-2 gap-2 overflow-y-auto rounded-lg bg-black/30 p-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {seasonData.episodes.map((ep: any) => (
                <Link
                  key={ep.id}
                  href={getEpisodeUrl(ep.episode_number)}
                  className={`rounded px-3 py-2 text-center text-sm transition ${
                    currentEpisode === ep.episode_number
                      ? 'bg-cinevin-red text-white'
                      : 'bg-cinevin-dark text-cinevin-text-muted hover:bg-cinevin-surface-hover hover:text-white'
                  }`}
                >
                  <div className="font-medium">E{ep.episode_number}</div>
                  <div className="truncate text-xs">{ep.name}</div>
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Watch TV page error:', error)
    return (
      <div className="min-h-screen bg-cinevin-dark pt-16">
        <div className="container-cinevin py-4">
          <Link
            href={`/tv/${id}`}
            className="inline-flex items-center gap-2 rounded-full bg-black/35 px-3 py-2 text-sm font-medium text-cinevin-text-muted backdrop-blur transition hover:bg-white/15 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Show
          </Link>
        </div>
        <div className="container-cinevin">
          <div className="flex flex-col items-center justify-center py-16">
            <p className="mb-4 text-cinevin-text-dim">
              Failed to load episode. Please try again.
            </p>
            <Link
              href={`/watch/tv/${id}?season=${currentSeason}&episode=${currentEpisode}`}
              className="rounded bg-cinevin-red px-4 py-2 text-white transition hover:bg-cinevin-red-hover"
            >
              Retry
            </Link>
          </div>
        </div>
      </div>
    )
  }
}