import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { tmdbClient } from '@/lib/tmdb/client'
import { VideoPlayer } from '@/components/watch/VideoPlayer'
import { Button } from '@/components/ui/Button'
import { MyListButton } from '@/components/ui/MyListButton'
import { Rating } from '@/components/ui/Rating'
import { getPosterUrl, formatDate } from '@/lib/utils/helpers'
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

export default async function WatchTVPage({ params, searchParams }: WatchTVPageProps) {
  const id = parseInt(params.id)
  const currentSeason = parseInt(searchParams.season || '1')
  const currentEpisode = parseInt(searchParams.episode || '1')

  if (isNaN(id)) {
    redirect('/tv')
  }

  try {
    // Fetch TV show details and season data on the server
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

    // Build URLs for navigation
    const getSeasonUrl = (seasonNum: number) => {
      return `/tv/${id}?season=${seasonNum}&episode=1`
    }

    const getEpisodeUrl = (episodeNum: number) => {
      return `/tv/${id}?season=${currentSeason}&episode=${episodeNum}`
    }

    // Check if previous/next exist
    const hasPrev = currentEpisode > 1 || currentSeason > 1
    const hasNext = currentEpisode < totalEpisodes || currentSeason < show.number_of_seasons

    // Calculate previous episode
    let prevUrl = '#'
    if (currentEpisode > 1) {
      prevUrl = getEpisodeUrl(currentEpisode - 1)
    } else if (currentSeason > 1) {
      prevUrl = getSeasonUrl(currentSeason - 1)
    }

    // Calculate next episode
    let nextUrl = '#'
    if (currentEpisode < totalEpisodes) {
      nextUrl = getEpisodeUrl(currentEpisode + 1)
    } else if (currentSeason < show.number_of_seasons) {
      nextUrl = getSeasonUrl(currentSeason + 1)
    }

    return (
      <div className="min-h-screen bg-[#141414]">
        {/* Back button */}
        <div className="container-premium py-4">
          <Link
            href={`/watch/tv/${id}`}
            className="inline-flex items-center gap-2 text-[#b3b3b3] hover:text-white transition"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Show
          </Link>
        </div>

        {/* Episode Info Bar */}
        <div className="container-premium py-2">
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <h1 className="text-lg md:text-xl font-bold text-white">{show.name}</h1>
            <span className="text-sm text-[#808080]">•</span>
            <span className="text-sm text-[#b3b3b3]">
              S{currentSeason} E{currentEpisode}
            </span>
            {currentEpisodeData && (
              <>
                <span className="text-sm text-[#808080]">•</span>
                <span className="text-sm text-[#b3b3b3]">{currentEpisodeData.name}</span>
              </>
            )}
          </div>
        </div>

        {/* Video Player - THIS IS THE MAIN CONTENT */}
        <div className="container-premium">
          <VideoPlayer
            mediaType="tv"
            tmdbId={id}
            season={currentSeason}
            episode={currentEpisode}
          />
        </div>

        {/* Episode Navigation */}
        <div className="container-premium py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              href={prevUrl}
              className={`flex items-center gap-2 rounded bg-[#1a1a1a] px-4 py-2 text-sm text-[#b3b3b3] transition hover:bg-[#2a2a2a] hover:text-white ${
                !hasPrev && 'opacity-50 pointer-events-none'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Link>
            
            <span className="text-sm text-[#b3b3b3] hidden sm:block">
              {currentEpisodeData?.name || `Episode ${currentEpisode}`}
            </span>
            <span className="text-sm text-[#b3b3b3] sm:hidden">
              S{currentSeason} E{currentEpisode}
            </span>
            
            <Link
              href={nextUrl}
              className={`flex items-center gap-2 rounded bg-[#1a1a1a] px-4 py-2 text-sm text-[#b3b3b3] transition hover:bg-[#2a2a2a] hover:text-white ${
                !hasNext && 'opacity-50 pointer-events-none'
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Show Details - Small section at bottom */}
        <div className="container-premium py-4 border-t border-white/5">
          <div className="flex flex-wrap items-center gap-4">
            {posterUrl && (
              <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded">
                <Image src={posterUrl} alt={show.name} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-white truncate">{show.name}</h2>
              <p className="text-xs text-[#808080]">{show.number_of_seasons} Seasons</p>
              <div className="flex items-center gap-2 mt-1">
                <Rating rating={show.vote_average} size="sm" />
              </div>
            </div>
            <div className="flex-shrink-0">
              <MyListButton
                tmdbId={show.id}
                mediaType="tv"
                title={show.name}
                posterPath={show.poster_path}
                releaseYear={show.first_air_date ? new Date(show.first_air_date).getFullYear() : undefined}
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Season selector */}
        <div className="container-premium pt-4">
          <p className="mb-2 text-sm font-medium text-[#b3b3b3]">Season</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {Array.from({ length: show.number_of_seasons }, (_, index) => index + 1).map((seasonNumber) => (
              <Link
                key={seasonNumber}
                href={getSeasonUrl(seasonNumber)}
                className={`shrink-0 rounded px-3 py-2 text-sm font-medium transition ${
                  currentSeason === seasonNumber
                    ? 'bg-[#E50914] text-white'
                    : 'bg-[#1a1a1a] text-[#b3b3b3] hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                Season {seasonNumber}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Episode Selector - Small dropdown */}
        <div className="container-premium py-4">
          <details className="cursor-pointer">
            <summary className="text-sm font-medium text-[#b3b3b3] hover:text-white transition">
              Jump to Episode ▼
            </summary>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-60 overflow-y-auto p-2 bg-[#1a1a1a] rounded-lg">
              {seasonData.episodes.map((ep: any) => (
                <Link
                  key={ep.id}
                  href={getEpisodeUrl(ep.episode_number)}
                  className={`px-3 py-2 rounded text-sm text-center transition ${
                    currentEpisode === ep.episode_number
                      ? 'bg-[#E50914] text-white'
                      : 'bg-[#0a0a0a] text-[#b3b3b3] hover:bg-[#2a2a2a] hover:text-white'
                  }`}
                >
                  <div className="font-medium">E{ep.episode_number}</div>
                  <div className="text-xs truncate">{ep.name}</div>
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
      <div className="min-h-screen bg-[#141414] pt-16">
        <div className="container-premium py-4">
          <Link
            href={`/watch/tv/${id}`}
            className="inline-flex items-center gap-2 text-[#b3b3b3] hover:text-white transition"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Show
          </Link>
        </div>
        <div className="container-premium">
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-[#808080] mb-4">Failed to load episode. Please try again.</p>
            <Link
              href={`/tv/${id}?season=${currentSeason}&episode=${currentEpisode}`}
              className="bg-[#E50914] text-white px-4 py-2 rounded hover:bg-[#F6121D] transition"
            >
              Retry
            </Link>
          </div>
        </div>
      </div>
    )
  }
}