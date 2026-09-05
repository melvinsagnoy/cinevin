import { TMDBMovie, TMDBTVShow } from '@/types/tmdb'
import { MediaItem } from '@/types/media'

export function convertToMediaItem(item: TMDBMovie | TMDBTVShow): MediaItem {
  const isMovie = 'title' in item
  
  return {
    id: item.id,
    mediaType: isMovie ? 'movie' : 'tv',
    title: isMovie ? (item as TMDBMovie).title : (item as TMDBTVShow).name,
    overview: item.overview || '',
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
    releaseDate: isMovie ? (item as TMDBMovie).release_date : undefined,
    firstAirDate: isMovie ? undefined : (item as TMDBTVShow).first_air_date,
    voteAverage: item.vote_average || 0,
    voteCount: item.vote_count || 0,
    popularity: item.popularity || 0,
    genres: item.genres || [],
    runtime: isMovie ? (item as TMDBMovie).runtime : undefined,
  }
}