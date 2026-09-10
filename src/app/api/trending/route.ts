import { NextRequest, NextResponse } from 'next/server'
import { tmdbClient } from '@/lib/tmdb/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const mediaType = (searchParams.get('mediaType') || 'all') as
      | 'all'
      | 'movie'
      | 'tv'
    const timeWindow = (searchParams.get('timeWindow') || 'day') as
      | 'day'
      | 'week'

    const data = await tmdbClient.getTrending(mediaType, timeWindow)

    return NextResponse.json(data, {
      headers: {
        'Cache-Control':
          'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Trending API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending content' },
      { status: 500 }
    )
  }
}