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

    const data = await tmdbClient.discoverMovies(params)
    
    // Log sample data to see what we're getting
    if (data.results && data.results.length > 0) {
      console.log('📽️ Sample movie:', {
        id: data.results[0].id,
        title: data.results[0].title || data.results[0].name,
        poster_path: data.results[0].poster_path,
        vote_average: data.results[0].vote_average,
        release_date: data.results[0].release_date || data.results[0].first_air_date,
      })
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
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