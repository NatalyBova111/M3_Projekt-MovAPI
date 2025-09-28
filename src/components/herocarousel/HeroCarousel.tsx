import './HeroCarousel.css';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { imgUrl } from '../../lib/Tmdb';
import type { TMDBMovie } from '../../types/Tmdb';

type Props = { items: TMDBMovie[] };

export default function HeroCarousel({ items }: Props) {
  const list = items.slice(0, 8); 
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);


  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setIndex(i);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const go = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="hero-carousel">
      <button className="nav prev" onClick={() => go(-1)} aria-label="Previous slide">‹</button>

      <div ref={trackRef} className="track" aria-label="Trending movies">
        {list.map((m) => {
          const poster = imgUrl(m.backdrop_path || m.poster_path, 'w780');
          const title = m.title || m.name || '';
          return (
            <Link key={m.id} to={`/movie/${m.id}`} className="slide">
              {/* медиа всегда 16:9 и cover */}
              <img className="media" src={poster} alt={title} />
              <div className="caption">
                <div className="title">{title}</div>
                <div className="meta">
                  ⭐ {(m.vote_average || 0).toFixed(1)}{m.release_date ? `  •  ${m.release_date.slice(0,4)}` : ''}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <button className="nav next" onClick={() => go(1)} aria-label="Next slide">›</button>

      <div className="dots" role="tablist" aria-label="Carousel dots">
        {list.map((_, i) => (
          <span key={i} className={`dot ${i === index ? 'active' : ''}`} role="tab" aria-selected={i === index}/>
        ))}
      </div>
    </div>
  );
}
