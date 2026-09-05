'use client'

import { useRouter } from 'next/navigation'
import { VideoPlayer } from '@/components/watch/VideoPlayer'
import { ArrowLeft } from 'lucide-react'

interface WatchMoviePageProps {
  params: {
    id: string
  }
}

export default function WatchMoviePage({ params }: WatchMoviePageProps) {
  const router = useRouter()
  const id = parseInt(params.id)

  if (isNaN(id)) {
    router.push('/movies')
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
        <VideoPlayer mediaType="movie" tmdbId={id} />
      </div>
    </div>
  )
}