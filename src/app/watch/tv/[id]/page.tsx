'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { VideoPlayer } from '@/components/watch/VideoPlayer'
import { ArrowLeft } from 'lucide-react'

interface WatchTVPageProps {
  params: {
    id: string
  }
}

export default function WatchTVPage({ params }: WatchTVPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = parseInt(params.id)
  const season = parseInt(searchParams.get('season') || '1')
  const episode = parseInt(searchParams.get('episode') || '1')

  if (isNaN(id)) {
    router.push('/tv')
    return null
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      {/* Back button */}
      <div className="container-netflix py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#b3b3b3] hover:text-white transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
      </div>

      {/* Video Player */}
      <div className="container-netflix">
        <VideoPlayer
          mediaType="tv"
          tmdbId={id}
          season={season}
          episode={episode}
        />
      </div>
    </div>
  )
}