import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/discovraphy/",
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        err: './404.html',
      }
    }
  }
})
