const API_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE as string;

export const imgUrl = (
  path: string | null,
  size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w342'
) => (path ? `${IMG_BASE}/${size}${path}` : '');

export async function tmdb<T>(
  path: string,
  params?: Record<string, string | number | boolean>
): Promise<T> {
  const url = new URL(API_BASE + path);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_TOKEN}` },
  });
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export const endpoints = {
  trending: () => tmdb(`/trending/movie/week`),
  trendingPaged: (page=1) => tmdb(`/trending/movie/week`, { page }),
  searchMulti: (q: string) => tmdb(`/search/multi`, { query: q }),
  movieDetails: (id: number) => tmdb(`/movie/${id}`),
  movieVideos: (id: number) => tmdb(`/movie/${id}/videos`),

  // genres + discover
  genres: () => tmdb(`/genre/movie/list`, { language: 'en-US' }),
  discoverByGenre: (genreId: number, page = 1) =>
    tmdb(`/discover/movie`, {
      with_genres: genreId,
      sort_by: 'popularity.desc',
      include_adult: false,
      page,
    }),
};
