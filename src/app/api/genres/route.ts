// src/app/api/genres/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { tmdbClient } from '@/lib/tmdb/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') as 'movie' | 'tv' || 'movie'
    
    let data
    if (type === 'movie') {
      data = await tmdbClient.getMovieGenres()
    } else {
      data = await tmdbClient.getTVGenres()
    }
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=2592000',
      },
    })
  } catch (error) {
    console.error('Genres API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch genres' },
      { status: 500 }
    )
  }
}