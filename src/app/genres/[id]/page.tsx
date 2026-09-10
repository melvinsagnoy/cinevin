import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { tmdbClient } from '@/lib/tmdb/client'
import { MediaCard } from '@/components/media/MediaCard'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { convertToMediaItem } from '@/lib/utils/converters'
import { MediaItem } from '@/types/media'
import { genres } from '@/config/navigation'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 3600

interface GenrePageProps {
  params: { id: string }
  searchParams: { type?: string }
}

/**
 * Find the matching genre in the OTHER media type list by name.
 * Example: "Action" (movie id 28) → "Action & Adventure" (tv id 10759)
 */
function findMatchingGenreId(
  name: string,
  targetList: readonly { id: number; name: string }[]
): number | null {
  // Direct name match
  const exact = targetList.find((g) => g.name === name)
  if (exact) return exact.id

  // Partial match (e.g. "Action" matches "Action & Adventure")
  const firstWord = name.split(/[\s&]+/)[0].toLowerCase()
  const partial = targetList.find((g) =>
    g.name.toLowerCase().startsWith(firstWord)
  )
  return partial ? partial.id : null
}

export async function generateMetadata({ params, searchParams }: GenrePageProps) {
  const genreId = parseInt(params.id)
  const type = searchParams.type === 'tv' ? 'tv' : 'movie'
  const list = type === 'movie' ? genres.movie : genres.tv
  const genre = list.find((g) => g.id === genreId)

  return {
    title: genre ? `${genre.name} — Cinevin` : 'Genre — Cinevin',
  }
}

function GenreLoading() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 18 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

async function GenreResults({
  genreId,
  type,
}: {
  genreId: number
  type: 'movie' | 'tv'
}) {
  try {
    const data =
      type === 'movie'
        ? await tmdbClient.discoverMovies({
            with_genres: genreId,
            sort_by: 'popularity.desc',
            page: 1,
          })
        : await tmdbClient.discoverTV({
            with_genres: genreId,
            sort_by: 'popularity.desc',
            page: 1,
          })

    const items: MediaItem[] = data.results.map(convertToMediaItem)

    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-cinevin-text-dim">
            No {type === 'movie' ? 'movies' : 'TV shows'} found in this genre.
          </p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((item) => (
          <MediaCard key={`${item.mediaType}-${item.id}`} item={item} />
        ))}
      </div>
    )
  } catch (error) {
    console.error('Genre fetch error:', error)
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="mb-4 text-cinevin-text-dim">
          Failed to load content. Please try again.
        </p>
        <Link
          href="/genres"
          className="rounded bg-cinevin-red px-4 py-2 text-white transition hover:bg-cinevin-red-hover"
        >
          Back to Genres
        </Link>
      </div>
    )
  }
}

export default async function GenrePage({
  params,
  searchParams,
}: GenrePageProps) {
  const genreId = parseInt(params.id)
  const type = searchParams.type === 'tv' ? 'tv' : 'movie'

  if (isNaN(genreId)) {
    notFound()
  }

  const currentList = type === 'movie' ? genres.movie : genres.tv
  const otherList = type === 'movie' ? genres.tv : genres.movie

  const genre = currentList.find((g) => g.id === genreId)

  // If the ID doesn't exist in the current type's list, but DOES exist in the other list,
  // treat this as a "type mismatch" — redirect to the correct type.
  if (!genre) {
    const otherGenre = otherList.find((g) => g.id === genreId)
    if (otherGenre) {
      // The ID belongs to the other type. Redirect to the correct type.
      // (No `redirect` import — use Next 14's built-in `redirect` helper.)
      // Importing redirect from next/navigation at top.
      const { redirect } = await import('next/navigation')
      redirect(`/genres/${genreId}?type=${type === 'movie' ? 'tv' : 'movie'}`)
    }
    notFound()
  }

  // Compute the correct ID for the "other" type by matching name
  const otherTypeId = findMatchingGenreId(genre.name, otherList)

  const otherTypeHref = otherTypeId
    ? `/genres/${otherTypeId}?type=${type === 'movie' ? 'tv' : 'movie'}`
    : `/genres?type=${type === 'movie' ? 'tv' : 'movie'}`

  return (
    <div className="min-h-screen bg-cinevin-dark pt-16">
      <div className="container-cinevin py-8">
        {/* Back link */}
        <Link
          href="/genres"
          className="mb-6 inline-flex items-center gap-2 text-sm text-cinevin-text-muted transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          All Genres
        </Link>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              {genre.name}
            </h1>
            <p className="mt-1 text-sm text-cinevin-text-muted">
              {type === 'movie' ? 'Movies' : 'TV Shows'} in this genre
            </p>
          </div>

          {/* Type toggle */}
          <div className="flex gap-2 rounded-lg border border-cinevin-border bg-cinevin-surface p-1">
            <Link
              href={
                type === 'movie'
                  ? `/genres/${genreId}?type=movie`
                  : otherTypeHref
              }
              className={`rounded px-4 py-1.5 text-sm font-medium transition ${
                type === 'movie'
                  ? 'bg-cinevin-red text-white'
                  : 'text-cinevin-text-muted hover:text-white'
              }`}
            >
              Movies
            </Link>
            <Link
              href={
                type === 'tv'
                  ? `/genres/${genreId}?type=tv`
                  : otherTypeHref
              }
              className={`rounded px-4 py-1.5 text-sm font-medium transition ${
                type === 'tv'
                  ? 'bg-cinevin-red text-white'
                  : 'text-cinevin-text-muted hover:text-white'
              }`}
            >
              TV Shows
            </Link>
          </div>
        </div>

        {/* Results */}
        <Suspense fallback={<GenreLoading />}>
          <GenreResults genreId={genreId} type={type} />
        </Suspense>
      </div>
    </div>
  )
}