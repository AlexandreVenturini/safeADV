import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // react(): permite usar JSX/React; tailwindcss(): processa as classes do Tailwind
  plugins: [react(), tailwindcss()],
})
