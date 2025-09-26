import { Link } from 'react-router-dom'
import type { TMDBMovie } from '../../types/Tmdb'
import { imgUrl } from '../../lib/Tmdb'
import './MovieCard.css'
import Rating from '../rating/Rating'

export default function MovieCard({ m }: { m: TMDBMovie }){
  const title = m.title ?? m.name ?? 'Untitled'
  return (
    <Link className="movie-card" to={`/movie/${m.id}`}>
      <img className="poster" src={imgUrl(m.poster_path,'w342')} alt={title} loading="lazy"/>
      <div className="meta">
        <div className="title">{title}</div>
        <Rating value={m.vote_average} />
      </div>
    </Link>
  )
}
