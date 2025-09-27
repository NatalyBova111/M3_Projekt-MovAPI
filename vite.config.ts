// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// export default defineConfig({
//   plugins: [react()],
//   base: '/M3_Projekt-MovAPI/',  
// })

// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/M3_Projekt-MovAPI/' : '/', // prod: GH Pages, dev: корень
}))