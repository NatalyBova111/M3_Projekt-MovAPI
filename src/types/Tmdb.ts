export type TMDBGenre = { id: number; name: string };
export type TMDBGenreList = { genres: TMDBGenre[] };

export type TMDBMovie = {
  id: number;
  title?: string;
  name?: string;                
  overview: string;
  release_date?: string;
  first_air_date?: string;     
  vote_average: number;
  genre_ids?: number[];
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: string;          // 'movie' | 'tv' | 'person' (в search/multi)
};

export type TMDBResults<T> = { page: number; results: T[] };

export type TMDBPaged<T> = {
  page: number;
  total_pages: number;
  total_results: number;
  results: T[];
};

export type TMDBMovieDetails = TMDBMovie & {
  genres: { id: number; name: string }[];
  runtime?: number;
  spoken_languages?: { english_name: string }[];
};

export type TMDBVideo = { key: string; name: string; type: string; site: string };
