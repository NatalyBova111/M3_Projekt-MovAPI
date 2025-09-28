import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../store/AppContext'
import { endpoints, imgUrl } from '../../lib/Tmdb'
import type { TMDBMovieDetails } from '../../types/Tmdb'
import BottomNav from '../../components/bottomnav/BottomNav'

export default function Favorites(){
  const { state } = useApp()
  const [items, setItems] = useState<TMDBMovieDetails[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let stop = false
    ;(async ()=>{
      setLoading(true)
      try{
        // грузим все детали параллельно
        const list = await Promise.all(
          state.favorites.map(id => endpoints.movieDetails(id) as Promise<TMDBMovieDetails>)
        )
        if (!stop) setItems(list)
      } finally {
        if (!stop) setLoading(false)
      }
    })()
    return ()=>{ stop = true }
  }, [state.favorites])

  return (
    <div className="container">
      <div className="h1">Favorites</div>
      {loading && <div className="loading">Loading…</div>}
      <div className="list">
        {items.map(it => (
          <Link key={it.id} to={`/movie/${it.id}`} className="row">
            <img src={imgUrl(it.poster_path,'w185')} alt={it.title || ''}/>
            <div className="info">
              <div className="title">{it.title}</div>
              <div className="muted">
                ⭐ {(it.vote_average || 0).toFixed(1)}
                {it.release_date ? `  •  ${it.release_date.slice(0,4)}` : ''}
              </div>
            </div>
          </Link>
        ))}
        {!loading && !items.length && <div className="muted" style={{marginTop:12}}>No favorites yet</div>}
      </div>
      <div className="bottom-safe" />
      <BottomNav />
    </div> 
  )
}
