import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  server: {
    fs: {
      allow: ['..', 'C:/Users/frapa/.gemini/antigravity/brain/13e11b91-f350-4c48-a362-8f948a92fc7f', 'C:/Users/frapa/.gemini/antigravity/brain/bfed399c-9767-4a8b-8051-24ea20843f0d']
    }
  }
})