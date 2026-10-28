import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { EVENT } from './src/data/event.js'

// Fills %EVENT_*% placeholders in index.html (meta description, Open Graph)
// from src/data/event.js, so the event details live in one place.
const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const eventMeta = {
  name: 'rise-event-meta',
  transformIndexHtml: (html) =>
    html.replace(/%EVENT_([A-Z]+)%/g, (match, key) => {
      const value = EVENT[key.toLowerCase()]
      if (typeof value !== 'string') throw new Error(`index.html: unknown placeholder ${match}`)
      return escape(value)
    }),
}

export default defineConfig({
  plugins: [react(), eventMeta],
  build: {
    rollupOptions: {
      output: {
        // React changes far less often than the site, so it gets its own file
        // and stays cached between deploys.
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) return 'react';
        },
      },
    },
  },
})
