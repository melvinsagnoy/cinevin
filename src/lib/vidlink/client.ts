interface VidLinkParams {
  mediaType: 'movie' | 'tv'
  tmdbId: number
  season?: number
  episode?: number
}

export function generateVidLinkUrl(params: VidLinkParams): string {
  const { mediaType, tmdbId, season, episode } = params
  
  if (mediaType === 'movie') {
    return `https://vidlink.pro/movie/${tmdbId}`
  } else {
    if (!season || !episode) {
      throw new Error('Season and episode are required for TV shows')
    }
    return `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`
  }
}