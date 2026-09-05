import { Suspense } from 'react'
import { tmdbClient } from '@/lib/tmdb/client'
import { MediaCard } from '@/components/media/MediaCard'
import { convertToMediaItem } from '@/lib/utils/converters'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { MediaItem } from '@/types/media'
import { languages } from '@/config/navigation'

export const revalidate = 3600
export const dynamic = 'force-dynamic'

interface BrowseLanguagesPageProps {
  searchParams: {
    lang?: string
    tab?: string
  }
}

function LanguagesLoading() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export default async function BrowseLanguagesPage({ searchParams }: BrowseLanguagesPageProps) {
  const selectedLanguage = searchParams.lang || 'en'
  const activeTab = searchParams.tab || 'movies'

  try {
    const language = selectedLanguage
    
    // Fetch content based on language
    const [movieData, tvData] = await Promise.all([
      tmdbClient.discoverMovies({
        with_original_language: language,
        sort_by: 'popularity.desc',
        page: 1,
      }),
      tmdbClient.discoverTV({
        with_original_language: language,
        sort_by: 'popularity.desc',
        page: 1,
      }),
    ])

    const movies: MediaItem[] = movieData.results.map(convertToMediaItem)
    const tvShows: MediaItem[] = tvData.results.map(convertToMediaItem)
    const languageName = languages.find(l => l.code === selectedLanguage)?.name || 'Unknown'

    const displayItems = activeTab === 'movies' ? movies : tvShows

    return (
      <div className="min-h-screen bg-[#141414] pt-16">
        <div className="container-premium py-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-white">Browse by Languages</h1>
            
            <form action="/browse-languages" method="GET" className="flex flex-wrap gap-2">
              <select
                name="lang"
                defaultValue={selectedLanguage}
                className="rounded bg-[#1a1a1a] px-4 py-2 text-sm text-[#b3b3b3] border border-white/10 focus:border-[#E50914] focus:outline-none min-w-[150px]"
                onChange={(e) => {
                  const form = e.target.form
                  if (form) form.submit()
                }}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </form>
          </div>

          <p className="text-[#808080] text-sm mb-6">
            Showing {activeTab === 'movies' ? 'movies' : 'TV shows'} in <span className="text-white font-medium">{languageName}</span>
          </p>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-white/10">
            <form action="/browse-languages" method="GET" className="flex gap-4">
              <input type="hidden" name="lang" value={selectedLanguage} />
              <button
                type="submit"
                name="tab"
                value="movies"
                className={`pb-3 px-2 text-sm font-medium transition ${
                  activeTab === 'movies'
                    ? 'text-white border-b-2 border-[#E50914]'
                    : 'text-[#808080] hover:text-white'
                }`}
              >
                Movies ({movies.length})
              </button>
              <button
                type="submit"
                name="tab"
                value="tv"
                className={`pb-3 px-2 text-sm font-medium transition ${
                  activeTab === 'tv'
                    ? 'text-white border-b-2 border-[#E50914]'
                    : 'text-[#808080] hover:text-white'
                }`}
              >
                TV Shows ({tvShows.length})
              </button>
            </form>
          </div>

          <Suspense fallback={<LanguagesLoading />}>
            {displayItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-[#808080]">No content found in {languageName}.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {displayItems.map((item) => (
                  <MediaCard 
                    key={`${item.mediaType}-${item.id}`} 
                    item={item} 
                  />
                ))}
              </div>
            )}
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Browse languages error:', error)
    return (
      <div className="min-h-screen bg-[#141414] pt-16">
        <div className="container-premium py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Browse by Languages</h1>
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-[#808080] mb-4">Failed to load content. Please try again.</p>
            <form action="/browse-languages" method="GET">
              <button
                type="submit"
                className="bg-[#E50914] text-white px-4 py-2 rounded hover:bg-[#F6121D] transition"
              >
                Retry
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}