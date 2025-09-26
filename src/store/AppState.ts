import type { TMDBMovie } from '../types/Tmdb';

export type Genre = 'Action' | 'Comedy' | 'Horror';

export type AppState = {
  ready: boolean;          // когда true — уходим со Splash
  query: string;           // строка поиска
  activeGenre: Genre;
  trendingCache: TMDBMovie[];  
  favorites: number[];     // избранное (id фильмов)
};

export type Action =
  | { type: 'APP_READY' }
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_GENRE'; payload: Genre }
  | { type: 'SET_TRENDING'; payload: TMDBMovie[] } 
  | { type: 'TOGGLE_FAVORITE'; payload: number };

export const initialState: AppState = {
  ready: false,
  query: '',
  activeGenre: 'Action',
  trendingCache: [],     // тип выведется как TMDBMovie[]
  favorites: [],
};

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'APP_READY':
      return { ...state, ready: true };
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_GENRE':
      return { ...state, activeGenre: action.payload };
    case 'SET_TRENDING':
      return { ...state, trendingCache: action.payload };
    case 'TOGGLE_FAVORITE':
      return state.favorites.includes(action.payload)
        ? { ...state, favorites: state.favorites.filter(id => id !== action.payload) }
        : { ...state, favorites: [...state.favorites, action.payload] };
    default:
      return state;
  }
}
