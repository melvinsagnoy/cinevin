'use client'

import { useState, useEffect, useRef } from 'react'

interface VideoPlayerProps {
  mediaType: 'movie' | 'tv'
  tmdbId: number
  season?: number
  episode?: number
  className?: string
}

export function VideoPlayer({
  mediaType,
  tmdbId,
  season,
  episode,
  className = '',
}: VideoPlayerProps) {
  const [server, setServer] = useState('vidlink')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [retryCount, setRetryCount] = useState(0)

  const servers = {
    vidlink: {
      name: 'VidLink',
      url: `https://vidlink.pro/${mediaType}/${tmdbId}${mediaType === 'tv' ? `/${season}/${episode}` : ''}`,
    },
    vidsrcpro: {
      name: 'VidSrcPro',
      url: `https://vidsrc.pro/embed/${mediaType}/${tmdbId}${mediaType === 'tv' ? `/${season}/${episode}` : ''}`,
    },
    superembed: {
      name: 'SuperEmbed',
      url: `https://superembed.net/embed/${mediaType}/${tmdbId}${mediaType === 'tv' ? `/${season}/${episode}` : ''}`,
    },
    '2embed': {
      name: '2Embed',
      url: `https://2embed.cc/embed/${mediaType}/${tmdbId}${mediaType === 'tv' ? `/${season}/${episode}` : ''}`,
    },
  }

  const currentServer = servers[server as keyof typeof servers] || servers.vidlink

  useEffect(() => {
    setIsVisible(true)
  }, [])

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

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Server Selector with fade-in */}
      <div className={`flex flex-wrap items-center gap-2 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <span className="text-sm font-medium text-[#808080]">Source:</span>
        {Object.entries(servers).map(([key, server]) => (
          <button
            key={key}
            onClick={() => handleServerChange(key)}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
              server === currentServer
                ? 'bg-[#E50914] text-white scale-105'
                : 'bg-[#1a1a1a] text-[#b3b3b3] hover:bg-[#2a2a2a] hover:text-white hover:scale-105'
            }`}
          >
            {server.name}
          </button>
        ))}
      </div>

      {/* Video Player with scale-in */}
      <div className={`relative aspect-video w-full overflow-hidden rounded-lg bg-black transition-all duration-700 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E50914] border-t-transparent" />
              <p className="text-sm text-[#808080] pulse">
                {retryCount > 0 ? `Retrying (${retryCount}/3)...` : 'Loading video...'}
              </p>
            </div>
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black px-4">
            <svg className="mb-4 h-16 w-16 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="mb-2 text-lg font-semibold text-white">Video Unavailable</p>
            <p className="text-center text-sm text-[#808080] max-w-md">{error}</p>
            {retryCount < 3 && (
              <button
                onClick={handleRetry}
                className="mt-4 rounded bg-[#E50914] px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-[#F6121D]"
              >
                Try Next Source
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-2 rounded bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-[#b3b3b3] transition-all duration-300 hover:scale-105 hover:bg-[#2a2a2a] hover:text-white"
            >
              Refresh Page
            </button>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={currentServer.url}
            className="h-full w-full"
            allowFullScreen
            allow="encrypted-media; autoplay; fullscreen"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title={`${mediaType === 'movie' ? 'Movie' : 'TV Show'} player`}
            loading="eager"
            referrerPolicy="no-referrer"
          />
        )}
      </div>
    </div>
  )
}