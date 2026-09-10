import { NextRequest, NextResponse } from 'next/server'
import { tmdbClient } from '@/lib/tmdb/client'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string; seasonNumber: string } }
) {
  try {
    const id = parseInt(params.id)
    const seasonNumber = parseInt(params.seasonNumber)

    if (isNaN(id) || isNaN(seasonNumber)) {
      return NextResponse.json(
        { error: 'Invalid TV ID or season number' },
        { status: 400 }
      )
    }

    const data = await tmdbClient.getTVSeason(id, seasonNumber)

    return NextResponse.json(data, {
      headers: {
        'Cache-Control':
          'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    })
  } catch (error) {
    console.error('TV season API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch TV season' },
      { status: 500 }
    )
  }
}