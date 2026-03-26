import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [ tailwindcss()],
  base: '/pac-man-game-react/', // This must match your repo name exactly
})