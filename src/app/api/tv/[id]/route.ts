// src/app/api/tv/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { tmdbClient } from '@/lib/tmdb/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid TV show ID' },
        { status: 400 }
      )
    }
    
    const data = await tmdbClient.getTVDetails(id)
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    })
  } catch (error) {
    console.error('TV details API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch TV show details' },
      { status: 500 }
    )
  }
}