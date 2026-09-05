import { NextRequest, NextResponse } from 'next/server'
import { tmdbClient } from '@/lib/tmdb/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] })
    }

    const data = await tmdbClient.searchMulti(query.trim())
    
    // Format suggestions
    const results = data.results
      .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
      .slice(0, 10)
      .map((item: any) => ({
        id: item.id,
        title: item.title || item.name || 'Unknown',
        mediaType: item.media_type === 'movie' ? 'movie' : 'tv',
        posterPath: item.poster_path || null,
        year: item.release_date 
          ? new Date(item.release_date).getFullYear().toString() 
          : item.first_air_date 
            ? new Date(item.first_air_date).getFullYear().toString() 
            : '',
      }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search suggestions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suggestions', results: [] },
      { status: 500 }
    )
  }
}