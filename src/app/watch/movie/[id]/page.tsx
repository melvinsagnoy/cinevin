import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { tmdbClient } from '@/lib/tmdb/client'
import { VideoPlayer } from '@/components/watch/VideoPlayer'
import { Button } from '@/components/ui/Button'
import { MyListButton } from '@/components/ui/MyListButton'
import { Rating } from '@/components/ui/Rating'
import { GenreBadge } from '@/components/ui/GenreBadge'
import { MediaRow } from '@/components/media/MediaRow'
import { convertToMediaItem } from '@/lib/utils/converters'
import { getPosterUrl, formatDate, formatRuntime } from '@/lib/utils/helpers'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface WatchMoviePageProps {
  params: {
    id: string
  }
}

export default async function WatchMoviePage({ params }: WatchMoviePageProps) {
  const id = parseInt(params.id)

  if (isNaN(id)) {
    redirect('/movies')
  }

  try {
    const [movie, similar] = await Promise.all([
      tmdbClient.getMovieDetails(id),
      tmdbClient.getMovieSimilar(id),
    ])

    if (!movie) {
      notFound()
    }

    const posterUrl = getPosterUrl(movie.poster_path, 'large')
    const similarItems = similar.results.map(convertToMediaItem)

    return (
      <div className="min-h-screen bg-[#141414]">
        {/* Back button */}
        <div className="container-premium py-4">
          <Link
            href={`/movies/${id}`}
            className="inline-flex items-center gap-2 text-[#b3b3b3] hover:text-white transition"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Movie
          </Link>
        </div>

        {/* Video Player */}
        <div className="container-premium">
          <VideoPlayer mediaType="movie" tmdbId={id} />
        </div>

        {/* Movie Details */}
        <div className="container-premium py-8">
          <div className="grid gap-8 md:grid-cols-[240px,1fr]">
            {posterUrl && (
              <div className="hidden md:block">
                <div className="relative aspect-[2/3] w-full max-w-[240px] overflow-hidden rounded-lg shadow-2xl">
                  <Image src={posterUrl} alt={movie.title} fill className="object-cover" />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl">
                {movie.title}
              </h1>

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

              <p className="text-sm text-[#b3b3b3] md:text-base">{movie.overview}</p>

              <div className="flex flex-wrap gap-3 pt-2">
                <MyListButton
                  tmdbId={movie.id}
                  mediaType="movie"
                  title={movie.title}
                  posterPath={movie.poster_path}
                  releaseYear={movie.release_date ? new Date(movie.release_date).getFullYear() : undefined}
                />
              </div>

              {movie.production_companies && movie.production_companies.length > 0 && (
                <div className="border-t border-white/5 pt-4">
                  <p className="text-sm text-[#808080]">
                    <span className="text-white">Production:</span>{' '}
                    {movie.production_companies.map((c: any) => c.name).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Movies */}
        {similarItems.length > 0 && (
          <div className="container-premium pb-12">
            <MediaRow title="You might also like" items={similarItems} />
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Watch movie error:', error)
    return (
      <div className="min-h-screen bg-[#141414] pt-16">
        <div className="container-premium py-4">
          <Link
            href={`/movies/${id}`}
            className="inline-flex items-center gap-2 text-[#b3b3b3] hover:text-white transition"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Movie
          </Link>
        </div>
        <div className="container-premium">
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-[#808080] mb-4">Failed to load movie. Please try again.</p>
            <Link
              href={`/watch/movie/${id}`}
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