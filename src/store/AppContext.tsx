import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import { reducer, initialState, type AppState, type Action } from './AppState';

type Ctx = { state: AppState; dispatch: React.Dispatch<Action> };
const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppCtx.Provider value={{ state, dispatch }}>{children}</AppCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
