import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { tmdbClient } from '@/lib/tmdb/client'
import { MediaCard } from '@/components/media/MediaCard'
import { convertToMediaItem } from '@/lib/utils/converters'
import { MediaItem } from '@/types/media'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'

export const revalidate = 86400

interface PersonPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PersonPageProps) {
  const id = parseInt(params.id)
  if (isNaN(id)) return {}

  try {
    const person = await tmdbClient.getPersonDetails(id)
    return {
      title: `${person.name} — Cinevin`,
      description: person.biography?.slice(0, 160) || `Details about ${person.name}`,
      openGraph: {
        title: person.name,
        description: person.biography?.slice(0, 160) || '',
        images: person.profile_path
          ? [`https://image.tmdb.org/t/p/w500${person.profile_path}`]
          : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function PersonPage({ params }: PersonPageProps) {
  const id = parseInt(params.id)
  if (isNaN(id)) {
    notFound()
  }

  try {
    const [person, credits] = await Promise.all([
      tmdbClient.getPersonDetails(id),
      tmdbClient.getPersonCredits(id),
    ])

    if (!person) {
      notFound()
    }

    const imageUrl = person.profile_path
      ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
      : null

    // Combine cast + crew, dedupe, sort by popularity
    const allCredits = [...(credits.cast || []), ...(credits.crew || [])]
    const seen = new Set<string>()

    const knownFor: MediaItem[] = allCredits
      .filter(
        (c: any) =>
          c.poster_path &&
          (c.media_type === 'movie' || c.media_type === 'tv')
      )
      .filter((c: any) => {
        const key = `${c.media_type}-${c.id}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 18)
      .map(convertToMediaItem)

    const bio = person.biography || ''
    const shortBio = bio.length > 800 ? bio.slice(0, 800) + '…' : bio

    return (
      <div className="min-h-screen bg-cinevin-dark pt-16">
        <div className="container-cinevin py-8">
          {/* Back */}
          <Link
            href="/search"
            className="mb-6 inline-flex items-center gap-2 text-sm text-cinevin-text-muted transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          {/* Header */}
          <div className="grid gap-8 md:grid-cols-[220px,1fr]">
            {/* Profile */}
            <div className="mx-auto md:mx-0">
              <div className="relative aspect-[2/3] w-48 overflow-hidden rounded-lg bg-cinevin-surface shadow-2xl md:w-full">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={person.name}
                    fill
                    sizes="220px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-cinevin-text-dim">
                    {person.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-5">
              <div>
                <h1 className="text-3xl font-bold text-white md:text-4xl">
                  {person.name}
                </h1>
                {person.known_for_department && (
                  <p className="mt-1 text-sm uppercase tracking-widest text-cinevin-text-dim">
                    {person.known_for_department}
                  </p>
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-cinevin-text-muted">
                {person.birthday && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-cinevin-text-dim" />
                    <span>{person.birthday}</span>
                  </div>
                )}
                {person.place_of_birth && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-cinevin-text-dim" />
                    <span>{person.place_of_birth}</span>
                  </div>
                )}
              </div>

              {/* Bio */}
              {shortBio && (
                <div>
                  <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-cinevin-text-dim">
                    Biography
                  </h2>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-cinevin-text-muted">
                    {shortBio}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Known For */}
          {knownFor.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-6 text-xl font-bold text-white">Known For</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {knownFor.map((item) => (
                  <MediaCard key={`${item.mediaType}-${item.id}`} item={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Person page error:', error)
    notFound()
  }
}