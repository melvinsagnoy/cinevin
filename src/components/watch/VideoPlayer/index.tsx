'use client'

import { useState, useEffect, useRef } from 'react'
import { useWatchHistory } from '@/hooks/useWatchHistory'

interface VideoPlayerProps {
  mediaType: 'movie' | 'tv'
  tmdbId: number
  season?: number
  episode?: number
  className?: string
  /** Title of the movie/show — used for watch history */
  title?: string
  /** TMDB poster path (e.g. "/abc123.jpg") — used for watch history */
  posterPath?: string | null
}

export function VideoPlayer({
  mediaType,
  tmdbId,
  season,
  episode,
  className = '',
  title = '',
  posterPath = null,
}: VideoPlayerProps) {
  const [server, setServer] = useState('vidlink')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  const { add, updateProgress } = useWatchHistory()

  // Generate URL based on props
  const generateUrl = (serverKey: string) => {
    const baseUrls: Record<string, string> = {
      vidlink: `https://vidlink.pro/${mediaType}/${tmdbId}`,
      vidsrcpro: `https://vidsrc.pro/embed/${mediaType}/${tmdbId}`,
      superembed: `https://superembed.net/embed/${mediaType}/${tmdbId}`,
      '2embed': `https://2embed.cc/embed/${mediaType}/${tmdbId}`,
    }

    let url = baseUrls[serverKey] || baseUrls.vidlink

    // Add season and episode for TV shows
    if (mediaType === 'tv' && season && episode) {
      if (serverKey === 'vidlink') {
        url = `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`
      } else {
        url = `${baseUrls[serverKey]}/${season}/${episode}`
      }
    }

    console.log(`🎬 Video URL (${serverKey}):`, url)
    return url
  }

  const servers = {
    vidlink: { name: 'VidLink' },
    vidsrcpro: { name: 'VidSrcPro' },
    superembed: { name: 'SuperEmbed' },
    '2embed': { name: '2Embed' },
  }

  const currentServer = servers[server as keyof typeof servers] || servers.vidlink

  // Update URL when episode or season changes
  useEffect(() => {
    const newUrl = generateUrl(server)
    setCurrentUrl(newUrl)
    setIsLoading(true)
    setError(null)
    setRetryCount(0)
  }, [mediaType, tmdbId, season, episode, server])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Record watch history + simulate progress pings
  useEffect(() => {
    if (!title) return

    // Record that user opened this
    add({
      mediaType,
      tmdbId,
      title,
      posterPath,
      season,
      episode,
      progress: 0,
    })

    // Simulate progress pings every 30s
    let progress = 5
    const interval = setInterval(() => {
      progress = Math.min(90, progress + 10)
      updateProgress(tmdbId, mediaType, progress, season, episode)
    }, 30_000)

    return () => clearInterval(interval)
  }, [tmdbId, mediaType, season, episode, title, posterPath, add, updateProgress])

  useEffect(() => {
    if (error && retryCount < 3) {
      const timer = setTimeout(() => {
        handleRetry()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [error, retryCount])

  const handleServerChange = (serverKey: string) => {
    setServer(serverKey)
    setIsLoading(true)
    setError(null)
    setRetryCount(0)
  }

  const handleRetry = () => {
    const serverKeys = Object.keys(servers)
    const currentIndex = serverKeys.indexOf(server)

    if (currentIndex < serverKeys.length - 1) {
      const nextServer = serverKeys[currentIndex + 1]
      setServer(nextServer)
      setIsLoading(true)
      setError(null)
      setRetryCount(retryCount + 1)
    } else {
      setError('All video sources are currently unavailable. Please try again later.')
      setIsLoading(false)
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setError(null)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setError('Failed to load video. Trying another source...')
  }

  console.log('🎬 VideoPlayer Props:', { mediaType, tmdbId, season, episode })

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Server Selector */}
      <div
        className={`flex flex-wrap items-center gap-2 rounded-xl border border-cinevin-border bg-black/35 px-3 py-2 backdrop-blur transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <span className="mr-1 text-xs font-bold uppercase tracking-[0.16em] text-cinevin-text-dim">
          Source:
        </span>
        {Object.entries(servers).map(([key, serverConfig]) => (
          <button
            key={key}
            onClick={() => handleServerChange(key)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
              server === key
                ? 'bg-cinevin-red text-white shadow-lg shadow-cinevin-red/30'
                : 'bg-white/10 text-cinevin-text-muted hover:bg-white/20 hover:text-white'
            }`}
          >
            {serverConfig.name}
          </button>
        ))}
      </div>

      {/* Video Player */}
      <div
        className={`relative aspect-video w-full overflow-hidden rounded-xl border border-cinevin-border bg-black shadow-2xl shadow-black/50 transition-all duration-700 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-cinevin-red border-t-transparent" />
              <p className="pulse text-sm text-cinevin-text-dim">
                {retryCount > 0
                  ? `Retrying (${retryCount}/3)...`
                  : 'Loading video...'}
              </p>
            </div>
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black px-4">
            <svg
              className="mb-4 h-16 w-16 text-cinevin-text-dim"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="mb-2 text-lg font-semibold text-white">
              Video Unavailable
            </p>
            <p className="max-w-md text-center text-sm text-cinevin-text-dim">
              {error}
            </p>
            {retryCount < 3 && (
              <button
                onClick={handleRetry}
                className="mt-4 rounded bg-cinevin-red px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-cinevin-red-hover"
              >
                Try Next Source
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-2 rounded bg-cinevin-surface px-4 py-2 text-sm font-medium text-cinevin-text-muted transition-all duration-300 hover:scale-105 hover:bg-cinevin-surface-hover hover:text-white"
            >
              Refresh Page
            </button>
          </div>
        ) : (
          currentUrl && (
            <iframe
              key={currentUrl}
              src={currentUrl}
              className="h-full w-full"
              allowFullScreen
              allow="encrypted-media; autoplay; fullscreen"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title={`${mediaType === 'movie' ? 'Movie' : 'TV Show'} player`}
              loading="eager"
              referrerPolicy="no-referrer"
            />
          )
        )}
      </div>
    </div>
  )
}