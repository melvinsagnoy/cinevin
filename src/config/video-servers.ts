export interface VideoServer {
  id: string
  name: string
  embedUrl: string
  enabled: boolean
}

export const videoServers: VideoServer[] = [
  {
    id: 'vidsrcpro',
    name: 'VidSrcPro',
    embedUrl: 'https://vidsrc.pro/embed',
    enabled: true,
  },
  {
    id: 'superembed',
    name: 'SuperEmbed',
    embedUrl: 'https://superembed.net/embed',
    enabled: true,
  },
  {
    id: '2embed',
    name: '2Embed',
    embedUrl: 'https://2embed.cc/embed',
    enabled: true,
  },
  {
    id: 'vidlink',
    name: 'VidLink',
    embedUrl: 'https://vidlink.pro/embed',
    enabled: true,
  },
  {
    id: 'smashystream',
    name: 'SmashyStream',
    embedUrl: 'https://smashystream.com/embed',
    enabled: true,
  },
]

// This function must be exported
export function getVideoUrl(server: VideoServer, mediaType: 'movie' | 'tv', tmdbId: number, season?: number, episode?: number): string {
  if (mediaType === 'movie') {
    return `${server.embedUrl}/movie/${tmdbId}`
  } else {
    return `${server.embedUrl}/tv/${tmdbId}/${season}/${episode}`
  }
}