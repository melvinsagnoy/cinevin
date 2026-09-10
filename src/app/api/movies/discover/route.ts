import { NextRequest, NextResponse } from 'next/server'
import { tmdbClient } from '@/lib/tmdb/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const genre = searchParams.get('genre')
    const sort = searchParams.get('sort') || 'popularity.desc'
    const page = parseInt(searchParams.get('page') || '1')

    const params: Record<string, string | number | boolean> = {
      sort_by: sort,
      page,
      include_adult: false,
      'vote_count.gte': 100,
    }
    if (genre) {
      params.with_genres = parseInt(genre)
    }

    const data = await tmdbClient.discoverMovies(params)

    return NextResponse.json(data, {
      headers: {
        'Cache-Control':
          'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Movies discover API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch movies', results: [] },
      { status: 500 }
    )
  }
}