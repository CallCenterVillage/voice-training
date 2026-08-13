import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    rollupOptions: {
      // In the SSR build React is external, and rollup rejects manualChunks
      // naming an external module. Chunking only matters for the client anyway.
      output: isSsrBuild ? {} : {
        manualChunks: {
          // React changes far less often than the content, so keeping it in its
          // own chunk means a content edit does not invalidate it in caches.
          // react-dom/client is what main.jsx actually imports; without it
          // listed, react-dom stays in the entry chunk.
          react: ["react", "react-dom", "react-dom/client"],
          // Only the waveform players need this; it should not sit in the
          // entry chunk that every route downloads.
          wavesurfer: ["wavesurfer.js"],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: false,
  },
}))
