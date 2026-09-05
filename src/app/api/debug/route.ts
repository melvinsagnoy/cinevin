import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.TMDB_API_TOKEN
  
  return NextResponse.json({
    hasToken: !!token,
    tokenLength: token?.length || 0,
    tokenPreview: token ? token.substring(0, 20) + '...' : 'No token',
    nodeEnv: process.env.NODE_ENV,
  })
}