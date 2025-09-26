import './Trailer.css'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { endpoints } from '../../lib/Tmdb'
import type { TMDBVideo } from '../../types/Tmdb'

export default function Trailer() {
  const { id } = useParams();
  const nav = useNavigate();
  const [ytKey, setYtKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let stop = false;
    if (!id) return;

    (async () => {
      setLoading(true);
      try {
        const vids = await endpoints.movieVideos(Number(id)) as { results: TMDBVideo[] };
        if (stop) return;
        const y = vids.results?.find(
          v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
        );
        setYtKey(y?.key ?? null);
      } finally {
        if (!stop) setLoading(false);
      }
    })();

    return () => { stop = true; };
  }, [id]);

  if (loading) return <div className="trailer-page">Loading…</div>;
  if (!ytKey)   return <div className="trailer-page">Trailer not available</div>;

  const src =
    `https://www.youtube.com/embed/${ytKey}?autoplay=0&rel=0&playsinline=1`;

  return (
    <div className="trailer-page">
      <button className="t-back" onClick={() => nav(-1)} aria-label="Back">←</button>

      <div className="player-frame">
        <iframe
          key={ytKey}
          src={src}
          title="Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
