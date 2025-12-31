import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Make environment available to the app
    __APP_ENV__: JSON.stringify(process.env.NODE_ENV || 'development'),
  },
})
