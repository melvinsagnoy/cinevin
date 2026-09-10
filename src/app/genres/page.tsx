import { GenreCard } from '@/components/media/GenreCard'
import { genres } from '@/config/navigation'

export const metadata = {
  title: 'Genres — Cinevin',
  description: 'Browse movies and TV shows by genre.',
}

export default function GenresPage() {
  return (
    <div className="min-h-screen bg-cinevin-dark pt-16">
      <div className="container-cinevin py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white md:text-4xl">Genres</h1>
          <p className="mt-2 text-sm text-cinevin-text-muted">
            Explore movies and TV shows by category
          </p>
        </header>

        {/* Movie genres */}
        <section className="mb-12">
          <h2 className="mb-5 text-xl font-bold text-white">Movies</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {genres.movie.map((genre) => (
              <GenreCard
                key={`movie-${genre.id}`}
                id={genre.id}
                name={genre.name}
                mediaType="movie"
              />
            ))}
          </div>
        </section>

        {/* TV genres */}
        <section>
          <h2 className="mb-5 text-xl font-bold text-white">TV Shows</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {genres.tv.map((genre) => (
              <GenreCard
                key={`tv-${genre.id}`}
                id={genre.id}
                name={genre.name}
                mediaType="tv"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}