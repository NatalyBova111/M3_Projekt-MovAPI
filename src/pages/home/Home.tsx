import './Home.css'
import { useEffect, useRef, useState } from 'react'
import { endpoints } from '../../lib/Tmdb'
import type { TMDBMovie, TMDBResults, TMDBGenre, TMDBGenreList } from '../../types/Tmdb'
import BottomNav from '../../components/bottomnav/BottomNav'
import SearchBar from '../../components/searchbar/SearchBar'
import Chip from '../../components/chip/Chip'
import HeroCarousel from '../../components/herocarousel/HeroCarousel'
import { useApp } from '../../store/AppContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Home() {
  const { state, dispatch } = useApp()
  const nav = useNavigate()
  const location = useLocation()

  const [genres, setGenres] = useState<TMDBGenre[]>([])
  const stripRef = useRef<HTMLDivElement | null>(null)

  // горизонтальный скролл жанров колесом (на десктопе удобно)
  const onGenreWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const el = stripRef.current; if (!el) return
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY
      e.preventDefault()
    }
  }

  const scrollGenres = (dir: -1 | 1) => {
    const el = stripRef.current; if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  // Тренды (кэш)
  useEffect(() => {
    if (state.trendingCache.length) return
    (async () => {
      const data = await endpoints.trending() as TMDBResults<TMDBMovie>
      dispatch({ type: 'SET_TRENDING', payload: data.results })
    })()
  }, [state.trendingCache.length, dispatch])

  // Жанры
  useEffect(() => {
    (async () => {
      const g = await endpoints.genres() as TMDBGenreList
      setGenres([...g.genres].sort((a,b)=>a.name.localeCompare(b.name)))
    })()
  }, [])

  // Ввод на Home 
  const handleHomeSearchChange = (v: string) => {
    dispatch({ type: 'SET_QUERY', payload: v })
  }
  // Переход на /search — по Enter
  const handleHomeSearchSubmit = (v: string) => {
    if (v.trim() && location.pathname !== '/search') nav('/search')
  }

  return (
    <div
      className="container home"
      style={{
        /* опускаем контент ниже */
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 120px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + var(--bn-h, 80px) + 16px)',
        paddingLeft: 16, paddingRight: 16,
      }}
    >
      <div className="h1">Welcome!</div>

      <SearchBar
        value={state.query}
        onChange={handleHomeSearchChange}
        onSubmit={handleHomeSearchSubmit}
      />

      {/* Полоса всех жанров */}
      <div className="genre-strip-wrap">
        <button className="genre-arrow left" onClick={()=>scrollGenres(-1)} aria-label="Scroll genres left" type="button">‹</button>

        <div
          ref={stripRef}
          className="genre-strip"
          onWheel={onGenreWheel}
        >
          {genres.map(g => (
            <Chip
              key={g.id}
              label={g.name}
              onClick={() => nav(`/search?genreId=${g.id}&genreName=${encodeURIComponent(g.name)}`)}
            />
          ))}
        </div>

        <button className="genre-arrow right" onClick={()=>scrollGenres(1)} aria-label="Scroll genres right" type="button">›</button>
      </div>

      {/* Доп. отступ перед каруселью, чтобы карточки фильмов были НИЖЕ */}
      <div className="hero-gap" />

      <div className="row-title">
        <span>Trending Movies</span>
        <Link className="see-all" to="/search">See all</Link>
      </div>

      {state.trendingCache.length
        ? <HeroCarousel items={state.trendingCache}/>
        : <div className="hero-skeleton" />}

      <div className="bottom-safe" />
      <BottomNav />
    </div>
  )
}
