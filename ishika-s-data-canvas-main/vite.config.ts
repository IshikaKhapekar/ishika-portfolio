import { defineConfig } from '@tanstack/react-start'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    preset: 'vercel',
  },
  vite: {
    plugins: [tsConfigPaths()],
  },
})
