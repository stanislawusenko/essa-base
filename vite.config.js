import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

import handlebars from 'vite-plugin-handlebars'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import autoMainPlugin from './scripts/vite-plugin-auto-main.ts'
import generateMenuPlugin from './scripts/vite-plugin-generate-dev-menu.ts'

/* ==========================================================================
   UTILITY: HTML ENTRY POINT DISCOVERY
   ========================================================================== */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const srcDir = path.resolve(__dirname, 'src')

/**
 * Recursively scans the source directory for HTML entry points.
 * Partials and specific asset directories are excluded to maintain
 * a clean build graph.
 */
function getHtmlFiles(dir, relativePath = '') {
  let results = []
  if (!fs.existsSync(dir)) return results

  const items = fs.readdirSync(dir, { withFileTypes: true })
  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    const relPath = path.join(relativePath, item.name)

    if (item.isDirectory()) {
      // Exclude asset and partial directories from serving as entry pages
      if (!['css', 'js', 'partials', 'img', 'assets'].includes(item.name)) {
        results = results.concat(getHtmlFiles(fullPath, relPath))
      }
    } else if (
      item.isFile() &&
      item.name.endsWith('.html') &&
      !fullPath.includes(path.join(srcDir, 'partials')) &&
      !item.name.includes('-demo')
    ) {
      results.push(relPath)
    }
  }
  return results
}

/* ==========================================================================
   MPA INPUT MAPPING
   ========================================================================== */

const htmlFiles = getHtmlFiles(srcDir)
const input = {}

htmlFiles.forEach((f) => {
  const key = f.replace(/\.html$/, '').replace(/\\/g, '/')
  input[key] = path.resolve(srcDir, f)
})

// Inject global script entry point
input['main'] = path.resolve(srcDir, 'scripts/main.ts')

// Ensure index entry exists to support root access
if (!input['index']) {
  input['index'] = path.resolve(srcDir, 'index.html')
}

/* ==========================================================================
   VITE CONFIGURATION
   ========================================================================== */

export default defineConfig({
  root: 'src',
  base: './',

  plugins: [
    tailwindcss(),
    handlebars({
      partialDirectory: path.resolve(__dirname, 'src/partials'),
    }),
    autoMainPlugin({
      scriptPath: '/scripts/main.ts',
    }),
    generateMenuPlugin({ srcDir }),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
      exclude: undefined,
      include: undefined,
      includePublic: true,
      logStats: true,
      ansiColors: true,
      // Image compression configuration
      jpeg: { quality: 80, mozjpeg: true },
      png: { quality: 80, palette: true },
      webp: { lossless: false, quality: 80 },
      avif: { quality: 70 },
    }),
  ],

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    manifest: 'assets/manifest.json',
    cssCodeSplit: true,
    rollupOptions: {
      input,
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        // Centralized asset categorization strategy
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || ''
          const ext = path.extname(name)
          if (/\.(png|jpe?g|svg|gif|webp|avif)$/i.test(ext)) return 'assets/img/[name][extname]'
          if (ext === '.css') return 'assets/css/[name]-[hash][extname]'
          if (/\.(woff2?|eot|ttf|otf)$/i.test(ext)) return 'assets/fonts/[name][extname]'
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },

  server: {
    port: 5173,
    strictPort: true,
    open: '/dev-menu.html',
  },
})
