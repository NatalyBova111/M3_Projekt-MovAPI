import './MovieDetails.css'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { endpoints, imgUrl } from '../../lib/Tmdb'
import type { TMDBMovieDetails, TMDBVideo } from '../../types/Tmdb'
import Rating from '../../components/rating/Rating'
import BottomNav from '../../components/bottomnav/BottomNav'

export default function MovieDetails() {
  const { id } = useParams()
  const nav = useNavigate()

  const [data, setData] = useState<TMDBMovieDetails | null>(null)
  const [ytKey, setYtKey] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let stop = false

    ;(async () => {
      const [d, vids] = await Promise.all([
        endpoints.movieDetails(Number(id)),
        endpoints.movieVideos(Number(id)),
      ])

      if (stop) return

      setData(d as TMDBMovieDetails)

      const youTube = (vids as { results: TMDBVideo[] }).results?.find(
        v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
      )
      setYtKey(youTube?.key ?? null)
    })()

    return () => { stop = true }
  }, [id])

  if (!data) return null

  const title    = data.title ?? 'Movie'
  const date     = (data.release_date || '').slice(0, 10)
  const runtime  = data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : '—'
  const genres   = data.genres?.map(g => g.name).join(', ')
  const langs    = data.spoken_languages?.map(l => l.english_name).join(', ')
  const backdrop = imgUrl(data.backdrop_path || data.poster_path, 'w780')


  return (
    <div className="details">
      {/* Hero с фоном и мягким градиентом снизу (реализовано в CSS через ::after) */}
      <div
        className="hero"
        style={{ backgroundImage: `url(${backdrop})` }}
      >
        <button
          type="button"
          className="back-btn"
          aria-label="Go back"
          onClick={() => nav(-1)}
        >
          ←
        </button>
      </div>

      {/* Тело страницы слегка «заезжает» на градиент */}
      <div className="container body">
        <div className="title-wrap">
          <h1 className="title">{title}</h1>
          <div className="muted">{date} • Action • {runtime}</div>
          <Rating value={data.vote_average} />
        </div>

        <h3>Overview</h3>
        <p className="overview">{data.overview}</p>

        <div className="grid-meta">
          <div>
            <b>Genres</b><br />{genres}
          </div>
          <div>
            <b>Languages</b><br />{langs}
          </div>
        </div>

        {ytKey ? (
          <button
            type="button"
            className="btn btn-primary watch"
            onClick={() => nav(`/trailer/${data.id}`)}
            aria-label="Watch trailer"
          >
            ▶ Watch Trailer
          </button>
        ) : (
          <button type="button" className="btn btn-primary watch" disabled>
            Trailer not available
          </button>
        )}

        {/* футер  */}
        <div className="bottom-safe" />
        <BottomNav />
      </div>
    </div>
  )
}
