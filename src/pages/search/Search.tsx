import './Search.css'
import { useEffect, useRef, useState } from 'react'
import { endpoints, imgUrl } from '../../lib/Tmdb'
import type {
  TMDBMovie,
  TMDBResults,
  TMDBPaged,
  TMDBGenre,
  TMDBGenreList,
} from '../../types/Tmdb'
import SearchBar from '../../components/searchbar/SearchBar'
import BottomNav from '../../components/bottomnav/BottomNav'
import Chip from '../../components/chip/Chip'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useApp } from '../../store/AppContext'
import favPng from '../../assets/Vector.png';


export default function Search() {
  const { state, dispatch } = useApp()
  const [params] = useSearchParams()
  const nav = useNavigate()

  // Режим страницы
  const genreId = params.get('genreId')
  const mode: 'trending' | 'genre' | 'search' =
    state.query ? 'search' : (genreId ? 'genre' : 'trending')

  // ===== ЖАНРЫ (полоса как на Home) =====
  const [genres, setGenres] = useState<TMDBGenre[]>([])
  useEffect(() => {
    (async () => {
      const g = await endpoints.genres() as TMDBGenreList
      setGenres([...g.genres].sort((a, b) => a.name.localeCompare(b.name)))
    })()
  }, [])

  const stripRef = useRef<HTMLDivElement | null>(null)

  // Горизонтальный скролл колесом (на десктопе удобно)
  const onGenreWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const el = stripRef.current
    if (!el) return
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY
      e.preventDefault()
    }
  }

  const goGenre = (id: number, name: string) => {
    // При переходе по жанру — очищаем текстовый поиск
    dispatch({ type: 'SET_QUERY', payload: '' })
    nav(`/search?genreId=${id}&genreName=${encodeURIComponent(name)}`)
  }

  // Автопрокрутка к активному жанру
  useEffect(() => {
    if (!genreId || !stripRef.current || !genres.length) return
    const el = stripRef.current.querySelector<HTMLElement>(`[data-genre="${genreId}"]`)
    if (!el) return
    // мгновенно центрируем…
    el.scrollIntoView({ inline: 'center', block: 'nearest' })
    // …и следом мягкая доводка
    requestAnimationFrame(() => {
      el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
    })
  }, [genreId, genres.length])

  // ===== ДАННЫЕ СПИСКА =====
  const [items, setItems] = useState<TMDBMovie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Пагинация для genre/trending
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  // --- GENRE ---
  useEffect(() => {
    if (mode !== 'genre') return
    let stop = false
    setItems([]); setPage(1); setHasMore(true); setError(null); setLoading(true)

    ;(async () => {
      try {
        const res = await endpoints.discoverByGenre(Number(genreId), 1) as TMDBPaged<TMDBMovie>
        if (stop) return
        setItems(res.results ?? [])
        setHasMore(res.page < res.total_pages)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load genre')
      } finally {
        if (!stop) setLoading(false)
      }
    })()

    return () => { stop = true }
  }, [mode, genreId])

  useEffect(() => {
    if (mode !== 'genre' || !loaderRef.current || !hasMore) return
    const io = new IntersectionObserver(async (entries) => {
      if (!entries[0].isIntersecting) return
      try {
        const next = page + 1
        const res = await endpoints.discoverByGenre(Number(genreId), next) as TMDBPaged<TMDBMovie>
        setItems(prev => [...prev, ...(res.results ?? [])])
        setPage(next)
        setHasMore(res.page < res.total_pages)
      } catch (err) {
        console.warn('discoverByGenre page load failed', err)
      }
    }, { rootMargin: '200px' })
    io.observe(loaderRef.current)
    return () => io.disconnect()
  }, [mode, genreId, page, hasMore])

  // --- TRENDING ---
  useEffect(() => {
    if (mode !== 'trending') return
    let stop = false
    setItems([]); setPage(1); setHasMore(true); setError(null); setLoading(true)

    ;(async () => {
      try {
        const res = await endpoints.trendingPaged(1) as TMDBPaged<TMDBMovie>
        if (stop) return
        setItems(res.results ?? [])
        setHasMore(res.page < (res.total_pages ?? Number.MAX_SAFE_INTEGER))
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load trending')
      } finally {
        if (!stop) setLoading(false)
      }
    })()

    return () => { stop = true }
  }, [mode])

  useEffect(() => {
    if (mode !== 'trending' || !loaderRef.current || !hasMore) return
    const io = new IntersectionObserver(async (entries) => {
      if (!entries[0].isIntersecting) return
      try {
        const next = page + 1
        const res = await endpoints.trendingPaged(next) as TMDBPaged<TMDBMovie>
        setItems(prev => [...prev, ...(res.results ?? [])])
        setPage(next)
        setHasMore(res.page < (res.total_pages ?? Number.MAX_SAFE_INTEGER))
      } catch (err) {
        console.warn('trendingPaged page load failed', err)
      }
    }, { rootMargin: '200px' })
    io.observe(loaderRef.current)
    return () => io.disconnect()
  }, [mode, page, hasMore])

  // --- SEARCH ---
  useEffect(() => {
    if (mode !== 'search') return
    const t = setTimeout(async () => {
      if (!state.query) { setItems([]); return }
      setLoading(true); setError(null)
      try {
        const data = await endpoints.searchMulti(state.query) as TMDBResults<TMDBMovie & { media_type?: string }>
        const filtered = (data.results ?? []).filter(
          r => (r.media_type === 'movie' || !r.media_type) && r.poster_path
        )
        setItems(filtered)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setLoading(false)
      }
    }, 400)
    return () => clearTimeout(t)
  }, [mode, state.query, dispatch])

  return (
    <div className="container">
      <SearchBar
        value={state.query}
        onChange={(v) => {
          if (genreId) nav('/search') 
          dispatch({ type: 'SET_QUERY', payload: v })
        }}
      />

      {/* Полоса жанров */}
      <div
        ref={stripRef}
        className="genre-strip"
        onWheel={onGenreWheel}
        aria-label="Genres"
      >
        {genres.map(g => {
          const active = String(g.id) === genreId
          return (
            <div key={g.id} data-genre={g.id}>
              <Chip
                label={g.name}
                active={active}
                onClick={() => goGenre(g.id, g.name)}
              />
            </div>
          )
        })}
      </div>

      <div style={{ height: 8 }} />

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading…</div>}

      <div className="list">
        {items.map(it => (
          <Link key={it.id} to={`/movie/${it.id}`} className="row">
            <img
              className="poster"
              src={imgUrl(it.poster_path,'w185')}
              alt={it.title || it.name || ''}
              loading="lazy"
            />
            <div className="info">
              <div className="title">{it.title || it.name}</div>
              <div className="muted">
                ⭐ {(it.vote_average || 0).toFixed(1)}
                {it.release_date ? `  •  ${it.release_date.slice(0,4)}` : ''}
              </div>
            </div>

            {/* единая иконка избранного */}
            <button
              className={`fav-icon ${state.favorites.includes(it.id) ? 'active' : ''}`}
              onClick={(e)=>{
                e.preventDefault()
                e.stopPropagation()
                dispatch({ type:'TOGGLE_FAVORITE', payload: it.id })
              }}
              aria-label="toggle favorite"
              title="Add to favorites"
              type="button"
            >
              <img src={favPng} alt="" aria-hidden="true" />
            </button>
          </Link>
        ))}
      </div>

      {(mode === 'genre' || mode === 'trending') ? <div ref={loaderRef} style={{height:1}} /> : null}

      <div className="bottom-safe" />
      <BottomNav />
    </div>
  )
}
