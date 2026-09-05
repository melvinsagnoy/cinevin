import { NextRequest, NextResponse } from 'next/server'
import { tmdbClient } from '@/lib/tmdb/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const genre = searchParams.get('genre')
    const sort = searchParams.get('sort') || 'popularity.desc'
    const page = parseInt(searchParams.get('page') || '1')

    const params: any = {
      sort_by: sort,
      page: page,
      include_adult: false,
      'vote_count.gte': 100,
    }
    if (genre) {
      params.with_genres = parseInt(genre)
    }

    const data = await tmdbClient.discoverTV(params)
    
    // Log sample data to verify
    if (data.results && data.results.length > 0) {
      console.log('📺 Sample TV show from API:', {
        id: data.results[0].id,
        name: data.results[0].name || data.results[0].title,
        poster_path: data.results[0].poster_path,
        vote_average: data.results[0].vote_average,
      })
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('TV discover API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch TV shows', results: [] },
      { status: 500 }
    )
  }
}